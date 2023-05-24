import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { csv } from "../client";
import { add, compareAsc, isAfter, isTomorrow, parse, setHours, startOfToday } from "date-fns";

type ForecastViewingMode = "table" | "graph" | "summary";

export interface HourValue {
  time: string;
  price: number | null;
}

export interface DayData {
  date: string;
  series: HourValue[];
}

export interface RegionData {
  name: string;
  currency: string;
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
        currency: responseRegionData.currency,
        days: [],
      };
      responseRegionData.days.forEach((dayData, dayIndex) => {
        const date = parse(dayData.date, DATE_RESPONSE_FORMAT, new Date()).toISOString();

        const emptyHours: HourValue[] = [];
        if (dayData.time.length !== 24) {
          const offset = parseInt(dayData.time[0].offset);
          for (let hour = 0; hour < offset; hour++) {
            emptyHours.push({
              time: setHours(new Date(date), hour).toISOString(),
              price: null,
            });
          }
        }
        const series: HourValue[] = dayData.time.map((t) => {
          return {
            time: setHours(new Date(date), parseInt(t.localHour)).toISOString(),
            price: parseFloat(t.localPrice),
          };
        });
        series.unshift(...emptyHours);
        regionData.days.push({
          date: date,
          series,
        });
      });

      regionData.days.sort((a, b) => {
        return compareAsc(Date.parse(a.date), Date.parse(b.date));
      });

      // const firstDayIsTomorrow = isTomorrow(Date.parse(regionData.days[1].date));
      // const isAfter10UTC = isAfter(Date.now(), add(startOfToday(), { hours: 10 }));
      // // Remove tomorrows data if its after 10:00 UTC time because that when the "real" price info is published
      // if (firstDayIsTomorrow && isAfter10UTC) {
      //   regionData.days.splice(1, 1);
      // }

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
