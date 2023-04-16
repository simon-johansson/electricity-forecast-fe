import {
  LineSegment,
  VictoryArea,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryContainer,
  VictoryLabel,
  VictoryLine,
  VictoryZoomContainer,
} from "victory";
import React, { FC, useEffect, useMemo, useState } from "react";
import { format, getHours } from "date-fns";
import { useAppSelector } from "../lib/store";
import { DayData } from "../lib/slice";

const getTimeSeries = (date: number) => {
  const series: { x: Date; y: number }[] = [];
  for (let hour = 0; hour <= 23; hour++) {
    series.push({ x: new Date(2023, 3, date, hour), y: getRandomInt(100, 500) });
  }
  return series;
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const TIME_SERIES = [
  ...getTimeSeries(6),
  ...getTimeSeries(7),
  ...getTimeSeries(8),
  ...getTimeSeries(9),
  ...getTimeSeries(10),
];

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
            <stop offset="30%" stopColor="#4f46e5" stopOpacity={0.1} />
            {/*<stop offset="30%" stopColor="transparent" stopOpacity={0} />*/}
            {/*<stop offset="90%" stopColor="white" stopOpacity={0} />*/}
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </linearGradient>

          <linearGradient id="lineGradient" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" stopOpacity={0} />
            <stop offset="40%" stopColor="transparent" stopOpacity={0} />
            <stop offset="40%" stopColor="#4f46e5" stopOpacity={0.2} />
            <stop offset="60%" stopColor="#4f46e5" stopOpacity={0.2} />
            <stop offset="60%" stopColor="transparent" stopOpacity={0} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      <div className="my-1">
        <DaySelector days={regionData!.days} selectedDay={day} setDay={setDay} />
      </div>

      <div className="m-auto flex">
        <DayChart days={regionData!.days} selectedDay={day} />
      </div>
    </div>
  );
};

export default ForecastGraph;

const DayChart: FC<{
  days: DayData[];
  selectedDay: DayData;
}> = ({ days, selectedDay }) => {
  const [domainYMin, domainYMax] = useMemo(() => {
    let min: undefined | number;
    let max: undefined | number;
    days.forEach((day) => {
      day.series.forEach(({ price }) => {
        if (!min || price < min) min = price;
        if (!max || price > max) max = price;
      });
    });
    return [min!, max!];
  }, [days]);

  const [dayMin, dayMax] = useMemo(() => {
    let min: undefined | number;
    let max: undefined | number;
    selectedDay.series.forEach(({ price }) => {
      if (!min || price < min) min = price;
      if (!max || price > max) max = price;
    });
    return [min!, max!];
  }, [selectedDay]);

  const timeSeries = useMemo(() => {
    return selectedDay.series.map((val) => ({ x: Date.parse(val.time), y: val.price }));
  }, [selectedDay]);

  return (
    <VictoryChart
      padding={{ left: 35, top: 50, right: 10, bottom: 35 }}
      // height={350}
      domain={{ y: [domainYMin - 10, domainYMax + 10] }}
      // domainPadding={{ y: 10 }}
      scale={{ x: "time" }}
      // theme={{ ...VictoryTheme.material, axis: { style: { grid: { stroke: "red" } } } }}
      // style={{ background: { stroke: "red" }, parent: { stroke: "black" } }}
      // containerComponent={
      //   <VictoryZoomContainer
      //     allowZoom={false}
      //     zoomDomain={{ x: [TIME_SERIES[0].x, TIME_SERIES[23].x] }}
      //   />
      // }
      // containerComponent={<VictoryContainer preserveAspectRatio="none" />}
      // events={[
      //   {
      //     childName: "all",
      //     target: "data",
      //     eventHandlers: {
      //       onClick: (event, props) => {
      //         console.log(event);
      //       },
      //     },
      //   },
      // ]}
    >
      <VictoryAxis
        dependentAxis
        axisComponent={<LineSegment style={{ opacity: 0.1 }} />}
        tickLabelComponent={<VictoryLabel dy={0} dx={5} />}
        // style={{ ticks: { stroke: "red", size: 20 } }}
      />

      <VictoryAxis
        axisComponent={<LineSegment style={{ opacity: 0.1 }} />}
        offsetY={35}
        scale={{ x: "time" }}
        // tickFormat={(t) => `${Math.round(t)}k`}
        tickFormat={(t: Date) => {
          return format(t, "HH");
        }}
        tickCount={6}
        // tickValues={[2, 3, 4, 5]}
      />

      <VictoryArea
        interpolation="catmullRom"
        animate={{ duration: 500, onLoad: { duration: 0 } }}
        style={{
          data: { fill: "url(#areaGradient)" },
        }}
        data={timeSeries}
      />

      <VictoryLine
        interpolation="catmullRom"
        animate={{ duration: 500, onLoad: { duration: 0 } }}
        style={{
          data: { stroke: "#4f46e5", opacity: 0.6, strokeWidth: 4 },
        }}
        // labels={({ datum }) => datum.y}
        labels={({ datum }) => {
          if (datum.y === dayMax) return "•";
          if (datum.y === dayMin) return "•";
          return "";
        }}
        // labelComponent={<VictoryLabel />}
        labelComponent={
          <VictoryLabel
            // backgroundStyle={{ fill: "#4f46e5", borderRadius: 10 }}
            // backgroundPadding={3}
            style={{
              fontSize: "40px",
              lineHeight: 0,
              fill: "black",
              stroke: "#f3f4f6",
              strokeWidth: 4,
            }}
            dy={18}
            dx={(args) => {
              if (!args.text[0]) return -1000;
              return 0;
            }}
          />
        }
        data={timeSeries}
        // events={[
        //   {
        //     target: "data",
        //     eventHandlers: {
        //       onMouseOver: (event, props) => {
        //         console.log(event);
        //         console.log(props);
        //       },
        //     },
        //   },
        // ]}
      />

      <VictoryBar
        style={{
          data: {
            fill: "transparent",
            width: 18,
            // strokeWidth: 2,
          },
        }}
        data={timeSeries.map((val) => ({ ...val, y: domainYMax + 5, label: "" }))}
        labelComponent={<VictoryLabel y={50} dx={0} />}
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: (event, props) => {
                // console.log(props.index);
                return [
                  {
                    target: "labels",
                    mutation: (props) => {
                      return { text: `${timeSeries[props.index].y}€` };
                    },
                  },
                  {
                    target: "data",
                    mutation: (props) => {
                      // return { style: { fill: "#4f46e5", opacity: 0.2, width: 18 } };
                      return {
                        style: {
                          fill: "url(#lineGradient)",
                          width: 18,
                        },
                      };
                    },
                  },
                ];
              },
              onMouseOut: (event, props) => {
                // console.log(props.index);
                return [
                  {
                    target: "labels",
                    mutation: (props) => {
                      return { text: "" };
                    },
                  },
                  {
                    target: "data",
                    mutation: (props) => {
                      return { style: { fill: "transparent", width: 18 } };
                    },
                  },
                ];
              },
            },
          },
        ]}
      />
    </VictoryChart>
  );
};

const ScrollableChart: FC = () => {
  return (
    <VictoryChart
      padding={{ left: 35, top: 10, right: 10, bottom: 35 }}
      height={450}
      domain={{ y: [0, 600] }}
      scale={{ x: "time" }}
      // theme={{ ...VictoryTheme.material, axis: { style: { grid: { stroke: "red" } } } }}
      // style={{ background: { stroke: "red" }, parent: { stroke: "black" } }}
      containerComponent={
        <VictoryZoomContainer
          allowZoom={false}
          zoomDomain={{ x: [TIME_SERIES[0].x, TIME_SERIES[23].x] }}
        />
      }
    >
      {/* Vertical bar indicating new day */}
      {TIME_SERIES.map((dataPoint, index) => {
        if (getHours(dataPoint.x) == 0) {
          return (
            // <VictoryBar
            //   style={{
            //     data: {
            //       fill: "transparent",
            //       width: 1,
            //       stroke: "#111111",
            //       strokeWidth: 2,
            //       strokeDasharray: 20,
            //       strokeDashoffset: 11,
            //       strokeOpacity: 0.2,
            //     },
            //   }}
            //   data={[{ x: dataPoint.x, y: 1000 }]}
            // />

            // <VictoryAxis
            //   // label="Label"
            //   style={
            //     {
            //       // axis: { stroke: "#756f6a" },
            //       // axisLabel: { fontSize: 20, padding: 30 },
            //       // grid: { stroke: ({ tick }: any) => (tick > 0.5 ? "red" : "grey") },
            //       // ticks: { stroke: "grey", size: 5 },
            //       // tickLabels: { fontSize: 15, padding: 5 },
            //     }
            //   }
            // />

            <VictoryLine
              style={{
                data: {
                  width: 1,
                  stroke: "tomato",
                  strokeWidth: 2,
                  strokeDasharray: 15,
                  strokeDashoffset: 11,
                  // strokeOpacity: 0.7,
                },
              }}
              // labels={({ datum }) => {
              //   if (datum.y > 500) return "💵";
              //   if (datum.y < 130) return "😊";
              //   return "";
              // }}
              // labelComponent={<VictoryLabel dy={-20} dx={10} />}
              data={[
                { x: dataPoint.x, y: 0 },
                { x: dataPoint.x, y: 1000 },
              ]}
            />
          );
        }
        return null;
      })}

      <VictoryArea
        interpolation="natural"
        style={{
          data: { fill: "url(#areaGradient)" },
        }}
        data={TIME_SERIES}
      />

      <VictoryLine
        interpolation="natural"
        style={{
          data: { stroke: "#4f46e5", strokeWidth: 2 },
        }}
        // labels={({ datum }) => datum.y}
        // labels={({ datum }) => {
        //   if (datum.y > 500) return "💵";
        //   if (datum.y < 130) return "😊";
        //   return "";
        // }}
        // labelComponent={<VictoryLabel />}
        // labelComponent={<VictoryLabel dy={-20} dx={10} />}
        data={TIME_SERIES}
      />
    </VictoryChart>
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
          return <DayButton day={day} isSelected={day === selectedDay} onClick={setDay} />;
        })}
      </div>
      <p className="text-center">{format(Date.parse(selectedDay.date), "EEEE, d LLLL yyyy")}</p>
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
      <span className="text-xs">{format(date, "EEEEE")}</span>
      <span
        className={`
          flex h-8 w-8 items-center justify-center rounded-full p-2 text-sm
          ${isSelected ? "bg-indigo-700 text-white" : "bg-white text-black"}
          `}
      >
        {format(date, "d")}
      </span>
    </div>
  );
};
