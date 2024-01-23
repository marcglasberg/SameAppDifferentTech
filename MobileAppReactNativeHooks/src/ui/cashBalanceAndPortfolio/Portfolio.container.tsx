import React, { useContext } from 'react';
import { PortfolioView } from './Portfolio.view';
import { Portfolio } from '../../business/state/Portfolio';
import { PortfolioContext, Set } from '../../business/state/PortfolioContext';

export const PortfolioContainer: React.FC
  = () => {
  const { portfolio, setPortfolio } = useContext(PortfolioContext);
  return <PortfolioView {...viewModel(portfolio, setPortfolio)} />;
};

export function viewModel(
  portfolio: Portfolio,
  setPortfolio: Set<Portfolio>
) {
  return {
    portfolioIsEmpty: portfolio.isEmpty,
    stocks: portfolio.stocks
  };
}
