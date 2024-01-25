import React, { createContext } from 'react';
import { Portfolio } from './Portfolio';
import { AvailableStocks } from './AvailableStocks';
import { Ui } from '../../ui/utils/Ui';
import { UseSet } from './Hooks';

export const PortfolioContext = createContext<{
  portfolio: Portfolio;
  setPortfolio: UseSet<Portfolio>
}>({
  portfolio: new Portfolio(), setPortfolio: () => {
  }
});

export const AvailableStocksContext = createContext<{
  availableStocks: AvailableStocks;
  setAvailableStocks: React.Dispatch<React.SetStateAction<AvailableStocks>>
}>({
  availableStocks: new AvailableStocks([]), setAvailableStocks: () => {
  }
});

export const UiContext = createContext<{
  ui: Ui;
  setUi: React.Dispatch<React.SetStateAction<Ui>>
}>({
  ui: new Ui(), setUi: () => {
  }
});
