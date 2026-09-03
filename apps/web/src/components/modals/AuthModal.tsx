import React, { useState } from 'react';
import { X, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, signInGuest, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !isSupabaseConfigured) {
      setMessage('Supabase não configurado no .env. Utilize o modo convidado.');
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (isRegister) {
        // 1. Cria a conta
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        // 2. Se a sessão já foi gerada diretamente (email confirmation desligado), fecha e loga
        if (data.session) {
          onClose();
          return;
        }

        // 3. Caso não tenha retornado sessão direta, faz login imediato
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInErr && signInData.session) {
          onClose();
          return;
        }

        if (signInErr) {
          if (signInErr.message.toLowerCase().includes('confirm') || signInErr.message.toLowerCase().includes('not confirmed')) {
            setMessage('Conta criada! Desative "Confirm email" no painel do Supabase (Auth > Providers > Email) para login instantâneo sem confirmação de e-mail.');
          } else {
            throw signInErr;
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onClose();
      }
    } catch (err: any) {
      if (err.message && err.message.includes('rate limit')) {
        setMessage('Limite de envio de e-mails do Supabase atingido. Desative a opção "Confirm email" em Authentication > Providers > Email no painel do Supabase para cadastrar e logar imediatamente.');
      } else {
        setMessage(err.message || 'Falha na autenticação.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title-row">
          <div>
            <h2 className="modal-title-text">
              {user ? 'Minha Conta' : (isRegister ? 'Nova Conta' : 'Acessar Conta')}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {user ? 'Sessão conectada no OddScan' : 'Sincronize preferências e histórico'}
            </p>
          </div>
          <button className="modal-close-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center', padding: '12px 0' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--accent-tech-glow)',
              border: '1px solid var(--accent-tech)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              color: 'var(--accent-tech)',
            }}>
              <UserCheck size={24} />
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{user.email}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-best)', marginTop: '2px' }}>
                Usuário Autenticado
              </div>
            </div>

            <button 
              className="btn-hollow" 
              onClick={async () => {
                await signOut();
                onClose();
              }}
              style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            >
              <LogOut size={14} />
              <span>Desconectar</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {message && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '8px 12px', borderRadius: '4px', fontSize: '0.75rem' }}>
                {message}
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', fontWeight: 600 }}>Email</label>
              <input 
                type="email" 
                className="input-futuristic"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com" 
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block', fontWeight: 600 }}>Senha</label>
              <input 
                type="password" 
                className="input-futuristic"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                required
              />
            </div>

            <button type="submit" className="btn-futuristic" disabled={loading} style={{ marginTop: '4px' }}>
              {loading ? 'Processando...' : (isRegister ? 'Criar Conta' : 'Entrar')}
            </button>

            <button 
              type="button" 
              className="btn-hollow"
              onClick={() => {
                signInGuest();
                onClose();
              }}
            >
              Entrar como Convidado Demo
            </button>

            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <button 
                type="button" 
                onClick={() => setIsRegister(!isRegister)}
                style={{ background: 'none', border: 'none', color: 'var(--accent-tech)', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                {isRegister ? 'Já tem conta? Faça login' : 'Não possui conta? Cadastre-se'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
