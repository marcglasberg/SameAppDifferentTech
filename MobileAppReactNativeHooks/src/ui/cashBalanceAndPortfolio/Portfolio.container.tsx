import React, { useContext } from 'react';
import { PortfolioView } from './Portfolio.view';
import { Portfolio } from '../../business/state/Portfolio';
import { PortfolioContext, UseSet } from '../../business/state/HooksAndContext';

export const PortfolioContainer: React.FC
  = () => {
  const { portfolio, setPortfolio } = useContext(PortfolioContext);
  return <PortfolioView {...viewModel(portfolio, setPortfolio)} />;
};

export function viewModel(
  portfolio: Portfolio,
  setPortfolio: UseSet<Portfolio>
) {
  return {
    portfolioIsEmpty: portfolio.isEmpty,
    stocks: portfolio.stocks
  };
}
