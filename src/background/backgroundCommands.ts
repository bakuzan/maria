import { browser } from 'webextension-polyfill-ts';

import getActiveTab from '@/utils/getActiveTab';
import storeTabs, { storeTabsAfter } from '@/utils/storeTabs';
import openNewTabStore from '@/utils/openNewTabStore';
import { log } from '@/log';

enum MariaCommand {
  OpenTabStore = 'open-tab-store',
  StoreTab = 'store-tab',
  StoreTabsAfter = 'store-tabs-after'
}

browser.commands.onCommand.addListener(async function (command: MariaCommand) {
  log('Command: ', command);

  const activeTab = await getActiveTab();

  switch (command) {
    case MariaCommand.OpenTabStore:
      await openNewTabStore();
      break;

    case MariaCommand.StoreTab:
      await storeTabs([activeTab]);
      break;

    case MariaCommand.StoreTabsAfter:
      await storeTabsAfter(activeTab);
      break;

    default:
      return;
  }
});
