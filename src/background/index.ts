import './backgroundCommands';
import './backgroundContextMenu';
import './backgroundOnMessage';
import './backgroundOnUpdated';
import { browser } from 'webextension-polyfill-ts';

import getStorage from '@/utils/getStorage';
import getAssetUrl from '@/utils/getAssetUrl';
import { checkFeedsForUpdates, updateBadge } from '@/utils/rssFeedChecks';
import { MariaAssetFileNames } from '@/consts';

async function startup() {
  const store = await getStorage();

  if (store.shouldPlayGreeting) {
    const greetingUrl = getAssetUrl(MariaAssetFileNames.Greeting);
    const greeting = new Audio(greetingUrl);
    greeting.play();
  }

  const updatedFeeds = await checkFeedsForUpdates();
  await updateBadge(updatedFeeds);
}

/* When the extension starts up... */
browser.runtime.onStartup.addListener(function () {
  startup();
});
