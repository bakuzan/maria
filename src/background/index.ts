import './backgroundCommands';
import './backgroundContextMenu';
import { browser } from 'webextension-polyfill-ts';

import downloadContext from './DownloadContext';
import { MariaAction, erzaGQL, PageAction } from '@/consts';
import { log } from '@/log';
import { BackgroundAction } from '@/types/BackgroundAction';
import { FeedCheck } from '@/types/FeedCheck';

import fetch from '@/utils/fetch';
import executeContentModule from '@/utils/executeContentModule';
import userFeedback from '@/utils/userFeedback';
import { processLinks, removeLinks } from '@/utils/linksProcessing';
import getErrorMessage from '@/utils/getErrorMessage';
import getStorage from '@/utils/getStorage';
import { chunk } from '@/utils/array';
import {
  checkFeedsForUpdates,
  updateBadge,
  getUnreadFeeds
} from '@/utils/rssFeedChecks';

/* Message handling */

chrome.runtime.onMessage.addListener(async function (
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

    case MariaAction.FETCH_NUMBER_DETAIL: {
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
    }

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

    case MariaAction.DOWNLOAD_GALLERY: {
      const { default: JSZip } = await import(
        /* webpackChunkName: "jszip" */ 'jszip'
      );

      downloadContext.init(request.items.length, request.filename);

      const zip = new JSZip();
      const chunks = chunk(request.items, 5);

      for (const hunk of chunks) {
        const queue = [];

        for (const item of hunk) {
          downloadContext.bumpQueuedCount();

          queue.push(
            window
              .fetch(item.url)
              .then((response) => response.arrayBuffer())
              .then((img) => zip.file(item.name, img))
              .then(() => downloadContext.bumpLoadedCount())
          );
        }

        await Promise.all(queue);
      }

      downloadContext.zipping();
      zip.generateAsync({ type: 'blob' }).then(async function (content) {
        const url = window.URL.createObjectURL(content);

        await browser.downloads.download({
          url,
          filename: request.filename,
          saveAs: true
        });

        downloadContext.reset();
        window.URL.revokeObjectURL(url);
      });

      return;
    }

    case MariaAction.DOWNLOAD_GALLERY_STATUS:
      downloadContext.report();
      return;

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

    await browser.browserAction.setBadgeText({ text: '!', tabId });
    await browser.browserAction.setBadgeBackgroundColor({
      color: `#ffa500`,
      tabId
    });
  } else {
    const unreadFeeds = await getUnreadFeeds();
    await updateBadge(unreadFeeds);
  }
});

/* When the extension starts up... */
chrome.runtime.onStartup.addListener(async function () {
  const greeting = new Audio(chrome.runtime.getURL('../assets/greeting.mp3'));
  greeting.play();

  const updatedFeeds = await checkFeedsForUpdates();
  await updateBadge(updatedFeeds);
});
