import browser from 'webextension-polyfill';

import { DownloadStatus } from '@/types/DownloadReport';

class DownloadTracker {
  private status: DownloadStatus = 'idle';
  private total: number = 0;
  private queued: number = 0;
  private loaded: number = 0;

  private filename: string = '';

  init(total: number, filename: string) {
    this.total = total;
    this.status = 'Downloading...';

    this.updateBadge('#');
  }

  bumpQueuedCount() {
    this.queued += 1;
    this.report();
  }

  bumpLoadedCount() {
    this.loaded += 1;
    this.report();
  }

  zipping() {
    this.status = 'Zipping...';
    this.report();
  }

  reset() {
    this.status = 'idle';
    this.total = 0;
    this.queued = 0;
    this.loaded = 0;
    this.filename = '';

    this.updateBadge();
    this.report();
  }

  report() {
    const isIdle = this.status === 'idle';
    const queued = isIdle ? '' : `${this.queued}/${this.total} queued`;
    const loaded = isIdle ? '' : `${this.loaded}/${this.total} loaded`;

    browser.runtime.sendMessage({
      action: 'popup',
      filename: this.filename,
      status: this.status,
      queued,
      loaded
    });
  }

  private async updateBadge(text?: string) {
    await browser.browserAction.setBadgeText({ text });
    await browser.browserAction.setBadgeBackgroundColor({
      color: `#800080`
    });
  }
}

const tracker = new DownloadTracker();

export default tracker;
