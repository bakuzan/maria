import getStorage from '../utils/getStorage.js';

async function saveOption(event) {
  const items = await getStorage();

  const value = Number(event.target.value);
  const curr = new Set([...items.digitOptions]);

  if (event.target.checked) {
    curr.add(value);
  } else {
    curr.delete(value);
  }

  await chrome.storage.sync.set({
    digitOptions: Array.from(curr)
  });
}

async function restoreOptions() {
  const items = await getStorage();

  Array.from(document.querySelectorAll("[name='digits']")).forEach(
    (node) =>
      (node.checked = items.digitOptions.some((x) => x === Number(node.value)))
  );
}

document.addEventListener('DOMContentLoaded', restoreOptions);
Array.from(document.querySelectorAll("[name='digits']")).forEach((node) =>
  node.addEventListener('change', saveOption)
);
