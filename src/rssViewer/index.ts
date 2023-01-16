import '../styles/index.scss';
import './rssViewer.scss';
import browser from 'webextension-polyfill';

import {
  renderFeedList,
  checkForFeedUpdates,
  getCheckUpdateButton,
  setupMarkAllReadButton
} from './helpers';
import getStorage from '@/utils/getStorage';

async function run() {
  const { feeds } = await getStorage();
  await browser.action.setBadgeText({ text: '' });

  const hasUnread = feeds.some((f) => f.hasUnread);
  setupMarkAllReadButton(hasUnread);

  getCheckUpdateButton().addEventListener('click', checkForFeedUpdates);
  renderFeedList(feeds);
}

run();
