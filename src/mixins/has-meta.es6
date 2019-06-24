'use strict';

import {asArray, parent, merge} from 'widjet-utils';
import parseValue from '../utils/parseValue';

export default function HasMeta(superclass) {
  return class extends superclass {
    get meta() {
      const ancestor = parent(this, 'sg-group');
      const baseMeta = ancestor ? ancestor.meta || {} : {};

      return merge(
        baseMeta,
        asArray(this.querySelectorAll(':scope > sg-meta')).reduce((o, n) => {
          const name = n.getAttribute('name');
          const content = n.getAttribute('content');
          const type = n.getAttribute('type') || 'string';
          if (name && content) {
            o[name] = parseValue(content, type);
          }
          return o;
        }, {}));
    }
  };
}
