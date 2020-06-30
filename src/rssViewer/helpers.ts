import { browser } from 'webextension-polyfill-ts';
import Parser from 'rss-parser';

import { Feed } from '@/types/Feed';
import { onFeedSelect, onRemoveFeed } from './feedActions';
import { createFeedItem } from './itemRenderers';
import getStorage from '@/utils/getStorage';

const feedReader = new Parser();
const UPDATE_LOADING_CLASS = 'check-updates-button--loading';

export const getCheckUpdateButton = () =>
  document.querySelector<HTMLButtonElement>('#checkUpdates');

export function renderFeedList(feeds: Feed[]) {
  const feedList = document.getElementById('feeds');

  feedList.innerHTML = feeds
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(createFeedItem)
    .join('');

  Array.from(feedList.querySelectorAll('.remove-button')).forEach((btn) =>
    btn.addEventListener('click', onRemoveFeed)
  );

  Array.from(feedList.querySelectorAll('.feed-button')).forEach((btn) =>
    btn.addEventListener('click', onFeedSelect)
  );
}

export async function checkForFeedUpdates() {
  const { feeds, ...store } = await getStorage();
  const detectedUpdates: Feed[] = [];

  const updateButton = getCheckUpdateButton();
  updateButton.disabled = true;
  updateButton.classList.add(UPDATE_LOADING_CLASS);

  const waitForIt = () =>
    new Promise((resolve) => window.setTimeout(resolve, 500));

  for (const item of feeds) {
    const time = new Date(item.lastUpdate).getTime();

    await waitForIt();
    const data = await feedReader.parseURL(item.link);
    const mostRecentDate = data.items.pop()?.pubDate;
    const lastUpdate = new Date(mostRecentDate ?? new Date()).getTime();

    if (!mostRecentDate || (item.lastUpdate && lastUpdate === time)) {
      continue;
    }

    detectedUpdates.push({
      ...item,
      lastUpdate,
      hasUnread: true
    });
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

    renderFeedList(updatedFeeds);
  }

  updateButton.disabled = false;
  updateButton.classList.remove(UPDATE_LOADING_CLASS);
}
