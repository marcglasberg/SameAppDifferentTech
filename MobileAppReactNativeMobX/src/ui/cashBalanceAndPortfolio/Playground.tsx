import React from 'react';
import { Text } from 'react-native';
import { Space } from '../theme/Space';
import { store } from '../../inject';
import Color from '../theme/Color';
import MaterialButton from '../utils/MaterialButton';
import AvailableStock from '../../business/state/AvailableStock';
import { Column } from '../utils/Layout';
import { CashBalanceAndPortfolio } from './CashBalanceAndPortfolio';

export const Playground: React.FC<{}> = ({}) => {
  return (
    <Column style={{
      backgroundColor: 'ffa',
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 40,
    }}
    >
      <CashBalanceAndPortfolio />

      <Space.px20 />

      <Text>
        This is an example of a "playground" where we may develop and test
        the {'<CashBalanceAndPortfolio>'} component in isolation.
        {'\n\n'}
        We're also adding a few buttons below, to help us manipulate the state of the app.
      </Text>

      <Space.px20 />

      <MaterialButton label="Clear cash balance"
                      backgroundColor={Color.blueText}
                      onPress={() => {
                        store.portfolio.cashBalance.setAmount(0);
                      }} />

      <Space.px8 />
      <MaterialButton label="Clear portfolio"
                      backgroundColor={Color.blueText}
                      onPress={() => {
                        store.portfolio.clearAll();
                      }} />

      <Space.px8 />
      <MaterialButton label="Add stocks to portfolio"
                      backgroundColor={Color.blueText}
                      onPress={async () => {
                        await store.availableStocks.loadAvailableStocks();
                        store.availableStocks.forEach((availableStock: AvailableStock) => {
                          if (Math.random() > 0.5)
                            store.portfolio.addStock(availableStock, 1);
                        });
                      }} />
    </Column>
  );
};
