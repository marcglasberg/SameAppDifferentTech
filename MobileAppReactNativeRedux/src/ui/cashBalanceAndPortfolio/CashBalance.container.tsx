import React from 'react';
import { CashBalanceView } from './CashBalance.view';
import { Portfolio } from '../../business/state/Portfolio';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';
import { addCashBalance, removeCashBalance } from '../../portfolioSlice.ts';
import { Dispatch } from '@reduxjs/toolkit';

export const CashBalanceContainer
  = () => {
  const portfolio = useSelector((state: RootState) => state.portfolio);
  const dispatch = useDispatch();
  return <CashBalanceView {...viewModel(portfolio, dispatch)} />;
};

export function viewModel(portfolio: Portfolio, dispatch: Dispatch) {

  return {
    cashBalance: portfolio.cashBalance,

    onAdd: () => {
      dispatch(
        addCashBalance({ howMuch: 100 })
      );
    },

    onRemove: () => {
      dispatch(
        removeCashBalance({ howMuch: 100 })
      );
    }
  };
}
