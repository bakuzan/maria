import { PROCESS_NUMBERS, REMOVE_LINKS } from '../consts.js';
import getActiveTab from '../utils/getActiveTab.js';

function buttonListener(action) {
  return async function() {
    try {
      const activeTab = await getActiveTab();

      const response = await chrome.runtime.sendMessage({
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
  .addEventListener('click', buttonListener(PROCESS_NUMBERS));

document
  .getElementById('removeLinks')
  .addEventListener('click', buttonListener(REMOVE_LINKS));
