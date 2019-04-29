'use strict';

import {asArray} from 'widjet-utils';
import {hasAttribute} from '../utils/attributes';

export default function ForwardAttributes(map) {
  return (superclass) => class extends superclass {

    set innerHTML(html) {
      super.innerHTML = html;

      asArray(this.children).forEach(n => this.forwardAttributes(n));
    }

    get innerHTML() {
      return super.innerHTML;
    }

    connectedCallback() {
      asArray(this.children).forEach(n => this.forwardAttributes(n));
    }

    forwardAttributes(target) {
      for (const attr in map) {
        if (hasAttribute(this, attr)) {
          map[attr](target, this);
        }
      }
      if (target.childElementCount) {
        asArray(target.children).forEach(n => this.forwardAttributes(n));
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

