export default async function getStorage() {
  return await chrome.storage.sync.get({
    digitOptions: [6, 5]
  });
}
