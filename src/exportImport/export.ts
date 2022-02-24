import { MariaStore } from '@/types/MariaStore';
import getStorage from '@/utils/getStorage';

let timer = 0;

function setupCopier(data: MariaStore) {
  const exportValue = JSON.stringify(data, null, 2);
  const exportArea = document.getElementById('export') as HTMLTextAreaElement;
  exportArea.value = exportValue;

  const copyButton = document.getElementById('copyExport');
  copyButton.addEventListener('click', async () => {
    const originalTextContent = copyButton.textContent;

    await navigator.clipboard
      .writeText(exportValue)
      .then(() => (copyButton.textContent = 'Copied!'));

    clearTimeout(timer);
    timer = window.setTimeout(() => {
      copyButton.textContent = originalTextContent;
    }, 1000);
  });
}

function download(downloadBlob: Blob, fileName: string) {
  const downloadLink = URL.createObjectURL(downloadBlob);
  const link = document.createElement('a');
  link.setAttribute('href', downloadLink);
  link.setAttribute('download', fileName);
  //   document.body.appendChild(link);
  link.click();
  //   document.body.removeChild(link);
}

export default async function exportHandler() {
  const data = await getStorage();

  setupCopier(data);

  // File downloader
  const exportButton = document.getElementById('exportFile');
  exportButton.addEventListener('click', async () => {
    const exportValue = JSON.stringify(data, null, 2);
    const fileBlob = new Blob([exportValue]);
    download(fileBlob, 'maria.json');
  });
}
