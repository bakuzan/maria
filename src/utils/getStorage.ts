import browser from 'webextension-polyfill';

import { MariaStore } from '@/types/MariaStore';

export const storageDefaults = {
  digitOptions: [6, 5],
  feeds: [],
  redirects: [],
  shouldCheckFeeds: true,
  shouldPlayGreeting: false,
  shouldRedirect: true,
  tabGroups: []
};

export default async function getStorage() {
  const store = await browser.storage.local.get(storageDefaults);

  return { ...storageDefaults, ...store } as MariaStore;
}
