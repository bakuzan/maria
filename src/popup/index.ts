import '../styles/index.scss';
import './popup.scss';

import { MariaAction } from '@/consts';
import getActiveTab from '@/utils/getActiveTab';
import openNewTabStore from '@/utils/openNewTabStore';

import dateCalculator from './dateCalculator';
import downloadGallery from './downloadGallery';
import { buttonListener } from './utils';

const VISIBLE_SIDEBAR_CLASS = 'popup__sidebar--visible';

async function run() {
  document
    .getElementById('openDateCalculator')
    .addEventListener('click', async () => {
      const sidebar = document.getElementById('popupSidebar');
      const isVisible = sidebar.className.includes(VISIBLE_SIDEBAR_CLASS);

      if (isVisible) {
        sidebar.classList.remove(VISIBLE_SIDEBAR_CLASS);
        dateCalculator.destroy();
      } else {
        sidebar.classList.add(VISIBLE_SIDEBAR_CLASS);
        dateCalculator.init();
      }
    });

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
