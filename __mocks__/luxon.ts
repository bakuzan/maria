export const mockDateTimeLocal = jest.fn();
export const mockFromObject = jest.fn();
export const mockFromJSDate = jest.fn();

export const DateTime = {
  local: mockDateTimeLocal,
  fromObject: mockFromObject,
  fromJSDate: mockFromJSDate
};
