import '../styles/index.scss';
import './exportImport.scss';
import { browser } from 'webextension-polyfill-ts';

import getStorage from '@/utils/getStorage';
import reloadTabStores from '@/utils/reloadTabStores';
import processImportedValue from './processImportedValue';

const ERROR_CLASS = 'maria-feedback--error';
const SUCCESS_CLASS = 'maria-feedback--success';
const WARNING_CLASS = 'maria-feedback--warning';
let timer = 0;

async function run() {
  const data = await getStorage();
  console.log('Export/Import page > ', data);

  // Export
  const exportValue = JSON.stringify(data.tabGroups, null, 2);
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

  // Import
  const feedback = document.getElementById('import-feedback');
  document.getElementById('runImport').addEventListener('click', async () => {
    feedback.textContent = '';

    const importArea = document.getElementById('import') as HTMLTextAreaElement;
    const importValue = importArea.value;

    try {
      const parsed = JSON.parse(importValue);

      const processed = processImportedValue(parsed);
      if (processed.success) {
        const activeClass = processed.message ? WARNING_CLASS : SUCCESS_CLASS;
        const inactiveClass = !processed.message
          ? WARNING_CLASS
          : SUCCESS_CLASS;

        feedback.classList.remove(ERROR_CLASS);
        feedback.classList.remove(inactiveClass);
        feedback.classList.add(activeClass);
        feedback.textContent = processed.message || 'Done.';

        const { tabGroups, ...store } = await getStorage();
        const newGroups = [...tabGroups, ...processed.data].filter(
          (x) => x.items.length > 0 || x.isLocked
        );

        await browser.storage.local.set({
          ...store,
          tabGroups: newGroups
        });

        await reloadTabStores();
      } else {
        throw new Error(processed.message);
      }
    } catch (e) {
      feedback.classList.add(ERROR_CLASS);
      feedback.classList.remove(SUCCESS_CLASS);
      feedback.classList.remove(WARNING_CLASS);
      feedback.textContent = e.message ?? 'Failed to parse import value.';
    }
  });
}

run();
