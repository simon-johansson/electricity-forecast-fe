import { format, isToday, isTomorrow } from "date-fns";
import { sv } from "date-fns/locale";
import { DayData, HourValue, RegionData } from "./slice";
import dateFormatOptions from "./dateFormatOptions";

export default class ForecastManager {
  private readonly regionData: RegionData;
  public readonly days: DayForecast[];

  constructor(regionData: RegionData) {
    this.regionData = regionData;
    this.days = regionData.days.map((day) => new DayForecast(day, this));
  }

  get currency() {
    return this.regionData.currency;
  }

  get firstDay() {
    return this.days[0];
  }

  get lastDay() {
    return this.days[this.days.length - 1];
  }

  get timeSpanAverage() {
    const totalPerSpan: { time: string; total: number }[] = [];

    this.days.forEach((day) => {
      day.timeSpans.forEach((timeSpan, index) => {
        const total = totalPerSpan[index] ? totalPerSpan[index].total : 0;
        totalPerSpan[index] = {
          time: timeSpan.formattedTimeLong,
          total: total + timeSpan.averagePrice,
        };
      });
    });

    return totalPerSpan.map(({ total, time }) => {
      return {
        time,
        average: total / this.days.length,
      };
    });
  }

  get lowestAverageTimeSpan() {
    return this.timeSpanAverage.sort((a, b) => {
      if (a.average < b.average) return -1;
      if (a.average > b.average) return 1;
      return 0;
    })[0];
  }

  get highestAverageTimeSpan() {
    return this.timeSpanAverage.sort((a, b) => {
      if (a.average > b.average) return -1;
      if (a.average < b.average) return 1;
      return 0;
    })[0];
  }

  get hoursPriceAverage() {
    let total = 0;
    let numHours = 0;
    this.days.forEach((day) => {
      day.hours.forEach((hour) => {
        if (hour.price) {
          total += hour.price;
          numHours++;
        }
      });
    });
    return total / numHours;
  }

  get hoursPriceHigh() {
    let high = this.days[0].hoursPriceHigh;
    this.days.forEach((day) => {
      const { price } = day.hoursPriceHigh;
      if (high.price === null || (price !== null && price > high.price)) high = day.hoursPriceHigh;
    });
    return high;
  }

  get hoursPriceLow() {
    let low = this.days[0].hoursPriceLow;
    this.days.forEach((day) => {
      const { price } = day.hoursPriceLow;
      if (low.price === null || (price !== null && price < low.price)) low = day.hoursPriceLow;
    });
    return low;
  }
}

export class DayForecast {
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
    if (isToday(this.date)) return "Idag" + format(this.date, ", d LLL");
    if (isTomorrow(this.date)) return "Imorgon" + format(this.date, ", d LLL");
    return format(this.date, "cccc, d LLL", dateFormatOptions);
  }

  get formattedDateShort() {
    if (isToday(this.date)) return "Idag";
    if (isTomorrow(this.date)) return "Imorgon";
    return format(this.date, "d LLL");
  }

  get hours() {
    return this.dayData.series;
  }

  get hoursPriceHigh() {
    let high = this.hours[0];
    this.hours.forEach((val) => {
      if (high.price === null || (val.price !== null && val.price > high.price)) high = val;
    });
    return high;
  }

  get hoursPriceLow() {
    let low = this.hours[0];
    this.hours.forEach((val) => {
      if (low.price === null || (val.price !== null && val.price < low.price)) low = val;
    });
    return low;
  }

  public compareHoursPrice(price: number) {
    const low = this.forecastManager.hoursPriceLow.price || 0;
    const high = this.forecastManager.hoursPriceHigh.price || 0;
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

export class TimeSpan {
  private readonly hours: HourValue[];

  constructor(hours: HourValue[]) {
    this.hours = hours;
  }

  get formattedTime() {
    const getHours = (date: string) => {
      return format(Date.parse(date), "HH");
    };
    const start = getHours(this.hours[0].time);
    const end = getHours(this.hours[this.hours.length - 1].time);
    return `${start}-${end}`;
  }

  get formattedTimeLong() {
    const getHours = (date: string) => {
      return format(Date.parse(date), "HH:mm");
    };
    const start = getHours(this.hours[0].time);
    const end = getHours(this.hours[this.hours.length - 1].time);
    return `${start} - ${end}`;
  }

  get averagePrice() {
    let total = 0;
    let hours = 0;
    this.hours.forEach((hour) => {
      if (hour.price) {
        total += hour.price;
        hours++;
      }
    });
    const average = Number(total / hours);
    return isNaN(average) ? 0 : average;
  }

  get priceHigh() {
    let high = this.hours[0];
    this.hours.forEach((val) => {
      if (!high.price || (val.price && val.price > high.price)) high = val;
    });
    return high;
  }

  get priceLow() {
    let low = this.hours[0];
    this.hours.forEach((val) => {
      if (!low.price || (val.price && val.price < low.price)) low = val;
    });
    return low;
  }
}
