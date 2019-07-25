import './thirdParty/hot-reload.js';
import './thirdParty/chrome-extension-async.js';
import {
  PROCESS_NUMBERS,
  REMOVE_LINKS,
  FETCH_NUMBER_DETAIL,
  BASE_LINK_URL
} from './consts.js';
import fetch from './utils/fetch.js';
import injectContentModule from './utils/injectContentModule.js';
import userFeedback from './utils/userFeedback.js';
import getActiveTab from './utils/getActiveTab.js';

/* Common */
function processLinks(tabId, sendResponse = () => null) {
  injectContentModule(tabId, `addLinks.js`);
  sendResponse({ action: PROCESS_NUMBERS, message: 'Done' });
}

function removeLinks(tabId, sendResponse = () => null) {
  injectContentModule(tabId, `removeLinks.js`);
  sendResponse({ action: REMOVE_LINKS, message: 'Done' });
}

/* Common END */

/* Message handling */

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );

  switch (request.action) {
    case PROCESS_NUMBERS:
      processLinks(request.tabID, sendResponse);
      break;

    case REMOVE_LINKS:
      removeLinks(request.tabID, sendResponse);
      break;

    case FETCH_NUMBER_DETAIL:
      fetch(`https://nhentai.net/api/gallery/${request.seriesId}`).then(
        (response) => {
          if (!response.success) {
            userFeedback('error', `Failed to fetch '${request.seriesId}'`);
          }

          sendResponse({
            action: FETCH_NUMBER_DETAIL,
            message: 'Done',
            ...response
          });
        }
      );
      return true;

    default:
      return;
  }
});

/* Context Menu! */
async function openWindow(selectionText) {
  try {
    const activeTab = await getActiveTab();
    await chrome.tabs.executeScript(activeTab.id, {
      code: `(() => {
			  const win = window.open("${BASE_LINK_URL}${selectionText}", '_blank');
			  win.opener = null;
		  })();`
    });
  } catch (error) {
    console.log(error);
    // TODO
    // Error handling
  }
}

function onSelectedText(selectionText = '', showAlert = true) {
  const selectionIsValid = /^\d+$/.test(selectionText);

  if (selectionIsValid) {
    openWindow(selectionText);
  } else if (showAlert) {
    userFeedback(
      'warning',
      'The current selection is not a valid magic number'
    );
  }
}

chrome.contextMenus.create({
  title: 'View magic number "%s"',
  contexts: ['selection'],
  onclick: function(info) {
    const { selectionText } = info;
    onSelectedText(selectionText);
  }
});

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
            onSelectedText(text, false);
          }
        );
        break;
      default:
        return;
    }
  });
});
