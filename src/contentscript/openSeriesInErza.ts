import { browser } from 'webextension-polyfill-ts';

import seriesPageButton from './shared/seriesPageButton';
import { BASE_ERZA_URL, MariaAction } from '@/consts';

const ERZA_URL = `${BASE_ERZA_URL}erza/{seriesType}-view/{seriesId}`;

export default async function openSeriesInErza() {
  const seriesType = window.location.href.split('/').slice(3, 4).pop();
  const [idSlug] = window.location.pathname.match(/\/\d+\/|\/\d+$/);
  const malId = Number(idSlug.replace(/\D/g, ''));
  const isAnime = seriesType === 'anime';

  async function openThisSeriesInErza() {
    await browser.runtime.sendMessage({
      action: MariaAction.OPEN_IN_ERZA,
      malId,
      isAnime,
      url: ERZA_URL.replace('{seriesType}', seriesType)
    });
  }

  seriesPageButton('Open series in Erza', () => openThisSeriesInErza());
}
