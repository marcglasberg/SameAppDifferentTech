import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { AvailableStocks } from './business/state/AvailableStocks.tsx';
import { print } from './business/utils/utils.ts';

export interface AvbStocksState {
  value: number;
}

const initialState = new AvailableStocks([]);

export const avbStocksSlice = createSlice({
  name: 'avbStocks',
  initialState,
  reducers: {

    setAvailableStocks: (state, action: PayloadAction<AvailableStocks>) => {
      state = action.payload;
      return state;
    },

    updateAvailableStocks: (state, action: PayloadAction<{ ticker: string, price: number }>) => {
      let ticker = action.payload.ticker;
      let price = action.payload.price;

      let availableStock = state.findBySymbolOrNull(ticker);

      // If the stock is found, replace its price.
      // If the stock is not found, keep the previous state.
      if (availableStock) {
        let avbStockWithUpdatedPrice = availableStock.withCurrentPrice(price);
        let newAvailableStocks = state.withAvailableStock(avbStockWithUpdatedPrice);

        print('Updated ' + ticker + ' price to ' + price + '.');

        state = newAvailableStocks;
        return state;
      }
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  setAvailableStocks,
  updateAvailableStocks
}
  = avbStocksSlice.actions;

export default avbStocksSlice.reducer;
