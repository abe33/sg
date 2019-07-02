'use strict';

import {asArray} from 'widjet-utils';

export default class PreviewElement extends HTMLElement {
  get margins() {
    return this.hasAttribute('margins')
      ? this.parseMargins(this.getAttribute('margins'))
      : [0, 0, 0, 0];
  }

  constructor(options = {}) {
    super();

    if (options.margins) {
      this.setAttribute('margins', options.margins.join(' '));
    }
  }

  connectedCallback() {
    requestAnimationFrame(() => {
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

      const margins = this.margins;
      const viewport = [
        0 - margins[3],
        0 - margins[0],
        (contentBounds.right - containerBounds.left) + (margins[1] + margins[3]),
        (contentBounds.bottom - containerBounds.top) + (margins[0] + margins[2]),
      ];

      const content = this.innerHTML;

      this.innerHTML = `
        <svg viewBox="${viewport.join(' ')}">
          <foreignObject x="0" y="0" width="${viewport[2]}" height="${viewport[3]}">
            <body xmlns="http://www.w3.org/1999/xhtml">${content}</body>
          </foreignObject>
        </svg>
      `;
    });
  }

  parseMargins(string) {
    const values = string.split(' ').map(n => parseInt(n, 10));
    switch (values.length) {
      case 1: return new Array(4).fill(values[0]);
      case 2: return [values[0], values[1], values[0], values[1]];
      case 3: return [values[0], values[1], values[2], values[1]];
      case 4: return values;
      default: return [0, 0, 0, 0];
    }
  }
}

customElements.define('sg-preview', PreviewElement);
