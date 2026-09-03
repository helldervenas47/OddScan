import React, { useState, useMemo } from 'react';
import { X, ExternalLink, Star, Activity, TrendingUp, Goal, Shield, Users, Minus } from 'lucide-react';
import { ClientEventComparison } from '../../lib/mockData';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useBetSlip, BetItem } from '../../contexts/BetSlipContext';
import { formatMatchDateTime } from '../../lib/dateUtils';
import { getBookmakerUrl } from '../../lib/bookmakerUrls';

interface ComparisonModalProps {
  event: ClientEventComparison | null;
  onClose: () => void;
  activeMarket: 'h2h' | 'totals';
}

type MarketType = 'h2h' | 'totals' | 'double_chance' | 'btts' | 'draw_no_bet';

interface DerivedMarketRow {
  bookmakerSlug: string;
  bookmakerName: string;
  values: { label: string; odd: number }[];
}

function computeDerived(bkm: any, totalsBkms: any[]) {
  const sumH2H = (1 / bkm.home) + (1 / bkm.draw) + (1 / bkm.away);
  const pH = (1 / bkm.home) / sumH2H;
  const pD = (1 / bkm.draw) / sumH2H;
  const pA = (1 / bkm.away) / sumH2H;

  const totalsBkm = totalsBkms.find((t: any) => t.bookmakerSlug === bkm.bookmakerSlug);

  return {
    dc1X: 1 / ((pH + pD) * 1.05),
    dc12: 1 / ((pH + pA) * 1.05),
    dcX2: 1 / ((pD + pA) * 1.05),
    dnb1: 1 / ((pH / (pH + pA)) * 1.04),
    dnb2: 1 / ((pA / (pH + pA)) * 1.04),
    bttsYes: totalsBkm
      ? 1 / ((1 / totalsBkm.over) * 0.88 * 1.05)
      : 1 / ((1 - pD * 0.5) * 0.45 * 1.05),
    bttsNo: totalsBkm
      ? 1 / ((1 / totalsBkm.under) * 0.82 * 1.05)
      : 1 / ((pD * 0.5 + 0.3) * 1.05),
  };
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ event, onClose, activeMarket: initialMarket }) => {
  const { isFavorite, toggleFavorite, onlyFavorites, favoriteBookmakerSlugs } = useFavorites();
  const { toggleBetItem, isItemSelected } = useBetSlip();
  const [modalFilterFavs, setModalFilterFavs] = useState<boolean>(onlyFavorites);
  const [modalMarket, setModalMarket] = useState<MarketType>(initialMarket);

  // All useMemo hooks BEFORE the early return to satisfy React rules of hooks
  const doubleChandeData = useMemo<DerivedMarketRow[]>(() => {
    if (!event) return [];
    return event.h2h.bookmakerOdds.map((bkm: any) => {
      const d = computeDerived(bkm, event.totals.bookmakerOdds);
      return {
        bookmakerSlug: bkm.bookmakerSlug,
        bookmakerName: bkm.bookmakerName,
        values: [
          { label: '1X', odd: Math.round(d.dc1X * 100) / 100 },
          { label: '12', odd: Math.round(d.dc12 * 100) / 100 },
          { label: 'X2', odd: Math.round(d.dcX2 * 100) / 100 },
        ],
      };
    });
  }, [event]);

  const drawNoBetData = useMemo<DerivedMarketRow[]>(() => {
    if (!event) return [];
    return event.h2h.bookmakerOdds.map((bkm: any) => {
      const d = computeDerived(bkm, event.totals.bookmakerOdds);
      return {
        bookmakerSlug: bkm.bookmakerSlug,
        bookmakerName: bkm.bookmakerName,
        values: [
          { label: '1', odd: Math.round(d.dnb1 * 100) / 100 },
          { label: '2', odd: Math.round(d.dnb2 * 100) / 100 },
        ],
      };
    });
  }, [event]);

  const bttsData = useMemo<DerivedMarketRow[]>(() => {
    if (!event) return [];
    return event.h2h.bookmakerOdds.map((bkm: any) => {
      const d = computeDerived(bkm, event.totals.bookmakerOdds);
      return {
        bookmakerSlug: bkm.bookmakerSlug,
        bookmakerName: bkm.bookmakerName,
        values: [
          { label: 'Sim', odd: Math.round(d.bttsYes * 100) / 100 },
          { label: 'Não', odd: Math.round(d.bttsNo * 100) / 100 },
        ],
      };
    });
  }, [event]);

  // Early return AFTER all hooks
  if (!event) return null;

  // ─── Market config ──────────────────────────────────────────────────
  const marketConfig: Record<MarketType, {
    label: string;
    icon: React.ReactNode;
    headers: string[];
    getData: () => DerivedMarketRow[];
    fairInfo?: { label: string; prob: string; fairOdd: string }[];
  }> = {
    h2h: {
      label: 'Resultado (1X2)',
      icon: <TrendingUp size={12} />,
      headers: ['1', 'X', '2'],
      getData: () => event.h2h.bookmakerOdds.map((b: any) => ({
        bookmakerSlug: b.bookmakerSlug,
        bookmakerName: b.bookmakerName,
        values: [
          { label: '1', odd: b.home },
          { label: 'X', odd: b.draw },
          { label: '2', odd: b.away },
        ],
      })),
      fairInfo: [
        { label: event.homeTeam, prob: (event.h2h.home.fairProb * 100).toFixed(1) + '%', fairOdd: event.h2h.home.fairOdds.toFixed(2) },
        { label: 'Empate', prob: (event.h2h.draw.fairProb * 100).toFixed(1) + '%', fairOdd: event.h2h.draw.fairOdds.toFixed(2) },
        { label: event.awayTeam, prob: (event.h2h.away.fairProb * 100).toFixed(1) + '%', fairOdd: event.h2h.away.fairOdds.toFixed(2) },
      ],
    },
    totals: {
      label: 'Gols (O/U ' + event.totals.line + ')',
      icon: <Goal size={12} />,
      headers: ['Over', 'Under'],
      getData: () => event.totals.bookmakerOdds.map((b: any) => ({
        bookmakerSlug: b.bookmakerSlug,
        bookmakerName: b.bookmakerName,
        values: [
          { label: 'Over', odd: b.over },
          { label: 'Under', odd: b.under },
        ],
      })),
      fairInfo: [
        { label: 'Mais de ' + event.totals.line, prob: (event.totals.over.fairProb * 100).toFixed(1) + '%', fairOdd: event.totals.over.fairOdds.toFixed(2) },
        { label: 'Menos de ' + event.totals.line, prob: (event.totals.under.fairProb * 100).toFixed(1) + '%', fairOdd: event.totals.under.fairOdds.toFixed(2) },
      ],
    },
    double_chance: {
      label: 'Dupla Chance',
      icon: <Shield size={12} />,
      headers: ['1X', '12', 'X2'],
      getData: () => doubleChandeData,
    },
    btts: {
      label: 'Ambas Marcam',
      icon: <Users size={12} />,
      headers: ['Sim', 'Não'],
      getData: () => bttsData,
    },
    draw_no_bet: {
      label: 'Draw No Bet',
      icon: <Minus size={12} />,
      headers: ['1', '2'],
      getData: () => drawNoBetData,
    },
  };

  const currentMarketConfig = marketConfig[modalMarket];
  const currentData = currentMarketConfig.getData();
  const headers = currentMarketConfig.headers;

  // Encontrar best odds por coluna
  const bestPerCol: number[] = headers.map((_, colIdx) => {
    let best = 0;
    currentData.forEach(row => {
      if (row.values[colIdx]?.odd > best) best = row.values[colIdx].odd;
    });
    return best;
  });

  // Filtrar/ordenar
  let displayRows = [...currentData].sort((a, b) => {
    const aFav = isFavorite(a.bookmakerSlug) ? 1 : 0;
    const bFav = isFavorite(b.bookmakerSlug) ? 1 : 0;
    return bFav - aFav;
  });

  if (modalFilterFavs && favoriteBookmakerSlugs.length > 0) {
    displayRows = displayRows.filter(b => isFavorite(b.bookmakerSlug));
  }

  const gridCols = `1fr ${'auto '.repeat(headers.length).trim()}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-dialog-wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-title-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-tech)', fontWeight: 700, textTransform: 'uppercase' }}>
                {event.leagueName}
              </span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)' }}>
                {formatMatchDateTime(event.commenceTime)}
              </span>
            </div>
            <h2 className="modal-title-text">{event.homeTeam} vs {event.awayTeam}</h2>
          </div>
          <button className="modal-close-icon" onClick={onClose} aria-label="Fechar">
            <X size={16} />
          </button>
        </div>

        {/* Fair Probability Panel */}
        {currentMarketConfig.fairInfo && (
          <div className="stat-panel-hud">
            <div className="stat-panel-label">
              <Activity size={13} />
              <span>Probabilidade Real (Sem Margem)</span>
            </div>
            <div className="stat-columns" style={headers.length === 2 ? { gridTemplateColumns: '1fr 1fr' } : undefined}>
              {currentMarketConfig.fairInfo.map((fi, i) => (
                <div key={i}>
                  <div className="stat-col-title">{fi.label}</div>
                  <div className="stat-col-pct">{fi.prob}</div>
                  <div className="stat-col-fair-odd">Odd Justa {fi.fairOdd}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nota para mercados derivados */}
        {(modalMarket === 'double_chance' || modalMarket === 'btts' || modalMarket === 'draw_no_bet') && (
          <div style={{
            background: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            fontSize: '0.7rem',
            color: 'var(--text-tertiary)',
            lineHeight: 1.4,
          }}>
            ⚡ Odds estimadas calculadas a partir das cotações 1X2 e Over/Under. Valores podem variar levemente em relação às oferecidas pelas casas.
          </div>
        )}

        {/* Market Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {(Object.keys(marketConfig) as MarketType[]).map(mk => {
            const cfg = marketConfig[mk];
            const isActive = modalMarket === mk;
            return (
              <button
                key={mk}
                onClick={() => setModalMarket(mk)}
                style={{
                  background: isActive ? 'var(--accent-tech)' : 'var(--bg-app)',
                  color: isActive ? '#080a0f' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '5px 10px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease',
                }}
              >
                {cfg.icon} {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Filter Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => setModalFilterFavs(false)}
              style={{
                background: !modalFilterFavs ? 'var(--accent-tech)' : 'var(--bg-app)',
                color: !modalFilterFavs ? '#080a0f' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Todas ({currentData.length})
            </button>
            <button
              onClick={() => setModalFilterFavs(true)}
              style={{
                background: modalFilterFavs ? 'var(--accent-fav)' : 'var(--bg-app)',
                color: modalFilterFavs ? '#080a0f' : 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-xs)',
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ⭐ Favoritas ({favoriteBookmakerSlugs.length})
            </button>
          </div>

          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
            {headers.join(' — ')}
          </span>
        </div>

        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          gap: '6px',
          padding: '6px 10px',
          background: 'var(--bg-app)',
          borderRadius: 'var(--radius-xs)',
          fontSize: '0.68rem',
          fontWeight: 700,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
        }}>
          <span>Operadora</span>
          {headers.map(h => (
            <span key={h} style={{ textAlign: 'center', minWidth: '48px' }}>{h}</span>
          ))}
        </div>

        {/* Table Body */}
        <div className="houses-comparison-list">
          {displayRows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
              Nenhuma casa favorita oferece cotações para este confronto.
            </div>
          ) : (
            displayRows.map(row => {
              const fav = isFavorite(row.bookmakerSlug);
              return (
                <div
                  key={row.bookmakerSlug}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: gridCols,
                    gap: '6px',
                    alignItems: 'center',
                    padding: '8px 10px',
                    background: fav ? 'var(--accent-fav-bg)' : 'transparent',
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(row.bookmakerSlug); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                      title={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Star
                        size={14}
                        fill={fav ? 'var(--accent-fav)' : 'none'}
                        color={fav ? 'var(--accent-fav)' : 'var(--text-tertiary)'}
                      />
                    </button>
                    <span style={{ fontWeight: 600, fontSize: '0.82rem', color: fav ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {row.bookmakerName}
                    </span>
                    <a
                      href={getBookmakerUrl(row.bookmakerSlug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}
                      title="Acessar site"
                    >
                      <ExternalLink size={11} />
                    </a>
                  </div>

                  {row.values.map((v, colIdx) => {
                    const isBest = v.odd === bestPerCol[colIdx] && v.odd > 0;
                    const betItemId = `${event.id}_${modalMarket}_${v.label}_${row.bookmakerSlug}`;
                    const inSlip = isItemSelected(betItemId);

                    const handleOddClick = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      if (v.odd <= 0) return;
                      
                      const betItem: BetItem = {
                        id: betItemId,
                        eventId: event.id,
                        matchTitle: `${event.homeTeam} vs ${event.awayTeam}`,
                        marketName: marketConfig[modalMarket].label,
                        selectionLabel: v.label,
                        odd: v.odd,
                        bookmakerSlug: row.bookmakerSlug,
                        bookmakerName: row.bookmakerName,
                      };
                      toggleBetItem(betItem);
                    };

                    return (
                      <span
                        key={colIdx}
                        onClick={handleOddClick}
                        title={`Clique para adicionar ao bilhete na ${row.bookmakerName}`}
                        style={{
                          textAlign: 'center',
                          minWidth: '48px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.85rem',
                          fontWeight: isBest ? 800 : 600,
                          color: inSlip ? '#080a0f' : (isBest ? 'var(--accent-best)' : 'var(--text-primary)'),
                          background: inSlip 
                            ? '#fbbf24' 
                            : (isBest ? 'var(--accent-best-bg)' : 'var(--bg-subtle)'),
                          padding: '3px 6px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          border: inSlip ? '1px solid #fbbf24' : '1px solid var(--border-subtle)',
                          transition: 'all 0.15s ease',
                          boxShadow: inSlip ? '0 0 8px rgba(251, 191, 36, 0.4)' : 'none',
                        }}
                      >
                        {v.odd > 0 ? v.odd.toFixed(2) : '-'}
                      </span>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
