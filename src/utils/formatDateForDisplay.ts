import { monthNames } from '@/consts';

const pad = (v: number) => `${v}`.padStart(2, '0');

export default function formatDateForDisplay(date: string | number | Date) {
  if (!date) {
    return '';
  }

  const d = new Date(date);
  return `${pad(d.getDate())} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}
