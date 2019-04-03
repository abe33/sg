'use strict';

export default function ForwardAttributes(map) {
  return (superclass) => class extends superclass {
    forwardAttributes(target) {
      for (const attr in map) {
        if (this.hasAttribute(attr)) {
          map[attr](target, this);
        }
      }
    }
  };
}

