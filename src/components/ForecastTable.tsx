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
import { DayData, HourValue, RegionData } from "../lib/slice";
import { format, isToday, isTomorrow } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";

class ForecastManager {
  private readonly regionData: RegionData;
  public readonly days: DayForecast[];

  constructor(regionData: RegionData) {
    this.regionData = regionData;
    this.days = regionData.days.map((day) => new DayForecast(day, this));
  }

  get hoursPriceHigh() {
    let high = this.days[0].hoursPriceHigh;
    this.days.forEach((day) => {
      if (day.hoursPriceHigh.price > high.price) high = day.hoursPriceHigh;
    });
    return high;
  }

  get hoursPriceLow() {
    let low = this.days[0].hoursPriceLow;
    this.days.forEach((day) => {
      if (day.hoursPriceLow.price < low.price) low = day.hoursPriceLow;
    });
    return low;
  }
}

class DayForecast {
  private readonly dayData: DayData;
  private readonly date: number;
  private readonly forecastManager: ForecastManager;
  public readonly timeSpans: TimeSpan[];

  constructor(dayData: DayData, forecastManager: ForecastManager) {
    this.dayData = dayData;
    this.date = Date.parse(dayData.date);
    this.forecastManager = forecastManager;

    const hourChunks: Array<HourValue[]> = [];
    const spanSize = 6;
    for (let i = 0; i < dayData.series.length; i += spanSize) {
      const chunk = dayData.series.slice(i, i + spanSize);
      hourChunks.push(chunk);
    }
    this.timeSpans = hourChunks.map((span) => new TimeSpan(span));
  }

  get formattedDate() {
    if (isToday(this.date)) return "Today" + format(this.date, ", d LLL");
    if (isTomorrow(this.date)) return "Tomorrow" + format(this.date, ", d LLL");
    return format(this.date, "cccc, d LLL");
  }

  get hours() {
    return this.dayData.series;
  }

  get hoursPriceHigh() {
    let high = this.hours[0];
    this.hours.forEach((val) => {
      if (val.price > high.price) high = val;
    });
    return high;
  }

  get hoursPriceLow() {
    let low = this.hours[0];
    this.hours.forEach((val) => {
      if (val.price < low.price) low = val;
    });
    return low;
  }

  public compareHoursPrice(price: number) {
    const low = this.forecastManager.hoursPriceLow.price;
    const high = this.forecastManager.hoursPriceHigh.price;
    return (price - low) / (high - low);
  }

  get timeSpanPriceHigh() {
    let high = this.timeSpans[0];
    this.timeSpans.forEach((span) => {
      if (span.averagePrice > high.averagePrice) high = span;
    });
    return high;
  }

  get timeSpanPriceLow() {
    let low = this.timeSpans[0];
    this.timeSpans.forEach((span) => {
      if (span.averagePrice < low.averagePrice) low = span;
    });
    return low;
  }
}

class TimeSpan {
  private readonly hours: HourValue[];

  // private readonly date: number;

  constructor(hours: HourValue[]) {
    this.hours = hours;
    // this.date = Date.parse(hours.);
  }

  get formattedTime() {
    const getHours = (date: string) => {
      return format(Date.parse(date), "HH");
    };
    const start = getHours(this.hours[0].time);
    const end = getHours(this.hours[this.hours.length - 1].time);
    return `${start}-${end}`;
  }

  get averagePrice() {
    let total = 0;
    this.hours.forEach((hour) => (total += hour.price));
    return Math.floor(total / this.hours.length);
  }

  get priceHigh() {
    let high = this.hours[0];
    this.hours.forEach((val) => {
      if (val.price > high.price) high = val;
    });
    return high;
  }

  get priceLow() {
    let low = this.hours[0];
    this.hours.forEach((val) => {
      if (val.price < low.price) low = val;
    });
    return low;
  }
}

const ForecastTable: FC<{}> = () => {
  const { regionData } = useAppSelector((state) => state.forecastSlice);
  const forecastManager = useMemo(() => {
    if (regionData) return new ForecastManager(regionData);
  }, [regionData]);

  if (!forecastManager) return null;

  return (
    <div>
      <ul className="space-y-3">
        {forecastManager.days.map((dayForecast) => (
          <DayTable key={dayForecast.formattedDate} dayForecast={dayForecast} />
        ))}
      </ul>
    </div>
  );
};

export default ForecastTable;

const DayTable: FC<{ dayForecast: DayForecast }> = ({ dayForecast }) => {
  const [viewHourly, setViewHourly] = useState<boolean>(false);
  const elRef = useRef<HTMLLIElement>(null);
  const scrollUp = () => {
    if (elRef.current) elRef.current.scrollIntoView();
  };

  useEffect(() => {
    setViewHourly(false);
  }, [dayForecast]);

  return (
    <li className="overflow-hidden rounded-md bg-white px-4 py-1 shadow" ref={elRef}>
      <StickyContainer>
        <ul>
          <li className="relative py-3">
            <Sticky topOffset={10}>
              {({
                style,

                // the following are also available but unused in this example
                isSticky,
                wasSticky,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight,
              }) => (
                <span style={style} className="z-30 bg-white font-bold">
                  {dayForecast.formattedDate}
                </span>
              )}
            </Sticky>
          </li>

          {/* description header */}
          {/*<li className="flex items-center">*/}
          {/*  <span className="w-[27%] max-w-[100px] text-xs font-light">*/}
          {/*    <ClockIcon className="ml-4 h-4 w-4" />*/}
          {/*  </span>*/}
          {/*  <span className="col-span-3 text-xs font-light">€/MWh</span>*/}
          {/*</li>*/}

          {viewHourly ? (
            <>
              {/*<TimeRow*/}
              {/*  time="00"*/}
              {/*  price={54}*/}
              {/*  textColor="text-green-500"*/}
              {/*  additionalInfo={<BadgeCheap />}*/}
              {/*/>*/}
              {/*<TimeRow time="01" price={56} />*/}
              {/*<TimeRow time="02" price={70} />*/}
              {/*<TimeRow time="03" price={23} />*/}
              {/*<TimeRow time="04" price={65} />*/}
              {/*<TimeRow time="05" price={60} />*/}
              {/*<TimeRow time="06" price={67} />*/}
              {/*<TimeRow time="07" price={60} />*/}
              {/*<TimeRow time="08" price={60} />*/}
              {/*<TimeRow time="09" price={60} />*/}
              {/*<TimeRow time="10" price={60} />*/}
              {/*<TimeRow time="11" price={60} />*/}
              {/*<TimeRow time="12" price={60} />*/}
              {/*<TimeRow time="13" price={60} />*/}
              {/*<TimeRow time="14" price={60} />*/}
              {/*<TimeRow time="15" price={60} />*/}
              {/*<TimeRow time="16" price={60} />*/}
              {/*<TimeRow time="17" price={60} />*/}
              {/*<TimeRow time="18" price={60} />*/}
              {/*<TimeRow*/}
              {/*  time="19"*/}
              {/*  price={60}*/}
              {/*  textColor="text-red-500"*/}
              {/*  additionalInfo={<BadgeExpensive />}*/}
              {/*/>*/}
              {/*<TimeRow time="20" price={60} />*/}
              {/*<TimeRow time="21" price={60} />*/}
              {/*<TimeRow time="22" price={60} />*/}
              {/*<TimeRow time="23" price={60} />*/}
              {dayForecast.hours.map((hourValue) => {
                // const additionalInfo = (() => {
                //   if (hourValue === dayForecast.hoursPriceHigh) return <BadgeExpensive />;
                //   if (hourValue === dayForecast.hoursPriceLow) return <BadgeCheap />;
                //   return undefined;
                // })();

                const priceComparedToMax = Math.round(
                  dayForecast.compareHoursPrice(hourValue.price) * 100
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

                return (
                  <TimeRow
                    key={hourValue.time}
                    time={format(Date.parse(hourValue.time), "HH")}
                    price={hourValue.price}
                    additionalInfo={additionalInfo}
                  />
                );
              })}
            </>
          ) : (
            <>
              {/*<TimeRow*/}
              {/*  time="00-06"*/}
              {/*  price={54}*/}
              {/*  textColor="text-green-500"*/}
              {/*  // additionalInfo={<BadgeCheap />}*/}
              {/*/>*/}
              {/*<TimeRow time="06-12" price={56} />*/}
              {/*<TimeRow*/}
              {/*  time="12-18"*/}
              {/*  price={70}*/}
              {/*  textColor="text-red-500"*/}
              {/*  additionalInfo={<BadgeExpensive />}*/}
              {/*/>*/}
              {/*<TimeRow time="18-00" price={60} />*/}
              {dayForecast.timeSpans.map((timeSpan) => {
                // let textColor = "";
                // if (timeSpan === dayForecast.timeSpanPriceHigh) textColor = "text-red-500";
                // if (timeSpan === dayForecast.timeSpanPriceLow) textColor = "text-green-500";
                // const additionalInfo = (() => {
                //   if (timeSpan === dayForecast.timeSpanPriceHigh) return <BadgeExpensive />;
                //   if (timeSpan === dayForecast.timeSpanPriceLow) return <BadgeCheap />;
                //   return undefined;
                // })();

                const lowPriceComparedToMax = Math.round(
                  dayForecast.compareHoursPrice(timeSpan.priceLow.price) * 100
                );
                const highPriceComparedToMax = Math.round(
                  dayForecast.compareHoursPrice(timeSpan.priceHigh.price) * 100
                );
                const additionalInfo = (
                  <div className="relative h-1 flex-1 rounded-full bg-black/10">
                    <figure
                      className={`absolute top-0 h-full rounded-full bg-slate-400`}
                      style={{
                        left: lowPriceComparedToMax + "%",
                        width: highPriceComparedToMax - lowPriceComparedToMax + "%",
                      }}
                    ></figure>
                  </div>
                );

                return (
                  <TimeRow
                    key={timeSpan.formattedTime}
                    time={timeSpan.formattedTime}
                    price={timeSpan.averagePrice}
                    priceHigh={timeSpan.priceHigh.price}
                    priceLow={timeSpan.priceLow.price}
                    additionalInfo={additionalInfo}
                  />
                );
              })}
            </>
          )}
          <ShowHourForHourRow
            expanded={viewHourly}
            onClick={() => {
              if (viewHourly) {
                scrollUp();
              }
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
  price: number;
  priceHigh?: number;
  priceLow?: number;
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
      <div className="flex w-[27%] max-w-[100px] items-center">
        <span className="w-12 text-center text-sm">{props.time}</span>
      </div>

      <div
        className={`relative col-span-3 flex flex-1 items-center  ${
          props.textColor ? props.textColor : "text-gray-900"
        }`}
      >
        <span className="relative inline-block min-w-[90px] text-lg font-semibold">
          {/*<div className="absolute -top-[10px] -right-[0px]">{props.additionalInfo}</div>*/}
          {Math.floor(props.price)}
          {/*{props.priceLow ? Math.floor(props.priceLow) : Math.floor(props.price)}*/}
          <span className="col-span-3 ml-1 text-tiny font-light">€/MWh</span>
        </span>

        {/*<Tooltip open placement="top-start">*/}
        {/*  <TooltipTrigger>Test</TooltipTrigger>*/}
        {/*  <TooltipContent>This is a test</TooltipContent>*/}
        {/*</Tooltip>*/}

        {props.additionalInfo}

        {/*{props.priceHigh && (*/}
        {/*  <span className="relative inline-block min-w-[45px] text-right text-lg font-semibold">*/}
        {/*    {Math.floor(props.priceHigh)}*/}
        {/*  </span>*/}
        {/*)}*/}

        {/*{typeof props.priceHigh !== "undefined" && typeof props.priceLow !== "undefined" && (*/}
        {/*  <span className="text-tiny font-light text-gray-500">*/}
        {/*    {Math.floor(props.priceLow)}-{Math.floor(props.priceHigh)}*/}
        {/*  </span>*/}
        {/*)}*/}

        {/*<div className="relative h-1 flex-1 rounded-full bg-black/5">*/}
        {/*  <figure className="absolute top-0 left-0 h-full w-[40px] rounded-full bg-red-300"></figure>*/}
        {/*</div>*/}
      </div>

      {/*<div className="flex items-center justify-end">*/}
      {/*{props.additionalInfo}*/}
      {/*<div>*/}
      {/*  <ChevronRightIcon className="ml-3 h-5 w-5 text-gray-400" />*/}
      {/*</div>*/}
      {/*</div>*/}
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
            <span className="text-xs">Hourly</span>
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
      {/*<CurrencyDollarIcon className="h-5 w-5 text-green-500" />*/}
      <CurrencyEuroIcon className="h-5 w-5 text-green-500" />
      {/*Low*/}
    </span>
  );
};

export const BadgeExpensive: FC<{}> = () => {
  return (
    <span className="flex items-center rounded-full bg-red-100 text-xs font-medium text-red-800">
      {/*<CurrencyDollarIcon className="h-5 w-5 text-red-500" />*/}
      <CurrencyEuroIcon className="h-5 w-5 text-red-500" />
      {/*High*/}
    </span>
  );
};
