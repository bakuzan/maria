class DownloadDriver {
  private total: number;
  private loaded: number = 0;
  private complete: number = 0;
  private message: HTMLDivElement;
  private progressLoad: HTMLDivElement;
  private progressDone: HTMLDivElement;

  init(total: number) {
    this.total = total;
    this.message = document.querySelector<HTMLDivElement>('#downloadMessage');
    this.message.textContent = 'Downloading...\r\n';

    this.progressLoad = document.querySelector<HTMLDivElement>('#filesQueued');
    this.progressDone = document.querySelector<HTMLDivElement>('#filesLoaded');
  }

  bumpLoadingCount() {
    this.loaded += 1;
    this.progressLoad.textContent = `${this.loaded}/${this.total} Queued`;
  }

  bumpLoadedCount() {
    this.complete += 1;
    this.progressDone.textContent = `${this.complete}/${this.total} Loaded`;
  }

  zipping() {
    this.progressLoad.textContent = '';
    this.progressDone.textContent = '';
    this.message.textContent = 'Zipping...';
  }

  reset() {
    this.progressLoad.textContent = '';
    this.progressDone.textContent = '';
    this.message.textContent = '';
    this.total = undefined;
    this.loaded = 0;
    this.complete = 0;

    delete this.message;
    delete this.progressLoad;
    delete this.progressDone;
  }
}

const driver = new DownloadDriver();

export default driver;
