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
      break;

    default:
      return;
  }
});

/* Context Menu! */
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
