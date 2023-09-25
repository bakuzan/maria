import generateUniqueId from '../../src/utils/generateUniqueId';

describe('generateUniqueId', () => {
  // Example : "e6c5eb2e-6b5b-43cf-81f2-257440b446f0"

  it('should generate a random crypto value', () => {
    const expected = [8, 4, 4, 4, 12];

    const result = generateUniqueId();
    const parts = result.split('-');

    expect(parts.length).toEqual(5);
    parts.forEach((part, i) => expect(part.length).toEqual(expected[i]));
  });
});
