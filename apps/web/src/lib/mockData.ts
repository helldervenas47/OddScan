import { Bookmaker } from '@oddscan/shared';

export const initialBookmakersList: Bookmaker[] = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    slug: 'betano',
    name: 'Betano',
    logo_url: null,
    site_url: 'https://br.betano.com',
    is_active: true,
    is_brazil_priority: true,
    is_licensed_brazil: true,
    display_order: 1,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    slug: 'bet365',
    name: 'Bet365',
    logo_url: null,
    site_url: 'https://www.bet365.com',
    is_active: true,
    is_brazil_priority: true,
    is_licensed_brazil: true,
    display_order: 2,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000003',
    slug: 'superbet',
    name: 'Superbet',
    logo_url: null,
    site_url: 'https://superbet.com/pt-br',
    is_active: true,
    is_brazil_priority: true,
    is_licensed_brazil: true,
    display_order: 3,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000004',
    slug: 'kto',
    name: 'KTO',
    logo_url: null,
    site_url: 'https://www.kto.com/pt',
    is_active: true,
    is_brazil_priority: true,
    is_licensed_brazil: true,
    display_order: 4,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000005',
    slug: 'sportingbet',
    name: 'Sportingbet',
    logo_url: null,
    site_url: 'https://sports.sportingbet.com/pt-br/sports',
    is_active: true,
    is_brazil_priority: true,
    is_licensed_brazil: true,
    display_order: 5,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000006',
    slug: 'betfair',
    name: 'Betfair',
    logo_url: null,
    site_url: 'https://www.betfair.com',
    is_active: true,
    is_brazil_priority: true,
    is_licensed_brazil: true,
    display_order: 6,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000007',
    slug: 'betway',
    name: 'Betway',
    logo_url: null,
    site_url: 'https://betway.com',
    is_active: true,
    is_brazil_priority: true,
    is_licensed_brazil: true,
    display_order: 7,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000008',
    slug: 'pinnacle',
    name: 'Pinnacle',
    logo_url: null,
    site_url: 'https://www.pinnacle.com',
    is_active: true,
    is_brazil_priority: false,
    is_licensed_brazil: false,
    display_order: 8,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000009',
    slug: 'onexbet',
    name: '1xBet',
    logo_url: null,
    site_url: 'https://1xbet.com',
    is_active: true,
    is_brazil_priority: false,
    is_licensed_brazil: false,
    display_order: 9,
  },
  {
    id: 'b0000000-0000-0000-0000-000000000010',
    slug: 'williamhill',
    name: 'William Hill',
    logo_url: null,
    site_url: 'https://www.williamhill.com',
    is_active: true,
    is_brazil_priority: false,
    is_licensed_brazil: false,
    display_order: 10,
  },
];

export interface ClientEventComparison {
  id: string;
  homeTeam: string;
  awayTeam: string;
  leagueName: string;
  commenceTime: string;
  lastUpdated: string;
  h2h: {
    home: { bestOdd: number; bookmakerSlug: string; bookmakerName: string; fairOdds: number; fairProb: number; evPct: number };
    draw: { bestOdd: number; bookmakerSlug: string; bookmakerName: string; fairOdds: number; fairProb: number; evPct: number };
    away: { bestOdd: number; bookmakerSlug: string; bookmakerName: string; fairOdds: number; fairProb: number; evPct: number };
    bookmakerOdds: {
      bookmakerSlug: string;
      bookmakerName: string;
      home: number;
      draw: number;
      away: number;
    }[];
  };
  totals: {
    line: number;
    over: { bestOdd: number; bookmakerSlug: string; bookmakerName: string; fairOdds: number; fairProb: number; evPct: number };
    under: { bestOdd: number; bookmakerSlug: string; bookmakerName: string; fairOdds: number; fairProb: number; evPct: number };
    bookmakerOdds: {
      bookmakerSlug: string;
      bookmakerName: string;
      over: number;
      under: number;
    }[];
  };
}

export const sampleEventsComparison: ClientEventComparison[] = [
  {
    id: 'soccer_bra_fla_pal_2026',
    homeTeam: 'Flamengo',
    awayTeam: 'Palmeiras',
    leagueName: 'Brasileirão Série A',
    commenceTime: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(),
    lastUpdated: 'Há 4 minutos (Auto)',
    h2h: {
      home: { bestOdd: 2.30, bookmakerSlug: 'superbet', bookmakerName: 'Superbet', fairOdds: 2.22, fairProb: 0.4504, evPct: 3.59 },
      draw: { bestOdd: 3.40, bookmakerSlug: 'kto', bookmakerName: 'KTO', fairOdds: 3.32, fairProb: 0.3012, evPct: 2.41 },
      away: { bestOdd: 3.50, bookmakerSlug: 'sportingbet', bookmakerName: 'Sportingbet', fairOdds: 3.42, fairProb: 0.2924, evPct: 2.34 },
      bookmakerOdds: [
        { bookmakerSlug: 'superbet', bookmakerName: 'Superbet', home: 2.30, draw: 3.30, away: 3.25 },
        { bookmakerSlug: 'betano', bookmakerName: 'Betano', home: 2.25, draw: 3.25, away: 3.30 },
        { bookmakerSlug: 'bet365', bookmakerName: 'Bet365', home: 2.20, draw: 3.35, away: 3.45 },
        { bookmakerSlug: 'kto', bookmakerName: 'KTO', home: 2.22, draw: 3.40, away: 3.35 },
        { bookmakerSlug: 'sportingbet', bookmakerName: 'Sportingbet', home: 2.15, draw: 3.30, away: 3.50 },
      ],
    },
    totals: {
      line: 2.5,
      over: { bestOdd: 2.12, bookmakerSlug: 'superbet', bookmakerName: 'Superbet', fairOdds: 2.06, fairProb: 0.4854, evPct: 2.91 },
      under: { bestOdd: 1.85, bookmakerSlug: 'sportingbet', bookmakerName: 'Sportingbet', fairOdds: 1.81, fairProb: 0.5525, evPct: 2.21 },
      bookmakerOdds: [
        { bookmakerSlug: 'superbet', bookmakerName: 'Superbet', over: 2.12, under: 1.78 },
        { bookmakerSlug: 'bet365', bookmakerName: 'Bet365', over: 2.10, under: 1.75 },
        { bookmakerSlug: 'betano', bookmakerName: 'Betano', over: 2.05, under: 1.80 },
        { bookmakerSlug: 'kto', bookmakerName: 'KTO', over: 2.02, under: 1.82 },
        { bookmakerSlug: 'sportingbet', bookmakerName: 'Sportingbet', over: 2.00, under: 1.85 },
      ],
    },
  },
  {
    id: 'soccer_bra_cor_sao_2026',
    homeTeam: 'Corinthians',
    awayTeam: 'São Paulo',
    leagueName: 'Brasileirão Série A',
    commenceTime: new Date(Date.now() + 1000 * 60 * 60 * 7).toISOString(),
    lastUpdated: 'Há 12 minutos (Auto)',
    h2h: {
      home: { bestOdd: 2.62, bookmakerSlug: 'bet365', bookmakerName: 'Bet365', fairOdds: 2.56, fairProb: 0.3906, evPct: 2.34 },
      draw: { bestOdd: 3.15, bookmakerSlug: 'superbet', bookmakerName: 'Superbet', fairOdds: 3.10, fairProb: 0.3226, evPct: 1.62 },
      away: { bestOdd: 3.05, bookmakerSlug: 'superbet', bookmakerName: 'Superbet', fairOdds: 2.98, fairProb: 0.3356, evPct: 2.35 },
      bookmakerOdds: [
        { bookmakerSlug: 'bet365', bookmakerName: 'Bet365', home: 2.62, draw: 3.10, away: 2.90 },
        { bookmakerSlug: 'superbet', bookmakerName: 'Superbet', home: 2.50, draw: 3.15, away: 3.05 },
        { bookmakerSlug: 'betano', bookmakerName: 'Betano', home: 2.55, draw: 3.05, away: 2.95 },
      ],
    },
    totals: {
      line: 2.5,
      over: { bestOdd: 2.35, bookmakerSlug: 'betano', bookmakerName: 'Betano', fairOdds: 2.30, fairProb: 0.4348, evPct: 2.17 },
      under: { bestOdd: 1.65, bookmakerSlug: 'bet365', bookmakerName: 'Bet365', fairOdds: 1.62, fairProb: 0.6173, evPct: 1.85 },
      bookmakerOdds: [
        { bookmakerSlug: 'betano', bookmakerName: 'Betano', over: 2.35, under: 1.62 },
        { bookmakerSlug: 'bet365', bookmakerName: 'Bet365', over: 2.30, under: 1.65 },
      ],
    },
  },
  {
    id: 'soccer_bra_bot_cam_2026',
    homeTeam: 'Botafogo',
    awayTeam: 'Atlético Mineiro',
    leagueName: 'Brasileirão Série A',
    commenceTime: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    lastUpdated: 'Há 18 minutos (Auto)',
    h2h: {
      home: { bestOdd: 2.15, bookmakerSlug: 'bet365', bookmakerName: 'Bet365', fairOdds: 2.10, fairProb: 0.4762, evPct: 2.38 },
      draw: { bestOdd: 3.35, bookmakerSlug: 'kto', bookmakerName: 'KTO', fairOdds: 3.30, fairProb: 0.3030, evPct: 1.52 },
      away: { bestOdd: 3.85, bookmakerSlug: 'kto', bookmakerName: 'KTO', fairOdds: 3.75, fairProb: 0.2667, evPct: 2.67 },
      bookmakerOdds: [
        { bookmakerSlug: 'bet365', bookmakerName: 'Bet365', home: 2.15, draw: 3.30, away: 3.70 },
        { bookmakerSlug: 'kto', bookmakerName: 'KTO', home: 2.08, draw: 3.35, away: 3.85 },
        { bookmakerSlug: 'betano', bookmakerName: 'Betano', home: 2.10, draw: 3.25, away: 3.75 },
      ],
    },
    totals: {
      line: 2.5,
      over: { bestOdd: 2.08, bookmakerSlug: 'kto', bookmakerName: 'KTO', fairOdds: 2.04, fairProb: 0.4902, evPct: 1.96 },
      under: { bestOdd: 1.82, bookmakerSlug: 'betano', bookmakerName: 'Betano', fairOdds: 1.78, fairProb: 0.5618, evPct: 2.25 },
      bookmakerOdds: [
        { bookmakerSlug: 'kto', bookmakerName: 'KTO', over: 2.08, under: 1.77 },
        { bookmakerSlug: 'betano', bookmakerName: 'Betano', over: 2.02, under: 1.82 },
      ],
    },
  },
];
