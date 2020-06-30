import '../styles/index.scss';
import './rssViewer.scss';
import { browser } from 'webextension-polyfill-ts';

import {
  renderFeedList,
  checkForFeedUpdates,
  getCheckUpdateButton
} from './helpers';
import getStorage from '@/utils/getStorage';

async function run() {
  const { feeds } = await getStorage();
  await browser.browserAction.setBadgeText({ text: '' });

  getCheckUpdateButton().addEventListener('click', checkForFeedUpdates);
  renderFeedList(feeds);
}

run();
