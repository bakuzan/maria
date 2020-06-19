import { browser } from 'webextension-polyfill-ts';

import { PageAction } from '@/consts';
import { DownloadItem } from '@/types/DownloadItem';
import getActiveTab from '@/utils/getActiveTab';
import downloadDriver from '@/utils/downloadDriver';

export default async function downloadGallery() {
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

    const img = await fetch(item.url).then((response) =>
      response.arrayBuffer()
    );

    zip.file(item.name, img);
    downloadDriver.bumpLoadedCount();
  }

  downloadDriver.zipping();
  zip.generateAsync({ type: 'blob' }).then(async function (content) {
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
