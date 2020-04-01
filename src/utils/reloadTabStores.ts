import { browser } from 'webextension-polyfill-ts';

export default async function reloadTabStores() {
  // Reload any open tabStore.html tabs
  await browser.tabs
    .query({ url: browser.extension.getURL('tabStore.html') })
    .then((ts) => ts.forEach(async (t) => await browser.tabs.reload(t.id)));
}
