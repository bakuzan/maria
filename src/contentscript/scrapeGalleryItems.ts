import { PageAction } from '@/consts';
import { browser } from 'webextension-polyfill-ts';

export default function initScrapeGalleryItems() {
  browser.runtime.onMessage.addListener(async function(msg, sender) {
    switch (msg.action) {
      case PageAction.GET_GALLERY: {
        const images = document.querySelectorAll('.gallerythumb > img');

        return Array.from(images).map((x, i) => {
          const rawUrl = x.getAttribute('data-src');
          const ext = rawUrl.split('.').pop();
          const name = i.toString().padStart(3, '0');

          return {
            name: `${name}.${ext}`,
            url: rawUrl.replace('//t.', '//i.').replace(`t.${ext}`, `.${ext}`)
          };
        });
      }
      case PageAction.GET_GALLERY_NAME: {
        const [name] = window.document.title.split('»');
        const filename = name
          .toLowerCase()
          .trim()
          .replace(/ /g, '-');

        // TODO
        // Remove invalid filename characters

        return `${filename}.zip`;
      }
      default:
        return;
    }
  });
}
