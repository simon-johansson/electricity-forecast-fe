import { FC, Fragment, PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CurrencyEuroIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Transition } from "@headlessui/react";
import { Sticky, StickyContainer } from "react-sticky";
import { useAppSelector } from "../lib/store";
import { format } from "date-fns";
import ForecastManager, { DayForecast } from "../lib/ForecastManager";

const ForecastTable: FC<{}> = () => {
  const { regionData } = useAppSelector((state) => state.forecastSlice);
  const forecastManager = useMemo(() => {
    if (regionData) return new ForecastManager(regionData);
  }, [regionData]);

  if (!forecastManager) return null;

  return (
    <div>
      <ul className="space-y-6">
        {forecastManager.days.map((dayForecast, index) => (
          <Fragment key={dayForecast.formattedDate}>
            <DayTable
              key={dayForecast.formattedDate}
              dayForecast={dayForecast}
              currency={forecastManager.currency}
            />
          </Fragment>
        ))}
      </ul>
    </div>
  );
};

export default ForecastTable;

const DayTable: FC<{ dayForecast: DayForecast; currency: string }> = ({
  dayForecast,
  currency,
}) => {
  const [viewHourly, setViewHourly] = useState<boolean>(false);
  const elRef = useRef<HTMLLIElement>(null);
  const scrollUp = () => {
    if (elRef.current) elRef.current.scrollIntoView();
  };

  useEffect(() => {
    setViewHourly(false);
  }, [dayForecast]);

  return (
    <li
      className="overflow-hidden rounded-md border border-black border-opacity-10 bg-white px-4 py-1 shadow-md"
      ref={elRef}
    >
      <StickyContainer>
        <ul>
          <li className="relative py-3">
            <Sticky topOffset={10}>
              {({ style }) => (
                <span style={style} className="z-30 bg-white font-bold">
                  {dayForecast.formattedDate}
                </span>
              )}
            </Sticky>
          </li>

          {viewHourly
            ? dayForecast.hours.map((hourValue) => {
                const priceComparedToMax = Math.round(
                  dayForecast.compareHoursPrice(hourValue.price ?? 0) * 100
                );
                let bgColor = "bg-green-300";
                if (priceComparedToMax > 30) bgColor = "bg-slate-300";
                if (priceComparedToMax > 80) bgColor = "bg-red-300";
                const additionalInfo = (
                  <div className="relative h-1 flex-1 rounded-full bg-black/5">
                    <figure
                      className={`absolute top-0 left-0 h-full rounded-full ${bgColor}`}
                      style={{ width: priceComparedToMax + "%" }}
                    ></figure>
                  </div>
                );

                if (hourValue.price === null) return null;

                return (
                  <TimeRow
                    key={hourValue.time}
                    time={format(Date.parse(hourValue.time), "HH")}
                    currency={currency}
                    price={hourValue.price}
                    additionalInfo={hourValue.price !== null ? additionalInfo : undefined}
                  />
                );
              })
            : dayForecast.timeSpans.map((timeSpan) => {
                const lowPriceComparedToMax = Math.round(
                  dayForecast.compareHoursPrice(timeSpan.priceLow.price ?? 0) * 100
                );
                const highPriceComparedToMax = Math.round(
                  dayForecast.compareHoursPrice(timeSpan.priceHigh.price ?? 0) * 100
                );
                const lowPriceLen = Math.round(timeSpan.priceLow.price ?? 0).toString().length;

                const priceLow = timeSpan.priceLow.price
                  ? timeSpan.priceLow.price.toFixed(2)
                  : null;
                const priceHigh = timeSpan.priceHigh.price
                  ? timeSpan.priceHigh.price.toFixed(2)
                  : null;

                const additionalInfo = (
                  <div className="relative h-1 flex-1 rounded-full bg-black/10">
                    <figure
                      className={`absolute top-0 h-full rounded-full bg-slate-400`}
                      style={{
                        left: lowPriceComparedToMax + "%",
                        width: highPriceComparedToMax - lowPriceComparedToMax + "%",
                      }}
                    ></figure>
                    <div
                      className={`absolute -top-[17px] flex items-center justify-between text-tiny text-slate-400 min-w[${
                        lowPriceLen > 2 ? 40 : 32
                      }px]`}
                      style={{
                        left: `${Math.min(lowPriceComparedToMax, 100)}%`,
                        right: `${Math.max(100 - highPriceComparedToMax, 2)}%`,
                      }}
                    >
                      <span className="mr-2">{priceLow !== null && priceLow}</span>
                      <span>{priceHigh !== null && priceHigh !== priceLow && priceHigh}</span>
                    </div>
                  </div>
                );

                if (timeSpan.priceHigh.price === 0 && timeSpan.priceLow.price === 0) {
                  return null;
                }

                return (
                  <TimeRow
                    key={timeSpan.formattedTime}
                    time={timeSpan.formattedTime}
                    price={timeSpan.averagePrice}
                    currency={currency}
                    priceHigh={timeSpan.priceHigh.price}
                    priceLow={timeSpan.priceLow.price}
                    additionalInfo={
                      timeSpan.priceHigh.price && timeSpan.priceLow.price
                        ? additionalInfo
                        : undefined
                    }
                  />
                );
              })}

          <ShowHourForHourRow
            expanded={viewHourly}
            onClick={() => {
              if (viewHourly) scrollUp();
              setViewHourly(!viewHourly);
            }}
          />
        </ul>
      </StickyContainer>
    </li>
  );
};

const TimeRow: FC<{
  time: string;
  price: number | null;
  currency: string;
  priceHigh?: number | null;
  priceLow?: number | null;
  hideBottomBorder?: boolean;
  textColor?: string;
  additionalInfo?: JSX.Element;
}> = (props) => {
  const [viewDetails, setViewDetails] = useState<boolean>(false);

  return (
    <li
      // onClick={() => setViewDetails(true)}
      className={`flex items-center py-3 ${
        props.hideBottomBorder ? "" : "border-b border-gray-200"
      }`}
    >
      <div className="flex w-[20%] max-w-[100px] items-center">
        <span className="w-12 text-center text-sm">{props.time}</span>
      </div>

      <div
        className={`relative col-span-3 flex flex-1 items-baseline  ${
          props.textColor ? props.textColor : "text-gray-900"
        }`}
      >
        <span className="relative inline-block min-w-[90px] text-lg font-semibold">
          {props.price !== null ? (
            <>
              {props.price.toFixed(2)}
              <span className="col-span-3 ml-1 mr-2 text-tiny font-light">{props.currency}</span>
            </>
          ) : (
            "-"
          )}
        </span>

        {props.additionalInfo}
      </div>

      <DetailedViewModal open={viewDetails} setOpen={setViewDetails}>
        <div>
          <Dialog.Title as="h3" className="font-bold leading-6">
            {props.time}
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you want to deactivate your account? All of your data will be permanently
              removed from our servers forever. This action cannot be undone.
            </p>
          </div>
        </div>
      </DetailedViewModal>
    </li>
  );
};

const ShowHourForHourRow: FC<{ expanded: boolean; onClick: () => void }> = (props) => {
  return (
    <li onClick={props.onClick}>
      <div className="flex w-full cursor-pointer items-center justify-center py-3 text-gray-500">
        {props.expanded ? (
          <>
            <span className="text-xs">Summary</span>
            <ChevronUpIcon className="ml-2 h-3 w-3" />
          </>
        ) : (
          <>
            <span className="text-xs">Timme för timme</span>
            <ChevronDownIcon className="ml-2 h-3 w-3" />
          </>
        )}
      </div>
    </li>
  );
};

const DetailedViewModal: FC<
  PropsWithChildren & { open: boolean; setOpen: (value: boolean) => void }
> = ({ open, setOpen, children }) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-start">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export const BadgeCheap: FC<{}> = () => {
  return (
    <span className="flex items-center rounded-full bg-green-100  text-xs font-medium text-green-800">
      <CurrencyEuroIcon className="h-5 w-5 text-green-500" />
    </span>
  );
};

export const BadgeExpensive: FC<{}> = () => {
  return (
    <span className="flex items-center rounded-full bg-red-100 text-xs font-medium text-red-800">
      <CurrencyEuroIcon className="h-5 w-5 text-red-500" />
    </span>
  );
};
