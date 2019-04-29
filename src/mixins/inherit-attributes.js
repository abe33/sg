'use strict';

import {parent} from 'widjet-utils';

export default function InheritAttributes(fromSelector, inheritedAttributes) {
  return (superclass) => class extends superclass {
    getAttribute(attr) {
      if (inheritedAttributes[attr]) {
        const ancestor = parent(this, fromSelector);
        return super.getAttribute(attr) ||
               (ancestor ? ancestor.getAttribute(inheritedAttributes[attr]) : null);
      } else {
        return super.getAttribute(attr);
      }
    }

    hasInheritedAttribute(attr) {
      const ancestor = parent(this, fromSelector);

      if (inheritedAttributes[attr]) {
        return !this.hasAttribute(attr) &&
               ancestor && (ancestor.hasAttribute(inheritedAttributes[attr]) ||
                            ancestor.hasInheritedAttribute(inheritedAttributes[attr]));
      } else {
        return false;
      }
    }
  };
}
