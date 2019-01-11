'use strict';

import HasTemplateElement from './has-template';

export default class TextElement extends HasTemplateElement {
  constructor() {
    super();

    this.consumeTemplate({
      defaultTemplateId: 'sg-text',
      mandatorySlot: false,
    });
  }
}

customElements.define('sg-text', TextElement);
