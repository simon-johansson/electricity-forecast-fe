import React, { useEffect, useState } from "react";
import Client, { Environment, forecast } from "./client";
import Layout from "./components/Layout";

function App() {
  const [postalCode, setPostalCode] = useState<string>("");
  const [forecasts, setForecasts] = useState<forecast.ListResponse | undefined>();
  const [selectedZone, setSelectedZone] = useState<"1" | "2" | "3" | "4">("1");
  const [zoneForecast, setZoneForecast] = useState<forecast.ZoneForecast | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const value = useAppSelector((state) => state.counter.value);
  // const dispatch = useAppDispatch();
  // console.log(value);
  // useEffect(() => {
  //   setInterval(() => {
  //     dispatch(incrementByAmount(1));
  //   }, 1000);
  // }, []);

  const client = new Client(Environment("staging"));
  // const client = window.location.host.includes("vercel.app")
  //   ? new Client(Environment("staging"))
  //   : new Client(Local);

  useEffect(() => {
    const func = async () => {
      await fetch("https://api.db-ip.com/v2/free/self")
        .then(async (response) => {
          const { ipAddress } = await response.json();
          const data = await client.forecast.GetPostalCodeFromIP({ ip: ipAddress });
          setPostalCode(data.zip_code);
        })
        .then((data) => console.log(data));
    };
    func();
  }, []);

  useEffect(() => {
    const func = async () => {
      const data = await client.forecast.GetForecasts();
      data.zones.forEach(
        (z) =>
          ((z as any).data = z.data.map(({ year, price }) => ({
            year,
            price: parseFloat(price.replace(",", ".")),
          })))
      );
      // console.log(data);
      setForecasts(data);
    };
    func();
  }, []);

  useEffect(() => {
    if (forecasts && selectedZone) {
      setZoneForecast(forecasts.zones.find((z) => z.zone === selectedZone));
    }
  }, [forecasts, selectedZone]);

  const search = async () => {
    setIsLoading(true);
    const data = await client.forecast.GetZoneFromPostalCode(postalCode);
    // console.log(data);
    setSelectedZone(data.zone as any);
    setIsLoading(false);
  };

  // console.log(forecasts);

  return <Layout>{/*<Footer />*/}</Layout>;
}

export default App;
