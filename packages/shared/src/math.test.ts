import { removeVigProportional, calculateConsensusFairOdds } from './math/noVig.js';
import { calculateEV } from './math/ev.js';

console.log('--- Iniciando Testes Matemáticos do OddScan ---');

// Teste 1: Remoção de vig proporcional (mercado 1X2 com margem de 6%)
const outcomes = [
  { name: 'Home', odds: 2.10 },
  { name: 'Draw', odds: 3.30 },
  { name: 'Away', odds: 3.60 },
];

const result = removeVigProportional(outcomes);
console.log(`[Teste 1] Overround calculado: ${result.overround} (Vig: ${result.vigPercentage}%)`);

const sumFairProb = result.outcomes.reduce((acc, o) => acc + o.fairProbability, 0);
console.log(`[Teste 1] Soma das probabilidades justas normalizadas: ${sumFairProb.toFixed(4)} (esperado: 1.0000)`);
if (Math.abs(sumFairProb - 1.0) > 0.001) {
  throw new Error('Falha no teste: soma de probabilidades não fecha em 1.0');
}

// Teste 2: Cálculo de EV%
// Odd oferecida: 2.30, Probabilidade justa: 45% (0.45)
// EV% = (0.45 * 2.30 - 1) * 100 = (1.035 - 1) * 100 = +3.50%
const ev = calculateEV(2.30, 0.45);
console.log(`[Teste 2] EV calculado para odd 2.30 e prob 0.45: ${ev.expectedValuePct}% (+EV: ${ev.isPositiveEV})`);
if (ev.expectedValuePct !== 3.5) {
  throw new Error(`Falha no cálculo de EV: esperado 3.5, obtido ${ev.expectedValuePct}`);
}

// Teste 3: Consenso de múltiplas casas
const consensus = calculateConsensusFairOdds({
  'Home': [2.20, 2.25, 2.30],
  'Draw': [3.30, 3.35, 3.40],
  'Away': [3.25, 3.30, 3.50],
});
console.log('[Teste 3] Consenso Fair Odds calculado com sucesso:', consensus);

console.log('✅ Todos os testes matemáticos foram aprovados com precisão!');
