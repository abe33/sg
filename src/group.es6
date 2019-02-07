'use strict';

import {asArray} from 'widjet-utils';
import {copyAttribute, forName} from './utils/attributes';

const ATTRIBUTES_MAP = {
  'template': forName('sg-item', copyAttribute('template')),
  'samples-slot': forName('sg-item', copyAttribute('samples-slot')),
  'texts-slot': forName('sg-item', copyAttribute('texts-slot')),
  'sources-slot': forName('sg-item', copyAttribute('sources-slot')),
};

export default class GroupElement extends HTMLElement {
  constructor() {
    super();

    const nodes = asArray(this.children);

    for (const attr in ATTRIBUTES_MAP) {
      if (this.hasAttribute(attr)) {
        ATTRIBUTES_MAP[attr](nodes, this);
      }
    }
  }
}

customElements.define('sg-group', GroupElement);
