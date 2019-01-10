'use strict';

import {asArray} from 'widjet-utils';
import HasTemplateElement from './has-template';

const getContentAsFragment = (node) => {
  const fragment = document.createDocumentFragment();
  asArray(node.childNodes).forEach(n => {
    fragment.appendChild(n);
  });

  return fragment;
};

export default class SampleElement extends HasTemplateElement {
  constructor() {
    super();

    if (this.hasAttribute('iframe')) {
      this.buildIframe();
    }

    this.consumeTemplate('sg-sample');
  }

  connectedCallback() {}

  buildIframe() {
    let content;
    const initialContent = getContentAsFragment(this);
    this.innerHTML = '<iframe></iframe>';

    const tplId = this.hasAttribute('iframe-template')
      ? this.getAttribute('iframe-template')
      : 'sg-sample/iframe';
    const tpl = document.getElementById(tplId);

    if (tpl) {
      const templateContent = tpl.content.cloneNode(true);
      const slot = templateContent.querySelector('slot');

      if (slot) {
        slot.parentNode.insertBefore(initialContent, slot);
        slot.remove();
        content = templateContent;
      } else {
        content = initialContent;

        const warning = document.createElement('span');
        warning.style.color = 'orange';
        warning.textContent = `A #${tplId} template was found but it didn\'t have a slot.`;
        content.insertBefore(warning, content.firstChild);
      }

    } else {
      content = initialContent;


      if (this.hasAttribute('iframe-template')) {
        const warning = document.createElement('span');
        warning.style.color = 'orange';
        warning.textContent = `The specified template #${tplId} was not found.`;
        content.insertBefore(warning, content.firstChild);
      }
    }

    const frame = this.querySelector('iframe');
    frame.contentDocument.open();
    frame.contentDocument.write(asArray(content.children).map(n => n.outerHTML).join(''));
    frame.contentDocument.close();
  }
}

customElements.define('sg-sample', SampleElement);
