import { BASE_LINK_URL } from '../consts.js';
import walk from './walk.js';

const anchorMe = (v, text) =>
  v.replace(
    text,
    `<a data-maria-link href=${BASE_LINK_URL + text}>${text}</a>`
  );

function processText(textNode) {
  const v = textNode.nodeValue;
  const codes = [];

  // TODO
  // Get user choices
  const choices = [6, 5];
  for (let i = 0; i < choices.length; i++) {
    const re = new RegExp('\\b[0-9]{' + choices[i] + '}\\b', 'g');
    const matchResult = v.match(re);

    if (matchResult != null) {
      codes.push(matchResult);
    }
  }

  if (codes.length) {
    codes.forEach((x) => anchorMe(v, x));

    const htmlParser = document.createElement('div');
    htmlParser.innerHTML = v;
    const newNodes = htmlParser.childNodes;

    while (newNodes.length) {
      textNode.parentNode.insertBefore(newNodes[0], textNode);
    }

    textNode.parentNode.removeChild(textNode);
  }
}

export default function addLinks() {
  console.log('add');
  const trail = walk(document.body);
  let curr = trail.next();

  while (!curr.done) {
    processText(curr.value);
  }

  // TODO
  // Display user feedback
}
