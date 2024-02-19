import React from 'react';
import { PortfolioView } from './Portfolio.view';
import { Portfolio } from '../../business/state/Portfolio';
import { useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';

export const PortfolioContainer: React.FC
  = () => {
  const portfolio = useSelector((state: RootState) => state.portfolio);
  return <PortfolioView {...viewModel(portfolio)} />;
};

export function viewModel(portfolio: Portfolio) {
  return {
    portfolioIsEmpty: portfolio.isEmpty,
    stocks: portfolio.stocks
  };
}
