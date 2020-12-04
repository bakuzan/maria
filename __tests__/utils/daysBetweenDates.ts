import daysBetweenDates from '../../src/utils/daysBetweenDates';

it('should return difference between dates', () => {
  const d1 = new Date(2020, 12, 3, 0, 0, 0, 0);
  const d2 = new Date(2020, 12, 25, 0, 0, 0);

  const result = daysBetweenDates(d1, d2);

  expect(Math.floor(result)).toEqual(22);
});

it('should return difference between dates on same day', () => {
  const d1 = new Date(2020, 12, 3, 12, 0, 0, 0);
  const d2 = new Date(2020, 12, 3, 15, 0, 0, 0);

  const result = daysBetweenDates(d1, d2);

  expect(result < 1).toBeTruthy;
});
