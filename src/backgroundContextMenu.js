import './thirdParty/hot-reload.js';
import './thirdParty/chrome-extension-async.js';
import { BASE_JURI_URL } from './consts.js';
import handleMagicNumberSelect from './utils/handleMagicNumberSelect.js';
import openWindow from './utils/openWindow.js';

// Magic number search
chrome.contextMenus.create({
  title: 'View magic number "%s"',
  contexts: ['selection'],
  onclick: function(info) {
    const { selectionText } = info;
    handleMagicNumberSelect(selectionText);
  }
});

// Juri search
const JURI_SEARCH_ID = 'juri-search';
const juriSearchOptions = [
  { title: 'Anime', onclick: createJuriSearchHandler('anime', 'all ages') },
  { title: 'Manga', onclick: createJuriSearchHandler('manga', 'all ages') },
  { title: 'Anime 18+', onclick: createJuriSearchHandler('anime', 'adult') },
  { title: 'Manga 18+', onclick: createJuriSearchHandler('manga', 'adult') }
];

function createJuriSearchHandler(type, age) {
  const optionUrl = `${BASE_JURI_URL}?type=${type}&age=${age}`;
  return function handleJuriSearch(info) {
    const { selectionText: search } = info;
    const juriSearchUrl = `${optionUrl}&searchString=${search}`;
    openWindow(juriSearchUrl);
  };
}

chrome.contextMenus.create({
  id: JURI_SEARCH_ID,
  title: 'Search Juri',
  contexts: ['selection']
});

juriSearchOptions.forEach((option) => {
  chrome.contextMenus.create({
    parentId: JURI_SEARCH_ID,
    contexts: ['selection'],
    ...option
  });
});
