// import * as d3 from "d3";

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
};

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
