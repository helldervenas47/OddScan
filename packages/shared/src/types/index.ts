export interface Bookmaker {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  site_url: string;
  is_active: boolean;
  is_brazil_priority: boolean;
  is_licensed_brazil: boolean;
  display_order: number;
}

export interface Sport {
  id: string;
  name: string;
  icon?: string;
  is_active: boolean;
}

export interface League {
  id: string;
  sport_id: string;
  name: string;
  country: string;
  is_active: boolean;
}

export type EventStatus = 'scheduled' | 'live' | 'finished' | 'cancelled';

export interface SportEvent {
  id: string;
  league_id: string | null;
  sport_id: string | null;
  home_team: string;
  away_team: string;
  commence_time: string;
  status: EventStatus;
}

export type MarketType = 'h2h' | 'totals' | 'btts';

export interface OddsSnapshot {
  id?: number;
  event_id: string;
  market_type: MarketType;
  bookmaker_id: string;
  outcome_name: string; // 'Home', 'Draw', 'Away', 'Over', 'Under'
  outcome_point?: number | null;
  odds_value: number;
  collected_at?: string;
}

export interface FairOddsResult {
  outcome_name: string;
  outcome_point?: number | null;
  fair_probability: number; // 0.0 a 1.0 (sem vig)
  fair_odds_value: number; // 1 / fair_probability
  best_market_odds: number;
  best_bookmaker_id: string;
  best_bookmaker_name?: string;
  best_bookmaker_slug?: string;
  expected_value_pct: number; // EV% = ((best_odds * fair_prob) - 1) * 100
}

export interface EventComparisonSummary {
  event: SportEvent & { league_name?: string };
  markets: {
    [key in MarketType]?: {
      market_name: string;
      outcomes: FairOddsResult[];
      all_bookmaker_odds: {
        bookmaker: Bookmaker;
        odds: { [outcomeKey: string]: number };
        is_favorite?: boolean;
      }[];
    };
  };
}
