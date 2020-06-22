import '../styles/index.scss';
import './popup.scss';

import { MariaAction } from '@/consts';
import getActiveTab from '@/utils/getActiveTab';
import openNewTabStore from '@/utils/openNewTabStore';

import downloadGallery from './downloadGallery';
import { buttonListener } from './utils';
import dateCalculatorManager from './dateCalculator';

async function run() {
  dateCalculatorManager.init();

  document
    .getElementById('openTabStore')
    .addEventListener('click', async () => {
      await openNewTabStore();
      window.close();
    });

  document
    .getElementById('processNumbers')
    .addEventListener('click', buttonListener(MariaAction.PROCESS_NUMBERS));

  document
    .getElementById('removeLinks')
    .addEventListener('click', buttonListener(MariaAction.REMOVE_LINKS));

  // Condition specific options...

  const activeTab = await getActiveTab();
  const re = /nhentai.net\/g\/\d{1,}\/$/;
  const isGalleryPage = new RegExp(re).test(activeTab.url);

  if (isGalleryPage) {
    document.getElementById('downloadGalleryOption').style.display = 'block';

    const downloadButton = document.querySelector<HTMLButtonElement>(
      '#downloadGallery'
    );

    downloadButton.disabled = false;
    downloadButton.addEventListener('click', downloadGallery);
  }
}

run();
