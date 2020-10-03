import './backgroundCommands';
import './backgroundContextMenu';
import './backgroundOnMessage';
import './backgroundOnUpdated';
import { browser } from 'webextension-polyfill-ts';

import getStorage from '@/utils/getStorage';

import { checkFeedsForUpdates, updateBadge } from '@/utils/rssFeedChecks';

/* When the extension starts up... */
browser.runtime.onStartup.addListener(async function () {
  const store = await getStorage();

  if (store.shouldPlayGreeting) {
    const greetingUrl = browser.runtime.getURL('../assets/greeting.mp3');
    const greeting = new Audio(greetingUrl);
    greeting.play();
  }

  const updatedFeeds = await checkFeedsForUpdates();
  await updateBadge(updatedFeeds);
});
