import toaster from './toaster.js';

export default function removeLinks() {
  console.log('remove');
  const links = Array.from(document.querySelectorAll('[data-maria-link]'));

  for (let link of links) {
    link.parentNode.insertBefore(link.textContent, link);
    link.parentNode.removeChild(link);
  }

  toaster('success', 'Links removed.');
}
