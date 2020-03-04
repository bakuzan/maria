import '../styles.scss';
import './popup.scss';
import { browser } from 'webextension-polyfill-ts';

import { MariaAction, PageAction } from '@/consts';
import { DownloadItem } from '@/types/DownloadItem';
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
  const { default: JSZip } = await import(
    /* webpackChunkName: "jszip" */ 'jszip'
  );

  const activeTab = await getActiveTab();

  const tabId = activeTab.id;
  const items: DownloadItem[] = await browser.tabs.sendMessage(tabId, {
    action: PageAction.GET_GALLERY
  });

  downloadDriver.init(items.length);

  const zip = new JSZip();

  for (const item of items) {
    downloadDriver.bumpLoadingCount();

    const response = await fetch(item.url);
    const img = await response.arrayBuffer();

    zip.file(item.name, img);
    downloadDriver.bumpLoadedCount();
  }

  downloadDriver.zipping();
  zip.generateAsync({ type: 'blob' }).then(async function(content) {
    const url = URL.createObjectURL(content);
    const filename = await browser.tabs.sendMessage(tabId, {
      action: PageAction.GET_GALLERY_NAME
    });

    await browser.downloads.download({
      url,
      filename,
      saveAs: true
    });

    downloadDriver.reset();
    URL.revokeObjectURL(url);
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
  const re = /nhentai.net\/g\/\d{1,}\/$/;
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
