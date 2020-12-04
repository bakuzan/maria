import formatDuration from '../../src/utils/formatDuration';

it('should return correctly formatted duration - days', () => {
  const days = 1;

  const result = formatDuration(days);

  expect(result).toEqual(`1 day`);
});

it('should return correctly formatted duration - weeks', () => {
  const days = 9;

  const result = formatDuration(days);

  expect(result).toEqual(`9 days`);
});

it('should return correctly formatted duration - months', () => {
  const days = 192;

  const result = formatDuration(days);

  expect(result).toEqual(`6 months, 9 days`);
});

it('should return correctly formatted duration - years', () => {
  const days = 567;

  const result = formatDuration(days);

  expect(result).toEqual(`1 year, 6 months, 19 days`);
});
