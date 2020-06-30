import { browser } from 'webextension-polyfill-ts';
import Parser from 'rss-parser';

import { renderFeed } from './itemRenderers';
import getStorage from '@/utils/getStorage';

const feedReader = new Parser();
const ACTIVE_FEED_CLASS = 'feed__item--active';

export async function onRemoveFeed(event: Event) {
  const t = this as HTMLButtonElement;
  const parent = t.parentElement;
  const link = parent.getAttribute('data-link');

  const store = await getStorage();
  const feeds = store.feeds.filter((f) => f.link !== link);
  await browser.storage.local.set({
    ...store,
    feeds
  });

  parent.parentNode.removeChild(parent);
}

export async function onFeedSelect(event: Event) {
  const t = this as HTMLButtonElement;
  const parent = t.parentElement;
  const link = parent.getAttribute('data-link');

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

  const data = await feedReader.parseURL(link);
  const viewer = document.getElementById('content');
  viewer.innerHTML = renderFeed(data);

  const store = await getStorage();
  const feeds = store.feeds.map((f) =>
    f.link !== link ? f : { ...f, hasUnread: false }
  );

  await browser.storage.local.set({
    ...store,
    feeds
  });
}
