import { browser } from 'webextension-polyfill-ts';

type ContentScriptFunction =
  | 'addHoverListeners'
  | 'addLinks'
  | 'addSeries'
  | 'openSeriesInErza'
  | 'removeLinks';

export default async function injectContentModule(
  tabId: number,
  func: ContentScriptFunction
) {
  await browser.tabs.executeScript(tabId, {
    code: `(async () => window.__Maria__.${func}())();`
  });
}
