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

    onAdd: () => {
      const newPortfolio = portfolio.addCashBalance(100);
      setPortfolio(newPortfolio);
    },

    onRemove: () => {
      const newPortfolio = portfolio.removeCashBalance(100);
      setPortfolio(newPortfolio);
    }
  };
}
