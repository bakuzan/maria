import { monthNames } from '@/consts';

const pad = (v: number) => `${v}`.padStart(2, '0');

export default function formatDateForDisplay(
  date: string | number | Date,
  includeTime = false
) {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  let result = `${pad(d.getDate())} ${
    monthNames[d.getMonth()]
  } ${d.getFullYear()}`;

  if (includeTime) {
    result += ` ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
      d.getSeconds()
    )}`;
  }

  return result;
}
