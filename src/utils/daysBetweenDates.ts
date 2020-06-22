export const MS_DAY = 60 * 60 * 24 * 1000;

function setTimeForDate(
  h: number,
  m: number,
  s: number,
  date: string | number | Date
) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m, s);
}

export default function daysBetweenDates(
  d1: string | number | Date,
  d2: string | number | Date
) {
  const a = setTimeForDate(0, 0, 0, d1).getTime();
  const b = setTimeForDate(23, 59, 59, d2).getTime();

  return Math.floor(b - a) / MS_DAY;
}
