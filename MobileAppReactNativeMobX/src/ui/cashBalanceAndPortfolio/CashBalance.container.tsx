import React from 'react';
import { store } from '../../inject';
import { observer } from 'mobx-react-lite';
import { CashBalanceView } from './CashBalance.view';

export const CashBalanceContainer
  = observer(() => {
  return <CashBalanceView {...viewModel()} />;
});

export function viewModel() {
  return {
    cashBalance: store.portfolio.cashBalance,
    onAdd: () => store.portfolio.cashBalance.add(100),
    onRemove: () => store.portfolio.cashBalance.remove(100),
  };
}
