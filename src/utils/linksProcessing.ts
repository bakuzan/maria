import { MariaAction } from '@/consts';
import { BackgroundAction } from '@/types/BackgroundAction';
import executeContentModule from './executeContentModule';

export function processLinks(
  tabId: number,
  sendResponse = (action: BackgroundAction) => null
) {
  executeContentModule(tabId, `addLinks`);
  sendResponse({ action: MariaAction.PROCESS_NUMBERS, message: 'Done' });
}

export function removeLinks(
  tabId: number,
  sendResponse = (action: BackgroundAction) => null
) {
  executeContentModule(tabId, `removeLinks`);
  sendResponse({ action: MariaAction.REMOVE_LINKS, message: 'Done' });
}
