import {
  FETCH_NUMBER_DETAIL,
  BASE_IMAGE_URL,
  PROXY_URL,
  extensionType
} from '../consts.js';
import dimensions from '../utils/dimensions.js';

const IMG_WIDTH = 150;
const IMG_HEIGHT = undefined;

const uniqueId = (base) => `${base}_${new Date().getTime()}`;
function displayStyle(node, x, y) {
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
  node,
  { seriesId, clientX, clientY, title, tags, image }
) {
  const uid = uniqueId(seriesId);

  const ti = document.createElement('div');
  ti.className = 'maria-detail__title';
  ti.textContent = title;

  const ta = document.createElement('ul');
  ta.className = `maria-detail__tags`;
  tags.forEach((tag) => {
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

export default function addHoverListeners(node) {
  // Trigger detail tooltip
  node.addEventListener('mouseenter', async function(event) {
    const { target: link, clientX, clientY } = event;
    const seriesId = link.getAttribute('data-maria-link');

    if (link.hasAttribute('data-maria-has-detail')) {
      const uid = link.getAttribute('data-maria-has-detail');
      const detail = document.body.querySelector(
        `[data-maria-detail="${uid}"]`
      );

      if (detail) {
        detail.style.cssText = displayStyle(link, clientX, clientY);
      }

      return;
    }

    const response = await chrome.runtime.sendMessage({
      action: FETCH_NUMBER_DETAIL,
      seriesId
    });

    const { success, data } = response;
    if (!success) {
      return;
    }

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
  });

  // Handle hiding the detail tooltip
  node.addEventListener('mouseleave', function(event) {
    const link = event.target;
    const uid = link.getAttribute('data-maria-has-detail');
    const detail = document.body.querySelector(`[data-maria-detail="${uid}"]`);

    if (detail) {
      detail.style.display = `none`;
    }
  });
}
