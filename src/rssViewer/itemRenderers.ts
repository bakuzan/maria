import Parser from 'rss-parser';

import { Feed } from '@/types/Feed';
import getUrlOrigin from '@/utils/getUrlOrigin';
import formatDateForDisplay from '@/utils/formatDateForDisplay';

export function createFeedItem(item: Feed) {
  const favicon = `${getUrlOrigin(item.link)}/favicon.ico`;
  const hasUpdate = item.hasUnread ? `<div class="feed-update">!</div>` : '';

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
      <span class="feed-name">${item.name}</span>
    </button>
    ${hasUpdate}
  </li>`;
}

function createFeedEntry(item: Parser.Item) {
  const published = formatDateForDisplay(item.pubDate, true);
  const link = item.link ?? item.enclosure?.url;
  const content = item.contentSnippet
    ? `<div class="rss-feed-entry__content">${item.contentSnippet}</div>`
    : '';

  return `
    <li class="rss-feed-entry">
      <time class="rss-feed-entry__date" dateTime="${item.pubDate}">${published}</time>
      <div class="rss-feed-entry__title">
        <a 
          class="rss-feed-entry__link maria-link" 
          href=${link} 
          target="_blank" 
          rel="noopener noreferrer nofollow">
          ${item.title}
        </a>
      </div>
      ${content}
    </li>
  `;
}

export function renderFeed(data: Parser.Output) {
  const items = data.items.map(createFeedEntry).join('');

  return `
    <section class="rss-feed">
        <header>
          <h2 class="rss-feed__title">${data.title}</h2>
          <p class="rss-feed__subtitle">${data.description}</p>
        </header>
        <ol class="rss-feed__items">
          ${items}
        </ol>
    </section>
  `;
}
