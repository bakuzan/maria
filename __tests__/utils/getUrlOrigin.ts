import getUrlOrigin from '../../src/utils/getUrlOrigin';

it('should return origin of full url', () => {
  const input = 'https://mywebsite.com/path/to/location?key=44';
  const output = 'https://mywebsite.com';

  const result = getUrlOrigin(input);

  expect(result).toEqual(output);
});
