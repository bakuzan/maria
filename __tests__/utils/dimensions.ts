import dimensions from '../../src/utils/dimensions';

it('should return document dimensions', () => {
  const result = dimensions();

  expect(result.h).toEqual(768);
  expect(result.w).toEqual(1024);
});
