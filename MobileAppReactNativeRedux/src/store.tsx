import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './portfolioSlice.ts';
import avbStocksReducer from './avbStocksSlice.ts';
import uiReducer from './uiSlice.ts';

export const store
  = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    avbStocks: avbStocksReducer,
    ui: uiReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself.
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}.
export type AppDispatch = typeof store.dispatch;
