import browser, { Tabs } from 'webextension-polyfill';

import malPageProcessing from './onUpdated/malPage';
import rssFeedProcessing from './onUpdated/rssFeed';
import jsonFormatting from './onUpdated/jsonFormatting';
import { log } from '@/log';

browser.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: Tabs.OnUpdatedChangeInfoType,
  tab: Tabs.Tab
) {
  const isComplete = changeInfo.status === 'complete';

  if (!isComplete) {
    return;
  }

  log(
    `Tab Complete Update (TabId: ${tabId}) > `,
    tab.title ?? '<no title>',
    changeInfo
  );

  malPageProcessing(tabId, tab);
  rssFeedProcessing(tabId);
  jsonFormatting(tabId);
});
