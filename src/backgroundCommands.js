import './thirdParty/hot-reload.js';
import './thirdParty/chrome-extension-async.js';
import getActiveTab from './utils/getActiveTab.js';
import { processLinks, removeLinks } from './utils/linksProcessing.js';
import handleMagicNumberSelect from './utils/handleMagicNumberSelect.js';

/* Keyboard shortcuts */
const CMD_ADD_LINKS = 'add-links';
const CMD_REMOVE_LINKS = 'remove-links';
const CMD_VIEW_MAGIC_NUMBER = 'view-magic-number';

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);

  getActiveTab().then((activeTab) => {
    switch (command) {
      case CMD_ADD_LINKS:
        processLinks(activeTab.id);
        break;
      case CMD_REMOVE_LINKS:
        removeLinks(activeTab.id);
        break;
      case CMD_VIEW_MAGIC_NUMBER:
        chrome.tabs.executeScript(
          activeTab.id,
          {
            code: `window.getSelection().toString();`
          },
          function(text) {
            handleMagicNumberSelect(text, false);
          }
        );
        break;
      default:
        return;
    }
  });
});
