import { FC, PropsWithChildren } from "react";
import { Disclosure } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import SearchArea from "./SearchArea";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { setForecastViewingMode, setIsSearchingLocation } from "../lib/slice";
import ForecastTable from "./ForecastTable";
import ForecastGraph from "./ForecastGraph";

const Layout: FC<PropsWithChildren> = (props) => {
  const { zone, isSearchingLocation, forecastViewingMode } = useAppSelector(
    (state) => state.forecastSlice
  );
  const dispatch = useAppDispatch();

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="border-b border-gray-200 bg-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      {/*<img className="block h-8 w-auto" src="/logo.png" />*/}
                      <figure className="h-8 w-8 rounded-full bg-indigo-700" />
                    </div>
                    <div className="flex sm:-my-px sm:ml-6 sm:space-x-8">
                      <p
                        className={
                          "inline-flex items-center pl-5 pt-1 text-base font-bold text-gray-500"
                        }
                      >
                        SE03 (Stockholm)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center sm:ml-6">
                    <button
                      type="button"
                      className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <MagnifyingGlassIcon
                        className="h-6 w-6"
                        onClick={() => dispatch(setIsSearchingLocation(true))}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>

        <SearchArea open={isSearchingLocation} />

        <div className="bg-gray-100 py-5">
          <main className="mx-auto max-w-7xl px-4 sm:px-6">
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
                  Tabell
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
                  Graf
                </button>
              </span>
            </div>

            {forecastViewingMode === "table" && <ForecastTable />}

            {forecastViewingMode === "graph" && <ForecastGraph />}

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
          </main>
          <section className="mt-20 border-t border-gray-200 bg-gray-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-3xl font-medium tracking-tight text-gray-900">
                  Frågor och svar
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  If you have anything else you want to ask,{" "}
                  <a className="text-gray-900 underline" href="mailto:info@example.com">
                    reach out to us
                  </a>
                  .
                </p>
              </div>
              <ul
                role="list"
                className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
              >
                <li>
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Hur säker är prognosen?
                  </h3>
                  <p className="mt-4 text-sm text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab blanditiis
                    consequatur distinctio et explicabo hic laborum, magni natus nesciunt pariatur
                    provident quaerat quo repellat sed tenetur ullam ut voluptatem voluptatibus!
                  </p>
                </li>
                <li>
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    För vem gäller prognosen?
                  </h3>
                  <p className="mt-4 text-sm text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab blanditiis
                    consequatur distinctio et explicabo hic laborum, magni natus nesciunt pariatur
                    provident quaerat quo repellat sed tenetur ullam ut voluptatem voluptatibus!
                  </p>
                </li>
                <li>
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Hur tas prognosen fram?
                  </h3>
                  <p className="mt-4 text-sm text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab blanditiis
                    consequatur distinctio et explicabo hic laborum, magni natus nesciunt pariatur
                    provident quaerat quo repellat sed tenetur ullam ut voluptatem voluptatibus!
                  </p>
                </li>
                <li>
                  <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Varför ska jag bry mig?
                  </h3>
                  <p className="mt-4 text-sm text-gray-700">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab blanditiis
                    consequatur distinctio et explicabo hic laborum, magni natus nesciunt pariatur
                    provident quaerat quo repellat sed tenetur ullam ut voluptatem voluptatibus!
                  </p>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Layout;