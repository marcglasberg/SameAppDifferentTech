import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Portfolio } from './business/state/Portfolio.tsx';
import { Ui } from './ui/utils/Ui.tsx';

const initialState = new Ui();

export const uiSlice = createSlice({
  name: 'ui',
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
  = uiSlice.actions;

export default uiSlice.reducer;
