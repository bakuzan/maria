import browser, { Menus } from 'webextension-polyfill';

import { BASE_JURI_URL, PageAction } from '@/consts';
import handleMagicNumberSelect from '@/utils/handleMagicNumberSelect';
import openWindow from '@/utils/openWindow';
import getActiveTab from '@/utils/getActiveTab';
import storeTabs, { storeTabsAfter, storeTabsBefore } from '@/utils/storeTabs';
import openNewTabStore from '@/utils/openNewTabStore';
import { log } from '@/log';
import timezoneConversion from '@/utils/timezoneConversion';
import openTimezoneConverter from '@/utils/openTimezoneConverter';
import userFeedback from '@/utils/userFeedback';

enum MariaContextMenuOption {
  MagicNumber = 'magic-number',
  TimeZoneConversion = 'timezone-conversion',
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

// Timezone conversion
browser.contextMenus.create({
  id: MariaContextMenuOption.TimeZoneConversion,
  title: 'Convert to local timezone "%s"',
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
    contexts: ['link'] as Menus.ContextType[]
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
  } else if (menuItemId === MariaContextMenuOption.TimeZoneConversion) {
    const output = timezoneConversion(search);

    if (output.success) {
      await openTimezoneConverter(
        output.source,
        output.date,
        output.utcOffset,
        search
      );
    } else {
      await userFeedback('warning', output.errorMessage);
    }
    return;
  }

  if (parentMenuItemId === MariaContextMenuOption.JuriSearch) {
    const itemId = menuItemId as string;
    const [type, age] = itemId.replace(/_/g, ' ').split('-');
    const optionUrl = `${BASE_JURI_URL}?type=${type}&age=${age}`;

    const searchText = search.trim();
    const juriSearchUrl = `${optionUrl}&searchString=${searchText}`;

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
        const linkText: string = await browser.tabs.sendMessage(activeTab.id, {
          action: PageAction.GET_LINK_NAME,
          url: info.linkUrl
        });

        await storeTabs([{ title: linkText, url: info.linkUrl }]);
        break;

      case MariaContextMenuOption.TabStoreStoreTab:
        await storeTabs([activeTab]);
        break;

      case MariaContextMenuOption.TabStoreStoreTabsAfter:
        await storeTabsAfter(activeTab);
        break;

      case MariaContextMenuOption.TabStoreStoreTabsBefore:
        await storeTabsBefore(activeTab);
        break;

      default:
        break;
    }
  }
});
