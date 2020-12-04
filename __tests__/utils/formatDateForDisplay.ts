import formatDateForDisplay from '../../src/utils/formatDateForDisplay';

describe('formatDateForDisplay', () => {
  it('should return empty string for falsey inputs', () => {
    const expected = '';

    const results = [
      formatDateForDisplay(undefined),
      formatDateForDisplay(null)
    ];

    results.forEach((result) => expect(result).toEqual(expected));
  });

  it('should format date to DD MMM YYYY', () => {
    const expected = '06 Mar 2019';

    const date = new Date('2019-03-06');
    const result = formatDateForDisplay(date);

    expect(result).toEqual(expected);
  });

  it('should re-format string to DD MMM YYYY', () => {
    const expected = '06 Mar 2019';

    const date = '2019-03-06';
    const result = formatDateForDisplay(date);

    expect(result).toEqual(expected);
  });
});
