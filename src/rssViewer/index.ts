import '../styles/index.scss';
import './rssViewer.scss';
import { browser } from 'webextension-polyfill-ts';

import {
  renderFeedList,
  checkForFeedUpdates,
  getCheckUpdateButton,
  getMarkAllReadButton,
  markAllRead
} from './helpers';
import getStorage from '@/utils/getStorage';

async function run() {
  const { feeds } = await getStorage();
  await browser.browserAction.setBadgeText({ text: '' });

  const hasUnread = feeds.some((f) => f.hasUnread);
  const marButton = getMarkAllReadButton();
  marButton.addEventListener('click', markAllRead);

  if (!hasUnread) {
    marButton.classList.add('no-updates');
  }

  getCheckUpdateButton().addEventListener('click', checkForFeedUpdates);
  renderFeedList(feeds);
}

run();
