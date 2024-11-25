import '../styles/index.scss';
import './options.scss';
import browser from 'webextension-polyfill';

import getStorage from '@/utils/getStorage';
import { reloadImportAndExport } from '@/utils/reloadMariaPages';

import setupRedirectSettings from './setupRedirectSettings';

async function saveGreeting(event: InputEvent) {
  const items = await getStorage();
  const target = event.target as HTMLInputElement;

  await browser.storage.local.set({
    ...items,
    shouldPlayGreeting: target.checked
  });

  await reloadImportAndExport();
}

async function saveCheckFeeds(event: InputEvent) {
  const items = await getStorage();
  const target = event.target as HTMLInputElement;

  await browser.storage.local.set({
    ...items,
    shouldCheckFeeds: target.checked
  });

  await reloadImportAndExport();
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

  await reloadImportAndExport();
}

async function saveRedirect(event: InputEvent) {
  const items = await getStorage();
  const target = event.target as HTMLInputElement;

  await browser.storage.local.set({
    ...items,
    shouldRedirect: target.checked
  });

  await reloadImportAndExport();
}

async function restoreOptions() {
  const items = await getStorage();
  const greeting =
    document.querySelector<HTMLInputElement>(`[name='greeting']`);

  greeting.checked = items.shouldPlayGreeting;

  const feeds = document.querySelector<HTMLInputElement>(`[name='feeds']`);
  feeds.checked = items.shouldCheckFeeds;

  const inputs = document.querySelectorAll<HTMLInputElement>(`[name='digits']`);

  Array.from(inputs).forEach(
    (node) =>
      (node.checked = items.digitOptions.some((x) => x === Number(node.value)))
  );

  const redirect =
    document.querySelector<HTMLInputElement>(`[name='redirect']`);

  redirect.checked = items.shouldRedirect;
}

async function run() {
  document.addEventListener('DOMContentLoaded', restoreOptions);

  document
    .querySelector(`[name='greeting']`)
    .addEventListener('change', saveGreeting);

  document
    .querySelector(`[name='feeds']`)
    .addEventListener('change', saveCheckFeeds);

  Array.from(document.querySelectorAll(`[name='digits']`)).forEach((node) =>
    node.addEventListener('change', saveOption)
  );

  document
    .querySelector(`[name='redirect']`)
    .addEventListener('change', saveRedirect);

  document.getElementById('exportImport').addEventListener(
    'click',
    async () =>
      await browser.tabs.create({
        index: 0,
        url: browser.runtime.getURL('exportImport.html')
      })
  );

  setupRedirectSettings();
}

run();
