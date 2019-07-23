import './thirdParty/hot-reload.js';
import './thirdParty/chrome-extension-async.js';
import { PROCESS_NUMBERS, REMOVE_LINKS, BASE_LINK_URL } from './consts.js';
import injectContentModule from './utils/injectContentModule.js';
import getActiveTab from './utils/getActiveTab.js';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );

  switch (request.action) {
    case PROCESS_NUMBERS:
      injectContentModule(request.tabID, `addLinks.js`);
      sendResponse({ action: PROCESS_NUMBERS, message: 'Done' });
      break;

    case REMOVE_LINKS:
      injectContentModule(request.tabID, `removeLinks.js`);
      sendResponse({ action: REMOVE_LINKS, message: 'Done' });
      break;

    default:
      return;
  }
});

async function userFeedback(type, message) {
  try {
    const activeTab = await getActiveTab();
    console.log(activeTab);
    await chrome.tabs.executeScript(activeTab.id, {
      code: `(async () => {
        const src = chrome.extension.getURL("src/utils/toaster.js");
        const contentMain = await import(src);
        contentMain.default("${type}", "${message}");
      })();`
    });
  } catch (error) {
    console.log(error);
    // TODO
    // Error handling
  }
}

chrome.contextMenus.create({
  title: 'View magic number "%s"',
  contexts: ['selection'],
  onclick: function(info) {
    const { selectionText } = info;
    const selectionIsValid = /^\d+$/.test(selectionText);

    if (selectionIsValid) {
      const win = window.open(`${BASE_LINK_URL}${selectionText}`, '_blank');
      win.opener = null;
    } else {
      userFeedback(
        'warning',
        'The current selection is not a valid magic number'
      );
    }
  }
});
