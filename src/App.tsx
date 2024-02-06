import React, { useEffect } from "react";
import Client, { Environment, Local } from "./client";
import { persistor, useAppDispatch, useAppSelector } from "./lib/store";
import {
  onCountryListResponse,
  onCountryResponse,
  setIsLoading,
  setSelectedCountry,
} from "./lib/slice";
import { PersistGate } from "redux-persist/integration/react";
import Layout from "./components/Layout";
import { captureException } from "@sentry/react";

function App() {
  const { selectedRegion, selectedCountry, countryList } = useAppSelector(
    (state) => state.forecastSlice
  );
  const dispatch = useAppDispatch();

  const client = new Client(Environment("staging"));
  // const client = new Client(Local);

  useEffect(() => {
    const func = async () => {
      try {
        const response = await client.csv.GetCountryList();
        dispatch(onCountryListResponse(response));
      } catch (err) {
        captureException(err);
        setTimeout(func, 2000);
      }
    };
    func();
  }, []);

  useEffect(() => {
    const setFallbackCountry = () => {
      const fallbackCountry = countryList.find(({ isoCode }) => isoCode === "SE")!;
      dispatch(setSelectedCountry(fallbackCountry.isoCode));
    };
    const getUserLocation = async () => {
      try {
        const response = await fetch("https://api.country.is");
        const { country } = await response.json();
        const ipCountry = countryList.find(({ isoCode }) => isoCode === country)!;
        if (!ipCountry) throw new Error("Invalid country: " + country);
        else dispatch(setSelectedCountry(ipCountry.isoCode));
      } catch (err) {
        captureException(err);
        setFallbackCountry();
      }
    };
    if (countryList.length) {
      setFallbackCountry();
      // if (!selectedCountry) getUserLocation();
      // else {
      //   const country = countryList.find(({ isoCode }) => isoCode === selectedCountry.isoCode);
      //   const countryIsAvailable =
      //     country && country.regions.find((region) => region === selectedRegion);
      //   if (!countryIsAvailable) setFallbackCountry();
      // }
    }
  }, [countryList]);

  useEffect(() => {
    const getCountry = async () => {
      dispatch(setIsLoading(true));
      try {
        const response = await client.csv.GetCountry(selectedCountry!.name);
        dispatch(onCountryResponse(response));
      } catch (err) {
        console.error(err);
        captureException(err);
        setTimeout(getCountry, 2000);
      }
      dispatch(setIsLoading(false));
    };
    if (selectedCountry && selectedRegion && countryList.length) getCountry();
  }, [selectedCountry, selectedRegion, countryList]);

  return (
    <PersistGate loading={null} persistor={persistor}>
      <Layout />
    </PersistGate>
  );
}

export default App;
