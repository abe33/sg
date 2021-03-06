'use strict';

import {merge} from 'widjet-utils';
import warnSpan from '../utils/warnSpan';

const DEFAULT_OPTIONS = {
  mandatorySlot: true,
};

export default function HasTemplate(superclass) {
  return class extends superclass {
    consumeTemplate(options = {}) {
      if (this.shadowRoot) { return; }

      options = merge(DEFAULT_OPTIONS, options);

      const tplAttr = this.getAttribute('template');
      const tplId = tplAttr || options.defaultTemplateId;

      const tpl = document.getElementById(tplId);

      if (tpl) {
        const templateContent = tpl.content;

        const shadowRoot = this.attachShadow({mode: 'open'});
        if (options.mandatorySlot && !templateContent.querySelector('slot')) {
          shadowRoot.innerHTML = `
          <slot></slot>
          ${warnSpan(`A #${tplId} template was found but it didn\'t have a slot.`).outerHTML}`;
        } else {
          shadowRoot.appendChild(templateContent.cloneNode(true));
        }
      } else if (tplAttr) {
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = `
        <slot></slot>
        ${warnSpan(`The specified template #${tplId} was not found.`).outerHTML}`;
      } else {
        this.renderDefaultTemplate();
      }
    }

    renderDefaultTemplate() {}
  };
}
