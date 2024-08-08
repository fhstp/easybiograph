// import * as d3 from "d3";

import { store } from "@/store";
import type { TimeLocaleDefinition } from "d3";
import de from "@/de";
import en from "@/en";

export function t(key: string): string {
  const lang = store.state.settings.language
  const trans: any = lang === 'de' ? de : en
  return trans[key]
}

// based on <https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940?permalink_comment_id=3052014#gistcomment-3052014>
export const debounce = <F extends (...args: any[]) => void>(
  func: F,
  waitFor: number
) => {
  let timeout: number = 0;

  const debounced = (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => void;
};

// based on <https://gist.github.com/woolfg/50b1ee17c8e4aa4c8a92>

// import * as d3 from "d3";

export const germanTimeFormat = {
  dateTime: "%a %b %e %X %Y",
  date: "%d.%m.%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ],
  shortDays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  months: [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  shortMonths: [
    "Jan",
    "Feb",
    "Mär",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ],
} as TimeLocaleDefinition;

export const englishTimeFormat = {
  dateTime: "%a %b %e %X %Y",
  date: "%m/%d/%Y",
  time: "%I:%M:%S %p",
  periods: ["AM", "PM"],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
} as TimeLocaleDefinition;

export function format(input: string): string {
  const month = Number(input.substring(5, 7));
  const year = Number(input.substring(0, 4));
  if (store.state.settings.language == "de") {
  return germanTimeFormat.shortMonths[month - 1] + " " + year;
  } else {
    return englishTimeFormat.shortMonths[month - 1] + " " + year;
  }
}

export function utcIncompleteDate(input: string): Date {
  // When the time zone offset is absent, date-only forms are interpreted as
  // a UTC time and date-time forms are interpreted as local time. This is due
  // to a historical spec error that was not consistent with ISO 8601 but could
  // not be changed due to web compatibility.
  return new Date(input);
}

export function utcIncompleteDateEnd(input: string): Date {
  const nextDate = new Date(input);
  if (input.length < 8) {
    nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
  } else {
    nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  }
  return nextDate;
  // return d3.utcMonth.ceil(new Date(new Date(input).getDate() + 1));
}
