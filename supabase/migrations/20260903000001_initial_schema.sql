-- 20260903000001_initial_schema.sql
-- OddScan Database Schema (Supabase / PostgreSQL)

-- 1. Tabela de Casas de Apostas (Bookmakers)
CREATE TABLE IF NOT EXISTS public.bookmakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    site_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_brazil_priority BOOLEAN DEFAULT false NOT NULL,
    is_licensed_brazil BOOLEAN DEFAULT true NOT NULL,
    display_order INT DEFAULT 100 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Tabela de Esportes
CREATE TABLE IF NOT EXISTS public.sports (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- 3. Tabela de Ligas / Competições
CREATE TABLE IF NOT EXISTS public.leagues (
    id TEXT PRIMARY KEY,
    sport_id TEXT NOT NULL REFERENCES public.sports(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    country TEXT DEFAULT 'Brasil' NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- 4. Tabela de Eventos (Partidas)
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    league_id TEXT REFERENCES public.leagues(id) ON DELETE SET NULL,
    sport_id TEXT REFERENCES public.sports(id) ON DELETE SET NULL,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    commence_time TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_events_commence_time ON public.events(commence_time);
CREATE INDEX IF NOT EXISTS idx_events_league ON public.events(league_id);

-- 5. Tabela de Tipos de Mercado
CREATE TABLE IF NOT EXISTS public.market_types (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

-- 6. Histórico de Odds Coletadas (Snapshots temporais)
CREATE TABLE IF NOT EXISTS public.odds_snapshots (
    id BIGSERIAL PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    market_type TEXT NOT NULL REFERENCES public.market_types(id) ON DELETE CASCADE,
    bookmaker_id UUID NOT NULL REFERENCES public.bookmakers(id) ON DELETE CASCADE,
    outcome_name TEXT NOT NULL,
    outcome_point NUMERIC(5, 2),
    odds_value NUMERIC(8, 4) NOT NULL,
    collected_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_odds_event_market ON public.odds_snapshots(event_id, market_type, collected_at DESC);
CREATE INDEX IF NOT EXISTS idx_odds_bookmaker ON public.odds_snapshots(bookmaker_id);
CREATE INDEX IF NOT EXISTS idx_odds_collected_at ON public.odds_snapshots(collected_at DESC);

-- 7. Tabela de Probabilidade Justa (No-Vig) e Valor Esperado (EV)
CREATE TABLE IF NOT EXISTS public.fair_odds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    market_type TEXT NOT NULL REFERENCES public.market_types(id) ON DELETE CASCADE,
    outcome_name TEXT NOT NULL,
    outcome_point NUMERIC(5, 2),
    fair_probability NUMERIC(6, 4) NOT NULL,
    fair_odds_value NUMERIC(8, 4) NOT NULL,
    best_market_odds NUMERIC(8, 4) NOT NULL,
    best_bookmaker_id UUID REFERENCES public.bookmakers(id) ON DELETE SET NULL,
    expected_value_pct NUMERIC(6, 2) NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_fair_odds_event ON public.fair_odds(event_id, market_type, calculated_at DESC);

-- 8. Tabela de Casas Favoritas por Usuário (Supabase Auth)
CREATE TABLE IF NOT EXISTS public.user_favorite_bookmakers (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bookmaker_id UUID NOT NULL REFERENCES public.bookmakers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (user_id, bookmaker_id)
);
CREATE INDEX IF NOT EXISTS idx_user_fav_user ON public.user_favorite_bookmakers(user_id);

-- 9. Habilitação de Row Level Security (RLS)
ALTER TABLE public.bookmakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.odds_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fair_odds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_bookmakers ENABLE ROW LEVEL SECURITY;

-- 10. Políticas de Acesso
-- Leitura pública para tabelas operacionais
CREATE POLICY "Public read bookmakers" ON public.bookmakers FOR SELECT USING (true);
CREATE POLICY "Public read sports" ON public.sports FOR SELECT USING (true);
CREATE POLICY "Public read leagues" ON public.leagues FOR SELECT USING (true);
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public read market_types" ON public.market_types FOR SELECT USING (true);
CREATE POLICY "Public read odds_snapshots" ON public.odds_snapshots FOR SELECT USING (true);
CREATE POLICY "Public read fair_odds" ON public.fair_odds FOR SELECT USING (true);

-- Favoritos: apenas o próprio usuário pode ler e gerenciar seus favoritos
CREATE POLICY "Users can view own favorite bookmakers" 
    ON public.user_favorite_bookmakers FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorite bookmakers" 
    ON public.user_favorite_bookmakers FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorite bookmakers" 
    ON public.user_favorite_bookmakers FOR DELETE 
    USING (auth.uid() = user_id);
