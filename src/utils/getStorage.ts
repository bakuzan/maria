import { browser } from 'webextension-polyfill-ts';

import { MariaStore } from '@/types/MariaStore';

export const storageDefaults = {
  digitOptions: [6, 5],
  feeds: [],
  shouldPlayGreeting: false,
  tabGroups: []
};

export default async function getStorage() {
  const store = await browser.storage.local.get(storageDefaults);

  return { ...storageDefaults, ...store } as MariaStore;
}
