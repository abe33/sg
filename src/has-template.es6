'use strict';

export default class HasTemplateElement extends HTMLElement {
  consumeTemplate(defaultTemplateId) {
    const tplId = this.hasAttribute('template')
      ? this.getAttribute('template')
      : defaultTemplateId;

    const tpl = document.getElementById(tplId);

    if (tpl) {
      const templateContent = tpl.content;

      const shadowRoot = this.attachShadow({mode: 'open'});
      if (!templateContent.querySelector('slot')) {
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
    }
  }
}
