'use strict';

export function copyAttribute(attrSrc, attrDest) {
  return (a, b) => {
    if (!a.hasAttribute(attrDest)) {
      a.setAttribute(attrDest || attrSrc, b.getAttribute(attrSrc));
    }
  };
}

export function forName(type, f) {
  return (n, ...args) => n.nodeName.toLowerCase() === type && f(n, ...args);
}

export function onList(f) {
  return (a, ...args) => a.forEach(o => f(o, ...args));
}
