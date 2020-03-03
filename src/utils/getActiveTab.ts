import { browser } from 'webextension-polyfill-ts';

export default async function getActiveTab() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}
