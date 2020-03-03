import { browser } from 'webextension-polyfill-ts';

import { MariaStore } from '@/types/MariaStore';

export default async function getStorage() {
  const store = await browser.storage.sync.get({
    digitOptions: [6, 5]
  });

  return store as MariaStore;
}
