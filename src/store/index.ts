import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import authReducer from './slices/authSlice';
import routeReducer from './slices/routeSlice';

export const store = configureStore({
  reducer: {
    filters: filterReducer,
    auth: authReducer,
    route: routeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;