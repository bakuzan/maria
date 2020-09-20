import './backgroundCommands';
import './backgroundContextMenu';
import { browser, Tabs, Runtime } from 'webextension-polyfill-ts';

import downloadContext from './DownloadContext';
import { MariaAction, erzaGQL, PageAction } from '@/consts';
import { log } from '@/log';
import { FeedCheck } from '@/types/FeedCheck';
import { ContentResponse } from '@/types/ContentResponse';

import fetcher, { callErza } from '@/utils/fetch';
import executeContentModule from '@/utils/executeContentModule';
import userFeedback from '@/utils/userFeedback';
import { processLinks, removeLinks } from '@/utils/linksProcessing';
import getErrorMessage from '@/utils/getErrorMessage';
import getStorage from '@/utils/getStorage';
import { chunk } from '@/utils/array';
import openWindow from '@/utils/openWindow';
import {
  checkFeedsForUpdates,
  updateBadge,
  getUnreadFeeds
} from '@/utils/rssFeedChecks';

/* Message handling */

async function onMessageHandler(request: any): Promise<ContentResponse> {
  switch (request.action) {
    case MariaAction.PROCESS_NUMBERS:
      processLinks(request.tabID);
      break;

    case MariaAction.REMOVE_LINKS:
      removeLinks(request.tabID);
      break;

    case MariaAction.FETCH_NUMBER_DETAIL: {
      const response = await fetcher(
        `https://nhentai.net/api/gallery/${request.seriesId}`
      );

      if (!response || !response.success) {
        userFeedback('error', `Failed to fetch '${request.seriesId}'`);
      }

      return {
        action: MariaAction.FETCH_NUMBER_DETAIL,
        message: 'Done',
        ...response
      };
    }

    case MariaAction.POST_MAL_SERIES: {
      const response = await callErza(
        request.isAnime ? erzaGQL.anime : erzaGQL.manga,
        { payload: request.series }
      );

      if (!response || !response.success) {
        const message = getErrorMessage(response);
        userFeedback('error', message);
      }

      return {
        action: MariaAction.POST_MAL_SERIES,
        message: 'Done',
        ...response
      };
    }

    case MariaAction.OPEN_IN_ERZA: {
      console.log('..', request);
      const response = await callErza(
        request.isAnime ? erzaGQL.animeExists : erzaGQL.mangaExists,
        { malId: request.malId }
      );

      await openWindow(request.url.replace('{seriesId}', response.data.id));

      return {
        action: MariaAction.OPEN_IN_ERZA,
        message: 'Done',
        ...response
      };
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

        await Promise.all(queue).catch((error) =>
          userFeedback('error', error.message)
        );
      }

      downloadContext.zipping();
      const content = await zip.generateAsync({ type: 'blob' });
      const url = window.URL.createObjectURL(content);

      await browser.downloads.download({
        url,
        filename: request.filename,
        saveAs: true
      });

      downloadContext.reset();
      window.URL.revokeObjectURL(url);

      break;
    }

    case MariaAction.DOWNLOAD_GALLERY_STATUS:
      downloadContext.report();
      break;

    default:
      break;
  }

  return { action: request.action, message: 'Done', success: true };
}

browser.runtime.onMessage.addListener(function (
  request: any,
  sender: Runtime.MessageSender
) {
  log(
    request.action,
    sender.tab
      ? ` from a content script: ${sender.tab.url}`
      : ' from the extension'
  );

  return onMessageHandler(request);
});

/* Update tabs watch */
browser.tabs.onUpdated.addListener(async function (
  tabId: number,
  changeInfo: Tabs.OnUpdatedChangeInfoType,
  tab: any
) {
  const isComplete = changeInfo.status === 'complete';
  if (!isComplete) {
    return;
  }

  // Mal Add series...
  const reA = /^https:\/\/myanimelist.net\/anime\/.*/;
  const reM = /^https:\/\/myanimelist.net\/manga\/.*/;
  const isAnime = new RegExp(reA).test(tab.url);
  const isManga = new RegExp(reM).test(tab.url);
  const isSeriesPage = isAnime || isManga;

  if (isSeriesPage) {
    await browser.tabs.executeScript(tabId, {
      code: `(async () => {
        Array
          .from(document.querySelectorAll(".inputtext"))
          .forEach((inp) => inp.setAttribute("autocomplete", "off"))
      })();`
    });

    const [idSlug] = tab.url.match(/\/\d+\/|\/\d+$/);
    const malId = Number(idSlug.replace(/\D/g, ''));

    const response = await callErza(
      isAnime ? erzaGQL.animeExists : erzaGQL.mangaExists,
      { malId }
    );

    if (!response || !response.success) {
      const message = getErrorMessage(response);
      userFeedback('error', message);
    } else if (response.data && response.data.exists) {
      await executeContentModule(tabId, 'openSeriesInErza');
    } else {
      await executeContentModule(tabId, 'addSeries');
    }
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
    const text = await browser.browserAction.getBadgeText({});

    if (!text) {
      const unreadFeeds = await getUnreadFeeds();
      await updateBadge(unreadFeeds);
    }
  }
});

/* When the extension starts up... */
browser.runtime.onStartup.addListener(async function () {
  const store = await getStorage();

  if (store.shouldPlayGreeting) {
    const greetingUrl = browser.runtime.getURL('../assets/greeting.mp3');
    const greeting = new Audio(greetingUrl);
    greeting.play();
  }

  const updatedFeeds = await checkFeedsForUpdates();
  await updateBadge(updatedFeeds);
});
