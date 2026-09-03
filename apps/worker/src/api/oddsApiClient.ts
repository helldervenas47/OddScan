import { OddsApiEvent } from './types.js';
import { mockSoccerEvents } from './mockOddsData.js';

export interface OddsApiFetchOptions {
  sportKeys?: string[];
  regions?: string;
  markets?: string;
}

// Ligas com foco principal no apostador brasileiro
export const DEFAULT_BRAZIL_SPORTS = [
  'soccer_brazil_campeonato',           // Brasileirão Série A
  'soccer_brazil_serie_b',              // Brasileirão Série B (jogos hoje)
  'soccer_conmebol_copa_sudamericana',  // Copa Sul-Americana (Vasco, etc.)
  'soccer_conmebol_copa_libertadores',  // Libertadores (Fluminense, etc.)
  'soccer_spain_la_liga',               // La Liga (jogos hoje)
  'soccer_epl',                         // Premier League
];

export class OddsApiClient {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.the-odds-api.com/v4';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ODDS_API_KEY;
  }

  /**
   * Busca eventos e odds reais para as ligas prioritárias no Brasil
   */
  async getOdds(options: OddsApiFetchOptions = {}): Promise<{
    events: OddsApiEvent[];
    source: 'live_api' | 'mock_fallback';
    remainingRequests?: number;
  }> {
    const sportKeys = options.sportKeys || DEFAULT_BRAZIL_SPORTS;
    const regions = options.regions || process.env.ODDS_API_REGIONS || 'eu,uk';
    const markets = options.markets || process.env.ODDS_API_MARKETS || 'h2h,totals';

    if (!this.apiKey || this.apiKey === 'your-odds-api-key' || process.env.USE_MOCK_FALLBACK === 'true') {
      console.log(`[OddApiClient] Usando dados mockados (chave ausente ou USE_MOCK_FALLBACK ativo)`);
      return {
        events: mockSoccerEvents,
        source: 'mock_fallback',
        remainingRequests: 500,
      };
    }

    const allEvents: OddsApiEvent[] = [];
    let lastRemaining: number | undefined;

    for (const sportKey of sportKeys) {
      try {
        const url = `${this.baseUrl}/sports/${sportKey}/odds/?apiKey=${this.apiKey}&regions=${regions}&markets=${markets}&oddsFormat=decimal`;
        console.log(`[OddApiClient] Requisitando jogos ao vivo: ${sportKey}...`);

        const response = await fetch(url);
        const remaining = response.headers.get('x-requests-remaining');
        if (remaining) {
          lastRemaining = parseInt(remaining, 10);
        }

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`[OddApiClient] Erro ${response.status} em ${sportKey}: ${errText}`);
          continue;
        }

        const events = (await response.json()) as OddsApiEvent[];
        if (Array.isArray(events)) {
          // Normaliza o título da liga
          events.forEach(evt => {
            if (sportKey === 'soccer_brazil_campeonato') evt.sport_title = 'Brasileirão Série A';
            if (sportKey === 'soccer_brazil_serie_b') evt.sport_title = 'Brasileirão Série B';
            if (sportKey === 'soccer_conmebol_copa_libertadores') evt.sport_title = 'Copa Libertadores';
            if (sportKey === 'soccer_conmebol_copa_sudamericana') evt.sport_title = 'Copa Sul-Americana';
            if (sportKey === 'soccer_spain_la_liga') evt.sport_title = 'La Liga';
            if (sportKey === 'soccer_epl') evt.sport_title = 'Premier League';
          });
          allEvents.push(...events);
          console.log(`[OddApiClient] ✓ ${events.length} jogos carregados de ${sportKey}.`);
        }
      } catch (err: any) {
        console.error(`[OddApiClient] Falha ao consultar ${sportKey}:`, err.message);
      }
    }

    if (allEvents.length === 0) {
      console.warn('[OddApiClient] Nenhum evento retornado pelas ligas. Ativando fallback.');
      return {
        events: mockSoccerEvents,
        source: 'mock_fallback',
        remainingRequests: lastRemaining,
      };
    }

    // Ordena os eventos por data/hora (os mais próximos e de hoje primeiro)
    allEvents.sort((a, b) => new Date(a.commence_time).getTime() - new Date(b.commence_time).getTime());

    console.log(`[OddApiClient] Total de jogos reais ao vivo coletados: ${allEvents.length}. Créditos restantes: ${lastRemaining}`);

    return {
      events: allEvents,
      source: 'live_api',
      remainingRequests: lastRemaining,
    };
  }
}
