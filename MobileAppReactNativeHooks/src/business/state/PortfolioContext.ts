import React, { createContext, useContext } from 'react';
import { Portfolio } from './Portfolio';
import AvailableStocks from './AvailableStocks';
import { Ui } from '../../ui/utils/Ui';

export type Set<T> = React.Dispatch<React.SetStateAction<T>>;

export const PortfolioContext = createContext<{
  portfolio: Portfolio;
  setPortfolio: Set<Portfolio>
}>({
  portfolio: new Portfolio(), setPortfolio: () => {
  }
});

export function usePortfolio(): [Portfolio, React.Dispatch<React.SetStateAction<Portfolio>>] {
  const { portfolio, setPortfolio } = useContext(PortfolioContext);
  return [portfolio, setPortfolio];
}

export const AvailableStocksContext = createContext<{
  availableStocks: AvailableStocks;
  setAvailableStocks: React.Dispatch<React.SetStateAction<AvailableStocks>>
}>({
  availableStocks: new AvailableStocks([]), setAvailableStocks: () => {
  }
});

export function useAvailableStocks(): [AvailableStocks, React.Dispatch<React.SetStateAction<AvailableStocks>>] {
  const { availableStocks, setAvailableStocks } = useContext(AvailableStocksContext);
  return [availableStocks, setAvailableStocks];
}

export const UiContext = createContext<{
  ui: Ui;
  setUi: React.Dispatch<React.SetStateAction<Ui>>
}>({
  ui: new Ui(), setUi: () => {
  }
});

export function useUi(): [Ui, React.Dispatch<React.SetStateAction<Ui>>] {
  const { ui, setUi } = useContext(UiContext);
  return [ui, setUi];
}
