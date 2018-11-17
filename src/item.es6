'use strict';

import {asArray} from 'widjet-utils';

export default class ItemElement extends HTMLElement {
  constructor() {
    super();

    this.sources = [];
    this.samples = [];
    this.texts = [];
    this.content = [];
    this.meta = {};

    this.gatherData();
  }

  connectedCallback() {}

  gatherData() {
    // Every node that is not a text node and not a sg-* element
    // will be part of a sample. We'll
    let currentSample = [];
    // Once we reach the end of the sample
    const storeCurrentSample = () => {
      if (currentSample.length) {
        const sample = currentSample.join('\n');
        this.samples.push(sample);
        this.content.push(`<sg-sample>${sample}</sg-sample>`);
        currentSample = [];
      }
    };

    asArray(this.childNodes).forEach(c => {
      switch (c.nodeType) {
        case 3: {
          const nodeContent = c.textContent.trim();
          if (nodeContent !== '') {
            this.texts.push(nodeContent);
            this.content.push(`<sg-text>${nodeContent}</sg-text>`);
          }
          break;
        }
        case 1: {
          switch (c.nodeName.toLowerCase()) {
            case 'sg-text': {
              storeCurrentSample();
              this.texts.push(c.innerHTML.trim());
              this.content.push(c.outerHTML);
              break;
            }
            case 'sg-sample': {
              storeCurrentSample();
              this.samples.push(c.innerHTML.trim());
              this.content.push(c.outerHTML);
              break;
            }
            case 'sg-src': {
              storeCurrentSample();
              this.sources.push(c.innerHTML.trim());
              this.content.push(c.outerHTML);
              break;
            }
            case 'sg-meta': {
              storeCurrentSample();
              const name = c.getAttribute('name');
              const content = c.getAttribute('content');
              if (name && content) {
                this.meta[name] = content;
              }
              break;
            }
            default: {
              currentSample.push(c.outerHTML);
              break;
            }
          }
        }
      }
      c.remove();
    });

    storeCurrentSample();

    // If we endup with samples but no sources, the source is the first sample.
    if (this.sources.length === 0 && this.samples.length > 0) {
      const sample = this.samples[0];
      this.sources.push(sample);
      this.content.push(`<sg-src>${sample}</sg-src>`);
    }
  }
}

customElements.define('sg-item', ItemElement);
