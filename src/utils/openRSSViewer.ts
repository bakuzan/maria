import { browser } from 'webextension-polyfill-ts';

export default async function openRSSViewer() {
  const targetTabUrl = browser.extension.getURL('rssViewer.html');

  const stores = await browser.tabs.query({
    url: targetTabUrl
  });

  const removeTabIds = stores.map((x) => x.id);
  await browser.tabs.remove(removeTabIds);

  await browser.tabs.create({
    index: 0,
    url: targetTabUrl
  });
}
