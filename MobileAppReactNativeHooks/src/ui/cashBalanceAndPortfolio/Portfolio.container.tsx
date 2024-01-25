import React from 'react';
import { PortfolioView } from './Portfolio.view';
import { Portfolio } from '../../business/state/Portfolio';
import { usePortfolio } from '../../business/state/Hooks';

export const PortfolioContainer: React.FC
  = () => {
  const { portfolio } = usePortfolio();
  return <PortfolioView {...viewModel(portfolio)} />;
};

export function viewModel(portfolio: Portfolio) {
  return {
    portfolioIsEmpty: portfolio.isEmpty,
    stocks: portfolio.stocks
  };
}
