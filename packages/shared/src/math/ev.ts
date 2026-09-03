/**
 * Cálculo de Valor Esperado (Expected Value - EV%)
 * 
 * Fórmula:
 * EV% = (Probabilidade Justa * Odd Oferecida - 1) * 100
 * 
 * Exemplo:
 * Se a odd justa de um desfecho é 2.00 (probabilidade justa = 50% ou 0.50),
 * e uma casa de apostas (ex: Betano) está pagando 2.20:
 * EV% = (0.50 * 2.20 - 1) * 100 = (1.10 - 1) * 100 = +10.00%
 */

export interface EVCalculationResult {
  offeredOdds: number;
  fairProbability: number;
  fairOdds: number;
  expectedValuePct: number;
  isPositiveEV: boolean;
}

export function calculateEV(
  offeredOdds: number,
  fairProbability: number
): EVCalculationResult {
  if (offeredOdds <= 1.0) {
    throw new Error(`Odd oferecida inválida (${offeredOdds}). Deve ser maior que 1.0.`);
  }

  if (fairProbability <= 0 || fairProbability > 1.0) {
    throw new Error(`Probabilidade justa inválida (${fairProbability}). Deve estar entre 0 e 1.`);
  }

  // EV decimal: (p * odds) - 1
  const evDecimal = (fairProbability * offeredOdds) - 1;
  const expectedValuePct = Number((evDecimal * 100).toFixed(2));
  const fairOdds = Number((1 / fairProbability).toFixed(4));

  return {
    offeredOdds,
    fairProbability,
    fairOdds,
    expectedValuePct,
    isPositiveEV: expectedValuePct > 0,
  };
}
