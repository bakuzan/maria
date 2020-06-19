import { browser } from 'webextension-polyfill-ts';

import { MariaAction } from '@/consts';
import getActiveTab from '@/utils/getActiveTab';

export function buttonListener(action: MariaAction) {
  return async function () {
    try {
      const activeTab = await getActiveTab();

      await browser.runtime.sendMessage({
        tabID: activeTab.id,
        action
      });
    } catch (error) {
      // TODO
      // Error handling
    }
  };
}
