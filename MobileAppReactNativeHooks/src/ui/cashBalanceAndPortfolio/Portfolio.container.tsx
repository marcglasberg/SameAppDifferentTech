import React from 'react';
import { PortfolioView } from './Portfolio.view';
import Portfolio from '../../business/state/Portfolio';

export const PortfolioContainer: React.FC
  = () => {
  return <PortfolioView {...viewModel()} />;
};

export function viewModel() {

  const [portfolio, setPortfolio] = Portfolio.use();

  return {
    portfolioIsEmpty: portfolio.isEmpty,
    stocks: portfolio.stocks
  };
}
