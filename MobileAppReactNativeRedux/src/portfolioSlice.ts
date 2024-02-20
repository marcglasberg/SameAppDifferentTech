import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Portfolio } from './business/state/Portfolio.tsx';
import { AvailableStock } from './business/state/AvailableStock.ts';
import { print } from './business/utils/utils.ts';

const initialState = new Portfolio();

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {

    setPortfolio: (state, action: PayloadAction<Portfolio>) => {
      state = action.payload;
      return state;
    },

    buyStock: (state, action: PayloadAction<{ availableStock: AvailableStock, howMany: number }>) => {
      state = state.buy(action.payload.availableStock, action.payload.howMany);
      return state;
    },

    sellStock: (state, action: PayloadAction<{ availableStock: AvailableStock, howMany: number }>) => {
      state = state.sell(action.payload.availableStock, action.payload.howMany);
      return state;
    },

    addCashBalance: (state, action: PayloadAction<{ howMuch: number }>) => {
      state = state.addCashBalance(action.payload.howMuch);
      return state;
    },

    removeCashBalance: (state, action: PayloadAction<{ howMuch: number }>) => {
      state = state.removeCashBalance(action.payload.howMuch);
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  setPortfolio,
  buyStock,
  sellStock,
  addCashBalance,
  removeCashBalance
}
  = portfolioSlice.actions;

export default portfolioSlice.reducer;
