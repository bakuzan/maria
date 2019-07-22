import './thirdParty/hot-reload.js';
import { PROCESS_NUMBERS, REMOVE_LINKS } from './consts.js';
import addLinks from './utils/addLinks.js';
import removeLinks from './utils/removeLinks.js';

chrome.runtime.onMessage.addListener(async function(
  request,
  sender,
  sendResponse
) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );

  switch (request.action) {
    case PROCESS_NUMBERS:
      await runAction(request.tabID, addLinks);
      sendResponse({ action: PROCESS_NUMBERS, message: 'Done' });
      break;
    case REMOVE_LINKS:
      await runAction(request.tabID, removeLinks);
      sendResponse({ action: REMOVE_LINKS, message: 'Done' });
      break;
    default:
      return;
  }
});

async function runAction(tabId, fn) {
  await chrome.tabs.executeScript(tabId, { code: `(${fn.toString()})()` });
}
