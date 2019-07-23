export default async function injectContentModule(tabId, url) {
  await chrome.tabs.executeScript(tabId, {
    code: `(async () => {
      const src = chrome.extension.getURL("src/content/${url}");
      const contentMain = await import(src);
      contentMain.default();
    })();`
  });
}
