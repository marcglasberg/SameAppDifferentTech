import React from 'react';
import { FlatList } from 'react-native';
import AvailableStock from '../../business/state/AvailableStock';
// import { AvailableStockContainer } from './AvailableStock.container';
import { AvailableStockWithHooks } from './alternative_implementations/hooks/AvailableStock.hook';


const AvailableStocksListView: React.FC<{ availableStock: AvailableStock[]; }>
  = ({ availableStock }) => {
  return (
    <FlatList
      data={availableStock}
      scrollEnabled={true}
      renderItem={renderItem}
      keyExtractor={(item, _) => `stock-${item.ticker}`}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );

  function renderItem({ item }: { item: AvailableStock }) {
    return <AvailableStockWithHooks availableStock={item} />;
  }
};

export default AvailableStocksListView;
