import React from 'react';
import { Star, User as UserIcon, Sun, Moon, SlidersHorizontal, Ticket } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useBetSlip } from '../../contexts/BetSlipContext';

interface HeaderProps {
  onOpenFavorites: () => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFavorites, onOpenAuth }) => {
  const { user } = useAuth();
  const { favoriteBookmakerSlugs, onlyFavorites, toggleOnlyFavorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();

  const handleToggleFavoritesFilter = () => {
    // Se o usuário ainda não tiver nenhuma favorita, abre o modal para ele escolher
    if (favoriteBookmakerSlugs.length === 0) {
      onOpenFavorites();
      return;
    }
    toggleOnlyFavorites();
  };

  const { items: betSlipItems, setIsOpen: setBetSlipOpen, activeBookmakerName } = useBetSlip();

  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-icon-logo">
          <img src="/logo.png" alt="OddScan Logo" className="brand-logo-img" />
        </div>
        <div className="brand-title-group">
          <div className="brand-name">
            <span>OddScan</span>
            <span className="brand-version">PRO</span>
          </div>
        </div>
      </div>

      <div className="header-controls">
        {/* Toggle de Modo Claro / Escuro */}
        <button 
          className="tool-btn theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
          aria-label="Alternar Tema"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Botão da Caderneta de Apostas */}
        {betSlipItems.length > 0 && (
          <button
            className="tool-btn active"
            onClick={() => setBetSlipOpen(true)}
            title={`Abrir Caderneta de Apostas (${activeBookmakerName})`}
            style={{ borderColor: 'var(--accent-tech)', background: 'var(--bg-subtle)' }}
          >
            <Ticket size={14} color="var(--accent-tech)" />
            <span>Caderneta ({betSlipItems.length})</span>
          </button>
        )}

        {/* Flag: Apenas Odds de Casas Favoritas */}
        <button 
          className={`tool-btn ${onlyFavorites ? 'active' : ''}`}
          onClick={handleToggleFavoritesFilter}
          title={
            favoriteBookmakerSlugs.length === 0 
              ? 'Nenhuma favorita selecionada. Clique para escolher.' 
              : (onlyFavorites ? 'Mostrando apenas odds de casas favoritas (Clique para ver todas)' : 'Filtrar apenas odds de casas favoritas')
          }
          style={onlyFavorites ? { borderColor: 'var(--accent-fav)', background: 'var(--accent-fav-bg)', color: 'var(--accent-fav)' } : {}}
        >
          <Star size={14} fill={onlyFavorites ? 'currentColor' : 'none'} />
          <span style={{ display: 'inline' }}>
            {onlyFavorites ? 'Apenas Favoritas' : 'Favoritas'}
          </span>
        </button>

        {/* Botão para gerenciar a lista de casas favoritas */}
        <button
          className="tool-btn"
          onClick={onOpenFavorites}
          title="Gerenciar lista de casas favoritas"
          style={{ padding: '0 8px' }}
        >
          <SlidersHorizontal size={14} />
        </button>

        {/* Minha Conta / Login */}
        <button 
          className="tool-btn"
          onClick={onOpenAuth}
          title={user ? 'Minha Conta' : 'Acessar Conta'}
        >
          <UserIcon size={14} />
          <span>{user ? 'Conta' : 'Entrar'}</span>
        </button>
      </div>
    </header>
  );
};
