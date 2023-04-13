export interface CountryResponse {
  country_code: string;
  areas: AreaData[];
}

export interface AreaData {
  id: string;
  label: string;
  days: DayData[];
}

export interface DayData {
  date: string;
  data_points: DataPoint[];
}

export interface DataPoint {
  time: string;
  price: number;
}
//
// class ForecastManager {
//   private readonly countryResponse: CountryResponse;
//   private areas: Area[];
//
//   constructor(countryResponse: CountryResponse) {
//     this.countryResponse = countryResponse;
//     this.areas = countryResponse.areas.map(area => new Area(area));
//   }
//
//   get countyCode() {
//     return this.countryResponse.country_code;
//   }
// }
//
// class Area {
//   private readonly areaData: AreaData;
//   private readonly forecasts: DayForecast[];
//
//   constructor(areaData: AreaData) {
//     this.areaData = areaData;
//     this.forecasts = this.areaData.days.map(day => new DayForecast(day));
//   }
// }
//
// class DayForecast {
//   private readonly dayData: DayData;
//
//   constructor(dayData: DayData) {
//     this.dayData = dayData;
//   }
//
//   get date() {
//     return this.dayData.date;
//   }
//
//   get timeSpans() {
//
//   }
//
//   get highest() {
//     let high: DataPoint = this.dayData.data_points[0];
//     this.dayData.data_points.forEach(point => {
//       if (point.price > high.price) high = point;
//     })
//     return high;
//   }
//
//   get lowest() {
//     let low: DataPoint = this.dayData.data_points[0];
//     this.dayData.data_points.forEach(point => {
//       if (point.price < low.price) low = point;
//     })
//     return low;
//   }
// }
//
// class TimeSpan {
//   private readonly dataPoints: DataPoint[];
//   private readonly label: string;
//   private readonly average: string;
//
//   constructor(dataPoints: DataPoint[]) {
//     this.dataPoints = dataPoints;
//     this.label = dataPoints[0].time + '-' + dataPoints[dataPoints.length - 1].time;
//     this.average
//   }
//
//   get date() {
//     return this.dayData.date;
//   }
//
//   get timeSpans() {
//
//   }
//
//   get highest() {
//     let high: DataPoint = this.dayData.data_points[0];
//     this.dayData.data_points.forEach(point => {
//       if (point.price > high.price) high = point;
//     })
//     return high;
//   }
//
//   get lowest() {
//     let low: DataPoint = this.dayData.data_points[0];
//     this.dayData.data_points.forEach(point => {
//       if (point.price < low.price) low = point;
//     })
//     return low;
//   }
// }
//
//
// const DATA: CountryResponse = {
//   country_code: 'SE',
//   areas: [
//     {
//       id: '1',
//       label: 'SE01',
//       days: [
//         {
//           date: '2023/02/16',
//           data_points: [
//             {time: '00', price: 3446},
//             {time: '01', price: 3288},
//             {time: '02', price: 3197},
//             {time: '03', price: 3109},
//             {time: '04', price: 3330},
//             {time: '05', price: 4497},
//             {time: '06', price: 8436},
//             {time: '07', price: 10004},
//             {time: '08', price: 9147},
//             {time: '09', price: 7840},
//             {time: '10', price: 5815},
//             {time: '11', price: 5880},
//             {time: '12', price: 5739},
//             {time: '13', price: 5924},
//             {time: '14', price: 6532},
//             {time: '15', price: 8498},
//             {time: '16', price: 10129},
//             {time: '17', price: 10673},
//             {time: '18', price: 9209},
//             {time: '19', price: 7960},
//             {time: '20', price: 6840},
//             {time: '21', price: 5407},
//             {time: '22', price: 4672},
//             {time: '23', price: 4035},
//           ]
//         },
//         {
//           date: '2023/02/17',
//           data_points: [
//             {time: '00', price: 3854},
//             {time: '01', price: 3710},
//             {time: '02', price: 3807},
//             {time: '03', price: 4130},
//             {time: '04', price: 4797},
//             {time: '05', price: 6951},
//             {time: '06', price: 9366},
//             {time: '07', price: 10292},
//             {time: '08', price: 9578},
//             {time: '09', price: 8730},
//             {time: '10', price: 7588},
//             {time: '11', price: 6347},
//             {time: '12', price: 5131},
//             {time: '13', price: 4942},
//             {time: '14', price: 4749},
//             {time: '15', price: 4936},
//             {time: '16', price: 5020},
//             {time: '17', price: 4973},
//             {time: '18', price: 3925},
//             {time: '19', price: 3551},
//             {time: '20', price: 3313},
//             {time: '21', price: 3057},
//             {time: '22', price: 2842},
//             {time: '23', price: 2575},
//           ]
//         },
//         {
//           date: '2023/02/18',
//           data_points: [
//             {time: '00', price: 2370},
//             {time: '01', price: 2147},
//             {time: '02', price: 2048},
//             {time: '03', price: 2003},
//             {time: '04', price: 1780},
//             {time: '05', price: 1403},
//             {time: '06', price: 1679},
//             {time: '07', price: 2480},
//             {time: '08', price: 2863},
//             {time: '09', price: 2929},
//             {time: '10', price: 2554},
//             {time: '11', price: 2235},
//             {time: '12', price: 2050},
//             {time: '13', price: 2404},
//             {time: '14', price: 2617},
//             {time: '15', price: 3221},
//             {time: '16', price: 3598},
//             {time: '17', price: 3595},
//             {time: '18', price: 3461},
//             {time: '19', price: 3315},
//             {time: '20', price: 3279},
//             {time: '21', price: 3182},
//             {time: '22', price: 2914},
//             {time: '23', price: 2911},
//           ]
//         }
//       ]
//     }
//   ]
// }
