import { browser, Tabs } from 'webextension-polyfill-ts';

import { erzaGQL, PageAction } from '@/consts';

import { FeedCheck } from '@/types/FeedCheck';

import { callErza } from '@/utils/fetch';
import executeContentModule from '@/utils/executeContentModule';
import userFeedback from '@/utils/userFeedback';
import getErrorMessage from '@/utils/getErrorMessage';
import getStorage from '@/utils/getStorage';

import { updateBadge, getUnreadFeeds } from '@/utils/rssFeedChecks';
import { log } from '@/log';

async function malPageProcessing(tabId: number, tab: Tabs.Tab) {
  const reA = /^https:\/\/myanimelist.net\/anime\/\d+/;
  const reM = /^https:\/\/myanimelist.net\/manga\/\d+/;
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
}

async function rssFeedProcessing(tabId: number) {
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
}

browser.tabs.onUpdated.addListener(function (
  tabId: number,
  changeInfo: Tabs.OnUpdatedChangeInfoType,
  tab: Tabs.Tab
) {
  const isComplete = changeInfo.status === 'complete';

  if (!isComplete) {
    return;
  }

  log(
    `Tab Complete Update (TabId: ${tabId}) > `,
    tab.title ?? '<no title>',
    changeInfo
  );

  malPageProcessing(tabId, tab);
  rssFeedProcessing(tabId);
});
