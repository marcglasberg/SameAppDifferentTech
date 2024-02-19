import React from 'react';
import { runConfig } from '../../inject';
import { AvailableStock } from '../../business/state/AvailableStock';
import { AvailableStockView } from './AvailableStock.view';
import { Portfolio } from '../../business/state/Portfolio';
import { buyStock, sellStock } from '../../portfolioSlice.ts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store.tsx';
import { Dispatch } from '@reduxjs/toolkit';


export const AvailableStockContainer: React.FC<{
  availableStock: AvailableStock
}> = ({ availableStock }) => {
  const portfolio = useSelector((state: RootState) => state.portfolio);
  const dispatch = useDispatch();
  return <AvailableStockView {...viewModel(availableStock, portfolio, dispatch)} />;
};

export function viewModel(
  availableStock: AvailableStock,
  portfolio: Portfolio,
  dispatch: Dispatch
) {

  return {
    availableStock,
    ifBuyDisabled: !portfolio.hasMoneyToBuyStock(availableStock),
    ifSellDisabled: !portfolio.hasStock(availableStock),
    abTesting: runConfig.abTesting,

    onBuy: () => {
      dispatch(
        buyStock({ availableStock: availableStock, howMany: 1 })
      );
    },

    onSell: () => {
      dispatch(
        sellStock({ availableStock: availableStock, howMany: 1 })
      );
    }
  };
}

