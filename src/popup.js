import { PROCESS_NUMBERS, REMOVE_LINKS } from './consts.js';

const showLinks = document.getElementById('processNumbers');
const removeLinks = document.getElementById('removeLinks');

showLinks.addEventListener('click', async function(element) {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    chrome.runtime.sendMessage({
      tabID: activeTab.id,
      action: PROCESS_NUMBERS
    });
  } catch (error) {
    // TODO
    // Error handling
  }
});

removeLinks.addEventListener('click', async function(element) {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    chrome.runtime.sendMessage({ tabID: activeTab.id, action: REMOVE_LINKS });
  } catch (error) {
    // TODO
    // Error handling
  }
});
