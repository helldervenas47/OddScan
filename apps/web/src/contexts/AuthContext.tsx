import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInGuest: () => void;
  signOut: () => Promise<void>;
  isDemoUser: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInGuest: () => {},
  signOut: async () => {},
  isDemoUser: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    // Verifica se há usuário demo salvo
    const savedDemo = localStorage.getItem('oddscan_demo_user');
    if (savedDemo) {
      setUser(JSON.parse(savedDemo));
      setIsDemoUser(true);
      setLoading(false);
      return;
    }

    if (!supabase || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Pega a sessão ativa do Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsDemoUser(false);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInGuest = () => {
    const demoUser = {
      id: 'demo-user-brazil-001',
      email: 'apostador@oddscan.app',
      user_metadata: { name: 'Apostador Pro Brasil' },
    } as unknown as User;

    localStorage.setItem('oddscan_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    setIsDemoUser(true);
  };

  const signOut = async () => {
    localStorage.removeItem('oddscan_demo_user');
    setIsDemoUser(false);
    if (supabase && isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInGuest, signOut, isDemoUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
