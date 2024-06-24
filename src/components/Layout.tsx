import React, { FC, PropsWithChildren } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SearchArea from "./SearchArea";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { setForecastViewingMode, setIsSearchingLocation } from "../lib/slice";
import ForecastTable from "./ForecastTable";
import ForecastGraph from "./ForecastGraph";
import { CircleFlag } from "react-circle-flags";
import Footer from "./Footer";
import ForecastSummary from "./ForecastSummary";
import Header from "./Header";

const translateSwedishRegion = (region: string) => {
  return "Elområde " + region.slice(-1);
};

const Layout: FC<PropsWithChildren> = (props) => {
  const { selectedRegion, selectedCountry, isSearchingLocation, forecastViewingMode } =
    useAppSelector((state) => state.forecastSlice);
  const dispatch = useAppDispatch();

  if (!selectedCountry || !selectedRegion) return null;

  const searchBox = (
    <div
      onClick={() => dispatch(setIsSearchingLocation(true))}
      // className="flex w-full max-w-[400px] cursor-pointer justify-between rounded border border-black/30 px-2 py-1 sm:w-fit sm:justify-start"
      className="flex w-full cursor-pointer justify-between rounded border border-black/30 px-2 py-1"
    >
      <div className="flex">
        <div className="flex flex-shrink-0 items-center">
          <CircleFlag countryCode={selectedCountry.isoCode.toLowerCase()} className="h-5 w-5" />
        </div>

        <div className="flex">
          <p className="ml-3 inline-flex items-center whitespace-nowrap text-gray-500">
            {/*<span className="font-bold capitalize">{selectedCountry.name.toLowerCase()}</span>*/}
            <span className="font-bold capitalize">Sverige</span>
            {selectedCountry.regions.length > 1 && (
              <span className="ml-2">({translateSwedishRegion(selectedRegion)})</span>
            )}
          </p>
        </div>
      </div>

      <div className="ml-8 flex items-center">
        <button
          type="button"
          className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex w-full flex-col">
      {/*<Header />*/}

      <div className="z-10 m-auto w-full">
        <div className="min-h-full w-full">
          <SearchArea open={isSearchingLocation} />

          <div className="w-full bg-white py-5">
            {/*<main className="mx-auto min-w-0 max-w-2xl px-4 sm:px-6 md:min-w-[768px] lg:px-8">*/}
            <main className="mx-auto min-w-0 max-w-4xl px-4 pb-28">
              <div className="mb-6 mt-11 flex w-full flex-col justify-center sm:flex-row sm:items-center">
                {/*<h2 className="mr-10 mb-6 text-3xl font-semibold sm:mb-0" id="forecasts">*/}
                {/*  Forecasts*/}
                {/*</h2>*/}
                <div className="w-full sm:w-[300px]">{searchBox}</div>
              </div>
              <div className="mt-8 flex items-center justify-center pb-5">
                <span className="isolate flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => dispatch(setForecastViewingMode("summary"))}
                    className={`
                      relative inline-flex h-8 w-28 items-center justify-center rounded-l-md border border-r-0 border-gray-300 
                      px-4 py-2 text-sm font-semibold text-gray-700 
                      ${
                        forecastViewingMode === "summary"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }
                  `}
                  >
                    Översikt
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(setForecastViewingMode("table"))}
                    className={`
                      relative inline-flex h-8 w-28 items-center justify-center border border-gray-300 
                      px-4 py-2 text-sm font-semibold text-gray-700 
                      ${
                        forecastViewingMode === "table"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }
                  `}
                  >
                    Tabell
                  </button>

                  <button
                    type="button"
                    onClick={() => dispatch(setForecastViewingMode("graph"))}
                    className={`relative -ml-px inline-flex h-8 w-28 items-center justify-center rounded-r-md border border-gray-300 
                    px-4 py-2 text-sm font-semibold
                    ${
                      forecastViewingMode === "graph"
                        ? "bg-primary text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }
                  `}
                  >
                    Diagram
                  </button>
                </span>
              </div>

              {forecastViewingMode === "summary" && <ForecastSummary />}

              {forecastViewingMode === "table" && <ForecastTable />}

              {forecastViewingMode === "graph" && <ForecastGraph />}
            </main>

            {/*<section*/}
            {/*  className="h-[400px] w-full  bg-cover bg-scroll bg-right-top bg-no-repeat md:bg-fixed md:bg-center"*/}
            {/*  style={{ backgroundImage: "url(/assets/sticky-bg.jpg)" }}*/}
            {/*/>*/}

            {/*<section className="bg-gray-50 py-20">*/}
            {/*  <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">*/}
            {/*    <h2 className="mr-10 mb-6 text-3xl font-semibold sm:mb-0" id="faqs">*/}
            {/*      Questions and answers*/}
            {/*    </h2>*/}
            {/*    <ul*/}
            {/*      role="list"*/}
            {/*      className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 space-y-6 lg:max-w-none"*/}
            {/*    >*/}
            {/*      <li>*/}
            {/*        <h3 className="text-lg font-semibold leading-6 text-gray-900">*/}
            {/*          How accurate is the forecast?*/}
            {/*        </h3>*/}
            {/*        <p className="mt-4 text-sm text-gray-700">*/}
            {/*          Energy price forecasts can provide useful insights into potential price*/}
            {/*          movements, but they are not always 100% accurate. While this energy price*/}
            {/*          forecast may not be perfect, it can still help you make informed decisions*/}
            {/*          about your energy usage and budget planning.*/}
            {/*        </p>*/}
            {/*      </li>*/}
            {/*      <li>*/}
            {/*        <h3 className="text-lg font-semibold leading-6 text-gray-900">*/}
            {/*          Is the forecast relevant for me?*/}
            {/*        </h3>*/}
            {/*        <p className="mt-4 text-sm text-gray-700">*/}
            {/*          Energy price forecasts are relevant for you to make informed decisions about*/}
            {/*          your energy usage and finances. By keeping an eye on energy price forecasts,*/}
            {/*          you can anticipate potential price increases, adjust your energy usage*/}
            {/*          accordingly, and potentially save money.*/}
            {/*        </p>*/}
            {/*      </li>*/}
            {/*      <li>*/}
            {/*        <h3 className="text-lg font-semibold leading-6 text-gray-900">*/}
            {/*          How is the forecast created?*/}
            {/*        </h3>*/}
            {/*        <p className="mt-4 text-sm text-gray-700">*/}
            {/*          Our forecast is a fundamental forecast model based on the principle of supply*/}
            {/*          and demand. The model attempts to predict future electricity prices by*/}
            {/*          analyzing the underlying factors that affect supply and demand. These factors*/}
            {/*          can include weather patterns, economic trends, fuel prices, generation*/}
            {/*          capacity, and transmission constraints.*/}
            {/*          <br />*/}
            {/*          <br />*/}
            {/*          The forecast model was created by Klas-Göran Flysjö who is an esteemed*/}
            {/*          professional in the energy sector, with a wealth of experience and expertise*/}
            {/*          in electrical engineering and energy technology. His extensive knowledge of*/}
            {/*          the industry has made him a sought-after authority in power trading, energy*/}
            {/*          forecasting, and more. In addition to his work as a control room technician*/}
            {/*          and operating engineer at nuclear and hydropower plants, Flysjö has held*/}
            {/*          managerial positions at several power trading companies. As a recognized*/}
            {/*          leader in the field, Klas-Göran Flysjö is a credible source of data and*/}
            {/*          insights for anyone looking to understand the complex world of energy and*/}
            {/*          power trading.*/}
            {/*        </p>*/}
            {/*      </li>*/}
            {/*    </ul>*/}
            {/*  </div>*/}
            {/*</section>*/}

            {/*<Footer />*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
