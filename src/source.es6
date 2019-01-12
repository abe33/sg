'use strict';

import {asArray} from 'widjet-utils';
import HasTemplate from './has-template';
import getContentAsFragment from './utils/getContentAsFragment';
import mix from './utils/mix';

export default class SourceElement extends mix(HTMLElement).with(HasTemplate) {
  constructor() {
    super();

    this.consumeTemplate({
      defaultTemplateId: 'sg-src',
      mandatorySlot: false,
    });
  }

  renderDefaultTemplate() {
    const shadowRoot = this.attachShadow({mode: 'open'});

    const source = this.innerHTML;

    shadowRoot.innerHTML = `<pre><code></code></pre>`;
    shadowRoot.querySelector('code').textContent = source.trim();
  }
}

customElements.define('sg-src', SourceElement);
