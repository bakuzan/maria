import getActiveTab from './getActiveTab.js';

export default async function userFeedback(type, message) {
  try {
    const activeTab = await getActiveTab();

    await chrome.tabs.executeScript(activeTab.id, {
      code: `(async () => {
          const src = chrome.extension.getURL("src/utils/toaster.js");
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
