/**
 * 一个 DOM 节点是否包含另一个 DOM 节点
 * @param parent {Node} 父节点
 * @param node {Node} 子节点
 * @returns {Boolean}
 */
export default function contains(parent, node) {
  if (parent && !node) {
    return document.documentElement.contains(parent);
  }

  return parent !== node && parent.contains(node);
}
