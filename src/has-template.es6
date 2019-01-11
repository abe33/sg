'use strict';

import {asArray, merge} from 'widjet-utils';

const DEFAULT_OPTIONS = {
  mandatorySlot: true,
}

export default class HasTemplateElement extends HTMLElement {
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
        // Shadow DOM v1 don't allow a script in a template to be affected
        // to currentScript and no API exists to access neither the host node
        // or the shadow root of that script node.
        // What we're doing is to basically adds these values as local
        // constants retrieved from the window object.
        // Once the scripts have been added to the element, the windows
        // properties are removed.
        const clone = templateContent.cloneNode(true);
        const scripts = asArray(clone.querySelectorAll('script'));
        if(scripts.length) {
          window.currentRoot = shadowRoot;
          window.currentHost = this;
          scripts.forEach(s=> {
            s.textContent = `
            const currentRoot = window.currentRoot;
            const currentHost = window.currentHost;
            ${s.textContent}`;
          })
        }
        shadowRoot.appendChild(clone);

        delete window.currentRoot;
        delete window.currentHost;
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
