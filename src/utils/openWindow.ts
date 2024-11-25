import browser from 'webextension-polyfill';

import getActiveTab from './getActiveTab';
import { reportError } from '@/log';

function openNewTab(tabUrl: string) {
  const win = window.open(tabUrl, '_blank');
  win.opener = null;
}

export default async function openWindow(tabUrl: string) {
  try {
    const activeTab = await getActiveTab();

    await browser.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: openNewTab,
      args: [tabUrl]
    });
  } catch (error) {
    reportError(error);
  }
}
