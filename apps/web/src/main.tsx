import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BetSlipProvider } from './contexts/BetSlipContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <BetSlipProvider>
            <App />
          </BetSlipProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
