import '../styles/index.scss';
import './rssViewer.scss';
import { browser } from 'webextension-polyfill-ts';

import {
  renderFeedList,
  checkForFeedUpdates,
  getCheckUpdateButton,
  setupMarkAllReadButton
} from './helpers';
import getStorage from '@/utils/getStorage';

async function run() {
  const { feeds } = await getStorage();
  await browser.browserAction.setBadgeText({ text: '' });

  const hasUnread = feeds.some((f) => f.hasUnread);
  setupMarkAllReadButton(hasUnread);

  getCheckUpdateButton().addEventListener('click', checkForFeedUpdates);
  renderFeedList(feeds);
}

run();
