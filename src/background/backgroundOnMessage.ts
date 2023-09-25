import browser, { Runtime } from 'webextension-polyfill';

import downloadContext from './DownloadContext';
import { MariaAction, erzaGQL } from '@/consts';
import { log } from '@/log';
import { ContentResponse } from '@/types/ContentResponse';

import fetcher, { callErza } from '@/utils/fetch';
import userFeedback from '@/utils/userFeedback';
import { processLinks, removeLinks } from '@/utils/linksProcessing';
import getErrorMessage from '@/utils/getErrorMessage';
import { chunk } from '@/utils/array';
import openWindow from '@/utils/openWindow';

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
      const buff = await new Response(content).arrayBuffer();
      const url = `data:application/zip;base64,${(buff as any).toString(
        'base64'
      )}`;

      await browser.downloads.download({
        url,
        filename: request.filename,
        saveAs: true
      });

      downloadContext.reset();

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
