import isValidDate from '../../src/utils/isValidDate';

it('should return false for invalid date as date', () => {
  const input = new Date('rubbish');

  const result = isValidDate(input);

  expect(result).toBeFalsy();
});

it('should return false for invalid date as string', () => {
  const input = 'rubbish';

  const result = isValidDate(input);

  expect(result).toBeFalsy();
});

it('should return false for invalid date as number', () => {
  const input = -100;

  const result = isValidDate(input);

  expect(result).toBeFalsy();
});

it('should return false for invalid date as undefined', () => {
  const input = undefined;

  const result = isValidDate(input);

  expect(result).toBeFalsy();
});

it('should return false for invalid date as null', () => {
  const input = null;

  const result = isValidDate(input);

  expect(result).toBeFalsy();
});

it('should return true for valid date as date', () => {
  const input = new Date();

  const result = isValidDate(input);

  expect(result).toBeTruthy();
});

it('should return true for valid date as string', () => {
  const input = '2020-12-04';

  const result = isValidDate(input);

  expect(result).toBeTruthy();
});

it('should return true for valid date as number', () => {
  const input = new Date().getTime();

  const result = isValidDate(input);

  expect(result).toBeTruthy();
});
