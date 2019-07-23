import { BASE_LINK_URL } from '../consts.js';
import walk from '../utils/walk.js';
import toaster from '../utils/toaster.js';

const anchorMe = (v, text) =>
  v.replace(
    new RegExp(text, 'g'),
    `<a 
    data-maria-link 
    class="maria-link"
    href=${BASE_LINK_URL + text} 
    target="_blank" 
    rel="noopener noreferrer">${text}</a>`
  );

function processText(textNode) {
  const v = textNode.nodeValue;

  // If this node has already been processed
  if (textNode.parentNode.hasAttribute('data-maria-link')) {
    return;
  }

  // TODO
  // Get user choices
  const choices = [6, 5];

  const codes = choices
    .map((x) => new RegExp('\\b[0-9]{' + x + '}\\b', 'g'))
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
      textNode.parentNode.insertBefore(newNodes[0], textNode);
    }

    textNode.parentNode.removeChild(textNode);
  }
}

export default async function addLinks() {
  await walk(document.body, processText);

  toaster('success', 'Numbers processed.');
}
