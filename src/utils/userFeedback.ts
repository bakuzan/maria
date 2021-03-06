import { browser } from 'webextension-polyfill-ts';

import { ToasterType } from '@/types/ToasterType';
import getActiveTab from './getActiveTab';
import { reportError } from '@/log';

export default async function userFeedback(type: ToasterType, message: string) {
  try {
    const activeTab = await getActiveTab();

    await browser.tabs.executeScript(activeTab.id, {
      code: `(async () => window.__Maria__.toaster("${type}", \`${message}\`))();`
    });
  } catch (error) {
    reportError(error);
  }
}
