'use strict';

import {asArray} from 'widjet-utils';

export default function getContentAsFragment(node) {
  const fragment = document.createDocumentFragment();
  asArray(node.childNodes).forEach(n => {
    fragment.appendChild(n);
  });

  return fragment;
};
