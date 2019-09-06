import './thirdParty/hot-reload.js';
import './thirdParty/chrome-extension-async.js';
import {
  PROCESS_NUMBERS,
  REMOVE_LINKS,
  FETCH_NUMBER_DETAIL,
  POST_MAL_SERIES,
  erzaGQL
} from './consts.js';
import fetch from './utils/fetch.js';
import injectContentModule from './utils/injectContentModule.js';
import userFeedback from './utils/userFeedback.js';
import { processLinks, removeLinks } from './utils/linksProcessing';
import getErrorMessage from './utils/getErrorMessage.js';

/* Message handling */

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? 'from a content script:' + sender.tab.url
      : 'from the extension'
  );

  switch (request.action) {
    case PROCESS_NUMBERS:
      processLinks(request.tabID, sendResponse);
      break;

    case REMOVE_LINKS:
      removeLinks(request.tabID, sendResponse);
      break;

    case FETCH_NUMBER_DETAIL:
      fetch(`https://nhentai.net/api/gallery/${request.seriesId}`).then(
        (response) => {
          if (!response.success) {
            userFeedback('error', `Failed to fetch '${request.seriesId}'`);
          }

          sendResponse({
            action: FETCH_NUMBER_DETAIL,
            message: 'Done',
            ...response
          });
        }
      );
      return true;

    case POST_MAL_SERIES: {
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
          action: POST_MAL_SERIES,
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
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  const isComplete = changeInfo.status === 'complete';
  const re = /^https:\/\/myanimelist.net\/anime\/.*|^https:\/\/myanimelist.net\/manga\/.*/;
  const isSeriesPage = new RegExp(re).test(tab.url);

  if (isComplete && isSeriesPage) {
    injectContentModule(tabId, 'addSeries.js');
  }
});
