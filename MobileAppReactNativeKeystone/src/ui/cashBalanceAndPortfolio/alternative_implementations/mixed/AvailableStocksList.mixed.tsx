import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { store } from '../../../../inject';

import { observer } from 'mobx-react-lite';
import { AvailableStock } from '../../../../business/state/AvailableStock';
import { AvailableStockContainer } from '../../AvailableStock.container';

export const AvailableStocksList_Mixed: React.FC<{}> = observer(() => {

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

  const renderItem = ({ item }: {
    item: AvailableStock
  }) => (
    <AvailableStockContainer availableStock={item} />
  );

  return (
    <FlatList
      data={store.availableStocks.list.slice()}
      scrollEnabled={true}
      renderItem={renderItem}
      keyExtractor={(item, _) => `stock-${item.ticker}`}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
});
