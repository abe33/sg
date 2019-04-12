'use strict';

import HasTemplate from './mixins/has-template';
import getContentAsFragment from './utils/getContentAsFragment';
import fragmentToString from './utils/fragmentToString';
import mix from './utils/mix';

export default class SampleElement extends mix(HTMLElement).with(HasTemplate) {
  constructor() {
    super();

    if (this.hasAttribute('iframe')) {
      this.buildIframe();
    }

    this.consumeTemplate({
      defaultTemplateId: 'sg-sample',
    });
  }

  connectedCallback() {}

  buildIframe() {
    let html;
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
        // We're building a fake fragment with the body of the iframe.
        // Inside the iframe we still want to use the template and shadow DOM
        // so that it stays consistent with the host page.
        html = `
        <body>
          ${fragmentToString(initialContent)}}
          <script type="text/javascript">
            const root = document.body.attachShadow({mode: 'open'});
            root.innerHTML = \`${fragmentToString(templateContent)}\`;
          </script>
        </body>`;
      } else {
        const warning = document.createElement('span');
        warning.style.color = 'orange';
        warning.textContent = `A #${tplId} template was found but it didn\'t have a slot.`;
        initialContent.insertBefore(warning, initialContent.firstChild);
        html = fragmentToString(initialContent);
      }

    } else {
      if (this.hasAttribute('iframe-template')) {
        const warning = document.createElement('span');
        warning.style.color = 'orange';
        warning.textContent = `The specified template #${tplId} was not found.`;
        initialContent.insertBefore(warning, initialContent.firstChild);
      }

      html = fragmentToString(initialContent);
    }

    const frame = this.querySelector('iframe');
    frame.contentDocument.open();
    frame.contentDocument.write(html);
    frame.contentDocument.close();
  }
}

customElements.define('sg-sample', SampleElement);
