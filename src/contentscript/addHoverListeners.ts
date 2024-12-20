import browser from 'webextension-polyfill';

import {
  MariaAction,
  BASE_IMAGE_URL,
  PROXY_URL,
  extensionType
} from '@/consts';
import { reportError } from '@/log';
import { ContentResponse } from '@/types/ContentResponse';
import { TooltipContent } from '@/types/TooltipContent';
import dimensions from '@/utils/dimensions';
import toaster from '@/utils/toaster';

const IMG_WIDTH = 150;
const IMG_HEIGHT = undefined;

const uniqueId = (base: string) => `${base}_${new Date().getTime()}`;

function displayStyle(node: HTMLElement, x: number, y: number) {
  const rect = node.getBoundingClientRect();
  const dim = dimensions();

  let height = y - rect.height;
  if (height + 300 > dim.h) {
    height = dim.h - 375;
  }

  return `
  left: ${x + rect.width / 4}px;
  top: ${height}px;
  display: flex;
 `;
}

function addDetailContainer(
  node: HTMLElement,
  { seriesId, clientX, clientY, title, tags, image }
) {
  const uid = uniqueId(seriesId);

  const ti = document.createElement('div');
  ti.className = 'maria-detail__title';
  ti.textContent = title;

  const ta = document.createElement('ul');
  ta.className = `maria-detail__tags`;
  tags.forEach((tag: string) => {
    const el = document.createElement('li');
    el.className = `maria-detail__tag`;
    el.textContent = tag;
    ta.appendChild(el);
  });

  const img = new Image(IMG_WIDTH, IMG_HEIGHT);
  img.src = image;
  img.alt = title;

  const d = document.createElement('div');
  d.className = 'maria-detail__column';
  d.appendChild(ti);
  d.appendChild(img);

  const c = document.createElement('div');
  c.setAttribute('data-maria-detail', uid);
  c.className = `maria maria-detail`;
  c.style.cssText = displayStyle(node, clientX, clientY);
  c.appendChild(d);
  c.appendChild(ta);

  document.body.appendChild(c);
  node.setAttribute('data-maria-has-detail', uid);
}

async function onEnter(event: MouseEvent) {
  const { target, clientX, clientY } = event;

  const link = target as HTMLElement;
  const seriesId = link.getAttribute('data-maria-link');

  if (link.hasAttribute('data-maria-has-detail')) {
    const uid = link.getAttribute('data-maria-has-detail');
    const detail: HTMLElement = document.body.querySelector(
      `[data-maria-detail="${uid}"]`
    );

    if (detail) {
      detail.style.cssText = displayStyle(link, clientX, clientY);
    }

    return;
  }

  const res = await browser.runtime.sendMessage({
    action: MariaAction.FETCH_NUMBER_DETAIL,
    seriesId
  });

  const response = res as ContentResponse;

  if (!res || !response.success) {
    reportError(`Something went wrong on fetching series detail (${seriesId})`);
    toaster('error', `Failed to fetch series details '${seriesId}'`);
    return;
  }

  const data = response.data as TooltipContent;

  let extension = data.images.cover.t;
  extension = extensionType[extension];
  const tags = data.tags.filter((x) => x.type === 'tag').map((x) => x.name);
  const title = data.title.english;
  const imgId = data.media_id;
  const image = `${PROXY_URL}${BASE_IMAGE_URL}`
    .replace('{id}', imgId)
    .replace('{ext}', extension);

  addDetailContainer(link, {
    seriesId,
    clientX,
    clientY,
    title,
    tags,
    image
  });
}

export default function addHoverListeners<T extends Node>(node: T) {
  // Trigger detail tooltip
  const element: HTMLElement = node as any;
  element.addEventListener('mouseenter', function (event) {
    onEnter(event);
  });

  // Handle hiding the detail tooltip
  element.addEventListener('mouseleave', function (event) {
    const link = event.target as HTMLElement;

    const uid = link.getAttribute('data-maria-has-detail');
    const detail: HTMLElement | null = document.body.querySelector(
      `[data-maria-detail="${uid}"]`
    );

    if (detail) {
      detail.style.display = `none`;
    }
  });
}
