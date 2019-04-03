'use strict';

import {asArray} from 'widjet-utils';
import {copyAttribute, forName, onList} from './utils/attributes';
import HasMeta from './mixins/has-meta';
import mix from './utils/mix';

const ATTRIBUTES_MAP = {
  'template': onList(forName('sg-item', copyAttribute('template'))),
  'samples-slot': onList(forName('sg-item', copyAttribute('samples-slot'))),
  'texts-slot': onList(forName('sg-item', copyAttribute('texts-slot'))),
  'sources-slot': onList(forName('sg-item', copyAttribute('sources-slot'))),
};

export default class GroupElement extends mix(HTMLElement).with(HasMeta) {
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
