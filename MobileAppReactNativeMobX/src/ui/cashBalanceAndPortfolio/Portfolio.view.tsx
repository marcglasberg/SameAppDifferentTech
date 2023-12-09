import React from 'react';
import { Text } from 'react-native';
import { observer } from 'mobx-react-lite';
import Stock from '../../business/state/Stock';
import { Space } from '../theme/Space';
import { Column, Row } from '../utils/Layout';
import { Font } from '../theme/Font';

export const PortfolioView: React.FC<{
  portfolioIsEmpty: boolean;
  stocks: Stock[];
}> = observer((
  {
    portfolioIsEmpty,
    stocks,
  }) => {

  return (
    <Column style={{ paddingVertical: 16, paddingHorizontal: 16, alignItems: 'flex-start' }}>

      <Row>
        <Text style={Font.medium()}>Portfolio:</Text>
        <Space.px8 />
        {portfolioIsEmpty && <Text style={Font.medium()}>—</Text>}
      </Row>

      <Space.px4 />

      {stocks.map((stock, index) => (
        <StockInPortfolio key={index} stock={stock} />
      ))}

    </Column>
  );
});

const StockInPortfolio: React.FC<{ stock: Stock }>
  = observer(({ stock }) => {

  return (
    <Text style={{ ...Font.small(), paddingTop: 2 }}>
      {`${stock.ticker} (${stock.howManyShares} shares @ US$ ${stock.averagePriceStr})`}
    </Text>
  );
});
