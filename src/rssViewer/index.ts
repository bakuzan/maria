import '../styles/index.scss';
import './rssViewer.scss';
import { browser } from 'webextension-polyfill-ts';
import Parser from 'rss-parser';

import { createFeedItem, renderFeed } from './itemRenderers';
import getStorage from '@/utils/getStorage';

const feedReader = new Parser();
const ACTIVE_FEED_CLASS = 'feed__item--active';

async function onRemoveFeed(event: Event) {
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

async function onFeedSelect(event: Event) {
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

async function run() {
  const { feeds } = await getStorage();
  await browser.browserAction.setBadgeText({ text: '' });

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

run();
