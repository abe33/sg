'use strict';

import {asArray} from 'widjet-utils';
import {copyAttribute} from './utils/attributes';

const ATTRIBUTES_MAP = {
  'template': copyAttribute('template'),
  'samples-slot': copyAttribute('samples-slot'),
  'texts-slot': copyAttribute('texts-slot'),
  'sources-slot': copyAttribute('sources-slot'),
}

export default class GroupElement extends HTMLElement {
  constructor() {
    super();

    const nodes = asArray(this.children);

    for (const attr in ATTRIBUTES_MAP) {
      if(this.hasAttribute(attr)) {
        ATTRIBUTES_MAP[attr](nodes, this);
      }
    }
  }
}

customElements.define('sg-group', GroupElement)
