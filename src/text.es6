'use strict';

import HasTemplate from './mixins/has-template';
import mix from './utils/mix';

export default class TextElement extends mix(HTMLElement).with(HasTemplate) {
  constructor() {
    super();

    this.consumeTemplate({
      defaultTemplateId: 'sg-text',
      mandatorySlot: false,
    });
  }
}

customElements.define('sg-text', TextElement);
