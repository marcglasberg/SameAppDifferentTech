import React from 'react';
import { runConfig, store } from '../../inject';
import { observer } from 'mobx-react-lite';
import { AvailableStock } from '../../business/state/AvailableStock';
import { AvailableStockView } from './AvailableStock.view';

export const AvailableStockContainer: React.FC<{
  availableStock: AvailableStock
}> = observer(({ availableStock }) => {
  return <AvailableStockView {...viewModel(availableStock)} />;
});

export function viewModel(availableStock: AvailableStock) {
  return {
    availableStock,
    ifBuyDisabled: !store.portfolio.hasMoneyToBuyStock(availableStock),
    ifSellDisabled: !store.portfolio.hasStock(availableStock),
    abTesting: runConfig.abTesting,
    onBuy: () => store.portfolio.buy(availableStock, 1),
    onSell: () => store.portfolio.sell(availableStock, 1),
  };
}

