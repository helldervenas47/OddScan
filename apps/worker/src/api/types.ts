export interface OddsApiOutcome {
  name: string;
  price: number;
  point?: number;
}

export interface OddsApiMarket {
  key: string; // 'h2h', 'totals', 'spreads'
  last_update: string;
  outcomes: OddsApiOutcome[];
}

export interface OddsApiBookmaker {
  key: string; // 'bet365', 'betano', 'pinnacle', 'sport888', etc.
  title: string;
  last_update: string;
  markets: OddsApiMarket[];
}

export interface OddsApiEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: OddsApiBookmaker[];
}
