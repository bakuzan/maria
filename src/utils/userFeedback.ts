import browser from 'webextension-polyfill';

import { ToasterType } from '@/types/ToasterType';
import getActiveTab from './getActiveTab';
import { reportError } from '@/log';

async function popMessage(type: ToasterType, message: string) {
  window.__Maria__.toaster(type, message);
}

export default async function userFeedback(type: ToasterType, message: string) {
  try {
    const activeTab = await getActiveTab();

    await browser.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: popMessage,
      args: [type, message]
    });
  } catch (error) {
    reportError(error);
  }
}
