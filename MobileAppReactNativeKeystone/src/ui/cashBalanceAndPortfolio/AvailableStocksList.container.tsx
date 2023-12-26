import React, { useEffect } from 'react';
import { store } from '../../inject';
import { observer } from 'mobx-react-lite';
import AvailableStocksListView from './AvailableStocksList.view';

export const AvailableStocksListContainer: React.FC<{}> = observer(() => {

  useEffect(() => {

    // On mount, we load the available stocks (the ones the user can buy)
    // and then start listening to stock price updates.
    (async () => {
      await store.availableStocks.loadAvailableStocks();
      store.availableStocks.startListeningToStockPriceUpdates();
    })();

    // On unmount, we stop listening to stock price updates.
    return () => {
      store.availableStocks.stopListeningToStockPriceUpdates();
    };
  }, []); // Run on mount only.

  return <AvailableStocksListView {...viewModel()} />;
});

export function viewModel() {
  return {
    availableStock: store.availableStocks.list,
  };
}


