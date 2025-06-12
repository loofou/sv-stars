/**
 * adjusted from https://github.com/gordonhart/atlasof.space/
 * @license APACHE-2.0
 */

export type Epoch = {
  name: string;
  year: number;
  month: number; // index, e.g. January = 0
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export enum Time {
  SECOND = 1,
  MINUTE = 60 * SECOND,
  HOUR = 60 * MINUTE,
  DAY = 24 * HOUR,
  WEEK = 7 * DAY,
  MONTH = 30.436875 * DAY,
  YEAR = 365.25 * DAY,
}

export const J2000: Epoch = {
  name: 'J2000',
  year: 2000,
  month: 0, // month index
  day: 1,
  hour: 12,
  minute: 0,
  second: 0,
};
// const JD_J2000 = 2451545.0; // Julian days since January 1, 4713 BCE, at noon (UTC)
const JD_UNIX_EPOCH = 2440588; // 1970-01-01, the Unix epoch

export function julianDayToEpoch(name: `JD${string}`): Epoch {
  const jd = Number(name.slice(2, name.length));
  const date = new Date((jd - JD_UNIX_EPOCH) * Time.DAY * 1000); // convert into calendar days
  return dateToEpoch(name, date);
}

export function dateToEpoch(name: string, date: Date): Epoch {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  const second = date.getUTCSeconds();
  return { name, year, month, day, hour, minute, second };
}

export function epochToDate({ year, month, day, hour, minute, second }: Epoch): Date {
  return new Date(Date.UTC(year, month, day, hour, minute, second));
}

export function nowEpoch(): Epoch {
  const now = new Date();
  return dateToEpoch(dateToJulianDay(now), now);
}

export function startEpoch(): Epoch {
  const start = new Date(Date.UTC(2300, 0, 1, 12, 0, 0)); // January 1, 2300, at noon UTC
  return dateToEpoch(dateToJulianDay(start), start);
}

export function dateToJulianDay(date: Date): `JD${string}` {
  const { year, month: monthIndex, day, hour, minute, second } = dateToEpoch('', date);
  const month = monthIndex + 1; // JavaScript months are 0-based
  const millisecond = date.getUTCMilliseconds();

  const decimalDay = day + hour / 24.0 + minute / 1440.0 + second / 86400.0 + millisecond / 86400000.0;
  // Handle January and February special case
  const [y, m] = month <= 2 ? [year - 1, month + 12] : [year, month];

  // Calculate A and B terms for Gregorian calendar
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + decimalDay + B - 1524.5;
  return `JD${jd}`;
}

export function dateToISO(date: Date): string {
  return date.toISOString().split('T')[0] ?? '';
}

export function dateToHumanReadable(date: Date): string {
  return date.toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function datetimeToHumanReadable(date: Date): string {
  const datePart = date.toLocaleString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // use 24-hour format
  });
  return `${datePart} UTC`;
}

export function humanTimeUnits(t: number, includeWeekAndMonth = false): [number, string] {
  const tAbs = Math.abs(t);
  if (tAbs < Time.MINUTE) {
    return [t, 's'];
  } else if (tAbs < Time.HOUR) {
    return [t / Time.MINUTE, 'm'];
  } else if (tAbs < Time.DAY) {
    return [t / Time.HOUR, 'h'];
  } else if (tAbs < (includeWeekAndMonth ? Time.WEEK : Time.YEAR)) {
    return [t / Time.DAY, 'd'];
  } else if (includeWeekAndMonth && tAbs < Time.MONTH) {
    return [t / Time.WEEK, 'w'];
  } else if (includeWeekAndMonth && tAbs < Time.YEAR) {
    return [t / Time.MONTH, 'M'];
  } else {
    return [t / Time.YEAR, 'y'];
  }
}

export function humanTime(t: number, includeWeekAndMonth = false): string {
  const [value, unit] = humanTimeUnits(t, includeWeekAndMonth);
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  const roundedValue = Math.round(absValue);
  return `${sign}${roundedValue} ${unit}${roundedValue !== 1 ? 's' : ''}`;
}
