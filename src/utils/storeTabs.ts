import { browser, Tabs } from 'webextension-polyfill-ts';

import { TabGroup } from '@/types/TabGroup';
import getStorage from './getStorage';
import generateUniqueId from './generateUniqueId';

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
    console.log(tab.url, tab.title);

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

  await browser.storage.local.set({
    ...store,
    tabGroups: groups
  });

  // Reload any open tabStore.html tabs
  await browser.tabs
    .query({ url: browser.extension.getURL('tabStore.html') })
    .then((ts) => ts.forEach(async (t) => await browser.tabs.reload(t.id)));
}
