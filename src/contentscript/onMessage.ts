import browser from 'webextension-polyfill';

import { PageAction } from '@/consts';
import getNode from '@/utils/getNode';
import isElementHidden from '@/utils/isElementHidden';

type Action = {
  action: PageAction;
  url?: string;
};

export default function initOnMessage() {
  browser.runtime.onMessage.addListener(async function (msg: Action, _sender) {
    switch (msg.action) {
      case PageAction.GET_GALLERY: {
        const images = document.querySelectorAll('.gallerythumb > img');

        return Array.from(images).map((x, i) => {
          const rawUrl = x.getAttribute('data-src');
          const ext = rawUrl.split('.').pop();
          const name = i.toString().padStart(3, '0');

          return {
            name: `${name}.${ext}`,
            url: rawUrl
              .replace(/\/\/t.?\./g, '//i.')
              .replace(`t.${ext}`, `.${ext}`)
          };
        });
      }

      case PageAction.GET_GALLERY_NAME: {
        // Authour
        const authourTag = getNode(`//a[starts-with(@href, "/artist/")]`);
        const authour =
          authourTag
            ?.querySelector('.name')
            ?.textContent.replace(/\(.*$/, '')
            .replace(/\|.*$/, '')
            .trim() ?? '';

        const pre = `[${authour.replace(/ /g, '-')}]`;

        // Title
        const name = document.querySelector('h1')?.textContent;
        const [lowerName, other] = (name ?? 'maria-gallery-download')
          .toLowerCase()
          .trim()
          .split('|');

        // Collection name
        const collectionName = other?.match(/\(.*?\)/) ?? '';
        const suff = collectionName ? `-[${collectionName}]` : '';

        const filename = `${lowerName}${suff}`
          .replace(/[^a-z0-9_\-\[\] ]/gi, '')
          .trim()
          .replace(/ /g, '-')
          .replace(/-{2,}/g, '-')
          .replace(`${pre}-`, '')
          .trim();

        return `${pre}-${filename}.zip`;
      }

      case PageAction.GET_LINK_NAME: {
        const origin = window.location.origin;
        const linkEnding = msg.url
          ? msg.url
              .replace(window.location.origin, '')
              .replace(window.location.protocol, '')
          : '';

        const links = document.querySelectorAll(`a[href$='${linkEnding}']`);
        const link = Array.from(links).find(
          (x: HTMLElement) => !isElementHidden(x)
        );

        return link?.textContent ?? `${origin} page link`;
      }

      case PageAction.GET_PAGE_RSS_FEED: {
        const feed = document.querySelector<HTMLLinkElement | null>(
          `link[type="application/rss+xml"]`
        );

        const feedContainer = document.querySelector<HTMLPreElement | null>(
          'pre'
        );

        const rssElement = document.querySelector<Element | null>('rss');

        if (feed) {
          const pageName = `${window.document.title} RSS`;
          const feedName = (feed.title || pageName).trim();
          const isBadRSSName = feedName.toLowerCase() === 'rss';
          const name = isBadRSSName ? pageName : feedName;

          return { hasFeed: true, name, link: feed.href };
        } else if (
          feedContainer &&
          (feedContainer.textContent.includes('type="application/rss+xml"') ||
            feedContainer.textContent.includes('<rss'))
        ) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(
            feedContainer.textContent,
            'text/xml'
          );

          const title = xmlDoc.querySelector('channel').querySelector('title');
          const link = xmlDoc
            .querySelector('channel')
            .querySelector('link[rel="self"]')
            ?.getAttribute('href');

          return {
            hasFeed: true,
            name: title.textContent,
            link: link ?? window.location.href
          };
        } else if (rssElement) {
          const title = rssElement.querySelector('title');

          return {
            hasFeed: true,
            name: title.textContent,
            link: window.location.href
          };
        }

        return { hasFeed: false, name: '', link: '' };
      }

      default:
        return;
    }
  });
}
