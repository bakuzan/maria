import { browser } from 'webextension-polyfill-ts';
import Parser from 'rss-parser';

import { Feed } from '@/types/Feed';
import getStorage from '@/utils/getStorage';
import { log, reportError } from '@/log';

const feedReader = new Parser();

const waitForIt = () =>
  new Promise((resolve) => window.setTimeout(resolve, 250));

export async function updateBadge(updates: Feed[]) {
  const unreadCount = updates.filter((x) => x.hasUnread).length;

  await browser.browserAction.setBadgeBackgroundColor({
    color: `#0070ff`
  });

  await browser.browserAction.setBadgeText({
    text: unreadCount ? `${unreadCount}` : ''
  });
}

export function getLastUpdateDate(data: Parser.Output) {
  const mostRecentDate = data.items[0]?.pubDate;

  return {
    hasDate: !!mostRecentDate,
    lastUpdate: new Date(mostRecentDate ?? new Date()).getTime()
  };
}

export async function checkFeedsForUpdates(
  // tslint:disable-next-line no-empty
  callback: (processed: Feed, error?: boolean) => void = () => {}
) {
  const { feeds, ...store } = await getStorage();
  const detectedUpdates: Feed[] = [];

  for (const item of feeds) {
    const time = new Date(item.lastUpdate).getTime();

    await waitForIt();

    try {
      const data = await feedReader.parseURL(item.link);
      const recentUpdate = getLastUpdateDate(data);
      const noUpdate =
        !recentUpdate.hasDate ||
        (item.lastUpdate && recentUpdate.lastUpdate === time);

      if (noUpdate) {
        log(`RSS Feed ${item.name} has no update.`);
        callback(item);
        continue;
      }

      const updated = {
        ...item,
        lastUpdate: recentUpdate.lastUpdate,
        hasUnread: true
      };
      detectedUpdates.push(updated);

      log(`RSS Feed ${item.name} updated!`);
      callback(updated);
    } catch (e) {
      reportError(e.message);
      callback(item, true);
    }
  }

  const updatedCount = detectedUpdates.length;

  if (updatedCount) {
    const updatedFeeds = feeds.map(
      (x) => detectedUpdates.find((u) => u.link === x.link) ?? x
    );

    await browser.storage.local.set({
      ...store,
      feeds: updatedFeeds
    });

    return updatedFeeds;
  }

  return [];
}

export async function getUnreadFeeds() {
  const store = await getStorage();
  return store.feeds.filter((x) => x.hasUnread);
}
