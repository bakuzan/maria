export default function isElementHidden(element: HTMLElement) {
  return !(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}
