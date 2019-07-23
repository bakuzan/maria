export default async function injectContentModule(tabId, url) {
  await chrome.tabs.executeScript(tabId, {
    code: `(async () => {
      const asy = chrome.extension.getURL("src/thirdParty/chrome-extension-async.js");
      await import(asy);
      
      const src = chrome.extension.getURL("src/content/${url}");
      const contentMain = await import(src);
      contentMain.default();
    })();`
  });
}
