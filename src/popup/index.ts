import '../styles/index.scss';
import './popup.scss';
import browser from 'webextension-polyfill';

import { FeedCheck } from '@/types/FeedCheck';

import { MariaAction, MariaAssetFileNames, PageAction } from '@/consts';
import getActiveTab from '@/utils/getActiveTab';
import openNewTabStore from '@/utils/openNewTabStore';
import openRSSViewer from '@/utils/openRSSViewer';

import { setupDownloadGallery } from './downloadGallery';
import { buttonListener } from './utils';
import dateCalculatorManager from './dateCalculator';
import getStorage from '@/utils/getStorage';
import getAssetUrl from '@/utils/getAssetUrl';
import randomValueOfEnum from '@/utils/getRandomEnum';

async function run() {
  dateCalculatorManager.init();

  document
    .getElementById('activateVoice')
    .addEventListener('click', async () => {
      const filename = randomValueOfEnum(MariaAssetFileNames);
      const assetUrl = getAssetUrl(filename);
      const voice = new Audio(assetUrl);
      voice.play();
    });

  document
    .getElementById('openTabStore')
    .addEventListener('click', async () => {
      await openNewTabStore();
      window.close();
    });

  document
    .getElementById('openRSSViewer')
    .addEventListener('click', async () => {
      await openRSSViewer();
      window.close();
    });

  document
    .getElementById('processNumbers')
    .addEventListener('click', () =>
      buttonListener(MariaAction.PROCESS_NUMBERS)
    );

  document
    .getElementById('removeLinks')
    .addEventListener('click', () => buttonListener(MariaAction.REMOVE_LINKS));

  /**
   * Condition specific options...below here
   *
   */

  // Download gallery...
  setupDownloadGallery();

  // RSS feed...
  const activeTab = await getActiveTab();
  const tabId = activeTab.id;
  const pageCheck: FeedCheck = await browser.tabs.sendMessage(tabId, {
    action: PageAction.GET_PAGE_RSS_FEED
  });

  if (pageCheck.hasFeed) {
    const { feeds } = await getStorage();

    if (feeds.some((x) => x.link === pageCheck.link)) {
      return;
    }

    document.getElementById('subscribeToFeed').style.display = 'block';

    const feedSubButton =
      document.querySelector<HTMLButtonElement>('#feedSubscribe');

    feedSubButton.disabled = false;
    feedSubButton.textContent = `Subscribe to ${pageCheck.name}`;
    feedSubButton.addEventListener('click', async (event) => {
      const store = await getStorage();
      const newFeedEntry = {
        name: pageCheck.name,
        link: pageCheck.link,
        hasUnread: false
      };

      await browser.storage.local.set({
        ...store,
        feeds: [...store.feeds, newFeedEntry]
      });

      await browser.browserAction.setBadgeText({ text: '', tabId });

      const btn = event.target as HTMLButtonElement;
      btn.disabled = true;

      document.getElementById('subscribeToFeed').style.display = 'none';
    });
  }
}

run();
