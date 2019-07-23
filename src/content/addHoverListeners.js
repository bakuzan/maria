import { FETCH_NUMBER_DETAIL, extensionType } from '../consts.js';

export default function addHoverListeners(node) {
  node.addEventListener('mouseenter', async function(event) {
    const link = event.target;

    if (link.hasAttribute('data-maria-detail')) {
      // TODO
      // show the existing detail
      return;
    }

    const seriesId = link.getAttribute('data-maria-link');
    const response = await chrome.runtime.sendMessage({
      action: FETCH_NUMBER_DETAIL,
      seriesId
    });

    console.log(response);
    const { success, data } = response;
    if (!success) {
      return;
    }

    let extension = data.images.cover.t;
    extension = extensionType[extension];
    const image = `https://t.nhentai.net/galleries/${seriesId}/cover.${extension}`;
    const tags = data.tags.filter((x) => x.type === 'tag').map((x) => x.name);
    const title = data.title.english;

    console.log(image, tags, title);

    // TODO
    // Show details
    // Apply attribute "data-maria-detail"
  });

  node.addEventListener('mouseleave', function() {
    // TODO
    // hide the mouse over detail view
  });
}
