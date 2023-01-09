import browser from 'webextension-polyfill';

import { MariaAction } from '@/consts';
import getActiveTab from '@/utils/getActiveTab';
import { reportError } from '@/log';

export async function buttonListener(action: MariaAction) {
  try {
    const activeTab = await getActiveTab();

    const response = await browser.runtime.sendMessage({
      tabID: activeTab.id,
      action
    });

    if (response && response.success) {
      window.close();
    } else {
      throw new Error(
        `Unsuccessful popup button listener message response. (Action: ${action})`
      );
    }
  } catch (error) {
    reportError(error);
  }
}
