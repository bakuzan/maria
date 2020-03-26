import { browser } from 'webextension-polyfill-ts';

import getActiveTab from '@/utils/getActiveTab';
import { processLinks, removeLinks } from '@/utils/linksProcessing';
import storeTabs from '@/utils/storeTabs';

enum MariaCommand {
  AddLinks = 'add-links',
  RemoveLinks = 'remove-links',
  ViewMagicNumber = 'view-magic-number',
  OpenTabStore = 'open-tab-store',
  StoreTab = 'store-tab'
}

browser.commands.onCommand.addListener(async function(command: MariaCommand) {
  console.log('Command:', command);

  const activeTab = await getActiveTab();

  switch (command) {
    case MariaCommand.AddLinks:
      processLinks(activeTab.id);
      break;

    case MariaCommand.RemoveLinks:
      removeLinks(activeTab.id);
      break;

    // Retired, limited to 4 chrome shortcuts
    // case MariaCommand.ViewMagicNumber:
    //   chrome.tabs.executeScript(
    //     activeTab.id,
    //     {
    //       code: `window.getSelection().toString();`
    //     },
    //     (text: any) => handleMagicNumberSelect(text, false)
    //   );
    //   break;

    case MariaCommand.OpenTabStore:
      await browser.tabs.create({
        url: chrome.extension.getURL('tabStore.html')
      });
      break;

    case MariaCommand.StoreTab:
      await storeTabs([activeTab]);
      break;

    default:
      return;
  }
});
