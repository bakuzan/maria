import { BASE_LINK_URL } from '@/consts';

import addHoverListeners from './addHoverListeners';
import walk from '@/utils/walk';
import toaster from '@/utils/toaster';
import getStorage from '@/utils/getStorage';

const anchorMe = (v: string, text: string) =>
  v.replace(
    new RegExp(text, 'g'),
    `<a 
    data-maria-link="${text}" 
    class="maria-link"
    href=${BASE_LINK_URL + text} 
    target="_blank" 
    rel="noopener noreferrer">${text}</a>`
  );

async function processText(textNode: Node) {
  const v = textNode.nodeValue;

  // If this node has already been processed
  const parent = textNode.parentNode as HTMLElement;
  if (parent.hasAttribute('data-maria-link')) {
    return;
  }

  const items = await getStorage();
  const codes = items.digitOptions
    .map((x: number) => new RegExp('\\b[0-9]{' + x + '}\\b', 'g'))
    .reduce((p, c) => {
      const results = v.match(c);

      if (results === null) {
        return p;
      }

      return [...p, ...results];
    }, []);

  if (codes.length) {
    const converted = codes.reduce((p, x) => anchorMe(p, x), v);

    const htmlParser = document.createElement('div');
    htmlParser.innerHTML = converted;
    const newNodes = htmlParser.childNodes;

    while (newNodes.length) {
      const mLink = newNodes[0];
      addHoverListeners(mLink);
      textNode.parentNode.insertBefore(mLink, textNode);
    }

    textNode.parentNode.removeChild(textNode);
  }
}

export default async function addLinks() {
  await walk(document.body, processText);

  toaster('success', 'Numbers processed.');
}
