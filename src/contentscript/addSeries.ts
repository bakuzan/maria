import { browser } from 'webextension-polyfill-ts';

import { MariaAction, monthNames, excludedTags } from '@/consts';
import { ContentResponse } from '@/types/ContentResponse';
import { SeriesPayload } from '@/types/SeriesPayload';
import toaster from '@/utils/toaster';
import getNode from '@/utils/getNode';
import isValidDate from '@/utils/isValidDate';

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

function cleanTitle(node: Node) {
  let title = node.textContent;
  const engNode: HTMLInputElement | null = getNode(
    `//*[@id="contentWrapper"]/div[1]/h1//span[@class="title-english"]`
  );

  if (engNode) {
    title = title.replace(engNode.textContent, '');
  }

  return title.trim();
}

function commonElements(isAnime: boolean) {
  const totalName = isAnime ? 'Episodes' : 'Chapters';

  const malId = getMalId();
  const titleNode = getNode(`//*[@id='contentWrapper']//h1/span`);
  const image = getNode<HTMLImageElement>(`//*[@id='content']//a/img`);
  const seriesType = getNode(`//span[text()='Type:']/../a`);
  const total = getNode(`//span[text()='${totalName}:']/..`);

  const tags = getNode(`//span[text()='Genres:']/../a`, true);
  const tagString = tags
    .map((x: Node) => x.textContent.trim().toLowerCase())
    .filter((x) => !excludedTags.includes(x))
    .join(',');

  const isAdult = tagString.includes('hentai');

  return {
    malId,
    title: cleanTitle(titleNode),
    image: image.src,
    series_type: seriesType.textContent.replace(/-/g, ''),
    total,
    isAdult,
    status: 'Planned',
    tagString: isAdult ? 'hentai' : tagString
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
  const startDate = new Date(
    Date.UTC(Number(year), monthIndex, Number(day.slice(0, -1)))
  );

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
    const response: ContentResponse = await browser.runtime.sendMessage({
      action: MariaAction.POST_MAL_SERIES,
      isAnime,
      series
    });

    console.log('post response', response);

    if (response.success) {
      toaster('success', `Posted ${response.data.title}.`);
    }
  } catch (error) {
    toaster('error', error.message);
  }
}

/* Setup elements */

export default function addSeries() {
  const location = document.querySelector('#profileRows');

  const scraper = document.createElement('div');
  scraper.className = 'maria maria-mal-add';

  const btn = document.createElement('button');
  btn.className = 'mra-button mra-button--padding mra-button--primary';
  btn.style.cssText = `width:99%;`;
  btn.textContent = 'Add series to Erza';

  btn.addEventListener('click', function () {
    const isAnime = !window.location.href.includes('manga');
    let result = null;

    if (isAnime) {
      result = handleAnime();
    } else {
      result = handleManga();
    }

    postSeries(isAnime, result);
  });

  scraper.appendChild(btn);

  // Add to page
  location.insertAdjacentElement('afterend', scraper);
}
