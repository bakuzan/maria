import { browser, Tabs } from 'webextension-polyfill-ts';

import { TabGroup, StoredTab } from '@/types/TabGroup';
import getStorage from './getStorage';
import generateUniqueId from './generateUniqueId';
import reloadTabStores from './reloadTabStores';
import { uniqueItemsFilter } from './array';

interface TabLinks extends Pick<Tabs.Tab, 'id' | 'title' | 'url'> {}

export default async function storeTabs(tabs: TabLinks[]) {
  const store = await getStorage();
  const groups = store.tabGroups;

  const newGroup: TabGroup = {
    id: generateUniqueId(),
    patterns: [],
    items: [],
    isLocked: false
  };

  tabs.forEach((tab) => {
    const matchedGroup = groups.find(
      (x) =>
        x.patterns.length &&
        x.patterns.some((p) => tab.url.match(new RegExp(p)))
    );

    const targetGroup = matchedGroup ?? newGroup;
    targetGroup.items.push({
      title: tab.title,
      url: tab.url
    });

    if (tab.id) {
      browser.tabs.remove(tab.id);
    }
  });

  if (newGroup.items.length !== 0) {
    groups.push(newGroup);
  }

  // Make each group contain only unique urls
  const distinct = uniqueItemsFilter<StoredTab>((x) => x.url);
  groups.forEach((g) => (g.items = g.items.filter(distinct)));

  await browser.storage.local.set({
    ...store,
    tabGroups: groups
  });

  await reloadTabStores();
}
