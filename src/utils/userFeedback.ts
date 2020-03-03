import { browser } from 'webextension-polyfill-ts';

import { ToasterType } from '@/types/ToasterType';
import getActiveTab from './getActiveTab';

export default async function userFeedback(type: ToasterType, message: string) {
  try {
    const activeTab = await getActiveTab();

    await browser.tabs.executeScript(activeTab.id, {
      code: `(async () => {
          const src = browser.extension.getURL("src/utils/toaster.js");
          const contentMain = await import(src);
          contentMain.default("${type}", \`${message}\`);
        })();`
    });
  } catch (error) {
    console.log(error);
    // TODO
    // Error handling
  }
}
