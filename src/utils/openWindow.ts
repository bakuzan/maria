import { browser } from 'webextension-polyfill-ts';

import getActiveTab from './getActiveTab';

export default async function openWindow(tabUrl: string) {
  try {
    const activeTab = await getActiveTab();
    await browser.tabs.executeScript(activeTab.id, {
      code: `(() => {
                const win = window.open("${tabUrl}", '_blank');
                win.opener = null;
            })();`
    });
  } catch (error) {
    console.log(error);
    // TODO
    // Error handling
  }
}
