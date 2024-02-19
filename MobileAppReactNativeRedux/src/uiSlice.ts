import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Ui } from './ui/utils/Ui.tsx';

const initialState = new Ui();

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {

    setUi: (state, action: PayloadAction<Ui>) => {
      state = action.payload;
      return state;
    },

    toggleConfigScreen: (state) => {
      state = state.toggleConfigScreen();
      return state;
    },

    toggleLightAndDarkMode: (state) => {
      state = state.toggleLightAndDarkMode();
      return state;
    }
  }
});

// Action creators are generated for each case reducer function
export const {
  setUi,
  toggleConfigScreen,
  toggleLightAndDarkMode
}
  = uiSlice.actions;

export default uiSlice.reducer;
