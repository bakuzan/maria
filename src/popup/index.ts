import '../styles/index.scss';
import './popup.scss';
import { browser } from 'webextension-polyfill-ts';

import { FeedCheck } from '@/types/FeedCheck';

import { MariaAction, PageAction } from '@/consts';
import getActiveTab from '@/utils/getActiveTab';
import openNewTabStore from '@/utils/openNewTabStore';
import openRSSViewer from '@/utils/openRSSViewer';

import downloadGallery from './downloadGallery';
import { buttonListener } from './utils';
import dateCalculatorManager from './dateCalculator';
import getStorage from '@/utils/getStorage';

async function run() {
  dateCalculatorManager.init();

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
    .addEventListener('click', buttonListener(MariaAction.PROCESS_NUMBERS));

  document
    .getElementById('removeLinks')
    .addEventListener('click', buttonListener(MariaAction.REMOVE_LINKS));

  // Condition specific options...

  const activeTab = await getActiveTab();
  const re = /nhentai.net\/g\/\d{1,}\/$/;
  const isGalleryPage = new RegExp(re).test(activeTab.url);

  if (isGalleryPage) {
    document.getElementById('downloadGalleryOption').style.display = 'block';

    const downloadButton = document.querySelector<HTMLButtonElement>(
      '#downloadGallery'
    );

    downloadButton.disabled = false;
    downloadButton.addEventListener('click', downloadGallery);
  }

  // RSS feed...
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

    const feedSubButton = document.querySelector<HTMLButtonElement>(
      '#feedSubscribe'
    );

    feedSubButton.disabled = false;
    feedSubButton.textContent = `Subscribe to ${pageCheck.name}`;
    feedSubButton.addEventListener('click', async (event) => {
      const store = await getStorage();

      await browser.storage.local.set({
        ...store,
        feeds: [...store.feeds, { name: pageCheck.name, link: pageCheck.link }]
      });

      await browser.browserAction.setBadgeText({ text: '', tabId });

      const btn = event.target as HTMLButtonElement;
      btn.disabled = true;

      document.getElementById('subscribeToFeed').style.display = 'none';
    });
  }
}

run();
