import browser, { Tabs } from 'webextension-polyfill';

import { TabGroup, StoredTab } from '@/types/TabGroup';
import getStorage from './getStorage';
import generateUniqueId from './generateUniqueId';
import { reloadTabStores } from './reloadMariaPages';
import { uniqueItemsFilter } from './array';
import { PartialBy } from '@/types/utils';

interface TabLinks
  extends PartialBy<Pick<Tabs.Tab, 'id' | 'title' | 'url'>, 'id'> {}

export default async function storeTabs(tabs: TabLinks[]) {
  const store = await getStorage();
  const groups = store.tabGroups;

  const newGroup: TabGroup = {
    id: generateUniqueId(),
    patterns: [],
    items: [],
    isLocked: false
  };

  const lastNotLocked = groups.filter((x) => !x.isLocked).pop();
  const nonMatchedGroup = tabs.length === 1 ? lastNotLocked : newGroup;

  tabs.forEach((tab) => {
    const matchedGroup = groups.find(
      (x) =>
        x.patterns.length &&
        x.patterns.some((p) => tab.url.match(new RegExp(p)))
    );

    const targetGroup = matchedGroup ?? nonMatchedGroup ?? newGroup;
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

export async function storeTabsAfter(activeTab: TabLinks) {
  const tabsAfterCurrent = await browser.tabs.query({}).then((tabs) => {
    const index = tabs.findIndex((t) => t.id === activeTab.id);
    return tabs.slice(index + 1);
  });

  await storeTabs(tabsAfterCurrent);
}

export async function storeTabsBefore(activeTab: TabLinks) {
  const tabsBeforeCurrent = await browser.tabs.query({}).then((tabs) => {
    const index = tabs.findIndex((t) => t.id === activeTab.id);
    return tabs.slice(0, index);
  });

  await storeTabs(tabsBeforeCurrent);
}
