import './backgroundCommands';
import './backgroundContextMenu';
import { browser } from 'webextension-polyfill-ts';

import { MariaAction, erzaGQL, PageAction } from '@/consts';
import { BackgroundAction } from '@/types/BackgroundAction';
import { FeedCheck } from '@/types/FeedCheck';

import fetch from '@/utils/fetch';
import executeContentModule from '@/utils/executeContentModule';
import userFeedback from '@/utils/userFeedback';
import { processLinks, removeLinks } from '@/utils/linksProcessing';
import getErrorMessage from '@/utils/getErrorMessage';
import getStorage from '@/utils/getStorage';

import {
  checkFeedsForUpdates,
  updateBadge,
  getUnreadFeeds
} from '@/utils/rssFeedChecks';
import { log } from '@/log';

/* Message handling */

chrome.runtime.onMessage.addListener(function (
  request: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (action: BackgroundAction) => void
) {
  log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );

  switch (request.action) {
    case MariaAction.PROCESS_NUMBERS:
      processLinks(request.tabID, sendResponse);
      break;

    case MariaAction.REMOVE_LINKS:
      removeLinks(request.tabID, sendResponse);
      break;

    case MariaAction.FETCH_NUMBER_DETAIL:
      fetch(`https://nhentai.net/api/gallery/${request.seriesId}`).then(
        (response) => {
          if (!response.success) {
            userFeedback('error', `Failed to fetch '${request.seriesId}'`);
          }

          sendResponse({
            action: MariaAction.FETCH_NUMBER_DETAIL,
            message: 'Done',
            ...response
          });
        }
      );
      return true;

    case MariaAction.POST_MAL_SERIES: {
      fetch(`http://localhost:9003/graphql`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        method: `POST`,
        body: JSON.stringify({
          query: request.isAnime ? erzaGQL.anime : erzaGQL.manga,
          variables: { payload: request.series }
        })
      }).then((response) => {
        if (!response.success) {
          const message = getErrorMessage(response);
          userFeedback('error', message);
        }

        sendResponse({
          action: MariaAction.POST_MAL_SERIES,
          message: 'Done',
          ...response
        });
      });

      return true;
    }

    default:
      return;
  }
});

/* Update tabs watch */
chrome.tabs.onUpdated.addListener(async function (
  tabId: number,
  changeInfo: any,
  tab: any
) {
  const isComplete = changeInfo.status === 'complete';
  const re = /^https:\/\/myanimelist.net\/anime\/.*|^https:\/\/myanimelist.net\/manga\/.*/;
  const isSeriesPage = new RegExp(re).test(tab.url);

  if (isComplete && isSeriesPage) {
    await executeContentModule(tabId, 'addSeries');

    await browser.tabs.executeScript(tabId, {
      code: `(async () => {
        Array
          .from(document.querySelectorAll(".inputtext"))
          .forEach((inp) => inp.setAttribute("autocomplete", "off"))
      })();`
    });
  }

  // RSS feed detection...
  const pageCheck: FeedCheck = await browser.tabs.sendMessage(tabId, {
    action: PageAction.GET_PAGE_RSS_FEED
  });

  if (pageCheck.hasFeed) {
    const { feeds } = await getStorage();

    if (feeds.some((x) => x.link === pageCheck.link)) {
      return;
    }

    await browser.browserAction.setBadgeBackgroundColor({
      color: `#ffa500`,
      tabId
    });

    await browser.browserAction.setBadgeText({ text: '!', tabId });
  } else {
    const unreadFeeds = await getUnreadFeeds();
    await updateBadge(unreadFeeds);
  }
});

/* When the extension starts up... */
chrome.runtime.onStartup.addListener(async function () {
  const updatedFeeds = await checkFeedsForUpdates();
  await updateBadge(updatedFeeds);
});
