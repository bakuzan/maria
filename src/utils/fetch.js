export default async function fetcher(url, options) {
  try {
    const data = await fetch(url, options).then((res) => res.json());
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
