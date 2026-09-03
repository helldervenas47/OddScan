import { OddsApiEvent } from './types.js';

/**
 * Mock realista de dados da The Odds API para partidas populares no Brasil
 * Utilizado para desenvolvimento local, testes automatizados e fallback quando a chave não estiver configurada.
 */
export const mockSoccerEvents: OddsApiEvent[] = [
  {
    id: 'soccer_bra_fla_pal_2026',
    sport_key: 'soccer_brazil_campeonato',
    sport_title: 'Brasileirão Série A',
    commence_time: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // Em 4 horas
    home_team: 'Flamengo',
    away_team: 'Palmeiras',
    bookmakers: [
      {
        key: 'betano',
        title: 'Betano',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Flamengo', price: 2.25 },
              { name: 'Draw', price: 3.25 },
              { name: 'Palmeiras', price: 3.30 }
            ]
          },
          {
            key: 'totals',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Over', price: 2.05, point: 2.5 },
              { name: 'Under', price: 1.80, point: 2.5 }
            ]
          }
        ]
      },
      {
        key: 'bet365',
        title: 'Bet365',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Flamengo', price: 2.20 },
              { name: 'Draw', price: 3.35 },
              { name: 'Palmeiras', price: 3.45 }
            ]
          },
          {
            key: 'totals',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Over', price: 2.10, point: 2.5 },
              { name: 'Under', price: 1.75, point: 2.5 }
            ]
          }
        ]
      },
      {
        key: 'superbet',
        title: 'Superbet',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Flamengo', price: 2.30 }, // Melhor odd para Flamengo
              { name: 'Draw', price: 3.30 },
              { name: 'Palmeiras', price: 3.25 }
            ]
          },
          {
            key: 'totals',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Over', price: 2.12, point: 2.5 }, // Melhor odd para Over
              { name: 'Under', price: 1.78, point: 2.5 }
            ]
          }
        ]
      },
      {
        key: 'kto',
        title: 'KTO',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Flamengo', price: 2.22 },
              { name: 'Draw', price: 3.40 }, // Melhor odd para Empate
              { name: 'Palmeiras', price: 3.35 }
            ]
          },
          {
            key: 'totals',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Over', price: 2.02, point: 2.5 },
              { name: 'Under', price: 1.82, point: 2.5 }
            ]
          }
        ]
      },
      {
        key: 'sportingbet',
        title: 'Sportingbet',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Flamengo', price: 2.15 },
              { name: 'Draw', price: 3.30 },
              { name: 'Palmeiras', price: 3.50 } // Melhor odd para Palmeiras
            ]
          },
          {
            key: 'totals',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Over', price: 2.00, point: 2.5 },
              { name: 'Under', price: 1.85, point: 2.5 } // Melhor odd para Under
            ]
          }
        ]
      },
      {
        key: 'pinnacle',
        title: 'Pinnacle',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Flamengo', price: 2.24 },
              { name: 'Draw', price: 3.32 },
              { name: 'Palmeiras', price: 3.41 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'soccer_bra_cor_sao_2026',
    sport_key: 'soccer_brazil_campeonato',
    sport_title: 'Brasileirão Série A',
    commence_time: new Date(Date.now() + 1000 * 60 * 60 * 7).toISOString(), // Em 7 horas
    home_team: 'Corinthians',
    away_team: 'São Paulo',
    bookmakers: [
      {
        key: 'betano',
        title: 'Betano',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Corinthians', price: 2.55 },
              { name: 'Draw', price: 3.05 },
              { name: 'São Paulo', price: 2.95 }
            ]
          }
        ]
      },
      {
        key: 'bet365',
        title: 'Bet365',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Corinthians', price: 2.62 }, // Melhor odd para Corinthians
              { name: 'Draw', price: 3.10 },
              { name: 'São Paulo', price: 2.90 }
            ]
          }
        ]
      },
      {
        key: 'superbet',
        title: 'Superbet',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Corinthians', price: 2.50 },
              { name: 'Draw', price: 3.15 }, // Melhor odd para Empate
              { name: 'São Paulo', price: 3.05 } // Melhor odd para São Paulo
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'soccer_bra_bot_cam_2026',
    sport_key: 'soccer_brazil_campeonato',
    sport_title: 'Brasileirão Série A',
    commence_time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // Amanhã
    home_team: 'Botafogo',
    away_team: 'Atlético Mineiro',
    bookmakers: [
      {
        key: 'betano',
        title: 'Betano',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Botafogo', price: 2.10 },
              { name: 'Draw', price: 3.25 },
              { name: 'Atlético Mineiro', price: 3.75 }
            ]
          }
        ]
      },
      {
        key: 'bet365',
        title: 'Bet365',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Botafogo', price: 2.15 }, // Melhor odd para Botafogo
              { name: 'Draw', price: 3.30 },
              { name: 'Atlético Mineiro', price: 3.70 }
            ]
          }
        ]
      },
      {
        key: 'kto',
        title: 'KTO',
        last_update: new Date().toISOString(),
        markets: [
          {
            key: 'h2h',
            last_update: new Date().toISOString(),
            outcomes: [
              { name: 'Botafogo', price: 2.08 },
              { name: 'Draw', price: 3.35 }, // Melhor odd para Empate
              { name: 'Atlético Mineiro', price: 3.85 } // Melhor odd para Atlético-MG
            ]
          }
        ]
      }
    ]
  }
];
