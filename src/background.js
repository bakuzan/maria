import './thirdParty/hot-reload.js';
import injectContentModule from './utils/injectContentModule.js';
import { PROCESS_NUMBERS, REMOVE_LINKS } from './consts.js';

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
