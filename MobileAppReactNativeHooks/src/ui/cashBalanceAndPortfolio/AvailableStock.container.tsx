import React from 'react';
import { runConfig } from '../../inject';
import { AvailableStock } from '../../business/state/AvailableStock';
import { AvailableStockView } from './AvailableStock.view';
import Portfolio from '../../business/state/Portfolio';

export const AvailableStockContainer: React.FC<{
  availableStock: AvailableStock
}> = ({ availableStock }) => {
  return <AvailableStockView {...viewModel(availableStock)} />;
};

export function viewModel(availableStock: AvailableStock) {

  const [portfolio, setPortfolio] = Portfolio.use();

  return {
    availableStock,
    ifBuyDisabled: !portfolio.hasMoneyToBuyStock(availableStock),
    ifSellDisabled: !portfolio.hasStock(availableStock),
    abTesting: runConfig.abTesting,

    onBuy: () => {
      const newPortfolio = portfolio.buy(availableStock, 1);
      return setPortfolio(newPortfolio);
    },

    onSell: () => {
      const newPortfolio = portfolio.sell(availableStock, 1);
      return setPortfolio(newPortfolio);
    }
  };
}

