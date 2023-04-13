import {
  VictoryArea,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryZoomContainer,
} from "victory";
import React, { FC } from "react";
import { getHours } from "date-fns";

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
  return (
    <div>
      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="myGradient" x2="0%" y2="100%">
            <stop offset="30%" stopColor="#4f46e5" stopOpacity={0.1} />
            {/*<stop offset="30%" stopColor="transparent" stopOpacity={0} />*/}
            {/*<stop offset="90%" stopColor="white" stopOpacity={0} />*/}
            <stop offset="100%" stopColor="white" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

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
            data: { fill: "url(#myGradient)" },
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
    </div>
  );
};

export default ForecastGraph;
