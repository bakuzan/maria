import { browser, ContextMenus } from 'webextension-polyfill-ts';

import { BASE_JURI_URL, PageAction } from '@/consts';
import handleMagicNumberSelect from '@/utils/handleMagicNumberSelect';
import openWindow from '@/utils/openWindow';
import getActiveTab from '@/utils/getActiveTab';
import storeTabs from '@/utils/storeTabs';
import openNewTabStore from '@/utils/openNewTabStore';
import { log } from '@/log';

enum MariaContextMenuOption {
  MagicNumber = 'magic-number',
  JuriSearch = 'juri-search',
  JuriSearchAnime = 'anime-all_ages',
  JuriSearchManga = 'manga-all_ages',
  JuriSearchAnimeAdult = 'anime-adult',
  JuriSearchMangaAdult = 'manga-adult',
  TabStore = 'tab-store',
  TabStoreOpen = 'open-tab-store',
  TabStoreStoreLink = 'store-link',
  TabStoreStoreTab = 'store-tab',
  TabStoreStoreTabsBefore = 'store-tabs-before',
  TabStoreStoreTabsAfter = 'store-tabs-after'
}

// Magic number search
browser.contextMenus.create({
  id: MariaContextMenuOption.MagicNumber,
  title: 'View magic number "%s"',
  contexts: ['selection']
});

// Search
browser.contextMenus.create({
  id: MariaContextMenuOption.JuriSearch,
  title: 'Search Juri',
  contexts: ['selection']
});

// Juri search
const juriSearchOptions = [
  {
    id: MariaContextMenuOption.JuriSearchAnime,
    title: 'Anime'
  },
  {
    id: MariaContextMenuOption.JuriSearchManga,
    title: 'Manga'
  },
  {
    id: MariaContextMenuOption.JuriSearchAnimeAdult,
    title: 'Anime 18+'
  },
  {
    id: MariaContextMenuOption.JuriSearchMangaAdult,
    title: 'Manga 18+'
  }
];

juriSearchOptions.forEach((option) => {
  browser.contextMenus.create({
    parentId: MariaContextMenuOption.JuriSearch,
    contexts: ['selection'],
    ...option
  });
});

// Tab Store
browser.contextMenus.create({
  id: MariaContextMenuOption.TabStore,
  title: `Maria's Tab Store`,
  contexts: ['page', 'link']
});

const tabStoreOptions = [
  { id: MariaContextMenuOption.TabStoreOpen, title: 'Open tab store' },
  {
    id: MariaContextMenuOption.TabStoreStoreTab,
    title: 'Send current tab to store'
  },
  {
    id: MariaContextMenuOption.TabStoreStoreLink,
    title: 'Send link to store',
    contexts: ['link'] as ContextMenus.ContextType[]
  },
  {
    id: MariaContextMenuOption.TabStoreStoreTabsAfter,
    title: 'Send tabs after the current tab to store'
  },
  {
    id: MariaContextMenuOption.TabStoreStoreTabsBefore,
    title: 'Send tabs before the current tab to store'
  }
];

tabStoreOptions.forEach((option) => {
  browser.contextMenus.create({
    parentId: MariaContextMenuOption.TabStore,
    ...option
  });
});

// ContextMenu click handler
browser.contextMenus.onClicked.addListener(async function (info) {
  const { menuItemId, parentMenuItemId, selectionText: search } = info;
  log('Context menu click : ', info);

  if (menuItemId === MariaContextMenuOption.MagicNumber) {
    handleMagicNumberSelect(search);
    return;
  }

  if (parentMenuItemId === MariaContextMenuOption.JuriSearch) {
    const itemId = menuItemId as string;
    const [type, age] = itemId.replace(/_/g, ' ').split('-');
    const optionUrl = `${BASE_JURI_URL}?type=${type}&age=${age}`;
    const juriSearchUrl = `${optionUrl}&searchString=${search}`;

    await openWindow(juriSearchUrl);
    return;
  }

  if (parentMenuItemId === MariaContextMenuOption.TabStore) {
    const activeTab = await getActiveTab();

    switch (menuItemId) {
      case MariaContextMenuOption.TabStoreOpen:
        await openNewTabStore();
        break;

      case MariaContextMenuOption.TabStoreStoreLink:
        const linkText = await browser.tabs.sendMessage(activeTab.id, {
          action: PageAction.GET_LINK_NAME,
          url: info.linkUrl
        });

        await storeTabs([{ title: linkText, url: info.linkUrl }]);
        break;

      case MariaContextMenuOption.TabStoreStoreTab:
        await storeTabs([activeTab]);
        break;

      case MariaContextMenuOption.TabStoreStoreTabsAfter:
        const tabsAfterCurrent = await browser.tabs.query({}).then((tabs) => {
          const index = tabs.findIndex((t) => t.id === activeTab.id);
          return tabs.slice(index + 1);
        });

        await storeTabs(tabsAfterCurrent);
        break;

      case MariaContextMenuOption.TabStoreStoreTabsBefore:
        const tabsBeforeCurrent = await browser.tabs.query({}).then((tabs) => {
          const index = tabs.findIndex((t) => t.id === activeTab.id);
          return tabs.slice(0, index);
        });

        await storeTabs(tabsBeforeCurrent);
        break;

      default:
        break;
    }
  }
});
