import { PROCESS_NUMBERS, REMOVE_LINKS } from './consts.js';

const showLinks = document.getElementById('processNumbers');
const removeLinks = document.getElementById('removeLinks');

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

showLinks.addEventListener('click', async function() {
  try {
    const activeTab = await getActiveTab();

    const response = await chrome.runtime.sendMessage({
      tabID: activeTab.id,
      action: PROCESS_NUMBERS
    });

    console.log(response);
  } catch (error) {
    // TODO
    // Error handling
  }
});

removeLinks.addEventListener('click', async function() {
  try {
    const activeTab = await getActiveTab();

    const response = await chrome.runtime.sendMessage({
      tabID: activeTab.id,
      action: REMOVE_LINKS
    });

    console.log(response);
  } catch (error) {
    // TODO
    // Error handling
  }
});
