import fetchMock from 'jest-fetch-mock';

import mariaFetch, { callErza } from '../../src/utils/fetch';
import { BASE_ERZA_URL } from '../../src/consts';

beforeAll(() => fetchMock.enableMocks());

describe('fetch', () => {
  const payload = {
    good: { success: true }
  };

  function setup(values: any) {
    fetchMock.mockIf(/jest/, async () => ({
      body: JSON.stringify(values),
      json: async () => values
    }));
  }

  beforeEach(() => fetchMock.resetMocks());

  it('should return good payload', async () => {
    const expected = payload.good;

    setup(payload.good);

    const result = await mariaFetch('https://jest');

    expect(result.success).toEqual(true);
    expect(result.data).toEqual(expected);
  });

  it('should fail gracefully', async () => {
    const myError = new Error('JEST FAIL');
    const expected = { success: false, error: myError };

    fetchMock.mockOnceIf(/jest/, () => {
      throw myError;
    });

    const result = await mariaFetch('https://jest');

    expect(result).toEqual(expected);
  });

  it('should post body content', async () => {
    const erzaResponse = { hello: 'world' };
    setup({ data: { erzaResponse } });

    const result = await mariaFetch('https://jest', {
      method: 'POST',
      body: "{ hello: 'world' }"
    });

    expect(result.success).toEqual(true);
    expect(result.data.hello).toEqual('world');
  });
});

describe('callErza', () => {
  function setup(values: any) {
    fetchMock.mockIf(/jest/, async () => ({
      body: JSON.stringify(values),
      json: async () => values
    }));
  }

  beforeEach(() => fetchMock.resetMocks());

  it('should call erza using fetcher', async () => {
    setup({});

    const spyOn = jest.spyOn(JSON, 'stringify');

    await callErza(`query SomeString {}`, { test: 'variable' });

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual(`${BASE_ERZA_URL}graphql`);
    expect(spyOn).toHaveBeenCalledTimes(1);
  });
});
