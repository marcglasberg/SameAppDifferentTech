import React from 'react';
import { store } from '../../inject';
import { observer } from 'mobx-react-lite';
import { PortfolioView } from './Portfolio.view';

export const PortfolioContainer: React.FC
  = observer(() => {
  return <PortfolioView {...viewModel()} />;
});

export function viewModel() {
  return {
    portfolioIsEmpty: store.portfolio.isEmpty,
    stocks: store.portfolio.stocks,
  };
}
