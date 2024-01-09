/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import AvailableStocksListView from './AvailableStocksList.view';
import AvailableStocks from '../../business/state/AvailableStocks';
import { print } from '../../business/utils/utils';

export const AvailableStocksListContainer: React.FC<{}> = () => {

  const [availableStocks, setAvailableStocks] = AvailableStocks.use();

  async function onMount(): Promise<void> {
    print('---------------------------------------------------------------------------------------------');
    let loadedAvailableStocks = await AvailableStocks.loadAvailableStocks();
    print(loadedAvailableStocks);
    print('DEPOIS');
    print('-----------------------------------------------------------------------------------------------');
    setAvailableStocks(loadedAvailableStocks);

    // TODO:
    // availableStocks.startListeningToStockPriceUpdates();
  }

  useEffect(() => {

      // On mount, we load the available stocks (the ones the user can buy)
      // and then start listening to stock price updates.
      onMount().then();

      // On unmount, we stop listening to stock price updates.
      return () => {
        availableStocks.stopListeningToStockPriceUpdates();
      };
    },

    []); // Run on mount only.

  return <AvailableStocksListView {...viewModel()} />;
};

export function viewModel() {

  const [availableStocks, setAvailableStocks] = AvailableStocks.use();

  return {
    availableStock: availableStocks.list
  };
}


