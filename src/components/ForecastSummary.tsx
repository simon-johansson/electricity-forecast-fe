import React, { FC, useMemo } from "react";
import { useAppSelector } from "../lib/store";
import {
  ArrowsInLineVertical,
  ChartLineDown,
  Icon,
  Mountains,
  PiggyBank,
  SealWarning,
} from "@phosphor-icons/react";
import ForecastManager from "../lib/ForecastManager";
import { format } from "date-fns";
import dateFormatOptions from "../lib/dateFormatOptions";

const ForecastSummary: FC<{}> = () => {
  const { regionData } = useAppSelector((state) => state.forecastSlice);
  const forecastManager = useMemo(() => {
    if (regionData) return new ForecastManager(regionData);
  }, [regionData]);

  if (!forecastManager) return null;

  const summaryPriceItems: {
    description: string;
    icon: Icon;
    value: JSX.Element;
    details?: string;
  }[] = [
    {
      description: "Genomsnittligt pris",
      icon: ArrowsInLineVertical,
      value: (
        <p className="text-xl font-semibold text-gray-900">
          {forecastManager.hoursPriceAverage.toFixed(2)}{" "}
          <span className="text-sm font-normal">{regionData!.currency}</span>
        </p>
      ),
      details: `${forecastManager.firstDay.formattedDateShort} - ${forecastManager.lastDay.formattedDateShort}`,
    },
    {
      description: "Högsta priset",
      icon: Mountains,
      value: (
        <p className="text-xl font-semibold text-gray-900">
          {format(
            Date.parse(forecastManager.hoursPriceHigh.time),
            "ccc 'kl' HH:mm",
            dateFormatOptions
          )}
        </p>
      ),
      details: `${forecastManager.hoursPriceHigh.price} ${regionData!.currency}`,
    },
    {
      description: "Lägsta priset",
      icon: ChartLineDown,
      value: (
        <p className="text-xl font-semibold text-gray-900">
          {format(
            Date.parse(forecastManager.hoursPriceLow.time),
            "ccc 'kl' HH:mm",
            dateFormatOptions
          )}
        </p>
      ),
      details: `${forecastManager.hoursPriceLow.price} ${regionData!.currency}`,
    },
  ];
  const summaryTimeItems: {
    description: string;
    icon: Icon;
    value: JSX.Element;
    details?: string;
  }[] = [
    {
      description: "Billigaste tiden i genomsnitt",
      icon: PiggyBank,
      value: (
        <p className="text-gray-900">
          <span className="text-xl font-semibold">
            {forecastManager.lowestAverageTimeSpan.time}
          </span>
          {/*<span className="ml-2 text-xs font-normal">(40 €/MWh)</span>*/}
        </p>
      ),
      details: `${forecastManager.lowestAverageTimeSpan.average.toFixed(2)} ${
        regionData!.currency
      }`,
    },
    {
      description: "Dyraste tiden i genomsnitt",
      icon: SealWarning,
      value: (
        <p className="text-gray-900">
          <span className="text-xl font-semibold">
            {forecastManager.highestAverageTimeSpan.time}
          </span>
        </p>
      ),
      details: `${forecastManager.highestAverageTimeSpan.average.toFixed(2)} ${
        regionData!.currency
      }`,
    },
  ];

  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">För nästa 5 dagar</h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {summaryPriceItems.map((item, index) => (
          <>
            <SummaryStat
              key={item.description}
              icon={item.icon}
              value={item.value}
              description={item.description}
              details={item.details}
            />
            {/*{index === 0 && (*/}
            {/*  <div className="flex h-20 sm:hidden">*/}
            {/*    <HorizontalBanner />*/}
            {/*  </div>*/}
            {/*)}*/}
          </>
        ))}
      </dl>

      {/*<div className="mt-5 flex h-20 md:hidden">*/}
      {/*  <HorizontalBanner />*/}
      {/*</div>*/}

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {summaryTimeItems.map((item) => (
          <SummaryStat
            key={item.description}
            icon={item.icon}
            value={item.value}
            description={item.description}
            details={item.details}
          />
        ))}
      </dl>
    </div>
  );
};

export default ForecastSummary;

const SummaryStat: FC<{ description: string; icon: Icon; value: JSX.Element; details?: string }> = (
  props
) => {
  return (
    <div className="relative flex items-center rounded-lg border border-black border-opacity-10 bg-white px-2 py-5 shadow-md">
      <div className="flex w-20 justify-center">
        <props.icon size={40} color="#0070bb" weight="duotone" />
      </div>
      <div className="flex flex-col space-y-1">
        <dt>
          <p className="font-medium text-gray-500">{props.description}</p>
        </dt>
        <dd className="flex">
          <p className="text-lg font-semibold text-gray-900">{props.value}</p>
        </dd>
        {props.details && (
          <dd className="flex">
            <p className="text-tiny text-gray-900">{props.details}</p>
          </dd>
        )}
      </div>
    </div>
  );
};
