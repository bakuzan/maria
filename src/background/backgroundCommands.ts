import { browser } from 'webextension-polyfill-ts';

import getActiveTab from '@/utils/getActiveTab';
import { processLinks, removeLinks } from '@/utils/linksProcessing';
import handleMagicNumberSelect from '@/utils/handleMagicNumberSelect';

enum MariaCommand {
  AddLinks = 'add-links',
  RemoveLinks = 'remove-links',
  ViewMagicNumber = 'view-magic-number'
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
    case MariaCommand.ViewMagicNumber:
      chrome.tabs.executeScript(
        activeTab.id,
        {
          code: `window.getSelection().toString();`
        },
        (text: any) => handleMagicNumberSelect(text, false)
      );
      break;
    default:
      return;
  }
});
