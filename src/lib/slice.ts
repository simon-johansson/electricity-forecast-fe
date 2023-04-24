import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { csv } from "../client";
import { compareAsc, parse, setHours } from "date-fns";

type ForecastViewingMode = "table" | "graph" | "summary";

export interface HourValue {
  time: string;
  price: number;
}

export interface DayData {
  date: string;
  series: HourValue[];
}

export interface RegionData {
  name: string;
  days: DayData[];
}

interface State {
  forecastViewingMode: ForecastViewingMode;
  isSearchingLocation: boolean;
  isLoading: boolean;
  countryList: csv.CountrySimple[];
  selectedCountry?: csv.CountrySimple;
  selectedRegion?: string;
  regionData?: RegionData;
}

const initialState: State = {
  isLoading: true,
  forecastViewingMode: "table",
  isSearchingLocation: false,
  countryList: [],
};

const forecastSlice = createSlice({
  name: "forecastSlice",
  initialState,
  reducers: {
    onCountryListResponse: (state, action: PayloadAction<csv.GetCountryListResponse>) => {
      const countryList = action.payload.data;
      countryList.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });

      state.countryList = countryList;
    },
    onCountryResponse: (state, action: PayloadAction<csv.GetCountryResponse>) => {
      const DATE_RESPONSE_FORMAT = "yyyyLLdd";
      const responseRegionData = action.payload.data.regions.find(
        (region) => region.name === state.selectedRegion
      )!;
      const regionData: RegionData = {
        name: responseRegionData.name,
        days: [],
      };
      responseRegionData.days.forEach((region) => {
        const date = parse(region.date, DATE_RESPONSE_FORMAT, new Date()).toISOString();
        regionData.days.push({
          date: date,
          series: region.time.map((t) => {
            return {
              time: setHours(new Date(date), parseInt(t.hour)).toISOString(),
              price: parseFloat(t.price),
            };
          }),
        });
      });
      regionData.days.sort((a, b) => {
        return compareAsc(Date.parse(a.date), Date.parse(b.date));
      });
      state.regionData = regionData;
    },
    setSelectedCountry: (state, action: PayloadAction<string>) => {
      const selectedCountry = state.countryList.find(
        (country) => country.isoCode === action.payload
      )!;
      state.selectedCountry = selectedCountry;
      state.selectedRegion = selectedCountry.regions[0];
    },
    setSelectedRegion: (state, action: PayloadAction<string>) => {
      state.selectedRegion = action.payload;
    },
    setForecastViewingMode: (state, action: PayloadAction<ForecastViewingMode>) => {
      state.forecastViewingMode = action.payload;
    },
    setIsSearchingLocation: (state, action: PayloadAction<boolean>) => {
      state.isSearchingLocation = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setForecastViewingMode,
  setIsSearchingLocation,
  onCountryResponse,
  onCountryListResponse,
  setSelectedCountry,
  setSelectedRegion,
  setIsLoading,
} = forecastSlice.actions;
export default forecastSlice.reducer;
