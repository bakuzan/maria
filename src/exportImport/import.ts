import { browser } from 'webextension-polyfill-ts';

import getStorage from '@/utils/getStorage';
import reloadMariaPages from '@/utils/reloadMariaPages';
import { uniqueItemsFilter } from '@/utils/array';
import processImportedValue from './processImportedValue';

const ERROR_CLASS = 'maria-feedback--error';
const SUCCESS_CLASS = 'maria-feedback--success';
const WARNING_CLASS = 'maria-feedback--warning';

async function importProcessor(importValue: string) {
  const feedback = document.getElementById('import-feedback');
  feedback.textContent = '';

  try {
    const parsed = JSON.parse(importValue);
    const processed = processImportedValue(parsed);

    if (processed.success) {
      const hasMessage = processed.messages.length > 0;
      const activeClass = hasMessage ? WARNING_CLASS : SUCCESS_CLASS;
      const inactiveClass = !hasMessage ? WARNING_CLASS : SUCCESS_CLASS;

      feedback.classList.remove(ERROR_CLASS);
      feedback.classList.remove(inactiveClass);
      feedback.classList.add(activeClass);
      feedback.textContent = processed.messages.join('\r\n') || 'Done.';

      const { digitOptions, feeds, tabGroups, redirects, ...store } =
        await getStorage();

      const newDigitOptions = processed.data.digitOptions.length
        ? processed.data.digitOptions
        : digitOptions;

      const newGroups = [...tabGroups, ...processed.data.tabGroups].filter(
        (x) => x.items.length > 0 || x.isLocked
      );

      const newFeeds = [...feeds, ...processed.data.feeds].filter(
        uniqueItemsFilter((x) => x.link)
      );

      const newRedirects = [...redirects, ...processed.data.redirects].filter(
        uniqueItemsFilter((x) => `${x.fromPattern}_${x.toPattern}`)
      );

      await browser.storage.local.set({
        ...store,
        digitOptions: newDigitOptions,
        feeds: newFeeds,
        redirects: newRedirects,
        tabGroups: newGroups
      });

      await reloadMariaPages();
    } else {
      throw new Error(processed.messages.join('\r\n'));
    }
  } catch (e) {
    feedback.classList.add(ERROR_CLASS);
    feedback.classList.remove(SUCCESS_CLASS);
    feedback.classList.remove(WARNING_CLASS);
    feedback.textContent = e.message ?? 'Failed to parse import value.';
  }
}

export default async function importHandler() {
  // Import text area
  document.getElementById('runImport').addEventListener('click', async () => {
    const importArea = document.getElementById('import') as HTMLTextAreaElement;
    const importValue = importArea.value;
    await importProcessor(importValue);
  });

  // Import input
  const importInput = document.getElementById('importFile');
  importInput.addEventListener('change', async (event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files[0];

    if (!file) {
      const feedback = document.getElementById('import-feedback');
      feedback.textContent = 'No file selected';
      feedback.classList.add(WARNING_CLASS);
      feedback.classList.remove(ERROR_CLASS);
      feedback.classList.remove(SUCCESS_CLASS);
    }

    const reader = new FileReader();
    reader.onload = async function loader() {
      const fileContents = reader.result as string;
      await importProcessor(fileContents);
    };
    reader.readAsText(file);
  });
}
