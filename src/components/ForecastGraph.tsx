import {
  LineSegment,
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryVoronoiContainer,
  VictoryZoomContainer,
} from "victory";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { format, getHours } from "date-fns";
import { useAppSelector } from "../lib/store";
import { DayData } from "../lib/slice";
import { BadgeCheap, BadgeExpensive } from "./ForecastTable";
import { useWindowSize } from "react-use";

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

      <div className="m-auto flex select-none">
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
  const { width } = useWindowSize();
  // console.log(width);
  const [isTouching, setIsTouching] = useState<boolean>(false);
  const [hoverData, setHoverData] = useState<{ price?: number; time?: number }>({});
  const [boundingRect, setBoundingRect] = useState({ width: 0, height: 0 });
  const graphRef = useCallback((node: Element) => {
    if (node !== null) {
      setBoundingRect(node.getBoundingClientRect());
    }
  }, []);

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

  const [dayMin, dayMax, dayAverage] = useMemo(() => {
    let min: undefined | number;
    let max: undefined | number;
    let average = 0;
    selectedDay.series.forEach(({ price }) => {
      if (min === undefined || price < min) min = price;
      if (max === undefined || price > max) max = price;
      average += price;
    });
    return [min!, max!, average / selectedDay.series.length];
  }, [selectedDay]);

  const timeSeries = useMemo(() => {
    return selectedDay.series.map((val) => ({ x: Date.parse(val.time), y: val.price }));
  }, [selectedDay]);

  // console.log(boundingRect.width);

  // @ts-ignore
  return (
    // @ts-ignore
    <div className="w-full" style={{ width: "100%", height: "100%" }} ref={graphRef}>
      <div className="mt-10 border-t border-black/10 pt-4">
        {/*<div className={hoverData.price ? "invisible" : "visible"}>*/}
        {/*  <p>*/}
        {/*    <span className="mr-1 text-lg font-bold">{hoverData.price ? hoverData.price : 52}</span>*/}
        {/*    <span className="text-sm">€/MWh</span>*/}
        {/*  </p>*/}
        {/*  <p className="text-xs">*/}
        {/*    H: {Math.round(dayMax)} L: {Math.round(dayMin)}*/}
        {/*  </p>*/}
        {/*</div>*/}
      </div>

      <div
        onTouchMove={() => setIsTouching(true)}
        onMouseOver={() => setIsTouching(true)}
        onTouchEnd={() => setIsTouching(false)}
        onMouseOut={() => setIsTouching(false)}
      >
        <VictoryChart
          padding={{ left: 30, top: 60, right: 10, bottom: 35 }}
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
          // height={width > 1000 ? 200 : 300}
          domain={{ y: [domainYMin - 10, domainYMax + 10] }}
          // domainPadding={{ y: 10 }}
          scale={{ x: "time", y: "linear" }}
          containerComponent={
            // <VictoryCursorContainer
            //   cursorLabelComponent={<VictoryLabel y={50} dx={0} />}
            //   cursorLabel={({ datum }) => {
            //     console.log(datum.x);
            //     return `${Math.round(datum.y)}`;
            //   }}
            // />
            <VictoryVoronoiContainer
              // onActivated={() => console.log("active")}
              // onDeactivated={() => console.log("deactive")}
              voronoiDimension="x"
              // onActivated={() => console.log("onActivated")}
              // onDeactivated={() => console.log("onDeactivated")}
              voronoiBlacklist={["areaBackground", "dayBars", "priceLine"]}
              labels={(data) => {
                // console.log(data);
                const { datum } = data;
                // if (hoverData.time !== datum.x) {
                //   setHoverData({
                //     price: datum.y,
                //     time: datum.x,
                //   });
                // }
                // return datum.y;
                if (isTouching) return datum.y;
                else return null;
              }}
              // labelComponent={<VictoryLabel y={50} x={0} />}
              labelComponent={
                // @ts-ignore
                <CustomLine dayMax={dayMax} dayMin={dayMin} />
              }
              // labelComponent={
              //   <VictoryTooltip dy={-7} constrainToVisibleArea cornerRadius={0} pointerLength={5} />
              // }
            />
          }
          // theme={{ ...VictoryTheme.material, axis: { style: { grid: { stroke: "red" } } } }}
          // style={{ background: { stroke: "red" }, parent: { stroke: "black" } }}
          // containerComponent={
          //   <VictoryZoomContainer
          //     allowZoom={false}
          //     zoomDomain={{ x: [TIME_SERIES[0].x, TIME_SERIES[23].x] }}
          //   />
          // }
          // containerComponent={<VictoryContainer preserveAspectRatio="none" />}
        >
          {/*<foreignObject x={20} y={10} width="80" height="40">*/}
          {/*  <div className="w-full text-center">*/}
          {/*    <span className="block text-xs">time</span>*/}
          {/*    <span className="mr-1 text-lg font-semibold">52</span>*/}
          {/*    <span className="text-xs">€/MWh</span>*/}
          {/*  </div>*/}
          {/*</foreignObject>*/}

          {/*<VictoryBar*/}
          {/*  labels={() => "average"}*/}
          {/*  style={{ data: { fill: "transparent" } }}*/}
          {/*  labelComponent={<CustomLine />}*/}
          {/*  data={timeSeries}*/}
          {/*/>*/}

          <MyCustomLabel
            hide={isTouching}
            dayMax={dayMax}
            dayMin={dayMin}
            dayAverage={dayAverage}
          />

          {/*<VictoryLabel*/}
          {/*  text={"add labels"}*/}
          {/*  textComponent={*/}
          {/*    <foreignObject x={10} y={-7} width="80" height="50">*/}
          {/*      <div className="left w-full">*/}
          {/*        <span className="mr-1 text-lg font-semibold">87</span>*/}
          {/*        <span className="text-xs">€/MWh</span>*/}
          {/*        <span className="block text-xs">H:40 L:10</span>*/}
          {/*      </div>*/}
          {/*    </foreignObject>*/}
          {/*  }*/}
          {/*  x={0}*/}
          {/*  y={0}*/}
          {/*/>*/}

          {/*<WrapperComponent>*/}
          <VictoryAxis
            dependentAxis
            axisComponent={<LineSegment style={{ opacity: 0.1 }} />}
            tickLabelComponent={<VictoryLabel dy={0} dx={5} />}
            // style={{ ticks: { stroke: "red", size: 20 } }}
          />
          {/*</WrapperComponent>*/}

          <VictoryAxis
            axisComponent={<LineSegment style={{ opacity: 0.1 }} />}
            offsetY={35}
            // padding={{ left: 50 }}
            // scale={{ x: "time" }}
            // tickFormat={(t) => `${Math.round(t)}k`}
            tickFormat={(t: Date) => {
              return format(t, "HH:mm");
            }}
            tickCount={boundingRect.width < 500 ? 4 : 6}
            // tickValues={[2, 3, 4, 5]}
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
              data: { stroke: "#4f46e5", opacity: 0.6, strokeWidth: 4 },
            }}
            // labels={({ datum }) => datum.y}
            // labels={({ datum }) => {
            //   if (datum.y === dayMax) return "high";
            //   if (datum.y === dayMin) return "low";
            //   return "";
            // }}
            // labelComponent={<VictoryLabel />}
            // labelComponent={
            //   // <VictoryLabel
            //   //   style={{
            //   //     fontSize: "40px",
            //   //     lineHeight: 0,
            //   //     fill: "black",
            //   //     stroke: "#f3f4f6",
            //   //     strokeWidth: 4,
            //   //   }}
            //   //   dy={18}
            //   //   dx={(args) => {
            //   //     if (!args.text[0]) return -1000;
            //   //     return 0;
            //   //   }}
            //   // />
            //   <CustomLabel />
            // }
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

          <VictoryLine
            interpolation="catmullRom"
            // animate={{ duration: 500, onLoad: { duration: 0 } }}
            style={{
              data: { stroke: "transparent", opacity: 0, strokeWidth: 4 },
            }}
            labels={({ datum }) => {
              if (datum.y === dayMax) return "high";
              if (datum.y === dayMin) return "low";
              return "";
            }}
            labelComponent={<CustomLabel />}
            data={timeSeries}
          />

          {/*<VictoryBar*/}
          {/*  name="dayBars"*/}
          {/*  style={{*/}
          {/*    data: {*/}
          {/*      fill: "transparent",*/}
          {/*      width: 18,*/}
          {/*      // strokeWidth: 2,*/}
          {/*    },*/}
          {/*  }}*/}
          {/*  data={timeSeries.map((val) => ({ ...val, y: domainYMax + 5, label: "" }))}*/}
          {/*  labelComponent={<VictoryLabel y={50} dx={0} />}*/}
          {/*  events={[*/}
          {/*    {*/}
          {/*      target: "data",*/}
          {/*      eventHandlers: {*/}
          {/*        // onMouseEnter: (event, props) => {*/}
          {/*        //   console.log(props.index);*/}
          {/*        //   return [*/}
          {/*        //     {*/}
          {/*        //       target: "labels",*/}
          {/*        //       mutation: (props) => {*/}
          {/*        //         return { text: `${timeSeries[props.index].y}€` };*/}
          {/*        //       },*/}
          {/*        //     },*/}
          {/*        //     {*/}
          {/*        //       target: "data",*/}
          {/*        //       mutation: (props) => {*/}
          {/*        //         // return { style: { fill: "#4f46e5", opacity: 0.2, width: 18 } };*/}
          {/*        //         return {*/}
          {/*        //           style: {*/}
          {/*        //             fill: "url(#lineGradient)",*/}
          {/*        //             width: 18,*/}
          {/*        //           },*/}
          {/*        //         };*/}
          {/*        //       },*/}
          {/*        //     },*/}
          {/*        //   ];*/}
          {/*        // },*/}
          {/*        // onTouchMove: (event, props) => {*/}
          {/*        //   (document.activeElement as any).blur();*/}
          {/*        //   console.log(props.index);*/}
          {/*        //   return [*/}
          {/*        //     {*/}
          {/*        //       target: "labels",*/}
          {/*        //       mutation: (props) => {*/}
          {/*        //         return { text: `${timeSeries[props.index].y}€` };*/}
          {/*        //       },*/}
          {/*        //     },*/}
          {/*        //     {*/}
          {/*        //       target: "data",*/}
          {/*        //       mutation: (props) => {*/}
          {/*        //         // return { style: { fill: "#4f46e5", opacity: 0.2, width: 18 } };*/}
          {/*        //         return {*/}
          {/*        //           style: {*/}
          {/*        //             fill: "url(#lineGradient)",*/}
          {/*        //             width: 18,*/}
          {/*        //           },*/}
          {/*        //         };*/}
          {/*        //       },*/}
          {/*        //     },*/}
          {/*        //   ];*/}
          {/*        // },*/}
          {/*        // onMouseOut: (event, props) => {*/}
          {/*        //   // console.log(props.index);*/}
          {/*        //   return [*/}
          {/*        //     {*/}
          {/*        //       target: "labels",*/}
          {/*        //       mutation: (props) => {*/}
          {/*        //         return { text: "" };*/}
          {/*        //       },*/}
          {/*        //     },*/}
          {/*        //     {*/}
          {/*        //       target: "data",*/}
          {/*        //       mutation: (props) => {*/}
          {/*        //         return { style: { fill: "transparent", width: 18 } };*/}
          {/*        //       },*/}
          {/*        //     },*/}
          {/*        //   ];*/}
          {/*        // },*/}
          {/*      },*/}
          {/*    },*/}
          {/*  ]}*/}
          {/*/>*/}
        </VictoryChart>
      </div>
    </div>
  );
};

const ScrollableChart: FC = () => {
  return (
    <VictoryChart
      padding={{ left: 35, top: 10, right: 10, bottom: 35 }}
      height={450}
      domain={{ y: [0, 600] }}
      // scale={{ x: "time" }}
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
          return (
            <DayButton key={day.date} day={day} isSelected={day === selectedDay} onClick={setDay} />
          );
        })}
      </div>
      <p className="text-center text-sm">
        {format(Date.parse(selectedDay.date), "EEEE, d LLLL yyyy")}
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

const CustomLabel: FC = (props: any) => {
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
  // return (
  //   <text x={props.x} y={props.y} fill={"#ef4444"}>
  //     test
  //   </text>
  // );
  // return <circle cx={props.x} cy={props.y} r={10} fill={"#ef4444"} />;
  // return <circle cx={props.x} cy={props.y} r={8} fill={"#22c55e"} />;
};

const MyCustomLabel = (props: any) => {
  return (
    <foreignObject x={10} y={-7} width="80" height="50">
      <div className={`left w-full ${props.hide ? "hidden" : ""}`}>
        <span className="mr-1 text-lg font-semibold">{Math.round(props.dayAverage)}</span>
        <span className="text-xs">€/MWh</span>
        <span className="block text-xs">
          H:{Math.round(props.dayMax)} L:{Math.round(props.dayMin)}
        </span>
      </div>
    </foreignObject>
  );
};

const CustomLine: FC = (props: any) => {
  // return (
  //   <>
  //     <foreignObject x={props.x - 40} y={-30} width="80" height="40">
  //       <div>
  //         <p>
  //           <span className="mr-1 text-lg font-bold">52</span>
  //           <span className="text-sm">€/MWh</span>
  //         </p>
  //         <p className="text-xs">H: 10 L: 100</p>
  //       </div>
  //     </foreignObject>
  //   </>
  // );

  if (props.text[0] === null) return null;

  const price = Math.round(props.text[0]);
  const time = format(props.datum.x, "HH:mm");
  const isMax = props.datum.y === props.dayMax;
  const isMin = props.datum.y === props.dayMin;
  const stroke = (() => {
    if (isMax) return "#ef4444";
    if (isMin) return "#22c55e";
    return "#4f46e5";
  })();
  return (
    <>
      {/*<VictoryTooltip dy={-7} constrainToVisibleArea cornerRadius={0} pointerLength={5} />*/}
      <foreignObject x={props.x - 40} y={10} width="80" height="40">
        <div className="w-full text-center">
          <span className="block text-xs">{time}</span>
          <span className="mr-1 text-lg font-semibold">{price}</span>
          <span className="text-xs">€/MWh</span>
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

const ContainerWrapper: FC<any> = (props) => {
  console.log(props);
  return (
    <VictoryVoronoiContainer
      voronoiDimension="x"
      voronoiBlacklist={["areaBackground", "dayBars", "priceLine"]}
      labels={(data) => {
        const { datum } = data;
        // if (hoverData.time !== datum.x) {
        //   setHoverData({
        //     price: datum.y,
        //     time: datum.x,
        //   });
        // }
        return datum.y;
      }}
      // labelComponent={<VictoryLabel y={50} x={0} />}
      // @ts-ignore
      labelComponent={<CustomLine dayMax={100} dayMin={0} />}
      // labelComponent={
      //   <VictoryTooltip dy={-7} constrainToVisibleArea cornerRadius={0} pointerLength={5} />
      // }
    />
  );
};

class WrapperComponent extends React.Component {
  renderChildren() {
    // @ts-ignore
    const children = React.Children.toArray(this.props.children);
    return children.map((child) => {
      // @ts-ignore
      const style = { ...child.props.style, ...this.props.style };
      // @ts-ignore
      return React.cloneElement(child, Object.assign({}, child.props, this.props, { style }));
    });
  }

  render() {
    return (
      <g>
        <VictoryLabel text={"add labels"} x={110} y={30} />
        {this.renderChildren()}
      </g>
    );
  }
}
