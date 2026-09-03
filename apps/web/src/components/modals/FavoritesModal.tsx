import React from 'react';
import { X, Star, Check, Wifi, Clock } from 'lucide-react';
import { initialBookmakersList } from '../../lib/mockData';
import { useFavorites } from '../../contexts/FavoritesContext';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Casas com cobertura ativa no OddScan
const LIVE_FEED_SLUGS = ['betano', 'bet365', 'superbet', 'pinnacle', 'betfair', 'betway', 'onexbet', 'williamhill'];

export const FavoritesModal: React.FC<FavoritesModalProps> = ({ isOpen, onClose }) => {
  const { favoriteBookmakerSlugs, toggleFavorite } = useFavorites();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title-row">
          <div>
            <h2 className="modal-title-text">Casas Favoritas</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Selecione as casas que você tem conta para calcular as melhores odds entre elas
            </p>
          </div>
          <button className="modal-close-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '60vh', overflowY: 'auto' }}>
          {initialBookmakersList.map((bkm) => {
            const isFav = favoriteBookmakerSlugs.includes(bkm.slug);
            const hasLiveFeed = LIVE_FEED_SLUGS.includes(bkm.slug);

            return (
              <div 
                key={bkm.slug}
                onClick={() => toggleFavorite(bkm.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: isFav ? 'var(--accent-fav-bg)' : 'var(--bg-app)',
                  border: isFav ? '1px solid var(--accent-fav)' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Star 
                    size={16} 
                    fill={isFav ? 'var(--accent-fav)' : 'none'} 
                    color={isFav ? 'var(--accent-fav)' : 'var(--text-tertiary)'} 
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                        {bkm.name}
                      </span>
                      {hasLiveFeed ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', background: 'var(--accent-best-bg)', color: 'var(--accent-best)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          <Wifi size={10} /> Feed Ativo
                        </span>
                      ) : (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.65rem', background: 'var(--border-subtle)', color: 'var(--text-secondary)', padding: '1px 6px', borderRadius: '4px', fontWeight: 500 }}>
                          <Clock size={10} /> Em breve
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.68rem', color: bkm.is_licensed_brazil ? 'var(--accent-best)' : 'var(--text-tertiary)', marginTop: '2px' }}>
                      {bkm.is_licensed_brazil ? 'Licenciada SPA/MF' : 'Operadora Internacional'}
                    </div>
                  </div>
                </div>

                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: isFav ? 'none' : '1px solid var(--border-subtle)',
                    background: isFav ? 'var(--accent-fav)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isFav && <Check size={13} color="#080a0f" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
