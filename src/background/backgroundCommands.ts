import { browser } from 'webextension-polyfill-ts';

import getActiveTab from '@/utils/getActiveTab';
import { processLinks, removeLinks } from '@/utils/linksProcessing';
import storeTabs from '@/utils/storeTabs';
import openNewTabStore from '@/utils/openNewTabStore';
import { log } from '@/log';

enum MariaCommand {
  AddLinks = 'add-links',
  RemoveLinks = 'remove-links',
  ViewMagicNumber = 'view-magic-number',
  OpenTabStore = 'open-tab-store',
  StoreTab = 'store-tab'
}

browser.commands.onCommand.addListener(async function (command: MariaCommand) {
  log('Command: ', command);

  const activeTab = await getActiveTab();

  switch (command) {
    case MariaCommand.AddLinks:
      processLinks(activeTab.id);
      break;

    case MariaCommand.RemoveLinks:
      removeLinks(activeTab.id);
      break;

    case MariaCommand.OpenTabStore:
      await openNewTabStore();
      break;

    case MariaCommand.StoreTab:
      await storeTabs([activeTab]);
      break;

    default:
      return;
  }
});
