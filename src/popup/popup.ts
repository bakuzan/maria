import '../styles.scss';
import './popup.scss';
import { browser } from 'webextension-polyfill-ts';
import JSZip from 'jszip';
import FileSaver from 'file-saver';

import { MariaAction } from '@/consts';
import getActiveTab from '@/utils/getActiveTab';
import downloadDriver from '@/utils/downloadDriver';

function buttonListener(action: MariaAction) {
  return async function() {
    try {
      const activeTab = await getActiveTab();

      await browser.runtime.sendMessage({
        tabID: activeTab.id,
        action
      });
    } catch (error) {
      // TODO
      // Error handling
    }
  };
}

async function downloadGallery() {
  const images = document.querySelectorAll<HTMLImageElement>(''); // TODO selector?
  downloadDriver.init(images.length);

  const zip = new JSZip();

  const items = Array.from(images).map((x, i) => {
    const rawUrl = x.getAttribute('data-src-set'); // TODO check attribute name
    const ext = rawUrl.split('.').pop();
    const name = i.toString().padStart(3, '0');

    return {
      name: `${name}.${ext}`,
      url: rawUrl.replace('//t.', '//i.').replace(`t.${ext}`, `.${ext}`)
    };
  });

  for (const item of items) {
    downloadDriver.bumpLoadingCount();

    const response = await fetch(item.url);
    const img = await response.arrayBuffer();

    zip.file(item.name, img);
    downloadDriver.bumpLoadedCount();
  }

  downloadDriver.zipping();
  zip.generateAsync({ type: 'blob' }).then(function(content) {
    // TODO
    // Get name from page title?
    FileSaver.saveAs(content, 'maria_gallery_download.zip');
    downloadDriver.reset();
  });
}

async function run() {
  document
    .getElementById('processNumbers')
    .addEventListener('click', buttonListener(MariaAction.PROCESS_NUMBERS));

  document
    .getElementById('removeLinks')
    .addEventListener('click', buttonListener(MariaAction.REMOVE_LINKS));

  const activeTab = await getActiveTab();
  const re = /nhentai.net\/g\/\d{1,}$/;
  const isGalleryPage = new RegExp(re).test(activeTab.url);

  if (isGalleryPage) {
    document.getElementById('downloadGalleryOption').style.display = 'block';

    const downloadButton = document.querySelector<HTMLButtonElement>(
      '#downloadGallery'
    );

    downloadButton.disabled = false;
    downloadButton.addEventListener('click', downloadGallery);
  }
}

run();
