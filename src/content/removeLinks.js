import toaster from '../utils/toaster.js';

export default function removeLinks() {
  const links = Array.from(document.querySelectorAll('[data-maria-link]'));

  for (let link of links) {
    const textNode = document.createTextNode(link.textContent);
    link.parentNode.insertBefore(textNode, link);
    link.parentNode.removeChild(link);
  }

  toaster('success', 'Links removed.');
}
