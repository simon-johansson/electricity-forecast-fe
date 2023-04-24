import React, { useEffect } from "react";
import Client, { Environment } from "./client";
import Layout from "./components/Layout";
import { useAppDispatch, useAppSelector } from "./lib/store";
import {
  onCountryListResponse,
  onCountryResponse,
  setIsLoading,
  setSelectedCountry,
} from "./lib/slice";

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
        console.error(err);
        setTimeout(() => {
          func();
        }, 2000);
      }
    };
    func();
  }, []);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const response = await fetch("https://api.country.is");
        const { country } = await response.json();
        const ipCountry = countryList.find(({ isoCode }) => isoCode === country)!;
        if (!ipCountry) throw new Error("Invalid country: " + country);
        else dispatch(setSelectedCountry(ipCountry.isoCode));
      } catch (err) {
        console.error(err);
        const fallbackCountry = countryList.find(({ isoCode }) => isoCode === "SE")!;
        dispatch(setSelectedCountry(fallbackCountry.isoCode));
      }
    };
    if (countryList.length) getUserLocation();
  }, [countryList]);

  useEffect(() => {
    const getCountry = async () => {
      dispatch(setIsLoading(true));
      try {
        const response = await client.csv.GetCountry(selectedCountry!.name);
        dispatch(onCountryResponse(response));
      } catch (err) {
        console.error(err);
      }
      dispatch(setIsLoading(false));
    };
    if (selectedCountry && selectedRegion) getCountry();
  }, [selectedCountry, selectedRegion]);

  return <Layout>{/*<Footer />*/}</Layout>;
}

export default App;
