import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { AvailableStocks } from './business/state/AvailableStocks.tsx';

export interface AvbStocksState {
  value: number;
}

const initialState = new AvailableStocks([]);

export const avbStocksSlice = createSlice({
  name: 'avbStocks',
  initialState,
  reducers: {
    increment: (state) => {
      // Uses the Immer library.
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount }
  = avbStocksSlice.actions;

export default avbStocksSlice.reducer;
