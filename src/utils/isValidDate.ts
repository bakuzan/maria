export default function isValidDate(d: string | number | Date) {
  return (
    (d instanceof Date ||
      typeof d === 'string' ||
      (typeof d === 'number' && d >= 0)) &&
    !isNaN(new Date(d).getTime())
  );
}
