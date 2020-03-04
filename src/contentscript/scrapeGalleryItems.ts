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
        const filename = (name ?? 'maria-gallery-download')
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9_\-\[\] ]/gi, '')
          .trim()
          .replace(/ /g, '-')
          .replace(/-{2,}/g, '-');

        const authour = '';
        // TODO
        // get authour tag content
        // const authour = document.querySelector<HTMLElement>('')?.textContent ?? "unknown";

        return `${filename}-[${authour}].zip`;
      }

      default:
        return;
    }
  });
}
