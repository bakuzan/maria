import { browser } from 'webextension-polyfill-ts';

import { PageAction } from '@/consts';
import getNode from '@/utils/getNode';

export default function initOnMessage() {
  browser.runtime.onMessage.addListener(async function (msg, sender) {
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
          authourTag?.textContent.replace(/\(.*$/, '').trim() ?? '';

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
        const link = document.querySelector(`a[href='${msg.url}']`);

        return link?.textContent ?? `${window.location.origin} page link`;
      }

      default:
        return;
    }
  });
}
