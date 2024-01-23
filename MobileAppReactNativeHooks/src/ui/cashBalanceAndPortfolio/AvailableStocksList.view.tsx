import React from 'react';
import { FlatList } from 'react-native';
import { AvailableStock } from '../../business/state/AvailableStock';
import { AvailableStockContainer } from './AvailableStock.container';
import { AvailableStocks } from '../../business/state/AvailableStocks';

// Alternative with Hooks:
// import { AvailableStockWithHooks } from './alternative_implementations/hooks/AvailableStock.hook';

const AvailableStocksListView: React.FC<{ availableStocks: AvailableStocks; }>
  = ({ availableStocks }) => {
  return (
    <FlatList
      data={availableStocks.list}
      scrollEnabled={true}
      renderItem={renderItem}
      keyExtractor={(item, _) => `stock-${item.ticker}`}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );

  function renderItem({ item }: { item: AvailableStock }) {
    return <AvailableStockContainer availableStock={item} />;

    // Alternative with Hooks:
    // return <AvailableStockWithHooks availableStock={item} />;
  }
};

export default AvailableStocksListView;
