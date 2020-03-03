import { browser } from 'webextension-polyfill-ts';

import { BASE_JURI_URL } from '@/consts';
import handleMagicNumberSelect from '@/utils/handleMagicNumberSelect';
import openWindow from '@/utils/openWindow';

enum MariaContextMenuOption {
  MagicNumber = 'magic-number',
  JuriSearch = 'juri-search',
  JuriSearchAnime = 'anime-all_ages',
  JuriSearchManga = 'manga-all_ages',
  JuriSearchAnimeAdult = 'anime-adult',
  JuriSearchMangaAdult = 'manga-adult'
}

// Magic number search
browser.contextMenus.create({
  id: MariaContextMenuOption.MagicNumber,
  title: 'View magic number "%s"',
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

function onInstalled() {
  browser.contextMenus.create({
    id: MariaContextMenuOption.JuriSearch,
    title: 'Search Juri',
    contexts: ['selection']
  });

  juriSearchOptions.forEach((option) => {
    browser.contextMenus.create({
      parentId: MariaContextMenuOption.JuriSearch,
      contexts: ['selection'],
      ...option
    });
  });

  browser.contextMenus.onClicked.addListener(function(info) {
    const { menuItemId, selectionText: search } = info;
    const itemId = menuItemId as string;

    if (menuItemId === MariaContextMenuOption.MagicNumber) {
      handleMagicNumberSelect(search);
      return;
    }

    const [type, age] = itemId.replace(/_/g, ' ').split('-');
    const optionUrl = `${BASE_JURI_URL}?type=${type}&age=${age}`;
    const juriSearchUrl = `${optionUrl}&searchString=${search}`;

    openWindow(juriSearchUrl);
  });
}

browser.runtime.onInstalled.addListener(onInstalled);
