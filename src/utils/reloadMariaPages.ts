import { browser } from 'webextension-polyfill-ts';

async function reloadPages(pageName: string) {
  // Reload any open tabStore.html tabs
  await browser.tabs
    .query({ url: browser.runtime.getURL(pageName) })
    .then((ts) => ts.forEach(async (t) => await browser.tabs.reload(t.id)));
}

export async function reloadImportAndExport() {
  await reloadPages('exportImport.html');
}
export async function reloadOptions() {
  await reloadPages('options.html');
}
export async function reloadRSSViewers() {
  await reloadPages('rssViewer.html');
}
export async function reloadTabStores() {
  await reloadPages('tabStore.html');
}

export default async function reloadMariaPages() {
  await reloadImportAndExport();
  await reloadOptions();
  await reloadRSSViewers();
  await reloadTabStores();
}
