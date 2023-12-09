import React from 'react';
import { LayoutAnimation, Text } from 'react-native';
import { runConfig, store } from '../../../../inject';

import { observer } from 'mobx-react-lite';
import AvailableStock from '../../../../business/state/AvailableStock';
import { Space } from '../../../theme/Space';
import MaterialButton from '../../../utils/MaterialButton';
import Divider from '../../../utils/Divider';
import Color from '../../../theme/Color';
import { Column, Row } from '../../../utils/Layout';
import { Font } from '../../../theme/Font';

export const AvailableStock_Mixed: React.FC<{
  availableStock: AvailableStock;
}>
  = observer(({ availableStock }) => {

  const animateAddition = () => {
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
          <Text style={runConfig.abTesting.choose($priceA, $priceB)}>
            {availableStock.currentPriceStr}
          </Text>
          <Space.px8 />
          <Row>

            <MaterialButton label="BUY"
                            backgroundColor={Color.up}
                            disabled={!store.portfolio.hasMoneyToBuyStock(availableStock)}
                            onPress={() => {
                              animateAddition();
                              store.portfolio.buy(availableStock, 1);
                            }} />

            <Space.px8 />

            <MaterialButton label="SELL"
                            backgroundColor={Color.down}
                            disabled={!store.portfolio.hasStock(availableStock)}
                            onPress={() => {
                              animateAddition();
                              store.portfolio.sell(availableStock, 1);
                            }} />
          </Row>
        </Column>

      </Row>
      <Space.px12 />
      <Divider />
    </Column>
  );
});
