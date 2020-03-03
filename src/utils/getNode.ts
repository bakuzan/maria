function getNode(xpath: string, all: true): HTMLElement[];
function getNode<T extends HTMLElement = HTMLElement>(
  xpath: string,
  all?: false
): T;
function getNode(xpath: string, all = false): HTMLElement | HTMLElement[] {
  const resultType = all
    ? XPathResult.UNORDERED_NODE_ITERATOR_TYPE
    : XPathResult.FIRST_ORDERED_NODE_TYPE;

  const res = document.evaluate(xpath, document, null, resultType, null);
  if (!all) {
    return res.singleNodeValue as HTMLElement;
  }

  const results: Node[] = [];
  let curr: boolean | Node | null = true;

  while (curr !== null) {
    curr = res.iterateNext();
    if (curr) {
      results.push(curr);
    }
  }

  return results as HTMLElement[];
}

export default getNode;
