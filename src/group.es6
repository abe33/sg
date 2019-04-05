'use strict';

import {copyAttribute, forName} from './utils/attributes';
import HasMeta from './mixins/has-meta';
import ForwardAttributes from './mixins/forward-attributes';
import mix from './utils/mix';

const ATTRIBUTES_MAP = {
  'template': forName('sg-item', copyAttribute('template')),
  'samples-slot': forName('sg-item', copyAttribute('samples-slot')),
  'texts-slot': forName('sg-item', copyAttribute('texts-slot')),
  'sources-slot': forName('sg-item', copyAttribute('sources-slot')),
  'previews-slot': forName('sg-item', copyAttribute('previews-slot')),
};

export default class GroupElement extends mix(HTMLElement)
  .with(HasMeta, ForwardAttributes(ATTRIBUTES_MAP)) {
}

customElements.define('sg-group', GroupElement);
