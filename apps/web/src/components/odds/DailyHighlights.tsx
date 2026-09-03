import React from 'react';
import { Trophy, Zap, Star, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { ClientEventComparison } from '../../lib/mockData';
import { formatMatchDateTime } from '../../lib/dateUtils';

interface DailyHighlightsProps {
  events: ClientEventComparison[];
  onSelectEvent: (event: ClientEventComparison) => void;
}

interface RankedPick {
  event: ClientEventComparison;
  outcomeName: string;
  outcomeLabel: string;
  bestOdd: number;
  fairProb: number;
  valueScore: number;
  evPct: number;
  bookmakerName: string;
}

export const DailyHighlights: React.FC<DailyHighlightsProps> = ({ events, onSelectEvent }) => {
  if (events.length === 0) return null;

  const candidatePicks: RankedPick[] = [];

  events.forEach(evt => {
    // H2H outcomes
    const h2hOutcomes = [
      {
        outcomeName: evt.homeTeam,
        outcomeLabel: 'Vitória ' + evt.homeTeam,
        bestOdd: evt.h2h.home.bestOdd,
        fairProb: evt.h2h.home.fairProb,
        evPct: evt.h2h.home.evPct,
        bookmakerName: evt.h2h.home.bookmakerName,
      },
      {
        outcomeName: 'Empate',
        outcomeLabel: 'Empate',
        bestOdd: evt.h2h.draw.bestOdd,
        fairProb: evt.h2h.draw.fairProb,
        evPct: evt.h2h.draw.evPct,
        bookmakerName: evt.h2h.draw.bookmakerName,
      },
      {
        outcomeName: evt.awayTeam,
        outcomeLabel: 'Vitória ' + evt.awayTeam,
        bestOdd: evt.h2h.away.bestOdd,
        fairProb: evt.h2h.away.fairProb,
        evPct: evt.h2h.away.evPct,
        bookmakerName: evt.h2h.away.bookmakerName,
      },
    ];

    // Totals outcomes
    const totalsOutcomes = [
      {
        outcomeName: 'Over ' + evt.totals.line,
        outcomeLabel: 'Mais de ' + evt.totals.line + ' gols',
        bestOdd: evt.totals.over.bestOdd,
        fairProb: evt.totals.over.fairProb,
        evPct: evt.totals.over.evPct,
        bookmakerName: evt.totals.over.bookmakerName,
      },
      {
        outcomeName: 'Under ' + evt.totals.line,
        outcomeLabel: 'Menos de ' + evt.totals.line + ' gols',
        bestOdd: evt.totals.under.bestOdd,
        fairProb: evt.totals.under.fairProb,
        evPct: evt.totals.under.evPct,
        bookmakerName: evt.totals.under.bookmakerName,
      },
    ];

    const allOutcomes = [...h2hOutcomes, ...totalsOutcomes];

    allOutcomes.forEach(o => {
      // Exige uma chance mínima segura de acerto (>= 45%) para evitar cebras de baixíssima probabilidade
      // Dá peso principal à probabilidade de acerto e valor relativo à odd
      if (o.fairProb >= 0.42) {
        // Fórmula de pontuação: 70% peso na probabilidade de acerto + 30% peso no EV%/Odd
        const valueScore = (o.fairProb * 100 * 0.75) + (o.evPct * 1.5) + (o.bestOdd * 2);
        candidatePicks.push({
          event: evt,
          outcomeName: o.outcomeName,
          outcomeLabel: o.outcomeLabel,
          bestOdd: o.bestOdd,
          fairProb: o.fairProb,
          valueScore,
          evPct: o.evPct,
          bookmakerName: o.bookmakerName,
        });
      }
    });
  });

  // Se por algum filtro extremo não houver candidatos com 42%+, tenta com 35%+
  if (candidatePicks.length < 3) {
    events.forEach(evt => {
      const allOutcomes = [
        { outcomeName: evt.homeTeam, outcomeLabel: 'Vitória ' + evt.homeTeam, ...evt.h2h.home },
        { outcomeName: 'Empate', outcomeLabel: 'Empate', ...evt.h2h.draw },
        { outcomeName: evt.awayTeam, outcomeLabel: 'Vitória ' + evt.awayTeam, ...evt.h2h.away },
        { outcomeName: 'Over ' + evt.totals.line, outcomeLabel: 'Mais de ' + evt.totals.line + ' gols', ...evt.totals.over },
        { outcomeName: 'Under ' + evt.totals.line, outcomeLabel: 'Menos de ' + evt.totals.line + ' gols', ...evt.totals.under },
      ];

      allOutcomes.forEach(o => {
        if (o.fairProb >= 0.35 && !candidatePicks.some(p => p.event.id === evt.id && p.outcomeName === o.outcomeName)) {
          const valueScore = (o.fairProb * 100 * 0.75) + (o.evPct * 1.5) + (o.bestOdd * 2);
          candidatePicks.push({
            event: evt,
            outcomeName: o.outcomeName,
            outcomeLabel: o.outcomeLabel,
            bestOdd: o.bestOdd,
            fairProb: o.fairProb,
            valueScore,
            evPct: o.evPct,
            bookmakerName: o.bookmakerName,
          });
        }
      });
    });
  }

  // Deduplica por evento para não repeti-lo 2x nos destaques
  const uniqueEventPicks: RankedPick[] = [];
  const usedEventIds = new Set<string>();

  // Ordena candidatas pelo valueScore (maior probabilidade + bom valor)
  candidatePicks.sort((a, b) => b.valueScore - a.valueScore);

  for (const pick of candidatePicks) {
    if (!usedEventIds.has(pick.event.id)) {
      usedEventIds.add(pick.event.id);
      uniqueEventPicks.push(pick);
    }
    if (uniqueEventPicks.length === 3) break;
  }

  const top3 = uniqueEventPicks;

  if (top3.length === 0) return null;

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <section className="daily-highlights">
      <div className="daily-highlights-header">
        <div className="daily-highlights-title">
          <Trophy size={18} />
          <span>Destaques de Alta Confiança</span>
        </div>
        <div className="daily-highlights-subtitle">
          Top 3 palpites de alta probabilidade de acerto (45%+) com as melhores odds do mercado
        </div>
      </div>

      <div className="daily-highlights-grid">
        {top3.map((pick, idx) => (
          <div
            key={pick.event.id + pick.outcomeName}
            className={`highlight-card highlight-rank-${idx + 1}`}
            onClick={() => onSelectEvent(pick.event)}
          >
            {/* Medal + Rank */}
            <div className="highlight-card-top">
              <span className="highlight-medal">{medals[idx]}</span>
              <span className="highlight-league">{pick.event.leagueName}</span>
              <span className="highlight-time">{formatMatchDateTime(pick.event.commenceTime)}</span>
            </div>

            {/* Match */}
            <div className="highlight-match">
              <span className="highlight-teams">{pick.event.homeTeam} vs {pick.event.awayTeam}</span>
            </div>

            {/* Pick Info */}
            <div className="highlight-pick-info">
              <div className="highlight-outcome">
                <Star size={12} fill="var(--accent-fav)" color="var(--accent-fav)" />
                <span>{pick.outcomeLabel}</span>
              </div>
              <div className="highlight-stats">
                <div className="highlight-stat-item">
                  <span className="highlight-stat-label">Odd Máxima</span>
                  <span className="highlight-stat-value">{pick.bestOdd.toFixed(2)}</span>
                </div>
                <div className="highlight-stat-item">
                  <span className="highlight-stat-label">Probabilidade</span>
                  <span className="highlight-stat-value" style={{ color: '#4ade80' }}>
                    {(pick.fairProb * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="highlight-stat-item">
                  <span className="highlight-stat-label">Confiança</span>
                  <span className="highlight-stat-value highlight-score">
                    <ShieldCheck size={12} style={{ display: 'inline', marginRight: 2 }} />
                    Alta
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="highlight-card-footer">
              <span className="highlight-bkm">
                <Zap size={10} /> {pick.bookmakerName}
              </span>
              {pick.evPct > 0 && (
                <span className="ev-pill">+{pick.evPct}% EV</span>
              )}
              <span className="highlight-cta">
                Ver Odds <ArrowUpRight size={11} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
