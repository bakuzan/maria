export default async function fetcher(url, options) {
  try {
    const data = await fetch(url, options).then((res) => res.json());

    // For graphql queries
    if (data.hasOwnProperty('data')) {
      const hasData = !!data.data;
      const hasErza = data.data.hasOwnProperty('erzaResponse');
      const nData =
        hasData && hasErza
          ? data.data.erzaResponse || data.data
          : data.data || data;

      return {
        success:
          (hasErza && data.data.erzaResponse) ||
          (!hasErza && hasData && data.data),
        ...nData
      };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
