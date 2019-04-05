'use strict';

import {asArray} from 'widjet-utils';

export default function ForwardAttributes(map) {
  return (superclass) => class extends superclass {

    set innerHTML(html) {
      super.innerHTML = html;

      asArray(this.children).forEach(n => this.forwardAttributes(n));
    }

    get innerHTML() {
      return super.innerHTML;
    }

    constructor() {
      super();

      asArray(this.children).forEach(n => this.forwardAttributes(n));
    }

    forwardAttributes(target) {
      for (const attr in map) {
        if (this.hasAttribute(attr)) {
          map[attr](target, this);
        }
      }
    }

    appendChild(child) {
      super.appendChild(child);
      this.forwardAttributes(child);
    }

    insertBefore(child, node) {
      super.insertBefore(child, node);
      this.forwardAttributes(child);
    }
  };
}

