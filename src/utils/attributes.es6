'use strict';

export function hasAttribute(node, attr) {
  return node.hasAttribute(attr) ||
        (node.hasInheritedAttribute && node.hasInheritedAttribute(attr));
}

export function copyAttribute(attrSrc, attrDest = attrSrc) {
  return (a, b) => {
    if (!a.hasAttribute(attrDest)) {
      a.setAttribute(attrDest, b.getAttribute(attrSrc));
    }
  };
}

export function forSelector(selector, f) {
  return (n, ...args) => n.matches(selector) && f(n, ...args);
}
