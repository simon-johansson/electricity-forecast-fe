import React, { useEffect } from "react";
import Client, { Environment, Local } from "./client";
import Layout from "./components/Layout";
import { useAppDispatch, useAppSelector } from "./lib/store";
import { onCountryListResponse, onCountryResponse, setIsLoading } from "./lib/slice";

function App() {
  const { selectedRegion, selectedCountry } = useAppSelector((state) => state.forecastSlice);
  const dispatch = useAppDispatch();

  const client = new Client(Environment("staging"));
  // const client = new Client(Local);

  // useEffect(() => {
  //   const func = async () => {
  //     await fetch("https://api.db-ip.com/v2/free/self")
  //       .then(async (response) => {
  //         const { ipAddress } = await response.json();
  //         const data = await client.forecast.GetPostalCodeFromIP({ ip: ipAddress });
  //         setPostalCode(data.zip_code);
  //       })
  //       .then((data) => console.log(data));
  //   };
  //   func();
  // }, []);

  useEffect(() => {
    const func = async () => {
      try {
        const response = await client.csv.GetCountryList();
        dispatch(onCountryListResponse(response));
      } catch (err) {
        console.error(err);
      }
    };
    func();
  }, []);

  useEffect(() => {
    if (selectedCountry && selectedRegion) {
      const func = async () => {
        dispatch(setIsLoading(true));
        try {
          const response = await client.csv.GetCountry(selectedCountry.name);
          dispatch(onCountryResponse(response));
        } catch (err) {
          console.error(err);
        }
        dispatch(setIsLoading(false));
      };
      func();
    }
  }, [selectedCountry, selectedRegion]);

  // useEffect(() => {
  //   if (forecasts && selectedZone) {
  //     setZoneForecast(forecasts.zones.find((z) => z.zone === selectedZone));
  //   }
  // }, [forecasts, selectedZone]);

  return <Layout>{/*<Footer />*/}</Layout>;
}

export default App;
