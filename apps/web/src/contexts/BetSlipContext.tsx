import React, { createContext, useContext, useState, useEffect } from 'react';
import { normalizeBookmakerSlug } from '../lib/normalize';

export interface BetItem {
  id: string;
  eventId: string;
  matchTitle: string;
  marketName: string;
  selectionLabel: string;
  odd: number;
  bookmakerSlug: string;
  bookmakerName: string;
}

export interface BookmakerConflictInfo {
  newItem: BetItem;
  currentBookmaker: string;
  newBookmaker: string;
}

interface BetSlipContextType {
  items: BetItem[];
  activeBookmakerSlug: string | null;
  activeBookmakerName: string | null;
  stake: number;
  setStake: (val: number) => void;
  addBetItem: (item: BetItem) => void;
  removeBetItem: (id: string) => void;
  clearBetSlip: () => void;
  isItemSelected: (id: string) => boolean;
  toggleBetItem: (item: BetItem) => void;
  conflictInfo: BookmakerConflictInfo | null;
  resolveConflictSwitch: () => void;
  resolveConflictKeep: () => void;
  totalOdd: number;
  potentialReturn: number;
  potentialProfit: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const BetSlipContext = createContext<BetSlipContextType>({
  items: [],
  activeBookmakerSlug: null,
  activeBookmakerName: null,
  stake: 50,
  setStake: () => {},
  addBetItem: () => {},
  removeBetItem: () => {},
  clearBetSlip: () => {},
  isItemSelected: () => false,
  toggleBetItem: () => {},
  conflictInfo: null,
  resolveConflictSwitch: () => {},
  resolveConflictKeep: () => {},
  totalOdd: 1,
  potentialReturn: 0,
  potentialProfit: 0,
  isOpen: false,
  setIsOpen: () => {},
});

export const BetSlipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<BetItem[]>(() => {
    const saved = localStorage.getItem('oddscan_betslip');
    return saved ? JSON.parse(saved) : [];
  });

  const [stake, setStakeState] = useState<number>(() => {
    const saved = localStorage.getItem('oddscan_betslip_stake');
    return saved ? Number(saved) : 50;
  });

  const [conflictInfo, setConflictInfo] = useState<BookmakerConflictInfo | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Deriva o slug e nome da casa ativa com base nos itens na caderneta
  const activeBookmakerSlug = items.length > 0 
    ? normalizeBookmakerSlug(items[0].bookmakerSlug) 
    : null;
    
  const activeBookmakerName = items.length > 0 
    ? items[0].bookmakerName 
    : null;

  useEffect(() => {
    localStorage.setItem('oddscan_betslip', JSON.stringify(items));
  }, [items]);

  const setStake = (val: number) => {
    const valid = Math.max(0, val);
    setStakeState(valid);
    localStorage.setItem('oddscan_betslip_stake', String(valid));
  };

  const isItemSelected = (id: string) => {
    return items.some(i => i.id === id);
  };

  const addBetItem = (newItem: BetItem) => {
    const newNormSlug = normalizeBookmakerSlug(newItem.bookmakerSlug);

    // Se já existem itens na caderneta e a casa é diferente
    if (items.length > 0 && activeBookmakerSlug && newNormSlug !== activeBookmakerSlug) {
      setConflictInfo({
        newItem,
        currentBookmaker: activeBookmakerName || 'Outra Casa',
        newBookmaker: newItem.bookmakerName,
      });
      return;
    }

    // Se é a mesma casa (ou a caderneta estava vazia):
    // Permite adicionar múltiplas odds do mesmo jogo desde que de mercados diferentes
    // Se for o mesmo mercado do mesmo jogo, substitui a opção anterior
    setItems(prev => {
      const filtered = prev.filter(
        i => !(i.eventId === newItem.eventId && i.marketName === newItem.marketName)
      );
      return [...filtered, newItem];
    });

    setIsOpen(true);
  };

  const removeBetItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearBetSlip = () => {
    setItems([]);
  };

  const toggleBetItem = (item: BetItem) => {
    if (isItemSelected(item.id)) {
      removeBetItem(item.id);
    } else {
      addBetItem(item);
    }
  };

  const resolveConflictSwitch = () => {
    if (conflictInfo) {
      // Limpa caderneta anterior e adiciona o novo item da nova casa
      setItems([conflictInfo.newItem]);
      setConflictInfo(null);
      setIsOpen(true);
    }
  };

  const resolveConflictKeep = () => {
    setConflictInfo(null);
  };

  // Cálculo da Odd Total (Multiplicador de Múltipla)
  const totalOdd = items.length > 0
    ? items.reduce((acc, item) => acc * item.odd, 1)
    : 1;

  const potentialReturn = stake * totalOdd;
  const potentialProfit = Math.max(0, potentialReturn - stake);

  return (
    <BetSlipContext.Provider value={{
      items,
      activeBookmakerSlug,
      activeBookmakerName,
      stake,
      setStake,
      addBetItem,
      removeBetItem,
      clearBetSlip,
      isItemSelected,
      toggleBetItem,
      conflictInfo,
      resolveConflictSwitch,
      resolveConflictKeep,
      totalOdd,
      potentialReturn,
      potentialProfit,
      isOpen,
      setIsOpen,
    }}>
      {children}
    </BetSlipContext.Provider>
  );
};

export const useBetSlip = () => useContext(BetSlipContext);
