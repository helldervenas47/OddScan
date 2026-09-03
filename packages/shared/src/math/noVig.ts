/**
 * Algoritmos de Remoção de Vig (Margem das Casas de Apostas)
 * 
 * Em qualquer mercado de apostas, a soma das probabilidades implícitas (1/Odd)
 * excede 1.0 (geralmente entre 1.04 e 1.10). Esse excedente é a margem de lucro (vig/juice).
 * Para encontrar a probabilidade real estimada pelo mercado (Fair Odds), removemos esse vig.
 */

export interface MarketOutcomeInput {
  name: string;
  point?: number | null;
  odds: number;
}

export interface NormalizedFairOutcome {
  name: string;
  point?: number | null;
  impliedProbability: number; // com vig (bruta)
  fairProbability: number;    // sem vig (normalizada: soma = 1.0)
  fairOdds: number;           // 1 / fairProbability
}

/**
 * Remove o vig usando o método multiplicativo proporcional (padrão da indústria).
 * É o método mais robusto e universal tanto para mercados de 2 vias quanto de 3 vias (1X2).
 */
export function removeVigProportional(outcomes: MarketOutcomeInput[]): {
  outcomes: NormalizedFairOutcome[];
  overround: number;
  vigPercentage: number;
} {
  if (!outcomes || outcomes.length < 2) {
    throw new Error('É necessário fornecer pelo menos 2 desfechos para calcular a remoção de vig.');
  }

  // 1. Calcula as probabilidades implícitas brutas
  const rawProbabilities = outcomes.map(o => {
    if (o.odds <= 1.0) {
      throw new Error(`Odd inválida (${o.odds}). Deve ser estritamente maior que 1.0.`);
    }
    return 1 / o.odds;
  });

  // 2. Soma das probabilidades implícitas (Overround)
  const overround = rawProbabilities.reduce((acc, p) => acc + p, 0);

  // 3. Normalização proporcional para que a soma seja exatamente 1.0 (100%)
  const normalizedOutcomes: NormalizedFairOutcome[] = outcomes.map((o, idx) => {
    const rawProb = rawProbabilities[idx];
    const fairProb = rawProb / overround;
    const fairOdds = 1 / fairProb;

    return {
      name: o.name,
      point: o.point,
      impliedProbability: Number(rawProb.toFixed(4)),
      fairProbability: Number(fairProb.toFixed(4)),
      fairOdds: Number(fairOdds.toFixed(4)),
    };
  });

  const vigPercentage = Number(((overround - 1) * 100).toFixed(2));

  return {
    outcomes: normalizedOutcomes,
    overround: Number(overround.toFixed(4)),
    vigPercentage,
  };
}

/**
 * Calcula a probabilidade justa agregando as odds de múltiplas casas de apostas.
 * Calcula a odd mediana de cada desfecho entre as casas e aplica a remoção de vig.
 */
export function calculateConsensusFairOdds(
  marketOutcomesAcrossBookmakers: { [outcomeKey: string]: number[] }
): { [outcomeKey: string]: { fairProbability: number; fairOdds: number } } {
  const aggregatedOutcomes: MarketOutcomeInput[] = [];

  for (const [key, oddsList] of Object.entries(marketOutcomesAcrossBookmakers)) {
    if (!oddsList || oddsList.length === 0) continue;

    // Mediana para mitigar outliers de odds erráticas
    const sorted = [...oddsList].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const medianOdds = sorted.length % 2 !== 0 
      ? sorted[mid] 
      : (sorted[mid - 1] + sorted[mid]) / 2;

    aggregatedOutcomes.push({
      name: key,
      odds: medianOdds,
    });
  }

  if (aggregatedOutcomes.length < 2) {
    return {};
  }

  const result = removeVigProportional(aggregatedOutcomes);
  const mapping: { [outcomeKey: string]: { fairProbability: number; fairOdds: number } } = {};

  for (const item of result.outcomes) {
    mapping[item.name] = {
      fairProbability: item.fairProbability,
      fairOdds: item.fairOdds,
    };
  }

  return mapping;
}
