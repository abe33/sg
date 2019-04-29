'use strict';

import HasMeta from './mixins/has-meta';
import HasTemplate from './mixins/has-template';
import InheritAttributes from './mixins/inherit-attributes';
import mix from './utils/mix';

const INHERITED = {
  'template': 'template',
  'items-template': 'items-template',
  'samples-slot': 'samples-slot',
  'texts-slot': 'texts-slot',
  'sources-slot': 'sources-slot',
  'previews-slot': 'previews-slot',
};

export default class GroupElement extends mix(HTMLElement)
  .with(HasMeta, HasTemplate, InheritAttributes('sg-group', INHERITED)) {

  constructor() {
    super();

    this.consumeTemplate({defaultTemplateId: 'sg-group'});
  }
}

customElements.define('sg-group', GroupElement);
