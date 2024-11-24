import browser from 'webextension-polyfill';

export type ContentScriptFunction =
  | 'addHoverListeners'
  | 'addLinks'
  | 'activateErzaSeries'
  | 'addSeries'
  | 'openSeriesInErza'
  | 'removeLinks';

function callMariaApi(func: ContentScriptFunction, arg: string) {
  window.__Maria__[func](arg);
}

export default async function injectContentModule(
  tabId: number,
  func: ContentScriptFunction,
  successorScript?: ContentScriptFunction
) {
  const arg = successorScript ? `"${successorScript}"` : '';

  await browser.scripting.executeScript({
    target: { tabId },
    func: callMariaApi,
    args: [func, arg]
  });
}
