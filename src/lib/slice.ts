import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Zone = "1" | "2" | "3" | "4";
type ForecastViewingMode = "table" | "graph";

interface State {
  forecastViewingMode: ForecastViewingMode;
  isSearchingLocation: boolean;
  zone: Zone;
  countryCode: string;
}

const initialState: State = {
  zone: "3",
  forecastViewingMode: "table",
  isSearchingLocation: false,
  countryCode: "SE",
};

const forecastSlice = createSlice({
  name: "forecastSlice",
  initialState,
  reducers: {
    // increment: (state) => {
    //   state.value += 1;
    // },
    // decrement: (state) => {
    //   state.value -= 1;
    // },
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
    setZone: (state, action: PayloadAction<Zone>) => {
      state.zone = action.payload;
      state.isSearchingLocation = false;
    },
    setForecastViewingMode: (state, action: PayloadAction<ForecastViewingMode>) => {
      state.forecastViewingMode = action.payload;
    },
    setIsSearchingLocation: (state, action: PayloadAction<boolean>) => {
      state.isSearchingLocation = action.payload;
    },
  },
});

export const { setZone, setForecastViewingMode, setIsSearchingLocation } = forecastSlice.actions;
export default forecastSlice.reducer;
