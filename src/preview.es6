'use strict';

export default class PreviewElement extends HTMLElement {
  connectedCallback () {
    const container = this.firstElementChild;
    const contentBounds = container.getBoundingClientRect();
    const containerBounds = this.getBoundingClientRect();

    const viewport = [
      contentBounds.left - containerBounds.left,
      contentBounds.top - containerBounds.top,
      contentBounds.width,
      contentBounds.height,
    ];

    this.innerHTML = `
      <svg viewbox="${viewport.join(' ')}">
        <foreignObject x="0" y="0" width="${viewport[2]}" height="${viewport[3]}">
          <body xmlns="http://www.w3.org/1999/xhtml">
            ${container.outerHTML}
          </body>
        </foreignObject>
      </svg>
    `;
  }
}

customElements.define('sg-preview', PreviewElement);
