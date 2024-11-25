import browser from 'webextension-polyfill';

import { PageAction, MariaAction } from '@/consts';
import { log } from '@/log';
import { DownloadItem } from '@/types/DownloadItem';
import { DownloadReport } from '@/types/DownloadReport';
import getActiveTab from '@/utils/getActiveTab';

async function downloadGallery(event: Event) {
  const t = this as HTMLButtonElement;
  if (t.disabled) {
    return;
  }

  const activeTab = await getActiveTab();

  const tabId = activeTab.id;
  const items: DownloadItem[] = await browser.tabs.sendMessage(tabId, {
    action: PageAction.GET_GALLERY
  });

  const filename = await browser.tabs.sendMessage(tabId, {
    action: PageAction.GET_GALLERY_NAME
  });

  log(`Starting download, ${filename}`, items);
  browser.runtime.sendMessage({
    action: MariaAction.DOWNLOAD_GALLERY,
    downloadTabId: tabId,
    filename,
    items
  });
}

export async function setupDownloadGallery() {
  // Listener for download progress reporting
  browser.runtime.onMessage.addListener(async (request: DownloadReport) => {
    if (request.action !== 'popup') {
      return;
    }

    const downloadOption = document.getElementById('downloadGalleryOption');
    const isNotIdle = request.status !== 'idle';

    if (downloadOption.style.display !== 'block') {
      if (isNotIdle) {
        downloadOption.style.display = 'block';
      } else {
        return;
      }
    }

    const btn = document.querySelector<HTMLButtonElement>('#downloadGallery');
    btn.disabled = isNotIdle;

    const message = document.querySelector<HTMLDivElement>('#downloadMessage');
    message.textContent = isNotIdle
      ? `${request.filename}\r\n${request.status}`
      : '';

    document.querySelector<HTMLDivElement>('#filesQueued').textContent =
      request.queued;

    document.querySelector<HTMLDivElement>('#filesLoaded').textContent =
      request.loaded;

    return;
  });

  // Show download button if on valid page
  const activeTab = await getActiveTab();
  const re = /nhentai.net\/g\/\d{1,}\/$/;
  const isGalleryPage = new RegExp(re).test(activeTab.url);

  if (isGalleryPage) {
    document.getElementById('downloadGalleryOption').style.display = 'block';
    const downloadButton =
      document.querySelector<HTMLButtonElement>('#downloadGallery');

    downloadButton.disabled = false;
    downloadButton.addEventListener('click', downloadGallery);
  }

  // Request current status of downloads?
  await browser.runtime.sendMessage({
    action: MariaAction.DOWNLOAD_GALLERY_STATUS
  });
}
