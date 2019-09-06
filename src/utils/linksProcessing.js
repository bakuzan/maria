import { PROCESS_NUMBERS, REMOVE_LINKS } from '../consts.js';
import injectContentModule from './injectContentModule.js';

export function processLinks(tabId, sendResponse = () => null) {
  injectContentModule(tabId, `addLinks.js`);
  sendResponse({ action: PROCESS_NUMBERS, message: 'Done' });
}

export function removeLinks(tabId, sendResponse = () => null) {
  injectContentModule(tabId, `removeLinks.js`);
  sendResponse({ action: REMOVE_LINKS, message: 'Done' });
}
