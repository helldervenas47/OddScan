import React, { useState } from 'react';
import { Ticket, X, Trash2, ArrowUpRight, Lock, AlertTriangle, ChevronUp, ChevronDown, CheckCircle, Copy } from 'lucide-react';
import { useBetSlip } from '../../contexts/BetSlipContext';
import { buildBookmakerDeepLinkUrl, generateBetCouponSummary } from '../../lib/bookmakerUrls';

export const BetSlip: React.FC = () => {
  const {
    items,
    activeBookmakerName,
    stake,
    setStake,
    removeBetItem,
    clearBetSlip,
    conflictInfo,
    resolveConflictSwitch,
    resolveConflictKeep,
    totalOdd,
    potentialReturn,
    potentialProfit,
    isOpen,
    setIsOpen,
  } = useBetSlip();

  const [showTransferNotice, setShowTransferNotice] = useState<boolean>(false);
  const [copiedCouponText, setCopiedCouponText] = useState<string>('');

  if (items.length === 0 && !conflictInfo && !showTransferNotice) {
    return null;
  }

  const handleQuickAddStake = (amount: number) => {
    setStake(stake + amount);
  };

  return (
    <>
      {/* Modal de Conflito de Casa de Aposta */}
      {conflictInfo && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24' }}>
                <AlertTriangle size={20} />
                <h3 className="modal-title" style={{ fontSize: '1rem' }}>Conflito de Casa de Aposta</h3>
              </div>
              <button className="modal-close-btn" onClick={resolveConflictKeep}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>
                Sua caderneta já possui palpites vinculados à <strong>{conflictInfo.currentBookmaker}</strong>.
              </p>
              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-xs)', borderLeft: '3px solid var(--accent-tech)' }}>
                Ao selecionar uma odd da <strong>{conflictInfo.newBookmaker}</strong>, você precisa reiniciar a caderneta para esta nova casa.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <button
                  className="btn-futuristic"
                  onClick={resolveConflictSwitch}
                  style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
                >
                  Trocar para {conflictInfo.newBookmaker} & Reiniciar
                </button>
                <button
                  onClick={resolveConflictKeep}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '8px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Manter {conflictInfo.currentBookmaker}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Widget Flutuante da Caderneta (Barra Minimizada) */}
      {!isOpen && items.length > 0 && (
        <div 
          className="betslip-float-bar"
          onClick={() => setIsOpen(true)}
        >
          <div className="betslip-float-left">
            <Ticket size={18} color="var(--accent-tech)" />
            <span className="betslip-badge">{items.length}</span>
            <span className="betslip-float-title">Caderneta ({activeBookmakerName})</span>
          </div>

          <div className="betslip-float-right">
            <div className="betslip-float-stat">
              <span className="label">Odd Total:</span>
              <span className="val">{totalOdd.toFixed(2)}</span>
            </div>
            <div className="betslip-float-stat">
              <span className="label">Retorno:</span>
              <span className="val highlight">R$ {potentialReturn.toFixed(2)}</span>
            </div>
            <ChevronUp size={18} />
          </div>
        </div>
      )}

      {/* Painel / Drawer Expandido da Caderneta */}
      {isOpen && items.length > 0 && (
        <div className="betslip-panel">
          {/* Header do Panel */}
          <div className="betslip-header">
            <div className="betslip-header-title">
              <Ticket size={18} color="var(--accent-tech)" />
              <span>Caderneta de Apostas</span>
              <span className="betslip-bkm-pill">
                <Lock size={10} /> {activeBookmakerName}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button 
                className="betslip-icon-btn" 
                onClick={clearBetSlip} 
                title="Limpar Caderneta"
              >
                <Trash2 size={15} />
              </button>
              <button 
                className="betslip-icon-btn" 
                onClick={() => setIsOpen(false)}
                title="Minimizar"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Aviso de Trava de Casa */}
          <div className="betslip-lock-notice">
            <Lock size={12} />
            <span>Odds combinadas exclusivamente para <strong>{activeBookmakerName}</strong></span>
          </div>

          {/* Lista de Seleções */}
          <div className="betslip-items-list">
            {items.map((item) => (
              <div key={item.id} className="betslip-item">
                <div className="betslip-item-main">
                  <div className="betslip-item-match">{item.matchTitle}</div>
                  <div className="betslip-item-selection">
                    <span className="market-tag">{item.marketName}</span>
                    <span className="selection-label">{item.selectionLabel}</span>
                  </div>
                </div>

                <div className="betslip-item-right">
                  <span className="betslip-odd-badge">{item.odd.toFixed(2)}</span>
                  <button 
                    className="betslip-item-remove"
                    onClick={() => removeBetItem(item.id)}
                    title="Remover palpite"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Seção de Cálculo e Valor da Aposta (Stake) */}
          <div className="betslip-footer">
            <div className="betslip-stake-section">
              <div className="betslip-stake-header">
                <span>Valor da Aposta (R$)</span>
                <div className="quick-stakes">
                  {[10, 50, 100, 200].map(amt => (
                    <button 
                      key={amt} 
                      onClick={() => handleQuickAddStake(amt)}
                      className="quick-stake-btn"
                    >
                      +{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="betslip-stake-input-wrapper">
                <span className="currency-prefix">R$</span>
                <input
                  type="number"
                  min="1"
                  step="5"
                  value={stake || ''}
                  onChange={(e) => setStake(Number(e.target.value))}
                  className="betslip-stake-input"
                  placeholder="0,00"
                />
              </div>
            </div>

            {/* Resumo dos Retornos */}
            <div className="betslip-summary-box">
              <div className="summary-row">
                <span>Multiplicador (Odd Total):</span>
                <strong className="odd-highlight">{totalOdd.toFixed(2)}</strong>
              </div>
              <div className="summary-row">
                <span>Lucro Estimado:</span>
                <span>R$ {potentialProfit.toFixed(2)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Retorno Potencial:</span>
                <strong className="return-highlight">R$ {potentialReturn.toFixed(2)}</strong>
              </div>
            </div>

            {/* Botão de Ação Direta para a Casa (Link nativo <a> com target="_blank") */}
            <a 
              href={buildBookmakerDeepLinkUrl(items[0]?.bookmakerSlug || '', items)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-futuristic betslip-submit-btn"
              onClick={() => {
                const couponText = generateBetCouponSummary(items, stake, totalOdd, potentialReturn);
                setCopiedCouponText(couponText);
                try {
                  if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(couponText).catch(() => {});
                  }
                } catch (e) {
                  console.error(e);
                }
                setShowTransferNotice(true);
              }}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Apostar na {activeBookmakerName} <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      )}

      {/* Modal de Sucesso / Transferência do Bilhete para a Casa */}
      {showTransferNotice && (
        <div className="modal-backdrop">
          <div className="modal-dialog" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80' }}>
                <CheckCircle size={22} />
                <h3 className="modal-title" style={{ fontSize: '1.05rem' }}>Bilhete Transferido com Sucesso!</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowTransferNotice(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: 'var(--radius-xs)', padding: '12px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                🚀 <strong>Redirecionamos você para a {activeBookmakerName}!</strong>
                <br />
                O seu bilhete com <strong>{items.length} aposta(s)</strong> e <strong>Odd Total {totalOdd.toFixed(2)}</strong> foi copiado para a sua área de transferência.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  📋 Conteúdo do Bilhete (Copiado automaticamente):
                </span>
                <textarea
                  readOnly
                  rows={6}
                  value={copiedCouponText}
                  style={{
                    width: '100%',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '8px 10px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    resize: 'none',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                <a
                  href={buildBookmakerDeepLinkUrl(items[0]?.bookmakerSlug || '', items)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-futuristic"
                  style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', fontSize: '0.82rem' }}
                >
                  Ir para {activeBookmakerName} <ArrowUpRight size={14} />
                </a>
                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(copiedCouponText);
                    }
                  }}
                  style={{
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Copy size={14} /> Copiar Bilhete
                </button>
                <button
                  onClick={() => setShowTransferNotice(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '10px 14px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
