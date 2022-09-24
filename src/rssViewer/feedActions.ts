import { browser } from 'webextension-polyfill-ts';
import Parser from 'rss-parser';

import { Feed } from '@/types/Feed';

import { renderFeed } from './itemRenderers';
import { afterRenderFeed } from './lifecycles';
import { LoaderHTML } from '@/consts';
import { log } from '@/log';
import getStorage from '@/utils/getStorage';
import { getLastUpdateDate, updateBadge } from '@/utils/rssFeedChecks';

const feedReader = new Parser();
const ACTIVE_FEED_CLASS = 'feed__item--active';

export const getMarkAllReadButton = () =>
  document.querySelector<HTMLButtonElement>('#markAllRead');

export function updateFeedMetaData(feeds: Feed[]) {
  // Feed text
  const feedMeta = document.getElementById('rssViewerMeta');
  const feedCount = feeds.length;
  const unreadCount = feeds.filter((x) => x.hasUnread).length;
  const unreadText = unreadCount ? `, with ${unreadCount} updates.` : '.';
  feedMeta.innerHTML = `Showing ${feedCount} feeds${unreadText}`;

  // Mark unread button
  const marButton = getMarkAllReadButton();
  const hasUnread = unreadCount > 0;
  hasUnread
    ? marButton.classList.remove('no-updates')
    : marButton.classList.add('no-updates');

  log(`Feeds: `, feeds);
}

export async function onRemoveFeed(event: Event) {
  const t = this as HTMLButtonElement;
  const parent = t.parentElement;
  const link = parent.getAttribute('data-link') ?? undefined;

  const store = await getStorage();
  const feeds = store.feeds.filter((f) => f.link !== link);

  updateFeedMetaData(feeds);
  await browser.storage.local.set({
    ...store,
    feeds
  });

  parent.parentNode.removeChild(parent);
}

function renderDelayedLoader(element: HTMLElement) {
  return window.setTimeout(() => (element.innerHTML = LoaderHTML), 1000);
}

export async function onFeedSelect(event: Event) {
  const t = this as HTMLButtonElement;
  const parent = t.parentElement;
  const link = parent.getAttribute('data-link');
  const viewer = document.getElementById('content');
  const timer = renderDelayedLoader(viewer);

  document
    .getElementById('feeds')
    .querySelectorAll('.feed__item')
    .forEach((li) => {
      if (li.getAttribute('data-link') === link) {
        li.classList.add(ACTIVE_FEED_CLASS);

        const updateIcon = li.querySelector('.feed-update');
        if (updateIcon) {
          li.removeChild(updateIcon);
        }
      } else {
        li.classList.remove(ACTIVE_FEED_CLASS);
      }
    });

  try {
    const data = await feedReader.parseURL(link);
    const mostRecent = getLastUpdateDate(data);

    log('Feed: ', data);
    clearTimeout(timer);
    viewer.innerHTML = renderFeed(data);
    afterRenderFeed(viewer);

    const store = await getStorage();
    const feeds = store.feeds.map((f) =>
      f.link !== link
        ? { ...f }
        : {
            ...f,
            lastUpdate: mostRecent.lastUpdate,
            hasUnread: false
          }
    );

    updateFeedMetaData(feeds);
    await browser.storage.local.set({
      ...store,
      feeds
    });

    await updateBadge(feeds);
  } catch (e) {
    clearTimeout(timer);
    viewer.innerHTML = `
      <div>
        <p>Failed to load feed.</p>
        <p>Url: ${link}</p>
        <pre>
          ${e.message}
        </pre>
      </div>
    `;
  }
}
