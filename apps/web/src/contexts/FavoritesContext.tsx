import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { useAuth } from './AuthContext';
import { normalizeBookmakerSlug } from '../lib/normalize';

interface FavoritesContextType {
  favoriteBookmakerSlugs: string[];
  toggleFavorite: (slug: string) => Promise<void>;
  isFavorite: (slug: string) => boolean;
  onlyFavorites: boolean;
  toggleOnlyFavorites: () => void;
  setOnlyFavorites: (val: boolean) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteBookmakerSlugs: [],
  toggleFavorite: async () => {},
  isFavorite: () => false,
  onlyFavorites: false,
  toggleOnlyFavorites: () => {},
  setOnlyFavorites: () => {},
});

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Por padrão, inicia SEM nenhuma casa favorita
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>(() => {
    const saved = localStorage.getItem('oddscan_fav_bookmakers');
    return saved ? JSON.parse(saved) : [];
  });

  // Flag para exibir apenas odds de casas favoritas
  const [onlyFavorites, setOnlyFavoritesState] = useState<boolean>(() => {
    return localStorage.getItem('oddscan_only_favorites') === 'true';
  });

  const setOnlyFavorites = (val: boolean) => {
    setOnlyFavoritesState(val);
    localStorage.setItem('oddscan_only_favorites', String(val));
  };

  const toggleOnlyFavorites = () => {
    setOnlyFavoritesState(prev => {
      const next = !prev;
      localStorage.setItem('oddscan_only_favorites', String(next));
      return next;
    });
  };

  // Sincroniza com Supabase se o usuário estiver autenticado
  useEffect(() => {
    if (!user || !supabase || !isSupabaseConfigured) {
      if (!user) {
        // Se deslogou ou não tem usuário, mantém o que estiver local ou vazio
        const saved = localStorage.getItem('oddscan_fav_bookmakers');
        setFavoriteSlugs(saved ? JSON.parse(saved) : []);
      }
      return;
    }
    const client = supabase;

    const fetchFavorites = async () => {
      const { data, error } = await client
        .from('user_favorite_bookmakers')
        .select('bookmakers(slug)')
        .eq('user_id', user.id);

      if (!error && data) {
        const slugs = data
          .map((item: any) => item.bookmakers?.slug)
          .filter(Boolean);
        setFavoriteSlugs(slugs); // Atualiza com o que o usuário realmente salvou (pode ser vazio [])
        localStorage.setItem('oddscan_fav_bookmakers', JSON.stringify(slugs));
      }
    };

    fetchFavorites();
  }, [user]);

  const toggleFavorite = async (slug: string) => {
    const norm = normalizeBookmakerSlug(slug);
    const isCurrentlyFav = favoriteSlugs.some(s => normalizeBookmakerSlug(s) === norm);
    const updated = isCurrentlyFav
      ? favoriteSlugs.filter(s => normalizeBookmakerSlug(s) !== norm)
      : [...favoriteSlugs, norm];

    setFavoriteSlugs(updated);
    localStorage.setItem('oddscan_fav_bookmakers', JSON.stringify(updated));

    // Sincroniza com Supabase se conectado
    if (user && supabase && isSupabaseConfigured) {
      const client = supabase;
      try {
        const { data: bkm } = await client
          .from('bookmakers')
          .select('id')
          .eq('slug', norm)
          .single();

        if (bkm) {
          if (isCurrentlyFav) {
            await client
              .from('user_favorite_bookmakers')
              .delete()
              .eq('user_id', user.id)
              .eq('bookmaker_id', bkm.id);
          } else {
            await client
              .from('user_favorite_bookmakers')
              .insert({
                user_id: user.id,
                bookmaker_id: bkm.id,
              });
          }
        }
      } catch (err) {
        console.error('[Favorites] Erro ao sincronizar com Supabase:', err);
      }
    }
  };

  const isFavorite = (slug: string) => {
    const norm = normalizeBookmakerSlug(slug);
    return favoriteSlugs.some(s => normalizeBookmakerSlug(s) === norm);
  };

  return (
    <FavoritesContext.Provider value={{
      favoriteBookmakerSlugs: favoriteSlugs,
      toggleFavorite,
      isFavorite,
      onlyFavorites,
      toggleOnlyFavorites,
      setOnlyFavorites,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
