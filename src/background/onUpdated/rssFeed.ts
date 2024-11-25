import browser from 'webextension-polyfill';

import { PageAction } from '@/consts';
import { FeedCheck } from '@/types/FeedCheck';
import getStorage from '@/utils/getStorage';
import { updateBadge, getUnreadFeeds } from '@/utils/rssFeedChecks';

export default async function rssFeedProcessing(tabId: number) {
  const pageCheck: FeedCheck = await browser.tabs.sendMessage(tabId, {
    action: PageAction.GET_PAGE_RSS_FEED
  });

  if (pageCheck.hasFeed) {
    const { feeds } = await getStorage();

    if (feeds.some((x) => x.link === pageCheck.link)) {
      return;
    }

    await browser.action.setBadgeText({ text: '!', tabId });
    await browser.action.setBadgeBackgroundColor({
      color: `#ffa500`,
      tabId
    });
  } else {
    const text = await browser.action.getBadgeText({});

    if (!text) {
      const unreadFeeds = await getUnreadFeeds();
      await updateBadge(unreadFeeds);
    }
  }
}
