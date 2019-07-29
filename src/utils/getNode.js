export default function getNode(xpath, all = false) {
  const resultType = all
    ? XPathResult.UNORDERED_NODE_ITERATOR_TYPE
    : XPathResult.FIRST_ORDERED_NODE_TYPE;

  const res = document.evaluate(xpath, document, null, resultType, null);
  if (!all) {
    return res.singleNodeValue;
  }

  const results = [];
  let curr = true;

  while (curr !== null) {
    curr = res.iterateNext();
    if (curr) {
      results.push(curr);
    }
  }

  return results;
}
