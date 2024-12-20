import browser from 'webextension-polyfill';
import { Feed } from '@/types/Feed';

import { checkFeedsForUpdates } from '@/utils/rssFeedChecks';
import getStorage from '@/utils/getStorage';

import {
  getMarkAllReadButton,
  onFeedSelect,
  onRemoveFeed,
  updateFeedMetaData
} from './feedActions';
import { createFeedItem } from './itemRenderers';

const UPDATE_LOADING_CLASS = 'check-updates-button--loading';

export const getCheckUpdateButton = () =>
  document.querySelector<HTMLButtonElement>('#checkUpdates');

export function renderFeedList(feeds: Feed[], isLoading = false) {
  const feedList = document.getElementById('feeds');
  feedList.innerHTML = feeds
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((x) => createFeedItem(x, isLoading))
    .join('');

  updateFeedMetaData(feeds);

  Array.from(feedList.querySelectorAll('.remove-button')).forEach((btn) =>
    btn.addEventListener('click', onRemoveFeed)
  );

  Array.from(feedList.querySelectorAll('.feed-button')).forEach((btn) =>
    btn.addEventListener('click', onFeedSelect)
  );
}

function updateFeedListItem(item: Feed, error = false) {
  const node = document.querySelector(`[data-link="${item.link}"`);
  const loader = node.querySelector('.feed-loading');

  if (item.hasUnread) {
    const label = 'Has unread update';
    loader.className = 'feed-update';
    loader.setAttribute('aria-label', label);
    loader.setAttribute('title', label);
    loader.innerHTML = '<span aria-hidden="true">!</span>';
  } else if (error) {
    const label = 'Has error';
    loader.className = 'feed-error';
    loader.setAttribute('aria-label', label);
    loader.setAttribute('title', label);
    loader.innerHTML = '<span aria-hidden="true">!</span>';
  } else {
    node.removeChild(loader);
  }
}

export async function checkForFeedUpdates() {
  const updateButton = getCheckUpdateButton();
  updateButton.disabled = true;
  updateButton.classList.add(UPDATE_LOADING_CLASS);

  const { feeds } = await getStorage();
  renderFeedList(feeds, true);

  const updatedFeeds = await checkFeedsForUpdates(updateFeedListItem);

  if (updatedFeeds.length) {
    renderFeedList(updatedFeeds);

    const marButton = getMarkAllReadButton();
    marButton.classList.remove('no-updates');
  }

  updateButton.disabled = false;
  updateButton.classList.remove(UPDATE_LOADING_CLASS);
}

async function markAllRead() {
  const marButton = getMarkAllReadButton();
  marButton.disabled = true;

  const { feeds, ...store } = await getStorage();
  feeds.forEach((f) => (f.hasUnread = false));
  renderFeedList(feeds);

  await browser.storage.local.set({
    ...store,
    feeds
  });

  marButton.disabled = false;
  marButton.classList.add('no-updates');
}

export function setupMarkAllReadButton(hasUnread: boolean) {
  const marButton = getMarkAllReadButton();
  marButton.addEventListener('click', markAllRead);

  if (!hasUnread) {
    marButton.classList.add('no-updates');
  }
}
