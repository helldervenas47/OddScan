-- 20260903000003_views_and_policies.sql
-- Views e helpers para acelerar consultas analíticas do frontend

-- View para consulta do card de eventos com as últimas odds consolidadas
CREATE OR REPLACE VIEW public.view_upcoming_events_summary AS
SELECT 
    e.id AS event_id,
    e.home_team,
    e.away_team,
    e.commence_time,
    e.status,
    l.id AS league_id,
    l.name AS league_name,
    l.country AS league_country,
    s.id AS sport_id,
    s.name AS sport_name
FROM public.events e
LEFT JOIN public.leagues l ON e.league_id = l.id
LEFT JOIN public.sports s ON e.sport_id = s.id
WHERE e.commence_time >= (now() - interval '2 hours')
ORDER BY e.commence_time ASC;

-- View dos últimos cálculos de Fair Odds e EV por evento
CREATE OR REPLACE VIEW public.view_latest_fair_odds AS
SELECT DISTINCT ON (fo.event_id, fo.market_type, fo.outcome_name, COALESCE(fo.outcome_point, 0))
    fo.id,
    fo.event_id,
    fo.market_type,
    fo.outcome_name,
    fo.outcome_point,
    fo.fair_probability,
    fo.fair_odds_value,
    fo.best_market_odds,
    fo.best_bookmaker_id,
    b.name AS best_bookmaker_name,
    b.slug AS best_bookmaker_slug,
    b.logo_url AS best_bookmaker_logo,
    b.site_url AS best_bookmaker_url,
    b.is_brazil_priority,
    fo.expected_value_pct,
    fo.calculated_at
FROM public.fair_odds fo
LEFT JOIN public.bookmakers b ON fo.best_bookmaker_id = b.id
ORDER BY fo.event_id, fo.market_type, fo.outcome_name, COALESCE(fo.outcome_point, 0), fo.calculated_at DESC;
