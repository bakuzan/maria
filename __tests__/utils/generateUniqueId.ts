import generateUniqueId from '../../src/utils/generateUniqueId';

describe('generateUniqueId', () => {
  // Example : "e6c5eb2e-6b5b-43cf-81f2-257440b446f0"
  let getRandomValues = null;

  beforeAll(() => {
    getRandomValues = jest
      .fn()
      .mockImplementation(() => new Uint8Array(1).fill(16));

    Object.defineProperty(window, 'crypto', {
      get: () => ({
        getRandomValues
      })
    });
  });

  it('should generate a random crypto value', () => {
    const expected = [8, 4, 4, 4, 12];

    const result = generateUniqueId();
    const parts = result.split('-');

    expect(getRandomValues).toHaveBeenCalled();
    expect(parts.length).toEqual(5);
    parts.forEach((part, i) => expect(part.length).toEqual(expected[i]));
  });
});
