import React from 'react';

export const ResponsibleGamingBanner: React.FC = () => {
  return (
    <div className="responsible-banner">
      <div>
        <span className="responsible-banner-badge">18+</span>
        <span>Apostas esportivas envolvem risco financeiro. Jogue com moderação.</span>
      </div>
      <div style={{ color: 'var(--text-tertiary)' }}>
        Probabilidades estatísticas sem garantia de ganho
      </div>
    </div>
  );
};
