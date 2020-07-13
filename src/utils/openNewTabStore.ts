import { browser } from 'webextension-polyfill-ts';

export default async function openNewTabStore() {
  const stores = await browser.tabs.query({
    url: browser.extension.getURL('tabStore.html')
  });

  const removeTabIds = stores.map((x) => x.id);
  await browser.tabs.remove(removeTabIds);

  await browser.tabs.create({
    index: 0,
    url: browser.extension.getURL('tabStore.html')
  });
}
