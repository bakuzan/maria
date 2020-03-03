import '../styles.scss';
import './popup.scss';
import { browser } from 'webextension-polyfill-ts';

import { MariaAction } from '@/consts';
import getActiveTab from '@/utils/getActiveTab';

function buttonListener(action: MariaAction) {
  return async function() {
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

document
  .getElementById('processNumbers')
  .addEventListener('click', buttonListener(MariaAction.PROCESS_NUMBERS));

document
  .getElementById('removeLinks')
  .addEventListener('click', buttonListener(MariaAction.REMOVE_LINKS));
