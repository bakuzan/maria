import { FetchResponse } from '@/types/FetchResponse';
import { BASE_ERZA_URL } from '@/consts';

export default async function fetcher(
  url: string,
  options?: RequestInit
): Promise<FetchResponse> {
  try {
    const response = await window.fetch(url, options);
    const data = await response.json();

    // For graphql queries
    if (data.hasOwnProperty('errors')) {
      return {
        success: false,
        ...data
      };
    } else if (data.hasOwnProperty('data')) {
      const hasData = !!data.data;
      const hasErza = data.data.hasOwnProperty('erzaResponse');
      const nData =
        hasData && hasErza
          ? data.data.erzaResponse || data.data
          : data.data || data;

      return {
        success: !!(
          (hasErza && data.data.erzaResponse) ||
          (!hasErza && hasData && data.data)
        ),
        ...(nData.hasOwnProperty('data') ? nData : { data: nData })
      };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}

export async function callErza(query: string, variables: any) {
  return await fetcher(`${BASE_ERZA_URL}graphql`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method: `POST`,
    body: JSON.stringify({
      query,
      variables
    })
  });
}
