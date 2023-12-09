import React from 'react';
import Color from '../theme/Color';
import { Column } from '../utils/Layout';
import { CashBalanceContainer } from './CashBalance.container';
import { PortfolioContainer } from './Portfolio.container';

export const CashBalanceAndPortfolio: React.FC<{}> = ({}) => {
  return (
    <Column style={{ backgroundColor: Color.backgroundDimmed }}>
      <CashBalanceContainer />
      <PortfolioContainer />
    </Column>
  );
};

