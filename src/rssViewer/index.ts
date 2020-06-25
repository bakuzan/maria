import '../styles/index.scss';
import './rssViewer.scss';
import { browser } from 'webextension-polyfill-ts';

import { Feed } from '@/types/Feed';
import getStorage from '@/utils/getStorage';
import getUrlOrigin from '@/utils/getUrlOrigin';

function createFeedItem(item: Feed) {
  const favicon = `${getUrlOrigin(item.link)}/favicon.ico`;

  return `
  <li class="feed__item" data-link="${item.link}">
    <button 
      type="button" 
      class="maria-button remove-button" 
      title="Unsubscribe from ${item.name}"
      aria-label="Unsubscribe from ${item.name}">
    ${'\u274C\ufe0e'}
    </button>
    <button 
      type="button" 
      class="maria-button feed-button">
      <img class="feed-icon" src="${favicon}" />
      <div class="feed-name">${item.name}</div>
    </button>
  </li>`;
}

async function run() {
  const { feeds } = await getStorage();

  const rootContainer = document.getElementById('rssViewer');
  const feedList = document.getElementById('feeds');
  const viewer = document.getElementById('content');

  feedList.innerHTML = feeds.map(createFeedItem).join('');

  // TODO
  // remove buttons!!
  // view buttons!!

  console.log('RSS Viewer...', rootContainer, feeds);
}

run();
