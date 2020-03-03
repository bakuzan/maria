export default function isValidDate(d: string | number | Date) {
  return d instanceof Date && !isNaN(new Date(d).getTime());
}
