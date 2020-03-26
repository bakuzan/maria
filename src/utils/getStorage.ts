import { browser } from 'webextension-polyfill-ts';

import { MariaStore } from '@/types/MariaStore';

export default async function getStorage() {
  const storageDefaults = {
    digitOptions: [6, 5],
    tabGroups: []
  };

  const store = await browser.storage.sync.get(storageDefaults);

  return { ...storageDefaults, ...store } as MariaStore;
}
