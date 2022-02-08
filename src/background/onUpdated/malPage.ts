import { browser, Tabs } from 'webextension-polyfill-ts';

import { erzaGQL } from '@/consts';

import { callErza } from '@/utils/fetch';
import executeContentModule from '@/utils/executeContentModule';
import userFeedback from '@/utils/userFeedback';
import getErrorMessage from '@/utils/getErrorMessage';

export default async function malPageProcessing(tabId: number, tab: Tabs.Tab) {
  const reA = /^https:\/\/myanimelist.net\/anime\/\d+/;
  const reM = /^https:\/\/myanimelist.net\/manga\/\d+/;
  const isAnime = new RegExp(reA).test(tab.url);
  const isManga = new RegExp(reM).test(tab.url);
  const isSeriesPage = isAnime || isManga;

  if (isSeriesPage) {
    await browser.tabs.executeScript(tabId, {
      code: `(async () => {
          Array
            .from(document.querySelectorAll(".inputtext"))
            .forEach((inp) => inp.setAttribute("autocomplete", "off"))
        })();`
    });

    const [idSlug] = tab.url.match(/\/\d+\/|\/\d+$/);
    const malId = Number(idSlug.replace(/\D/g, ''));

    const response = await callErza(
      isAnime ? erzaGQL.animeExists : erzaGQL.mangaExists,
      { malId }
    );

    if (!response || !response.success) {
      const message = getErrorMessage(response);
      userFeedback('error', message);
    } else {
      await executeContentModule(
        tabId,
        'activateErzaSeries',
        response.data && response.data.exists ? 'openSeriesInErza' : 'addSeries'
      );
    }
  }
}
