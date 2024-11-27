import '../styles/index.scss';
import './tabStore.scss';
import browser from 'webextension-polyfill';

import { TabGroup } from '@/types/TabGroup';
import getStorage from '@/utils/getStorage';
import generateUniqueId from '@/utils/generateUniqueId';
import { TabGroupController } from './TabGroupController';
import checkAndPlayAudio from './audio';

async function run() {
  await checkAndPlayAudio();

  const rootContainer = document.getElementById('tabStore');
  const { tabGroups } = await getStorage();

  const controllers = tabGroups.map(
    (x) => new TabGroupController(rootContainer, x)
  );

  document.getElementById('addNewGroup').addEventListener('click', async () => {
    const store = await getStorage();
    const groups = store.tabGroups;

    const newGroup: TabGroup = {
      id: generateUniqueId(),
      patterns: [],
      items: [],
      isLocked: true
    };

    await browser.storage.local.set({
      ...store,
      tabGroups: [...groups, newGroup]
    });

    controllers.push(new TabGroupController(rootContainer, newGroup));
  });
}

run();
