import {
  mockDateTimeLocal,
  mockFromJSDate,
  mockFromObject
} from '../../__mocks__/luxon';

import timezoneConversion from '../../src/utils/timezoneConversion';

it('should return invalid input message - empty string', () => {
  const result = timezoneConversion('');

  expect(result.success).toBeFalsy();
  expect(result.errorMessage).not.toBeUndefined();
  expect(
    result.errorMessage?.toLowerCase().includes('invalid input')
  ).toBeTruthy();
});

it('should return invalid input message - whitespace string', () => {
  const result = timezoneConversion('  ');

  expect(result.success).toBeFalsy();
  expect(result.errorMessage).not.toBeUndefined();
  expect(
    result.errorMessage?.toLowerCase().includes('invalid input')
  ).toBeTruthy();
});

it('should return invalid format message', () => {
  const result = timezoneConversion('10 of the clock');

  expect(result.success).toBeFalsy();
  expect(result.errorMessage).not.toBeUndefined();
  expect(
    result.errorMessage?.toLowerCase().includes('invalid format')
  ).toBeTruthy();
});

/* EXAMPLES WITH CONFIRMED CONVERSIONS
    10:00 PST    -> 18:00 GMT
    1:00 CST     -> 07:00 GMT
    5 PM EST     -> 22:00 GMT
    9PM CET      -> 20:00 GMT
    1:00 PM JST  -> 04:00 GMT
    1:00PM VLAT  -> 03:00 GMT (VLAT not supported)
*/

beforeEach(() => {
  mockDateTimeLocal.mockClear();
  mockFromJSDate.mockClear();
  mockFromObject.mockClear();
});

it('should convert colon format', () => {
  const input = '10:00 PST';
  const mockToObject = jest.fn();
  const mockToJSDate1 = jest
    .fn()
    .mockImplementation(() => new Date(2020, 11, 10, 10));

  const mockToJSDate2 = jest
    .fn()
    .mockImplementation(() => new Date(2020, 11, 10, 18));

  const fromObjItem = {
    isValid: true,
    invalidReason: undefined,
    invalidExplanation: undefined,
    offset: -480,
    toObject: mockToObject,
    toJSDate: mockToJSDate1
  };

  const fromJSDateItem = {
    isValid: true,
    invalidReason: undefined,
    invalidExplanation: undefined,
    offset: 0,
    toJSDate: mockToJSDate2,
    setZone: jest.fn().mockImplementation(() => fromJSDateItem)
  };

  mockDateTimeLocal.mockImplementation(() => ({ zone: { name: 'GMT' } }));
  mockFromObject.mockImplementation(() => fromObjItem);
  mockFromJSDate.mockImplementation(() => fromJSDateItem);

  const result = timezoneConversion(input);

  expect(result.success).toBeTruthy();
  expect(result.errorMessage).toBeUndefined();
  expect(result.date?.toLocaleTimeString()).toEqual('18:00:00');
  expect(result.source?.toLocaleTimeString()).toEqual('10:00:00');
  expect(result.utcOffset).toEqual(-8);

  expect(mockDateTimeLocal).toHaveBeenCalledTimes(1);
  expect(mockFromObject).toHaveBeenCalledTimes(2);
  expect(mockFromJSDate).toHaveBeenCalledTimes(1);

  expect(mockToJSDate1).toHaveBeenCalledTimes(2);
  expect(mockToJSDate2).toHaveBeenCalledTimes(1);
});

it('should convert colon format with no padded hour', () => {
  const input = '1:00 CST';
  const mockToObject = jest.fn();
  const mockToJSDate1 = jest
    .fn()
    .mockImplementation(() => new Date(2020, 11, 10, 1));

  const mockToJSDate2 = jest
    .fn()
    .mockImplementation(() => new Date(2020, 11, 10, 7));

  const fromObjItem = {
    isValid: true,
    invalidReason: undefined,
    invalidExplanation: undefined,
    offset: -360,
    toObject: mockToObject,
    toJSDate: mockToJSDate1
  };

  const fromJSDateItem = {
    isValid: true,
    invalidReason: undefined,
    invalidExplanation: undefined,
    offset: 0,
    toJSDate: mockToJSDate2,
    setZone: jest.fn().mockImplementation(() => fromJSDateItem)
  };

  mockDateTimeLocal.mockImplementation(() => ({ zone: { name: 'GMT' } }));
  mockFromObject.mockImplementation(() => fromObjItem);
  mockFromJSDate.mockImplementation(() => fromJSDateItem);

  const result = timezoneConversion(input);

  expect(result.success).toBeTruthy();
  expect(result.errorMessage).toBeUndefined();
  expect(result.date?.toLocaleTimeString()).toEqual('07:00:00');
  expect(result.source?.toLocaleTimeString()).toEqual('01:00:00');
  expect(result.utcOffset).toEqual(-6);

  expect(mockDateTimeLocal).toHaveBeenCalledTimes(1);
  expect(mockFromObject).toHaveBeenCalledTimes(2);
  expect(mockFromJSDate).toHaveBeenCalledTimes(1);

  expect(mockToJSDate1).toHaveBeenCalledTimes(2);
  expect(mockToJSDate2).toHaveBeenCalledTimes(1);
});

it('should convert ampm format with a space', () => {
  const input = '5 PM EST';
  const mockToObject = jest.fn();
  const mockToJSDate1 = jest
    .fn()
    .mockImplementation(() => new Date(2020, 11, 10, 17));

  const mockToJSDate2 = jest
    .fn()
    .mockImplementation(() => new Date(2020, 11, 10, 22));

  const fromObjItem = {
    isValid: true,
    invalidReason: undefined,
    invalidExplanation: undefined,
    offset: -300,
    toObject: mockToObject,
    toJSDate: mockToJSDate1
  };

  const fromJSDateItem = {
    isValid: true,
    invalidReason: undefined,
    invalidExplanation: undefined,
    offset: 0,
    toJSDate: mockToJSDate2,
    setZone: jest.fn().mockImplementation(() => fromJSDateItem)
  };

  mockDateTimeLocal.mockImplementation(() => ({ zone: { name: 'GMT' } }));
  mockFromObject.mockImplementation(() => fromObjItem);
  mockFromJSDate.mockImplementation(() => fromJSDateItem);

  const result = timezoneConversion(input);

  expect(result.success).toBeTruthy();
  expect(result.errorMessage).toBeUndefined();
  expect(result.date?.toLocaleTimeString()).toEqual('22:00:00');
  expect(result.source?.toLocaleTimeString()).toEqual('17:00:00');
  expect(result.utcOffset).toEqual(-5);

  expect(mockDateTimeLocal).toHaveBeenCalledTimes(1);
  expect(mockFromObject).toHaveBeenCalledTimes(2);
  expect(mockFromJSDate).toHaveBeenCalledTimes(1);

  expect(mockToJSDate1).toHaveBeenCalledTimes(2);
  expect(mockToJSDate2).toHaveBeenCalledTimes(1);
});

it('should convert ampm format with no space', () => {
  const input = '9PM CET';
  const mockToObject = jest.fn();
  const mockToJSDate1 = jest
    .fn()
    .mockImplementation(() => new Date(2020, 11, 10, 21));

  const mockToJSDate2 = jest
    .fn()
    .mockImplementation(() => new Date(2020, 11, 10, 20));

  const fromObjItem = {
    isValid: true,
    invalidReason: undefined,
    invalidExplanation: undefined,
    offset: 60,
    toObject: mockToObject,
    toJSDate: mockToJSDate1
  };

  const fromJSDateItem = {
    isValid: true,
    invalidReason: undefined,
    invalidExplanation: undefined,
    offset: 0,
    toJSDate: mockToJSDate2,
    setZone: jest.fn().mockImplementation(() => fromJSDateItem)
  };

  mockDateTimeLocal.mockImplementation(() => ({ zone: { name: 'GMT' } }));
  mockFromObject.mockImplementation(() => fromObjItem);
  mockFromJSDate.mockImplementation(() => fromJSDateItem);

  const result = timezoneConversion(input);

  expect(result.success).toBeTruthy();
  expect(result.errorMessage).toBeUndefined();
  expect(result.date?.toLocaleTimeString()).toEqual('20:00:00');
  expect(result.source?.toLocaleTimeString()).toEqual('21:00:00');
  expect(result.utcOffset).toEqual(1);

  expect(mockDateTimeLocal).toHaveBeenCalledTimes(1);
  expect(mockFromObject).toHaveBeenCalledTimes(2);
  expect(mockFromJSDate).toHaveBeenCalledTimes(1);

  expect(mockToJSDate1).toHaveBeenCalledTimes(2);
  expect(mockToJSDate2).toHaveBeenCalledTimes(1);
});

it('should convert ampm-colon format with a space', () => {
  const input = '1:00 PM JST';
  const mockToObject = jest.fn();
  const mockToJSDate1 = jest
    .fn()
    .mockImplementation(() => new Date(2020, 11, 10, 13));

  const mockToJSDate2 = jest
    .fn()
    .mockImplementation(() => new Date(2020, 11, 10, 4));

  const fromObjItem = {
    isValid: true,
    invalidReason: undefined,
    invalidExplanation: undefined,
    offset: 540,
    toObject: mockToObject,
    toJSDate: mockToJSDate1
  };

  const fromJSDateItem = {
    isValid: true,
    invalidReason: undefined,
    invalidExplanation: undefined,
    offset: 0,
    toJSDate: mockToJSDate2,
    setZone: jest.fn().mockImplementation(() => fromJSDateItem)
  };

  mockDateTimeLocal.mockImplementation(() => ({ zone: { name: 'GMT' } }));
  mockFromObject.mockImplementation(() => fromObjItem);
  mockFromJSDate.mockImplementation(() => fromJSDateItem);

  const result = timezoneConversion(input);

  expect(result.success).toBeTruthy();
  expect(result.errorMessage).toBeUndefined();
  expect(result.date?.toLocaleTimeString()).toEqual('04:00:00');
  expect(result.source?.toLocaleTimeString()).toEqual('13:00:00');
  expect(result.utcOffset).toEqual(9);

  expect(mockDateTimeLocal).toHaveBeenCalledTimes(1);
  expect(mockFromObject).toHaveBeenCalledTimes(2);
  expect(mockFromJSDate).toHaveBeenCalledTimes(1);

  expect(mockToJSDate1).toHaveBeenCalledTimes(2);
  expect(mockToJSDate2).toHaveBeenCalledTimes(1);
});

it('should return invalid date reason message', () => {
  const input = '1:00PM VLAT';
  const fromObjItem = {
    isValid: false,
    invalidReason: 'test',
    invalidExplanation: 'this is why'
  };

  mockFromObject.mockImplementation(() => fromObjItem);

  const result = timezoneConversion(input);

  expect(result.success).toBeFalsy();
  expect(result.errorMessage).not.toBeUndefined();
  expect(result.errorMessage).toEqual('test > this is why');

  expect(mockFromObject).toHaveBeenCalledTimes(1);
});
