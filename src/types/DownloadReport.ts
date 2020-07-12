export type DownloadStatus = 'idle' | 'Downloading...' | 'Zipping...';

export interface DownloadReport {
  action: 'popup';
  filename: string;
  status: DownloadStatus;
  queued: string;
  loaded: string;
}
