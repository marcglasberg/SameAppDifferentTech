import React, { useContext } from 'react';
import { CashBalanceView } from './CashBalance.view';
import { Portfolio } from '../../business/state/Portfolio';
import { PortfolioContext, Set } from '../../business/state/PortfolioContext';

export const CashBalanceContainer
  = () => {
  const { portfolio, setPortfolio } = useContext(PortfolioContext);
  return <CashBalanceView {...viewModel(portfolio, setPortfolio)} />;
};

export function viewModel(
  portfolio: Portfolio,
  setPortfolio: Set<Portfolio>
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
