export * from './types/index.js';
export * from './math/noVig.js';
export * from './math/ev.js';

/**
 * Normaliza os identificadores de casas da The Odds API
 * Ex: 'betano_uk' -> 'betano', 'betfair_ex_uk' -> 'betfair'
 */
export function normalizeBookmakerSlug(rawSlug: string): string {
  if (!rawSlug) return '';
  const s = rawSlug.toLowerCase();
  if (s.startsWith('betano')) return 'betano';
  if (s.startsWith('bet365')) return 'bet365';
  if (s.startsWith('betfair')) return 'betfair';
  if (s.startsWith('pinnacle')) return 'pinnacle';
  if (s.startsWith('betway')) return 'betway';
  if (s.startsWith('onexbet') || s.includes('1xbet')) return 'onexbet';
  if (s.startsWith('superbet')) return 'superbet';
  if (s.startsWith('kto')) return 'kto';
  if (s.startsWith('sportingbet')) return 'sportingbet';
  if (s.startsWith('betnacional')) return 'betnacional';
  if (s.startsWith('williamhill')) return 'williamhill';
  if (s.startsWith('betsson')) return 'betsson';
  if (s.startsWith('leovegas')) return 'leovegas';
  if (s.startsWith('unibet')) return 'unibet';
  if (s.startsWith('marathon')) return 'marathonbet';
  if (s.startsWith('skybet')) return 'skybet';
  if (s.startsWith('paddypower')) return 'paddypower';
  if (s.startsWith('ladbrokes')) return 'ladbrokes';
  return s;
}
