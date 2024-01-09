import React from 'react';
import { CashBalanceView } from './CashBalance.view';
import Portfolio from '../../business/state/Portfolio';

export const CashBalanceContainer
  = () => {
  return <CashBalanceView {...viewModel()} />;
};

export function viewModel() {

  const [portfolio, setPortfolio] = Portfolio.use();

  return {
    cashBalance: portfolio.cashBalance,
    onAdd: () => portfolio.cashBalance.add(100),
    onRemove: () => portfolio.cashBalance.remove(100)
  };
}
