/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import AvailableStocksListView from './AvailableStocksList.view';
import { AvailableStocks } from '../../business/state/AvailableStocks';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';
import { setAvailableStocks } from '../../avbStocksSlice.ts';

export const AvailableStocksListContainer: React.FC<{}> = () => {

  const availableStocks = useSelector((state: RootState) => state.avbStocks);
  const dispatch = useDispatch();

  /**
   * On mount, we load the available stocks (the ones the user can buy)
   * and then start listening to stock price updates.
   */
  async function onMount(): Promise<void> {

    let loadedAvailableStocks = await AvailableStocks.loadAvailableStocks();
    dispatch(setAvailableStocks(loadedAvailableStocks));

    availableStocks.startListeningToStockPriceUpdates();
  }

  useEffect(() => {

      onMount().then();

      // On unmount, we stop listening to stock price updates.
      return () => {
        availableStocks.stopListeningToStockPriceUpdates();
      };
    },

    []); // Run on mount only.

  return <AvailableStocksListView {...viewModel(availableStocks)} />;
};

export function viewModel(availableStocks: AvailableStocks) {

  return {
    availableStocks: availableStocks
  };
}


