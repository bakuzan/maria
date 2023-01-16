import './backgroundCommands';
import './backgroundContextMenu';
import './backgroundOnMessage';
import './backgroundOnUpdated';
import browser, { WebRequest } from 'webextension-polyfill';
import { RedirectDetails } from '@/types/Redirect';

import { MariaAssetFileNames } from '@/consts';
import getStorage from '@/utils/getStorage';
import getAssetUrl from '@/utils/getAssetUrl';
import { checkFeedsForUpdates, updateBadge } from '@/utils/rssFeedChecks';
import findRedirectMatch from '@/utils/findRedirectMatch';
import { log } from '@/log';

// Caches for redirect requests
// These will be lost when the background task sleeps, but this is okay.
const ignoreNextRequest = {};
const justRedirected = {};

const redirectThreshold = 3;
const ResourceTypes = ['main_frame', 'history'];

async function startup() {
  const store = await getStorage();

  if (store.shouldPlayGreeting) {
    const greetingUrl = getAssetUrl(MariaAssetFileNames.Greeting);
    const greeting = new Audio(greetingUrl);
    greeting.play();
  }

  const updatedFeeds = await checkFeedsForUpdates();
  await updateBadge(updatedFeeds);
}

/* When the extension starts up... */
browser.runtime.onStartup.addListener(function () {
  startup();
});

async function onPageRequest(
  details: RedirectDetails
): Promise<WebRequest.BlockingResponse> {
  const store = await getStorage();

  if (!store.shouldRedirect) {
    // If redirects are turned off just ignore everything
    return {};
  }

  if (details.method !== 'GET') {
    return {};
  }

  if (!ResourceTypes.includes(details.type)) {
    return {};
  }

  let timestamp = ignoreNextRequest[details.url];
  if (timestamp) {
    log(
      'Ignoring ' +
        details.url +
        ', was just redirected ' +
        (new Date().getTime() - timestamp) +
        'ms ago'
    );
    delete ignoreNextRequest[details.url];
    return {};
  }

  const result = findRedirectMatch(store.redirects, details.url);

  if (result) {
    const threshold = 3000;
    const data = justRedirected[details.url];

    if (!data || new Date().getTime() - data.timestamp > threshold) {
      justRedirected[details.url] = {
        timestamp: new Date().getTime(),
        count: 1
      };
    } else {
      data.count++;
      justRedirected[details.url] = data;

      if (data.count >= redirectThreshold) {
        log(
          'Ignoring ' +
            details.url +
            ' because we have redirected it ' +
            data.count +
            ' times in the last ' +
            threshold +
            'ms'
        );

        return {};
      }
    }

    log(
      'Redirecting ' +
        details.url +
        ' ===> ' +
        result.redirectUrl +
        ', type: ' +
        details.type +
        ', patterns: ' +
        result.fromPattern +
        ' ===> ' +
        result.toPattern
    );

    ignoreNextRequest[result.redirectUrl] = new Date().getTime();
    return { redirectUrl: result.redirectUrl };
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  onPageRequest,
  {
    urls: ['https://*/*', 'http://*/*'],
    types: ['main_frame']
  },
  ['blocking'] // TODO, this wont work in manifest v3 apparently.
);

browser.webNavigation.onHistoryStateUpdated.addListener(
  async function checkHistoryStateRedirects(ev) {
    const result = await onPageRequest({
      method: 'GET',
      type: 'history',
      url: ev.url
    });

    if (result.redirectUrl) {
      await browser.tabs.update(ev.tabId, { url: result.redirectUrl });
    }
  }
);
