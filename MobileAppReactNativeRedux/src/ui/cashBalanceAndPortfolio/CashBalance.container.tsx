import React from 'react';
import { CashBalanceView } from './CashBalance.view';
import { Portfolio } from '../../business/state/Portfolio';
import { usePortfolio, UseSet } from '../../business/state/Hooks';

export const CashBalanceContainer
  = () => {
  const { portfolio, setPortfolio } = usePortfolio();
  return <CashBalanceView {...viewModel(portfolio, setPortfolio)} />;
};

export function viewModel(
  portfolio: Portfolio,
  setPortfolio: UseSet<Portfolio>
) {

  return {
    cashBalance: portfolio.cashBalance,

    onAdd: () => {
      setPortfolio(prevPortfolio => prevPortfolio.addCashBalance(100));
    },

    onRemove: () => {
      setPortfolio(prevPortfolio => prevPortfolio.removeCashBalance(100));
    }
  };
}
