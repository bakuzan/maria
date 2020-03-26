import { browser, Tabs } from 'webextension-polyfill-ts';

import { TabGroup } from '@/types/TabGroup';
import getStorage from './getStorage';
import generateUniqueId from './generateUniqueId';

export default async function storeTabs(tabs: Tabs.Tab[]) {
  const store = await getStorage();
  const groups = store.tabGroups;

  const newGroup: TabGroup = {
    id: generateUniqueId(),
    patterns: [],
    items: [],
    isLocked: false
  };

  tabs.forEach((tab) => {
    console.log(tab.url, tab.title);

    const matchedGroup = groups.find(
      (x) => x.patterns.length && x.patterns.some((p) => tab.url.match(p))
    );

    const targetGroup = matchedGroup ?? newGroup;
    targetGroup.items.push({
      title: tab.title,
      url: tab.url
    });

    browser.tabs.remove(tab.id);
  });

  if (newGroup.items.length !== 0) {
    groups.push(newGroup);
  }

  await browser.storage.sync.set({
    ...store,
    tabGroups: groups
  });
}
