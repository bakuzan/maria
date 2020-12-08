export const mockParseURL = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return { parseURL: mockParseURL };
});

export default mock;
