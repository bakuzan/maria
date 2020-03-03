import toaster from '@/utils/toaster';

export default function removeLinks() {
  const links = Array.from(document.querySelectorAll('[data-maria-link]'));
  const details = Array.from(document.querySelectorAll('[data-maria-detail]'));

  // Remove detail tooltips
  details.forEach((detail) => detail.parentNode.removeChild(detail));

  // Remove links
  for (const link of links) {
    const textNode = document.createTextNode(link.textContent);
    link.parentNode.insertBefore(textNode, link);
    link.parentNode.removeChild(link);
  }

  toaster('success', 'Links removed.');
}
