'use strict';

import {asArray} from 'widjet-utils';

export default function fragmentToString(fragment) {
  return asArray(fragment.children).map(n => n.outerHTML).join('');
}
