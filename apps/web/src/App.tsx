import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { ResponsibleGamingBanner } from './components/layout/ResponsibleGamingBanner';
import { EventCard } from './components/odds/EventCard';
import { DailyHighlights } from './components/odds/DailyHighlights';
import { ComparisonModal } from './components/modals/ComparisonModal';
import { FavoritesModal } from './components/modals/FavoritesModal';
import { AuthModal } from './components/modals/AuthModal';
import { BetSlip } from './components/betslip/BetSlip';
import { ClientEventComparison } from './lib/mockData';
import liveOddsJson from './lib/liveOddsData.json';
import { HelpCircle, Filter, Star, AlertTriangle } from 'lucide-react';
import { useFavorites } from './contexts/FavoritesContext';
import { normalizeBookmakerSlug } from './lib/normalize';
import { isMatchToday } from './lib/dateUtils';

const rawEvents = (liveOddsJson && liveOddsJson.length > 0)
  ? (liveOddsJson as ClientEventComparison[])
  : [];

export const App: React.FC = () => {
  const [activeMarket, setActiveMarket] = useState<'h2h' | 'totals'>('h2h');
  const [selectedEvent, setSelectedEvent] = useState<ClientEventComparison | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [leagueFilter, setLeagueFilter] = useState<string>('todos');

  const { onlyFavorites, toggleOnlyFavorites, favoriteBookmakerSlugs } = useFavorites();

  // Filtra eventos por liga ou data
  const filteredEvents = rawEvents.filter((evt) => {
    // Se o flag de apenas favoritas estiver ativo e houver favoritas selecionadas,
    // só mostra eventos que tenham pelo menos uma das casas favoritas
    if (onlyFavorites && favoriteBookmakerSlugs.length > 0) {
      const normFavorites = favoriteBookmakerSlugs.map(s => normalizeBookmakerSlug(s));
      const hasFavBookmaker = evt.h2h.bookmakerOdds.some(b => 
        normFavorites.includes(normalizeBookmakerSlug(b.bookmakerSlug))
      );
      if (!hasFavBookmaker) return false;
    }

    if (leagueFilter === 'todos') return true;
    if (leagueFilter === 'hoje') {
      return isMatchToday(evt.commenceTime);
    }
    if (leagueFilter === 'brasileirao') {
      return evt.leagueName.includes('Brasileir');
    }
    if (leagueFilter === 'conmebol') {
      return evt.leagueName.includes('Libertadores') || evt.leagueName.includes('Sul-Americana');
    }
    if (leagueFilter === 'europa') {
      return evt.leagueName.includes('La Liga') || evt.leagueName.includes('Premier League');
    }
    return true;
  });

  return (
    <div className="app-container">
      {/* Header com Toggle Dark/Light e Flag de Favoritas */}
      <Header 
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Banner de Jogo Responsável */}
      <ResponsibleGamingBanner />

      {/* Conteúdo Principal */}
      <main className="content-area">
        {/* Painel de Scanner Futurista e Seleção de Mercado */}
        <section className="scanner-status-panel">
          <div className="scanner-left">
            <div className="radar-ping" />
            <div>
              <div className="scanner-text-main">
                <span>Odds Reais Conectadas (The Odds API)</span>
              </div>
              <div className="scanner-text-sub">
                {rawEvents.length} jogos monitorados em tempo real • Conexão ativa
              </div>
            </div>
          </div>

          <div className="market-tabs">
            <button 
              className={`market-tab-btn ${activeMarket === 'h2h' ? 'active' : ''}`}
              onClick={() => setActiveMarket('h2h')}
            >
              Resultado Final (1X2)
            </button>
            <button 
              className={`market-tab-btn ${activeMarket === 'totals' ? 'active' : ''}`}
              onClick={() => setActiveMarket('totals')}
            >
              Gols (Over/Under 2.5)
            </button>
          </div>
        </section>

        {/* Filtro Rápido de Competições e Flag de Favoritas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <Filter size={13} />
            <span>Filtro:</span>
          </div>

          {[
            { id: 'todos', label: 'Todos os Jogos' },
            { id: 'hoje', label: 'Partidas de Hoje' },
            { id: 'brasileirao', label: 'Brasileirão (A & B)' },
            { id: 'conmebol', label: 'Libertadores & Sul-Americana' },
            { id: 'europa', label: 'La Liga & Premier League' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setLeagueFilter(f.id)}
              style={{
                background: leagueFilter === f.id ? 'var(--accent-tech)' : 'var(--bg-surface)',
                color: leagueFilter === f.id ? '#080a0f' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '5px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {f.label}
            </button>
          ))}

          {/* Botão Flag de Apenas Favoritas na barra de filtros */}
          <button
            onClick={() => {
              if (favoriteBookmakerSlugs.length === 0) {
                setIsFavoritesOpen(true);
              } else {
                toggleOnlyFavorites();
              }
            }}
            style={{
              background: onlyFavorites ? 'var(--accent-fav)' : 'var(--bg-surface)',
              color: onlyFavorites ? '#080a0f' : 'var(--text-secondary)',
              border: onlyFavorites ? '1px solid var(--accent-fav)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              padding: '5px 12px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: 'auto',
            }}
          >
            <Star size={12} fill={onlyFavorites ? 'currentColor' : 'none'} />
            <span>{onlyFavorites ? 'Apenas Favoritas: ON' : 'Apenas Favoritas: OFF'}</span>
          </button>
        </div>

        {/* Alerta caso o usuário tenha ativado o flag de favoritas mas não tenha selecionado nenhuma casa */}
        {onlyFavorites && favoriteBookmakerSlugs.length === 0 && (
          <div style={{
            background: 'var(--accent-fav-bg)',
            border: '1px solid var(--accent-fav)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-primary)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color="var(--accent-fav)" />
              <span>Você ativou o filtro de favoritas, mas sua conta ainda não tem nenhuma casa marcada.</span>
            </div>
            <button 
              className="btn-futuristic" 
              onClick={() => setIsFavoritesOpen(true)}
              style={{ padding: '4px 12px', fontSize: '0.75rem' }}
            >
              Escolher Casas
            </button>
          </div>
        )}

        {/* Destaques do Dia (Top 3 Apostas de Maior Valor x Probabilidade) */}
        <DailyHighlights 
          events={filteredEvents}
          onSelectEvent={(evt) => setSelectedEvent(evt)}
        />

        {/* Barra de Explicação Rápida */}
        <div className="quick-guide-bar">
          <HelpCircle size={15} color="var(--accent-tech)" />
          <div>
            <strong>Como entender: </strong>
            {onlyFavorites 
              ? `Exibindo as melhores odds exclusivamente entre as suas ${favoriteBookmakerSlugs.length} casas favoritas.` 
              : 'Destacamos a maior odd do mercado para cada desfecho. O badge +EV% indica oportunidade matemática positiva frente à odd sem taxa das casas.'}
          </div>
        </div>

        {/* Grid de Partidas Reais */}
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>Nenhuma partida encontrada para este filtro.</p>
            {onlyFavorites && (
              <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>
                Tente desativar o filtro de favoritas ou adicionar mais casas à sua lista de preferências.
              </p>
            )}
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id}
                event={event}
                activeMarket={activeMarket}
                onSelectEvent={(evt) => setSelectedEvent(evt)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Rodapé Institucional */}
      <footer className="app-footer">
        <div>
          <span>OddScan PRO — Dados oficiais coletados via The Odds API para o mercado regulamentado.</span>
        </div>
        <div>
          Apostas esportivas envolvem risco financeiro. Jogue com responsabilidade.
        </div>
      </footer>

      {/* Modais */}
      <ComparisonModal 
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        activeMarket={activeMarket}
      />

      <FavoritesModal 
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
      />

      <AuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Caderneta de Apostas Flutuante */}
      <BetSlip />
    </div>
  );
};
