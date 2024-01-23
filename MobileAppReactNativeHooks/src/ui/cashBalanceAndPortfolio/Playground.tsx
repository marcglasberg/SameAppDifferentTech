import React from 'react';
import { Text } from 'react-native';
import { Space } from '../theme/Space';
import Color from '../theme/Color';
import MaterialButton from '../utils/MaterialButton';
import { AvailableStock } from '../../business/state/AvailableStock';
import { Column } from '../utils/Layout';
import { CashBalanceAndPortfolio } from './CashBalanceAndPortfolio';
import { AvailableStocks } from '../../business/state/AvailableStocks';
import { useAvailableStocks, usePortfolio } from '../../business/state/HooksAndContext';

export const Playground: React.FC<{}> = ({}) => {

  const [portfolio, setPortfolio] = usePortfolio();
  const [availableStocks, setAvailableStocks] = useAvailableStocks();

  return (
    <Column style={{
      backgroundColor: 'ffa',
      flex: 1,
      paddingHorizontal: 12,
      paddingVertical: 40
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
                        portfolio.cashBalance.withAmount(0);
                      }} />

      <Space.px8 />
      <MaterialButton label="Clear portfolio"
                      backgroundColor={Color.blueText}
                      onPress={() => {
                        portfolio.withoutStocks();
                      }} />

      <Space.px8 />
      <MaterialButton label="Add stocks to portfolio"
                      backgroundColor={Color.blueText}
                      onPress={async () => {
                        await AvailableStocks.loadAvailableStocks();
                        availableStocks.forEach((availableStock: AvailableStock) => {
                          if (Math.random() > 0.5)
                            portfolio.withAddedStock(availableStock, 1);
                        });
                      }} />
    </Column>
  );
};
