import { POST_MAL_SERIES, monthNames, excludedTags } from '../consts.js';
import toaster from '../utils/toaster.js';
import getNode from '../utils/getNode.js';

/* Functions */

function commonElements(isAnime) {
  const totalName = isAnime ? 'Episodes' : 'Chapters';

  const malId = Number(window.location.pathname.replace(/\D/g, ''));
  const title = getNode(`//*[@id='contentWrapper']//h1/span`);
  const image = getNode(`//*[@id='content']//a/img`);
  const series_type = getNode("//span[text()='Type:']/../a");
  const total = getNode(`//span[text()='${totalName}:']/..`);
  const tags = getNode("//span[text()='Genres:']/../a", true);
  const tagString = tags
    .map((x) => x.textContent.trim().toLowerCase())
    .filter((x) => !excludedTags.includes(x))
    .join(',');

  return {
    malId,
    title,
    image,
    series_type,
    total,
    tagString,
    status: 'Planned',
    isAdult: tagString.includes('hentai')
  };
}

function handleAnime() {
  const { title, image, series_type, total, ...pass } = commonElements(true);
  const episodes = total.innerText.replace(/\D/g, '');

  const seriesStartEl = getNode("//span[text()='Aired:']/..");
  const [mn, day, year] = seriesStartEl.textContent
    .trim()
    .split(' ')
    .slice(2, 5);
  const monthIndex = monthNames.findIndex((x) => x === mn);

  return {
    ...pass,
    title: title.textContent.trim(),
    image: image.src,
    series_type: series_type.textContent,
    series_episodes: Number(episodes),
    series_start: new Date(Date.UTC(year, monthIndex, day.slice(0, -1)))
      .toISOString()
      .split('T')[0]
  };
}

function handleManga() {
  const { title, image, series_type, total, ...pass } = commonElements(false);
  const vol = getNode(`//span[text()='Volumes:']/..`);
  const chapters = total.innerText.replace(/\D/g, '');
  const volumes = vol.innerText.replace(/\D/g, '');

  return {
    ...pass,
    title: title.textContent.trim(),
    image: image.src,
    series_type: series_type.textContent,
    series_chapters: Number(chapters),
    series_volumes: Number(volumes)
  };
}

async function postSeries(isAnime, series) {
  try {
    const response = await chrome.runtime.sendMessage({
      action: POST_MAL_SERIES,
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
  btn.textContent = 'Add series to Erza';
  btn.addEventListener('click', function() {
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
