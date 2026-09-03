-- 20260903000002_seed_brazil_bookmakers.sql
-- Seed inicial de Casas de Apostas com prioridade Brasil (regulamentadas/populares) e metadados

-- 1. Mercados Principais
INSERT INTO public.market_types (id, name, description) VALUES
('h2h', 'Resultado Final (1X2)', 'Vitória do mandante, empate ou vitória do visitante'),
('totals', 'Total de Gols (Over/Under)', 'Total de gols marcados acima ou abaixo de uma linha'),
('btts', 'Ambas as Equipes Marcam', 'Sim ou Não para ambos os times marcarem')
ON CONFLICT (id) DO NOTHING;

-- 2. Esportes
INSERT INTO public.sports (id, name, icon, is_active) VALUES
('soccer', 'Futebol', 'futbol', true),
('basketball', 'Basquete', 'basketball-ball', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Ligas Populares
INSERT INTO public.leagues (id, sport_id, name, country, is_active) VALUES
('soccer_brazil_campeonato', 'soccer', 'Brasileirão Série A', 'Brasil', true),
('soccer_brazil_copa', 'soccer', 'Copa do Brasil', 'Brasil', true),
('soccer_conmebol_libertadores', 'soccer', 'Copa Libertadores', 'América do Sul', true),
('soccer_uefa_champs_league', 'soccer', 'UEFA Champions League', 'Europa', true),
('soccer_epl', 'soccer', 'Premier League', 'Inglaterra', true),
('soccer_spain_la_liga', 'soccer', 'La Liga', 'Espanha', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Casas de Apostas (Prioritárias no Brasil e autorizadas pela SPA/MF)
INSERT INTO public.bookmakers (slug, name, logo_url, site_url, is_active, is_brazil_priority, is_licensed_brazil, display_order) VALUES
('betano', 'Betano', 'https://images.oddscan.app/bookmakers/betano.svg', 'https://br.betano.com', true, true, true, 1),
('bet365', 'Bet365', 'https://images.oddscan.app/bookmakers/bet365.svg', 'https://www.bet365.com', true, true, true, 2),
('superbet', 'Superbet', 'https://images.oddscan.app/bookmakers/superbet.svg', 'https://superbet.com/pt-br', true, true, true, 3),
('kto', 'KTO', 'https://images.oddscan.app/bookmakers/kto.svg', 'https://www.kto.com/pt', true, true, true, 4),
('betnacional', 'Betnacional', 'https://images.oddscan.app/bookmakers/betnacional.svg', 'https://betnacional.com', true, true, true, 5),
('sportingbet', 'Sportingbet', 'https://images.oddscan.app/bookmakers/sportingbet.svg', 'https://sports.sportingbet.com/pt-br/sports', true, true, true, 6),
('pinnacle', 'Pinnacle (Referência Sem Margem)', 'https://images.oddscan.app/bookmakers/pinnacle.svg', 'https://www.pinnacle.com', true, false, false, 99)
ON CONFLICT (slug) DO UPDATE SET 
    name = EXCLUDED.name,
    is_brazil_priority = EXCLUDED.is_brazil_priority,
    is_licensed_brazil = EXCLUDED.is_licensed_brazil,
    site_url = EXCLUDED.site_url,
    display_order = EXCLUDED.display_order;
