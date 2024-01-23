import React from 'react';
import { LayoutAnimation, Text } from 'react-native';

import { AvailableStock } from '../../business/state/AvailableStock';
import { Space } from '../theme/Space';
import MaterialButton from '../utils/MaterialButton';
import Divider from '../utils/Divider';
import Color from '../theme/Color';
import { Column, Row } from '../utils/Layout';
import { Font } from '../theme/Font';
import { AbTesting } from '../../business/RunConfig/ABTesting';

export const AvailableStockView: React.FC<{
  availableStock: AvailableStock;
  ifBuyDisabled: boolean;
  ifSellDisabled: boolean;
  abTesting: AbTesting,
  onBuy: () => void;
  onSell: () => void;
}>
  = ({
       availableStock,
       ifBuyDisabled,
       ifSellDisabled,
       abTesting,
       onBuy,
       onSell
     }) => {

  const animate = () => {
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
                              animate();
                              onBuy();
                            }} />

            <Space.px8 />

            <MaterialButton label="SELL"
                            backgroundColor={Color.down}
                            disabled={ifSellDisabled}
                            onPress={() => {
                              animate();
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
