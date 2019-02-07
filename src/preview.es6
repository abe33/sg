'use strict';

import {asArray} from 'widjet-utils';

export default class PreviewElement extends HTMLElement {
  connectedCallback() {
    const containerBounds = this.getBoundingClientRect();
    let contentBounds = {};

    asArray(this.children).forEach(n => {
      const bounds = n.getBoundingClientRect();

      contentBounds.left = contentBounds.left
        ? Math.min(bounds.left, contentBounds.left)
        : bounds.left;
      contentBounds.top = contentBounds.top
        ? Math.min(bounds.top, contentBounds.top)
        : bounds.top;
      contentBounds.right = contentBounds.right
        ? Math.max(bounds.right, contentBounds.right)
        : bounds.right;
      contentBounds.bottom = contentBounds.bottom
        ? Math.max(bounds.bottom, contentBounds.bottom)
        : bounds.bottom;
    });

    const viewport = [
      0,
      0,
      contentBounds.right - containerBounds.left,
      contentBounds.bottom - containerBounds.top,
    ];

    const content = this.innerHTML;

    this.innerHTML = `
      <svg viewbox="${viewport.join(' ')}">
        <foreignObject x="0" y="0" width="${viewport[2]}" height="${viewport[3]}">
          <body xmlns="http://www.w3.org/1999/xhtml">${content}</body>
        </foreignObject>
      </svg>
    `;
  }
}

customElements.define('sg-preview', PreviewElement);
