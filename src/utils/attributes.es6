'use strict';

export function copyAttribute (attrSrc, attrDest) {
  return (a, b) =>
    a.forEach(n => {
      if(!n.hasAttribute(attrDest)) {
        n.setAttribute(attrDest || attrSrc, b.getAttribute(attrSrc))
      }
    });
};

export function forName (type, f) {
  return (a, b) =>
    f(a.filter(n => n.nodeName.toLowerCase() === type), b);
};
