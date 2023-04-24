import * as Sentry from "@sentry/react";
import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import slice from "./slice";

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
});

export const store = configureStore({
  reducer: {
    forecastSlice: slice,
  },
  enhancers: [sentryReduxEnhancer],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
