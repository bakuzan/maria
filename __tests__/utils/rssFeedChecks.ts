import { getLastUpdateDate } from '../../src/utils/rssFeedChecks';

describe('getLastUpdateDate', () => {
  it('should return hasDate false when no date present', () => {
    const data = { items: [] };

    const result = getLastUpdateDate(data);

    expect(result.hasDate).toBeFalsy();
  });

  it('should return hasDate true when date present', () => {
    const pubDate = new Date(2020, 12, 7);
    const data = { items: [{ pubDate: pubDate.toISOString() }] };

    const result = getLastUpdateDate(data);

    expect(result.hasDate).toBeTruthy();
    expect(result.lastUpdate).toEqual(pubDate.getTime());
  });
});
