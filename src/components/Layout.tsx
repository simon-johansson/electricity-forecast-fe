import { FC, PropsWithChildren } from "react";
import { Disclosure } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SearchArea from "./SearchArea";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { setForecastViewingMode, setIsSearchingLocation } from "../lib/slice";
import ForecastTable from "./ForecastTable";
import ForecastGraph from "./ForecastGraph";
import { CircleFlag } from "react-circle-flags";
import Footer from "./Footer";

const Layout: FC<PropsWithChildren> = (props) => {
  const { selectedRegion, selectedCountry, isSearchingLocation, forecastViewingMode } =
    useAppSelector((state) => state.forecastSlice);
  const dispatch = useAppDispatch();

  if (!selectedCountry || !selectedRegion) return null;

  return (
    <div className="flex w-full">
      <Banner />
      <div className="z-10 m-auto min-w-0 max-w-4xl md:min-w-[768px]">
        <div className="min-h-full">
          <Disclosure as="nav" className="border-b border-gray-200 bg-white">
            {({ open }) => (
              <>
                <div className="grid grid-cols-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                  <div className="col-span-2 sm:col-span-1">
                    <h1 className="mb-4 font-semibold leading-6 sm:mb-0">
                      Energy Price Forecasts For Europe
                    </h1>
                  </div>
                  <div
                    className="col-span-2 flex justify-end sm:col-span-1"
                    onClick={() => dispatch(setIsSearchingLocation(true))}
                  >
                    <div className="flex w-full max-w-[400px] cursor-pointer justify-between rounded border border-black/30 px-2 py-1 sm:w-fit sm:justify-start">
                      <div className="flex">
                        <div className="flex flex-shrink-0 items-center">
                          <CircleFlag
                            countryCode={selectedCountry.isoCode.toLowerCase()}
                            className="h-5 w-5"
                          />
                        </div>

                        <div className="flex">
                          <p className="ml-3 inline-flex items-center whitespace-nowrap text-gray-500">
                            <span className="font-bold capitalize">
                              {selectedCountry.name.toLowerCase()}
                            </span>
                            {selectedCountry.regions.length > 1 && (
                              <span className="ml-2">({selectedRegion})</span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="ml-8 flex items-center">
                        <button
                          type="button"
                          className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <MagnifyingGlassIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Disclosure>

          <SearchArea open={isSearchingLocation} />

          <div className="bg-gray-100 py-5 pb-0">
            <main className="mx-auto max-w-screen-sm px-4 sm:px-6">
              <div className="flex items-center justify-center pb-5">
                <span className="isolate flex rounded-md shadow-sm">
                  <button
                    type="button"
                    onClick={() => dispatch(setForecastViewingMode("table"))}
                    className={`
                      relative inline-flex h-8 w-28 items-center justify-center rounded-l-md border border-gray-300 
                      px-4 py-2 text-sm font-medium text-gray-700 
                      focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
                      ${
                        forecastViewingMode === "table"
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }
                  `}
                  >
                    Table
                  </button>

                  <button
                    type="button"
                    onClick={() => dispatch(setForecastViewingMode("graph"))}
                    className={`relative -ml-px inline-flex h-8 w-28 items-center justify-center rounded-r-md border border-gray-300 
                    px-4 py-2 text-sm font-medium  
                    focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
                    ${
                      forecastViewingMode === "graph"
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }
                  `}
                  >
                    Chart
                  </button>
                </span>
              </div>

              {forecastViewingMode === "table" && <ForecastTable />}

              {forecastViewingMode === "graph" && <ForecastGraph />}
            </main>

            <section className="mt-20 border-t border-b border-gray-200 bg-gray-50 py-20">
              {/*<div className="w-full pt-8 ">*/}
              {/*  <h2 className="text-3xl font-bold">Frågor och svar</h2>*/}
              {/*  <div className="mt-4">*/}
              {/*    <Disclosure>*/}
              {/*      {({ open }) => (*/}
              {/*        <>*/}
              {/*          <Disclosure.Button className="flex w-full justify-between bg-white px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">*/}
              {/*            <span>What is your refund policy?</span>*/}
              {/*            <ChevronUpIcon*/}
              {/*              className={`${*/}
              {/*                open ? "rotate-180 transform" : ""*/}
              {/*              } h-5 w-5 text-purple-500`}*/}
              {/*            />*/}
              {/*          </Disclosure.Button>*/}
              {/*          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">*/}
              {/*            If you're unhappy with your purchase for any reason, email us within 90 days*/}
              {/*            and we'll refund you in full, no questions asked.*/}
              {/*          </Disclosure.Panel>*/}
              {/*        </>*/}
              {/*      )}*/}
              {/*    </Disclosure>*/}
              {/*    <Disclosure as="div" className="mt-2">*/}
              {/*      {({ open }) => (*/}
              {/*        <>*/}
              {/*          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">*/}
              {/*            <span>Do you offer technical support?</span>*/}
              {/*            <ChevronUpIcon*/}
              {/*              className={`${*/}
              {/*                open ? "rotate-180 transform" : ""*/}
              {/*              } h-5 w-5 text-purple-500`}*/}
              {/*            />*/}
              {/*          </Disclosure.Button>*/}
              {/*          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">*/}
              {/*            No.*/}
              {/*          </Disclosure.Panel>*/}
              {/*        </>*/}
              {/*      )}*/}
              {/*    </Disclosure>*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                  <h2 className="text-3xl font-medium tracking-tight text-gray-900">
                    Questions and answers
                  </h2>
                  {/*<p className="mt-2 text-lg text-gray-600">*/}
                  {/*  If you have anything else you want to ask,{" "}*/}
                  {/*  <a className="text-gray-900 underline" href="mailto:info@example.com">*/}
                  {/*    reach out to us*/}
                  {/*  </a>*/}
                  {/*  .*/}
                  {/*</p>*/}
                </div>
                <ul
                  role="list"
                  className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
                >
                  <li>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      How accurate is the forecast?
                    </h3>
                    <p className="mt-4 text-sm text-gray-700">
                      Energy price forecasts can provide useful insights into potential price
                      movements, but they are not always 100% accurate. While this energy price
                      forecast may not be perfect, it can still help you make informed decisions
                      about your energy usage and budget planning.
                    </p>
                  </li>
                  <li>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Is the forecast relevant for me?
                    </h3>
                    <p className="mt-4 text-sm text-gray-700">
                      Energy price forecasts are relevant for you to make informed decisions about
                      your energy usage and finances. By keeping an eye on energy price forecasts,
                      you can anticipate potential price increases, adjust your energy usage
                      accordingly, and potentially save money.
                    </p>
                  </li>
                  <li>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      How is the forecast created?
                    </h3>
                    <p className="mt-4 text-sm text-gray-700">
                      Our forecast is a fundamental forecast model based on the principle of supply
                      and demand. The model attempts to predict future electricity prices by
                      analyzing the underlying factors that affect supply and demand. These factors
                      can include weather patterns, economic trends, fuel prices, generation
                      capacity, and transmission constraints.
                    </p>
                  </li>
                  {/*<li>*/}
                  {/*  <h3 className="text-lg font-semibold leading-6 text-gray-900">*/}
                  {/*    How can I make use if the forecast?*/}
                  {/*  </h3>*/}
                  {/*  <p className="mt-4 text-sm text-gray-700">*/}
                  {/*    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab blanditiis*/}
                  {/*    consequatur distinctio et explicabo hic laborum, magni natus nesciunt pariatur*/}
                  {/*    provident quaerat quo repellat sed tenetur ullam ut voluptatem voluptatibus!*/}
                  {/*  </p>*/}
                  {/*</li>*/}
                </ul>
              </div>
            </section>

            <Footer />
          </div>
        </div>
      </div>
      <Banner />
    </div>
  );
};

export default Layout;

const Banner = () => {
  return (
    <div className="relative flex hidden min-h-fit w-full items-center justify-center overflow-hidden bg-red-400 md:flex">
      <p className="fixed top-1/2 -rotate-90 whitespace-nowrap text-8xl font-black text-white">
        REKLAM
      </p>
    </div>
  );
};
