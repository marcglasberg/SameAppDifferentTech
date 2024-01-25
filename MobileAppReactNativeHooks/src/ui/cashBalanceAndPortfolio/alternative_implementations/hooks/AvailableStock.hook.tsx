import { runConfig } from '../../../../inject';
import { AvailableStock } from '../../../../business/state/AvailableStock';
import React from 'react';
import { LayoutAnimation, Text } from 'react-native';
import { Font } from '../../../theme/Font';
import Color from '../../../theme/Color';
import { Column, Row } from '../../../utils/Layout';
import { Space } from '../../../theme/Space';
import MaterialButton from '../../../utils/MaterialButton';
import Divider from '../../../utils/Divider';
import { usePortfolio } from '../../../../business/state/Hooks';

export function useAvailableStock(availableStock: AvailableStock) {

  const { portfolio } = usePortfolio();

  return {
    availableStock,
    ifBuyDisabled: !portfolio.hasMoneyToBuyStock(availableStock),
    ifSellDisabled: !portfolio.hasStock(availableStock),
    abTesting: runConfig.abTesting,
    onBuy: () => portfolio.buy(availableStock, 1),
    onSell: () => portfolio.sell(availableStock, 1)
  };
}

export const AvailableStockWithHooks
  : React.FC<{
  availableStock: AvailableStock;
}>
  = ({ availableStock }) => {

  const {
    ifBuyDisabled,
    ifSellDisabled,
    abTesting,
    onBuy,
    onSell
  } = useAvailableStock(availableStock);

  const _animate = () => {
    // Call this before updating the state that causes a re-render.
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const $ticker = Font.large();
  const $name = Font.small(Color.textDimmed);
  const $priceA = Font.big(Color.blueText);
  const $priceB = Font.small();

  return (

    <Column style={{ paddingTop: 12, paddingHorizontal: 12 }}>

      <Row>

        <Column style={{ flex: 1 }}>
          <Text style={$ticker}>{availableStock.ticker}</Text>
          <Space.px4 />
          <Text style={$name}>{availableStock.name}</Text>
        </Column>

        <Space.px8 />

        <Column>
          <Text style={abTesting.choose($priceA, $priceB)}>
            {availableStock.currentPriceStr}
          </Text>
          <Space.px8 />
          <Row>

            <MaterialButton label="BUY"
                            backgroundColor={Color.up}
                            disabled={ifBuyDisabled}
                            onPress={() => {
                              _animate();
                              onBuy();
                            }} />

            <Space.px8 />

            <MaterialButton label="SELL"
                            backgroundColor={Color.down}
                            disabled={ifSellDisabled}
                            onPress={() => {
                              _animate();
                              onSell();
                            }} />
          </Row>
        </Column>

      </Row>
      <Space.px12 />
      <Divider />
    </Column>
  );
};
