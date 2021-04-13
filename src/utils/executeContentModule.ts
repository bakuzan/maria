import { browser } from 'webextension-polyfill-ts';

export type ContentScriptFunction =
  | 'addHoverListeners'
  | 'addLinks'
  | 'activateErzaSeries'
  | 'addSeries'
  | 'openSeriesInErza'
  | 'removeLinks';

export default async function injectContentModule(
  tabId: number,
  func: ContentScriptFunction,
  successorScript?: ContentScriptFunction
) {
  const arg = successorScript ? `"${successorScript}"` : '';

  await browser.tabs.executeScript(tabId, {
    code: `(async () => window.__Maria__.${func}(${arg}))();`
  });
}
