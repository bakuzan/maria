import browser from 'webextension-polyfill';

import { MariaAction } from '@/consts';
import getActiveTab from '@/utils/getActiveTab';
import { reportError } from '@/log';

type ActionResponse = {
  success: boolean;
};

export async function buttonListener(action: MariaAction) {
  try {
    const activeTab = await getActiveTab();

    const response: ActionResponse = await browser.runtime.sendMessage({
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
