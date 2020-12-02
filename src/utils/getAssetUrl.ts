import { browser } from 'webextension-polyfill-ts';

import { MariaAssetFileNames } from '@/consts';

export default function getAssetUrl(value: MariaAssetFileNames) {
  return browser.runtime.getURL(`../assets/${value.toString()}`);
}
