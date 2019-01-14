'use strict';

import {asArray, merge} from 'widjet-utils';

const DEFAULT_OPTIONS = {
  mandatorySlot: true,
}

export default function HasTemplate (superclass) {
  return class extends superclass {
    consumeTemplate(options={}) {
      options = merge(DEFAULT_OPTIONS, options);

      const tplId = this.hasAttribute('template')
        ? this.getAttribute('template')
        : options.defaultTemplateId;

      const tpl = document.getElementById(tplId);

      if (tpl) {
        const templateContent = tpl.content;

        const shadowRoot = this.attachShadow({mode: 'open'});
        if (options.mandatorySlot && !templateContent.querySelector('slot')) {
          shadowRoot.innerHTML = `
          <slot></slot>
          <span style="color: orange;">A #${tplId} template was found but it didn\'t have a slot.</span>`;
        } else {
          shadowRoot.appendChild(templateContent.cloneNode(true));
        }
      } else if (this.hasAttribute('template')) {
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
        <slot></slot>
        <span style="color: orange;">The specified template #${tplId} was not found.</span>`;
      } else {
        this.renderDefaultTemplate();
      }
    }

    renderDefaultTemplate() {}
  }
}

