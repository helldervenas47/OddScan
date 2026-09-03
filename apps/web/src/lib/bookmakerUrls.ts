import { normalizeBookmakerSlug } from './normalize';
import { BetItem } from '../contexts/BetSlipContext';

/**
 * Retorna a URL oficial e direta para acesso às casas de apostas parceiras
 */
export function getBookmakerUrl(rawSlug: string): string {
  if (!rawSlug) return 'https://www.google.com';
  const norm = normalizeBookmakerSlug(rawSlug);

  switch (norm) {
    case 'betano':
      return 'https://br.betano.com';
    case 'bet365':
      return 'https://www.bet365.com/#/HO/';
    case 'superbet':
      return 'https://superbet.com/pt-br';
    case 'kto':
      return 'https://www.kto.com/pt';
    case 'sportingbet':
      return 'https://sports.sportingbet.com/pt-br/sports';
    case 'betfair':
      return 'https://www.betfair.com/br';
    case 'betway':
      return 'https://betway.com/pt/sports';
    case 'pinnacle':
      return 'https://www.pinnacle.com';
    case 'betnacional':
      return 'https://betnacional.com';
    case 'onexbet':
      return 'https://1xbet.com/br/';
    case 'williamhill':
      return 'https://sports.williamhill.com';
    case 'betsson':
      return 'https://www.betsson.com/br';
    case 'leovegas':
      return 'https://www.leovegas.com/pt-br';
    case 'unibet':
      return 'https://www.unibet.com';
    case 'marathonbet':
      return 'https://www.marathonbet.com';
    case 'skybet':
      return 'https://m.skybet.com';
    case 'paddypower':
      return 'https://www.paddypower.com';
    case 'ladbrokes':
      return 'https://sports.ladbrokes.com';
    default:
      return `https://www.google.com/search?q=${encodeURIComponent(rawSlug + ' casa de apostas site oficial')}`;
  }
}

/**
 * Constrói a URL de Deep Link direto para a partida ou cupom de aposta na casa de aposta
 */
export function buildBookmakerDeepLinkUrl(rawSlug: string, items: BetItem[]): string {
  if (!rawSlug) return 'https://www.google.com';
  const norm = normalizeBookmakerSlug(rawSlug);

  // Extrai o nome do primeiro time/jogo para o parâmetro de busca direta do evento
  const firstItem = items[0];
  const searchTerm = firstItem ? firstItem.matchTitle.split(' vs ')[0] || firstItem.matchTitle : '';
  const query = encodeURIComponent(searchTerm);

  switch (norm) {
    case 'betano':
      return searchTerm ? `https://br.betano.com/search/?q=${query}` : 'https://br.betano.com';
    case 'bet365':
      return searchTerm ? `https://www.bet365.com/#/AX/K%5E${query}/` : 'https://www.bet365.com/#/HO/';
    case 'superbet':
      return searchTerm ? `https://superbet.com/pt-br/pesquisar?query=${query}` : 'https://superbet.com/pt-br';
    case 'kto':
      return searchTerm ? `https://www.kto.com/pt/esportes/?search=${query}` : 'https://www.kto.com/pt';
    case 'sportingbet':
      return searchTerm ? `https://sports.sportingbet.com/pt-br/sports/search?q=${query}` : 'https://sports.sportingbet.com/pt-br/sports';
    case 'betfair':
      return searchTerm ? `https://www.betfair.com/br/apostas-esportivas/search?q=${query}` : 'https://www.betfair.com/br';
    default:
      return getBookmakerUrl(rawSlug);
  }
}

/**
 * Gera o texto do cupom/bilhete formatado para ser copiado à área de transferência do usuário
 */
export function generateBetCouponSummary(
  items: BetItem[],
  stake: number,
  totalOdd: number,
  potentialReturn: number
): string {
  if (items.length === 0) return '';

  const bookmakerName = items[0].bookmakerName;
  const lines: string[] = [
    `🎟️ BILHETE ODDSCAN PRO — ${bookmakerName.toUpperCase()}`,
    `----------------------------------------`,
  ];

  items.forEach((item, idx) => {
    lines.push(`${idx + 1}. Jogo: ${item.matchTitle}`);
    lines.push(`   Aposta: ${item.selectionLabel} (${item.marketName}) @ ${item.odd.toFixed(2)}`);
  });

  lines.push(`----------------------------------------`);
  lines.push(`Odd Total: ${totalOdd.toFixed(2)}`);
  lines.push(`Valor da Aposta: R$ ${stake.toFixed(2)}`);
  lines.push(`Retorno Estimado: R$ ${potentialReturn.toFixed(2)}`);
  lines.push(`----------------------------------------`);
  lines.push(`Gerado via OddScan PRO - oddscan.app`);

  return lines.join('\n');
}
