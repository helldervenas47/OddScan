import React from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import { ClientEventComparison } from '../../lib/mockData';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { normalizeBookmakerSlug } from '../../lib/normalize';
import { formatMatchDateTime } from '../../lib/dateUtils';

interface EventCardProps {
  event: ClientEventComparison;
  activeMarket: 'h2h' | 'totals';
  onSelectEvent: (event: ClientEventComparison) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, activeMarket, onSelectEvent }) => {
  const { isFavorite, onlyFavorites, favoriteBookmakerSlugs } = useFavorites();
  const { toggleBetItem, isItemSelected } = useBetSlip();

  const isH2H = activeMarket === 'h2h';

  // Se o filtro de apenas favoritas estiver ativo, calcula a melhor odd considerando apenas as favoritas
  let displayH2H = event.h2h;
  let hasFavH2HOdds = true;

  if (onlyFavorites) {
    const normFavorites = favoriteBookmakerSlugs.map(s => normalizeBookmakerSlug(s));
    const favOddsList = event.h2h.bookmakerOdds.filter(b => 
      normFavorites.includes(normalizeBookmakerSlug(b.bookmakerSlug))
    );

    if (favOddsList.length > 0) {
      const bestHome = favOddsList.reduce((max, cur) => cur.home > max.home ? cur : max, favOddsList[0]);
      const bestDraw = favOddsList.reduce((max, cur) => cur.draw > max.draw ? cur : max, favOddsList[0]);
      const bestAway = favOddsList.reduce((max, cur) => cur.away > max.away ? cur : max, favOddsList[0]);

      displayH2H = {
        ...event.h2h,
        home: {
          ...event.h2h.home,
          bestOdd: bestHome.home,
          bookmakerSlug: bestHome.bookmakerSlug,
          bookmakerName: bestHome.bookmakerName,
        },
        draw: {
          ...event.h2h.draw,
          bestOdd: bestDraw.draw,
          bookmakerSlug: bestDraw.bookmakerSlug,
          bookmakerName: bestDraw.bookmakerName,
        },
        away: {
          ...event.h2h.away,
          bestOdd: bestAway.away,
          bookmakerSlug: bestAway.bookmakerSlug,
          bookmakerName: bestAway.bookmakerName,
        },
      };
    } else {
      hasFavH2HOdds = false;
    }
  }

  let displayTotals = event.totals;
  let hasFavTotalsOdds = true;

  if (onlyFavorites) {
    const normFavorites = favoriteBookmakerSlugs.map(s => normalizeBookmakerSlug(s));
    const favTotalsList = event.totals.bookmakerOdds.filter(b => 
      normFavorites.includes(normalizeBookmakerSlug(b.bookmakerSlug))
    );

    if (favTotalsList.length > 0) {
      const bestOver = favTotalsList.reduce((max, cur) => cur.over > max.over ? cur : max, favTotalsList[0]);
      const bestUnder = favTotalsList.reduce((max, cur) => cur.under > max.under ? cur : max, favTotalsList[0]);

      displayTotals = {
        ...event.totals,
        over: {
          ...event.totals.over,
          bestOdd: bestOver.over,
          bookmakerSlug: bestOver.bookmakerSlug,
          bookmakerName: bestOver.bookmakerName,
        },
        under: {
          ...event.totals.under,
          bestOdd: bestUnder.under,
          bookmakerSlug: bestUnder.bookmakerSlug,
          bookmakerName: bestUnder.bookmakerName,
        },
      };
    } else {
      hasFavTotalsOdds = false;
    }
  }

  return (
    <article className="event-card" onClick={() => onSelectEvent(event)}>
      <div className="event-card-header">
        <span className="event-league-tag">{event.leagueName}</span>
        <span className="event-time-pill">{formatMatchDateTime(event.commenceTime)}</span>
      </div>

      <div className="event-teams-box">
        <div className="team-line">
          <span>{event.homeTeam}</span>
          <span className="team-tag">Mandante</span>
        </div>
        <div className="team-line">
          <span>{event.awayTeam}</span>
          <span className="team-tag">Visitante</span>
        </div>
      </div>

      {isH2H ? (
        !hasFavH2HOdds ? (
          <div style={{ background: 'var(--bg-app)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Nenhuma das suas casas favoritas tem cotação para este jogo.
          </div>
        ) : (
          <div className="odds-hud">
            {/* Casa */}
            {(() => {
              const itemId = `${event.id}_h2h_home_${displayH2H.home.bookmakerSlug}`;
              const selected = isItemSelected(itemId);
              return (
                <div 
                  className={`odd-slot highlight-best ${selected ? 'in-betslip' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBetItem({
                      id: itemId,
                      eventId: event.id,
                      matchTitle: `${event.homeTeam} vs ${event.awayTeam}`,
                      marketName: 'Resultado Final (1X2)',
                      selectionLabel: `Vitória ${event.homeTeam}`,
                      odd: displayH2H.home.bestOdd,
                      bookmakerSlug: displayH2H.home.bookmakerSlug,
                      bookmakerName: displayH2H.home.bookmakerName,
                    });
                  }}
                  title="Clique para adicionar à caderneta"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="odd-slot-label">1 ({event.homeTeam.substring(0, 3).toUpperCase()})</span>
                  <span className="odd-slot-value">{displayH2H.home.bestOdd.toFixed(2)}</span>
                  <div className="prob-bar-wrapper">
                    <div className="prob-bar-fill" style={{ width: `${(event.h2h.home.fairProb * 100).toFixed(0)}%` }} />
                    <span className="prob-bar-label">{(event.h2h.home.fairProb * 100).toFixed(0)}% chance</span>
                  </div>
                  <div className="odd-slot-bkm">
                    {isFavorite(displayH2H.home.bookmakerSlug) && (
                      <Star size={11} fill="currentColor" color="var(--accent-fav)" />
                    )}
                    <span>{displayH2H.home.bookmakerName}</span>
                  </div>
                  {displayH2H.home.evPct > 0 && (
                    <span className="ev-pill">+{displayH2H.home.evPct}% EV</span>
                  )}
                </div>
              );
            })()}

            {/* Empate */}
            {(() => {
              const itemId = `${event.id}_h2h_draw_${displayH2H.draw.bookmakerSlug}`;
              const selected = isItemSelected(itemId);
              return (
                <div 
                  className={`odd-slot highlight-best ${selected ? 'in-betslip' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBetItem({
                      id: itemId,
                      eventId: event.id,
                      matchTitle: `${event.homeTeam} vs ${event.awayTeam}`,
                      marketName: 'Resultado Final (1X2)',
                      selectionLabel: 'Empate',
                      odd: displayH2H.draw.bestOdd,
                      bookmakerSlug: displayH2H.draw.bookmakerSlug,
                      bookmakerName: displayH2H.draw.bookmakerName,
                    });
                  }}
                  title="Clique para adicionar à caderneta"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="odd-slot-label">Empate (X)</span>
                  <span className="odd-slot-value">{displayH2H.draw.bestOdd.toFixed(2)}</span>
                  <div className="prob-bar-wrapper">
                    <div className="prob-bar-fill" style={{ width: `${(event.h2h.draw.fairProb * 100).toFixed(0)}%` }} />
                    <span className="prob-bar-label">{(event.h2h.draw.fairProb * 100).toFixed(0)}% chance</span>
                  </div>
                  <div className="odd-slot-bkm">
                    {isFavorite(displayH2H.draw.bookmakerSlug) && (
                      <Star size={11} fill="currentColor" color="var(--accent-fav)" />
                    )}
                    <span>{displayH2H.draw.bookmakerName}</span>
                  </div>
                  {displayH2H.draw.evPct > 0 && (
                    <span className="ev-pill">+{displayH2H.draw.evPct}% EV</span>
                  )}
                </div>
              );
            })()}

            {/* Visitante */}
            {(() => {
              const itemId = `${event.id}_h2h_away_${displayH2H.away.bookmakerSlug}`;
              const selected = isItemSelected(itemId);
              return (
                <div 
                  className={`odd-slot highlight-best ${selected ? 'in-betslip' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBetItem({
                      id: itemId,
                      eventId: event.id,
                      matchTitle: `${event.homeTeam} vs ${event.awayTeam}`,
                      marketName: 'Resultado Final (1X2)',
                      selectionLabel: `Vitória ${event.awayTeam}`,
                      odd: displayH2H.away.bestOdd,
                      bookmakerSlug: displayH2H.away.bookmakerSlug,
                      bookmakerName: displayH2H.away.bookmakerName,
                    });
                  }}
                  title="Clique para adicionar à caderneta"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="odd-slot-label">2 ({event.awayTeam.substring(0, 3).toUpperCase()})</span>
                  <span className="odd-slot-value">{displayH2H.away.bestOdd.toFixed(2)}</span>
                  <div className="prob-bar-wrapper">
                    <div className="prob-bar-fill" style={{ width: `${(event.h2h.away.fairProb * 100).toFixed(0)}%` }} />
                    <span className="prob-bar-label">{(event.h2h.away.fairProb * 100).toFixed(0)}% chance</span>
                  </div>
                  <div className="odd-slot-bkm">
                    {isFavorite(displayH2H.away.bookmakerSlug) && (
                      <Star size={11} fill="currentColor" color="var(--accent-fav)" />
                    )}
                    <span>{displayH2H.away.bookmakerName}</span>
                  </div>
                  {displayH2H.away.evPct > 0 && (
                    <span className="ev-pill">+{displayH2H.away.evPct}% EV</span>
                  )}
                </div>
              );
            })()}
          </div>
        )
      ) : (
        !hasFavTotalsOdds ? (
          <div style={{ background: 'var(--bg-app)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '16px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            Nenhuma das suas casas favoritas tem cotação para este mercado.
          </div>
        ) : (
          <div className="odds-hud totals">
            {/* Over */}
            {(() => {
              const itemId = `${event.id}_totals_over_${displayTotals.over.bookmakerSlug}`;
              const selected = isItemSelected(itemId);
              return (
                <div 
                  className={`odd-slot highlight-best ${selected ? 'in-betslip' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBetItem({
                      id: itemId,
                      eventId: event.id,
                      matchTitle: `${event.homeTeam} vs ${event.awayTeam}`,
                      marketName: `Gols (Over ${event.totals.line})`,
                      selectionLabel: `Mais de ${event.totals.line} gols`,
                      odd: displayTotals.over.bestOdd,
                      bookmakerSlug: displayTotals.over.bookmakerSlug,
                      bookmakerName: displayTotals.over.bookmakerName,
                    });
                  }}
                  title="Clique para adicionar à caderneta"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="odd-slot-label">Mais de {event.totals.line} gols</span>
                  <span className="odd-slot-value">{displayTotals.over.bestOdd.toFixed(2)}</span>
                  <div className="prob-bar-wrapper">
                    <div className="prob-bar-fill" style={{ width: `${(event.totals.over.fairProb * 100).toFixed(0)}%` }} />
                    <span className="prob-bar-label">{(event.totals.over.fairProb * 100).toFixed(0)}% chance</span>
                  </div>
                  <div className="odd-slot-bkm">
                    {isFavorite(displayTotals.over.bookmakerSlug) && (
                      <Star size={11} fill="currentColor" color="var(--accent-fav)" />
                    )}
                    <span>{displayTotals.over.bookmakerName}</span>
                  </div>
                  {displayTotals.over.evPct > 0 && (
                    <span className="ev-pill">+{displayTotals.over.evPct}% EV</span>
                  )}
                </div>
              );
            })()}

            {/* Under */}
            {(() => {
              const itemId = `${event.id}_totals_under_${displayTotals.under.bookmakerSlug}`;
              const selected = isItemSelected(itemId);
              return (
                <div 
                  className={`odd-slot highlight-best ${selected ? 'in-betslip' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBetItem({
                      id: itemId,
                      eventId: event.id,
                      matchTitle: `${event.homeTeam} vs ${event.awayTeam}`,
                      marketName: `Gols (Under ${event.totals.line})`,
                      selectionLabel: `Menos de ${event.totals.line} gols`,
                      odd: displayTotals.under.bestOdd,
                      bookmakerSlug: displayTotals.under.bookmakerSlug,
                      bookmakerName: displayTotals.under.bookmakerName,
                    });
                  }}
                  title="Clique para adicionar à caderneta"
                  style={{ cursor: 'pointer' }}
                >
                  <span className="odd-slot-label">Menos de {event.totals.line} gols</span>
                  <span className="odd-slot-value">{displayTotals.under.bestOdd.toFixed(2)}</span>
                  <div className="prob-bar-wrapper">
                    <div className="prob-bar-fill" style={{ width: `${(event.totals.under.fairProb * 100).toFixed(0)}%` }} />
                    <span className="prob-bar-label">{(event.totals.under.fairProb * 100).toFixed(0)}% chance</span>
                  </div>
                  <div className="odd-slot-bkm">
                    {isFavorite(displayTotals.under.bookmakerSlug) && (
                      <Star size={11} fill="currentColor" color="var(--accent-fav)" />
                    )}
                    <span>{displayTotals.under.bookmakerName}</span>
                  </div>
                  {displayTotals.under.evPct > 0 && (
                    <span className="ev-pill">+{displayTotals.under.evPct}% EV</span>
                  )}
                </div>
              );
            })()}
          </div>
        )
      )}

      <div className="event-card-action">
        <span>
          {onlyFavorites 
            ? `${favoriteBookmakerSlugs.length} favoritas ativas` 
            : `${isH2H ? event.h2h.bookmakerOdds.length : event.totals.bookmakerOdds.length} operadoras escaneadas`}
        </span>
        <div className="action-link">
          <span>Comparar Casas</span>
          <ArrowUpRight size={14} />
        </div>
      </div>
    </article>
  );
};
