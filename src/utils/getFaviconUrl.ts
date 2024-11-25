import browser from 'webextension-polyfill';
import getUrlOrigin from './getUrlOrigin';

export default function getFaviconUrl(url: string) {
  const pageUrl = getUrlOrigin(url);
  const extensionUrl = new URL(browser.runtime.getURL('/_favicon/'));
  extensionUrl.searchParams.set('pageUrl', pageUrl);
  extensionUrl.searchParams.set('size', '16');
  return extensionUrl.toString();
}
