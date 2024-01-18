/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import AvailableStocksListView from './AvailableStocksList.view';
import AvailableStocks from '../../business/state/AvailableStocks';

export const AvailableStocksListContainer: React.FC<{}> = () => {

  const [availableStocks, setAvailableStocks] = AvailableStocks.use();

  /**
   * On mount, we load the available stocks (the ones the user can buy)
   * and then start listening to stock price updates.
   */
  async function onMount(): Promise<void> {

    let loadedAvailableStocks = await AvailableStocks.loadAvailableStocks();
    setAvailableStocks(loadedAvailableStocks);

    availableStocks.startListeningToStockPriceUpdates(setAvailableStocks);
  }

  useEffect(() => {

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
    availableStocks: availableStocks
  };
}


