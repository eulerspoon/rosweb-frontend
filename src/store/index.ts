import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';

export const store = configureStore({
  reducer: {
    filters: filterReducer,
  },
  // DevTools автоматически подключаются в development режиме
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;