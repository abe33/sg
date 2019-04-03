'use strict';

import {asArray} from 'widjet-utils';
import parseValue from '../utils/parseValue';

export default function HasMeta(superclass) {
  return class extends superclass {
    get meta() {
      return asArray(this.querySelectorAll(':scope > sg-meta')).reduce((o, n) => {
        const name = n.getAttribute('name');
        const content = n.getAttribute('content');
        const type = n.getAttribute('type') || 'string';
        if (name && content) {
          o[name] = parseValue(content, type);
        }
        return o;
      }, {});
    }

  };
}
