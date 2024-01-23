import React, { useContext } from 'react';
import { runConfig } from '../../inject';
import { AvailableStock } from '../../business/state/AvailableStock';
import { AvailableStockView } from './AvailableStock.view';
import { PortfolioContext, Set } from '../../business/state/PortfolioContext';
import { Portfolio } from '../../business/state/Portfolio';

export const AvailableStockContainer: React.FC<{
  availableStock: AvailableStock
}> = ({ availableStock }) => {
  const { portfolio, setPortfolio } = useContext(PortfolioContext);
  return <AvailableStockView {...viewModel(availableStock, portfolio, setPortfolio)} />;
};

export function viewModel(
  availableStock: AvailableStock,
  portfolio: Portfolio,
  setPortfolio: Set<Portfolio>
) {

  return {
    availableStock,
    ifBuyDisabled: !portfolio.hasMoneyToBuyStock(availableStock),
    ifSellDisabled: !portfolio.hasStock(availableStock),
    abTesting: runConfig.abTesting,

    onBuy: () => {
      setPortfolio(prevPortfolio => prevPortfolio.buy(availableStock, 1));
    },

    onSell: () => {
      setPortfolio(prevPortfolio => prevPortfolio.sell(availableStock, 1));
    }
  };
}

