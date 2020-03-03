export default async function walk(
  node: Node,
  fn: (node: Node) => Promise<void>
) {
  let child: ChildNode;
  let next: ChildNode;

  switch (node.nodeType) {
    case 1: // Element
    case 9: // Document
    case 11: // Document fragment
      child = node.firstChild;
      while (child) {
        next = child.nextSibling;
        walk(child, fn);
        child = next;
      }
      break;

    case 3: // Text node
      if (
        node.parentElement !== null &&
        node.parentElement.tagName.toLowerCase() !== 'script' &&
        node.parentElement.tagName.toLowerCase() !== 'style' &&
        node.parentElement.tagName.toLowerCase() !== 'textarea' &&
        node.parentElement.contentEditable !== 'true'
      ) {
        await fn(node);
      }
      break;
  }
}
