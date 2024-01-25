import React, { useContext } from 'react';
import { Portfolio } from './Portfolio';
import { AvailableStocks } from './AvailableStocks';
import { Ui } from '../../ui/utils/Ui';
import { AvailableStocksContext, PortfolioContext, UiContext } from './Context';

export type UseSet<T> = ((value: T | ((prevState: T) => T)) => void);

export function usePortfolio(): {
  portfolio: Portfolio,
  setPortfolio: React.Dispatch<React.SetStateAction<Portfolio>>
} {
  return useContext(PortfolioContext);
}

export function useAvailableStocks(): {
  availableStocks: AvailableStocks,
  setAvailableStocks: React.Dispatch<React.SetStateAction<AvailableStocks>>
} {
  return useContext(AvailableStocksContext);
}

export function useUi(): {
  ui: Ui,
  setUi: React.Dispatch<React.SetStateAction<Ui>>
} {
  return useContext(UiContext);
}
