import './backgroundCommands';
import './backgroundContextMenu';

import { MariaAction, erzaGQL } from '@/consts';
import { BackgroundAction } from '@/types/BackgroundAction';
import fetch from '@/utils/fetch';
import executeContentModule from '@/utils/executeContentModule';
import userFeedback from '@/utils/userFeedback';
import { processLinks, removeLinks } from '@/utils/linksProcessing';
import getErrorMessage from '@/utils/getErrorMessage';

/* Message handling */

chrome.runtime.onMessage.addListener(function(
  request: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (action: BackgroundAction) => void
) {
  console.log(
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
chrome.tabs.onUpdated.addListener(function(
  tabId: number,
  changeInfo: any,
  tab: any
) {
  const isComplete = changeInfo.status === 'complete';
  const re = /^https:\/\/myanimelist.net\/anime\/.*|^https:\/\/myanimelist.net\/manga\/.*/;
  const isSeriesPage = new RegExp(re).test(tab.url);

  if (isComplete && isSeriesPage) {
    executeContentModule(tabId, 'addSeries');
  }
});
