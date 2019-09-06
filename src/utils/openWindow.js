import getActiveTab from './getActiveTab.js';

export default async function openWindow(tabUrl) {
  try {
    const activeTab = await getActiveTab();
    await chrome.tabs.executeScript(activeTab.id, {
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
