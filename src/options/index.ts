import '../styles/index.scss';
import './options.scss';
import { browser } from 'webextension-polyfill-ts';

import getStorage from '@/utils/getStorage';

async function saveGreeting(event: InputEvent) {
  const items = await getStorage();
  const target = event.target as HTMLInputElement;

  await browser.storage.local.set({
    ...items,
    shouldPlayGreeting: target.checked
  });
}

async function saveOption(event: InputEvent) {
  const items = await getStorage();
  const target = event.target as HTMLInputElement;

  const value = Number(target.value);
  const curr = new Set([...items.digitOptions]);

  if (target.checked) {
    curr.add(value);
  } else {
    curr.delete(value);
  }

  await browser.storage.local.set({
    ...items,
    digitOptions: Array.from(curr)
  });
}

async function restoreOptions() {
  const items = await getStorage();
  const greeting = document.querySelector<HTMLInputElement>(
    `[name='greeting']`
  );

  greeting.checked = items.shouldPlayGreeting;

  const inputs = document.querySelectorAll<HTMLInputElement>(`[name='digits']`);

  Array.from(inputs).forEach(
    (node) =>
      (node.checked = items.digitOptions.some((x) => x === Number(node.value)))
  );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document
  .querySelector(`[name='greeting']`)
  .addEventListener('change', saveGreeting);

Array.from(document.querySelectorAll(`[name='digits']`)).forEach((node) =>
  node.addEventListener('change', saveOption)
);
