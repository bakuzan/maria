import browser from 'webextension-polyfill';

import { Redirect } from '@/types/Redirect';

import getStorage from '@/utils/getStorage';
import generateUniqueId from '@/utils/generateUniqueId';
import { reloadImportAndExport } from '@/utils/reloadMariaPages';

const getInputElementValue = (idString: string) =>
  (document.getElementById(idString) as HTMLInputElement).value;

async function removeRedirect(event: Event) {
  const btn = event.target as HTMLButtonElement;
  const id = btn.getAttribute('data-id');

  const items = await getStorage();
  const redirects = items.redirects.filter((x) => x.id !== id);
  await browser.storage.local.set({
    ...items,
    redirects
  });

  renderRedirectList(redirects);
  await reloadImportAndExport();
}

function renderRedirectList(items: Redirect[]) {
  const ul = document.getElementById('redirectSettings');

  const newChildren = items.map((data) => {
    const li = document.createElement('li');
    li.className = `redirect-settings__entry redirect`;

    const controls = document.createElement('div');
    const fromInput = document.createElement('input');
    fromInput.type = 'text';
    fromInput.name = `fromPattern_${data.id}`;
    fromInput.value = data.fromPattern;
    fromInput.readOnly = true; // todo, matke editable

    const toInput = document.createElement('input');
    toInput.type = 'text';
    toInput.name = `toPattern_${data.id}`;
    toInput.value = data.toPattern;
    toInput.readOnly = true; // todo, matke editable

    controls.append(fromInput);
    controls.append(`->`);
    controls.append(toInput);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.setAttribute('data-id', data.id);
    removeButton.className = `maria-button redirect__button`;
    removeButton.textContent = '\u274C\ufe0e';
    removeButton.title = `Remove redirect`;
    removeButton.addEventListener('click', removeRedirect);

    li.append(controls);
    li.append(removeButton);
    return li;
  });

  ul.replaceChildren();
  newChildren.forEach((x) => ul.append(x));
}

async function onAddRedirect() {
  const messages = document.getElementById('addRedirectMessages');
  const fromPattern = getInputElementValue('fromPattern');
  const toPattern = getInputElementValue('toPattern');

  if (!fromPattern || !fromPattern.trim() || !toPattern || !toPattern.trim()) {
    messages.textContent = `Both from and to pattern are required!`;
    return;
  }

  messages.textContent = ``;
  const items = await getStorage();
  const newRedirect = {
    id: generateUniqueId(),
    fromPattern,
    toPattern
  };

  const redirects = [...items.redirects, newRedirect];
  await browser.storage.local.set({
    ...items,
    redirects
  });

  renderRedirectList(redirects);
  await reloadImportAndExport();
}

export default async function setupRedirectSettings() {
  const items = await getStorage();

  renderRedirectList(items.redirects);
  document
    .getElementById('addRedirect')
    .addEventListener('click', onAddRedirect);
}
