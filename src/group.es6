'use strict';

import {asArray} from 'widjet-utils';
import {copyAttribute, forName, onList} from './utils/attributes';
import HasMeta from './mixins/has-meta';
import ForwardAttributes from './mixins/forward-attributes';
import mix from './utils/mix';

const ATTRIBUTES_MAP = {
  'template': onList(forName('sg-item', copyAttribute('template'))),
  'samples-slot': onList(forName('sg-item', copyAttribute('samples-slot'))),
  'texts-slot': onList(forName('sg-item', copyAttribute('texts-slot'))),
  'sources-slot': onList(forName('sg-item', copyAttribute('sources-slot'))),
};

export default class GroupElement extends mix(HTMLElement)
  .with(HasMeta, ForwardAttributes(ATTRIBUTES_MAP)) {

  constructor() {
    super();

    this.forwardAttributes(asArray(this.children));
  }
}

customElements.define('sg-group', GroupElement);
