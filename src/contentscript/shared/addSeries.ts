import { browser } from 'webextension-polyfill-ts';

import { MariaAction, monthNames, excludedTags, LoaderHTML } from '@/consts';
import { ContentResponse } from '@/types/ContentResponse';
import { SeriesPayload } from '@/types/SeriesPayload';

import toaster from '@/utils/toaster';
import getNode from '@/utils/getNode';
import isValidDate from '@/utils/isValidDate';

import seriesPageButton from './seriesPageButton';

/* Functions */
function getMalId() {
  const mid: HTMLInputElement | null = document.querySelector(
    `input[name='mid']`
  );

  if (!mid) {
    const [idSlug] = window.location.pathname.match(/\/\d+\/|\/\d+$/);
    return Number(idSlug.replace(/\D/g, ''));
  }

  return Number(mid.value);
}

function getCleanTitle(...selectors: string[]) {
  const node = selectors.map((x) => getNode(x)).find((x) => x !== null);
  let title = node.textContent;

  const engSelector = `//*[@id="contentWrapper"]//span[@class="title-english"]`;
  const engNode = getNode<HTMLInputElement | null>(engSelector);

  if (engNode) {
    title = title.replace(engNode.textContent, '');
  }

  return title.trim();
}

function commonElements(isAnime: boolean) {
  const totalName = isAnime ? 'Episodes' : 'Chapters';

  const malId = getMalId();
  const image = document.querySelector<HTMLImageElement>(
    '#content img.lazyloaded[itemprop]'
  );

  const seriesType = getNode(`//span[text()='Type:']/../a`);
  const total = getNode(`//span[text()='${totalName}:']/..`);

  const tags = getNode(`//span[starts-with(text(),'Genre')]/../a`, true);
  const tagString = tags
    .map((x: Node) => x.textContent.trim().toLowerCase())
    .filter((x) => !excludedTags.includes(x))
    .join(',');

  const isAdult = tagString.includes('hentai');

  return {
    malId,
    title: getCleanTitle(
      `//*[@id='contentWrapper']//h1/span`,
      `//*[@id='contentWrapper']//h1`
    ),
    image: image?.src ?? '',
    series_type: seriesType.textContent.replace(/-/g, ''),
    total,
    isAdult,
    status: 'Planned',
    tagString: isAdult ? '' : tagString
  };
}

function handleAnime() {
  const { total, ...pass } = commonElements(true);
  const episodes = total.innerText.replace(/\D/g, '');

  const seriesStartEl = getNode(`//span[text()='Aired:']/..`);
  const [mn, day, year] = seriesStartEl.textContent
    .trim()
    .split(' ')
    .slice(2, 5);

  const monthIndex = monthNames.findIndex((x) => x === mn);
  const startDate =
    mn && day && year
      ? new Date(Date.UTC(Number(year), monthIndex, Number(day.slice(0, -1))))
      : null;

  return {
    ...pass,
    series_episodes: Number(episodes),
    series_start: isValidDate(startDate)
      ? startDate.toISOString().split('T')[0]
      : null
  };
}

function handleManga() {
  const { total, ...pass } = commonElements(false);
  const vol = getNode(`//span[text()='Volumes:']/..`);
  const chapters = total.innerText.replace(/\D/g, '');
  const volumes = vol.innerText.replace(/\D/g, '');

  return {
    ...pass,
    series_chapters: Number(chapters),
    series_volumes: Number(volumes)
  };
}

async function postSeries(isAnime: boolean, series: SeriesPayload) {
  try {
    const res = await browser.runtime.sendMessage({
      action: MariaAction.POST_MAL_SERIES,
      isAnime,
      series
    });

    const response = (res as unknown) as ContentResponse;

    if (response && response.success) {
      toaster('success', `Posted ${response.data.title}.`);
    }

    return response.success;
  } catch (error) {
    toaster('error', error.message);
    return false;
  }
}

function renderDelayedLoader(element: HTMLElement) {
  return window.setTimeout(
    () => element.insertAdjacentHTML('beforeend', LoaderHTML),
    1000
  );
}

/* Setup elements */

export default function addSeries(onSuccess: () => void) {
  let timer = 0;

  seriesPageButton('Add series to Erza', function (scraper, btn) {
    if (btn.disabled) {
      return;
    }

    btn.disabled = true;
    timer = renderDelayedLoader(scraper);

    const isAnime = !window.location.href.includes('manga');
    let result = null;

    if (isAnime) {
      result = handleAnime();
    } else {
      result = handleManga();
    }

    postSeries(isAnime, result).then((success) => {
      clearTimeout(timer);

      const loader = scraper.querySelector('#mariaLoader');
      if (loader) {
        scraper.removeChild(loader);
      }

      if (success) {
        onSuccess();
      }

      btn.disabled = false;
    });
  });
}
