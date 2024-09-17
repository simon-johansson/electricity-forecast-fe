import {
  LineSegment,
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryVoronoiContainer,
} from "victory";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useAppSelector } from "../lib/store";
import { DayData } from "../lib/slice";
import { BadgeCheap, BadgeExpensive } from "./ForecastTable";
import dateFormatOptions from "../lib/dateFormatOptions";

const ForecastGraph: FC<{}> = () => {
  const { regionData } = useAppSelector((state) => state.forecastSlice);
  const [day, setDay] = useState<DayData>(regionData!.days[0]);

  useEffect(() => {
    setDay(regionData!.days[0]);
  }, [regionData]);

  if (!regionData) return null;

  return (
    <div>
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="areaGradient" x2="0%" y2="100%">
            <stop offset="30%" stopColor="#0070bb" stopOpacity={0.1} />
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </linearGradient>

          <linearGradient id="lineGradient" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" stopOpacity={0} />
            <stop offset="40%" stopColor="transparent" stopOpacity={0} />
            <stop offset="40%" stopColor="#0070bb" stopOpacity={0.2} />
            <stop offset="60%" stopColor="#0070bb" stopOpacity={0.2} />
            <stop offset="60%" stopColor="transparent" stopOpacity={0} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      <div className="my-1">
        <DaySelector days={regionData!.days} selectedDay={day} setDay={setDay} />
      </div>

      <div className="m-auto flex select-none">
        <DayChart days={regionData!.days} selectedDay={day} currency={regionData.currency} />
      </div>
    </div>
  );
};

export default ForecastGraph;

const DayChart: FC<{
  days: DayData[];
  selectedDay: DayData;
  currency: string;
}> = ({ days, selectedDay, currency }) => {
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useCallback((node: Element) => {
    if (node !== null) {
      setBoundingRect(node.getBoundingClientRect());
    }
  }, []);

  const [domainYMin, domainYMax] = useMemo(() => {
    let min = 10000;
    let max = 0;
    days.forEach((day) => {
      day.series.forEach(({ price }) => {
        if (price && price < min) min = price;
        if (price && price > max) max = price;
      });
    });
    return [min!, max!];
  }, [days]);

  const [dayMin, dayMax, dayAverage] = useMemo(() => {
    let min = selectedDay.series[0];
    let max = selectedDay.series[0];
    let average = 0;
    let len = 0;
    selectedDay.series.forEach((s) => {
      const price = s.price;
      if (min.price === null || (price !== null && price < min.price)) min = s;
      if (max.price === null || (price !== null && price > max.price)) max = s;
      if (price !== null) {
        average += price;
        len++;
      }
    });
    return [min!, max!, average / len];
  }, [selectedDay]);

  const timeSeries = useMemo(() => {
    return selectedDay.series.map((val) => ({ x: Date.parse(val.time), y: val.price }));
  }, [selectedDay]);

  // @ts-ignore
  return (
    // @ts-ignore
    <div className="w-full" style={{ width: "100%", height: "100%" }} ref={graphRef}>
      <div className="mt-6 border-t border-black/10 pt-4 pb-2" />

      <div
        onTouchMove={() => setIsTouching(true)}
        onMouseOver={() => setIsTouching(true)}
        onTouchEnd={() => setIsTouching(false)}
        onMouseOut={() => setIsTouching(false)}
      >
        <VictoryChart
          padding={{ left: 35, top: 60, right: 10, bottom: 35 }}
          height={300}
          theme={{
            axis: {
              style: {
                axis: { fill: "transparent" },
                axisLabel: { fontFamily: "Inter", padding: 25 },
                grid: {
                  fill: "none",
                  stroke: "none",
                  pointerEvents: "painted",
                },
                ticks: {
                  fill: "transparent",
                  size: 1,
                  stroke: "transparent",
                },
                tickLabels: { fontFamily: "Inter", padding: 10 },
              },
            },
          }}
          width={boundingRect.width}
          domain={{ y: [domainYMin - domainYMax * 0.05, domainYMax + domainYMax * 0.05] }}
          scale={{ x: "time", y: "linear" }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              voronoiBlacklist={["areaBackground", "dayBars", "priceLine"]}
              labels={(data) => {
                const { datum } = data;
                if (isTouching) return datum.y;
                else return null;
              }}
              labelComponent={
                // @ts-ignore
                <CustomLine dayMax={dayMax} dayMin={dayMin} currency={currency} />
              }
            />
          }
        >
          <MyCustomLabel
            hide={isTouching}
            dayMax={dayMax}
            dayMin={dayMin}
            dayAverage={dayAverage}
            currency={currency}
          />

          <VictoryAxis
            dependentAxis
            axisComponent={<LineSegment style={{ opacity: 0.1 }} />}
            tickLabelComponent={<VictoryLabel dy={0} dx={5} />}
          />

          <VictoryAxis
            axisComponent={<LineSegment style={{ opacity: 0.1 }} />}
            offsetY={35}
            tickFormat={(t: Date) => {
              return format(t, "HH:mm");
            }}
            tickCount={boundingRect.width < 500 ? 4 : 6}
          />

          <VictoryArea
            name="areaBackground"
            interpolation="catmullRom"
            animate={{ duration: 500, onLoad: { duration: 0 } }}
            style={{
              data: { fill: "url(#areaGradient)" },
            }}
            data={timeSeries}
          />

          <VictoryLine
            name="priceLine"
            interpolation="catmullRom"
            animate={{ duration: 500, onLoad: { duration: 0 } }}
            style={{
              data: { stroke: "#0070bb", opacity: 0.6, strokeWidth: 4 },
            }}
            data={timeSeries}
          />

          <VictoryLine
            interpolation="catmullRom"
            style={{
              data: { stroke: "transparent", opacity: 0, strokeWidth: 4 },
            }}
            labels={({ datum }) => {
              if (datum.x === Date.parse(dayMax.time)) return "high";
              if (datum.x === Date.parse(dayMin.time)) return "low";
              return "";
            }}
            labelComponent={<CustomLabel dayMax={dayMax} dayMin={dayMin} />}
            data={timeSeries}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

const DaySelector: FC<{
  days: DayData[];
  selectedDay: DayData;
  setDay: (day: DayData) => void;
}> = ({ days, selectedDay, setDay }) => {
  return (
    <div className="flex flex-col space-y-3">
      <div className="flex justify-center space-x-5">
        {days.map((day) => {
          return (
            <DayButton key={day.date} day={day} isSelected={day === selectedDay} onClick={setDay} />
          );
        })}
      </div>
      <p className="text-center text-sm">
        {format(Date.parse(selectedDay.date), "EEEE, d LLLL yyyy", dateFormatOptions)}
      </p>
    </div>
  );
};

const DayButton: FC<{ day: DayData; isSelected: boolean; onClick: (day: DayData) => void }> = ({
  day,
  isSelected,
  onClick,
}) => {
  const date = Date.parse(day.date);
  return (
    <div
      className="flex cursor-pointer select-none flex-col items-center justify-center space-y-1"
      onClick={() => onClick(day)}
    >
      <span className="text-xs">{format(date, "EEEEE", dateFormatOptions)}</span>
      <span
        className={`
          flex h-8 w-8 items-center justify-center rounded-full p-2 text-sm
          ${isSelected ? "bg-primary text-white" : "bg-white text-black"}
          `}
      >
        {format(date, "d")}
      </span>
    </div>
  );
};

const CustomLabel = (props: any) => {
  const [show, setShow] = useState(false);
  const el = useMemo<JSX.Element | null>(() => {
    if (props.text(props) === "high") return <BadgeExpensive />;
    if (props.text(props) === "low") return <BadgeCheap />;
    return null;
  }, [props.text(props)]);

  useEffect(() => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
    }, 500);
  }, [props.x, props.y]);

  if (!el || !show) return null;
  return (
    <foreignObject x={props.x - 10} y={props.y - 10} width="20" height="20">
      {el}
    </foreignObject>
  );
};

const MyCustomLabel = (props: any) => {
  const low = props.dayMin.price <= 0 ? "≤0.0" : props.dayMin.price.toFixed(2);
  const high = props.dayMax.price <= 0 ? "≤0.0" : props.dayMax.price.toFixed(2);
  return (
    <foreignObject x={10} y={-7} width="100" height="50">
      <div className={`left w-full ${props.hide ? "hidden" : ""}`}>
        <span className="mr-1 text-lg font-semibold">{props.dayAverage.toFixed(2)}</span>
        <span className="text-xs">{props.currency}</span>
        <span className="block text-xs">
          <span className="mr-2">H:{high}</span>
          <span>L:{low}</span>
        </span>
      </div>
    </foreignObject>
  );
};

const CustomLine: FC = (props: any) => {
  if (props.text[0] === null) return null;

  let price = props.text[0];
  price = parseFloat(price) <= 0 ? "≤0.0" : parseFloat(price).toFixed(2);
  const time = format(props.datum.x, "HH:mm");
  const isMax = props.datum.y === props.dayMax.price;
  const isMin = props.datum.y === props.dayMin.price;
  const stroke = (() => {
    if (isMax) return "#ef4444";
    if (isMin) return "#22c55e";
    return "#0070bb";
  })();

  return (
    <>
      <foreignObject x={props.x - 40} y={10} width="100" height="40">
        <div className="w-full text-center">
          <span className="block text-xs">{time}</span>
          <span className="mr-1 text-lg font-semibold">{price}</span>
          <span className="text-xs">{props.currency}</span>
        </div>
      </foreignObject>
      <line
        x1={props.x}
        y1={60}
        x2={props.x}
        y2={265}
        stroke="#94a3b8"
        strokeWidth={3}
        strokeOpacity={0.5}
      />
      <circle
        cx={props.x}
        cy={props.y}
        r={isMax || isMin ? 8 : 5}
        fill={isMax || isMin ? "transparent" : "white"}
        stroke={stroke}
        strokeWidth={3}
      />
      {}
    </>
  );
};
