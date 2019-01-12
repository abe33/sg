'use strict';

import {asArray, getNode} from 'widjet-utils';
import HasTemplate from './has-template';
import parseValue from './utils/parseValue';
import mix from './utils/mix';

export default class ItemElement extends mix(HTMLElement).with(HasTemplate) {
  constructor() {
    super();

    this.sources = [];
    this.samples = [];
    this.texts = [];
    this.meta = {};

    const content = this.gatherData();

    this.consumeTemplate({
      defaultTemplateId: 'sg-item'
    });

    content.forEach(c => this.appendChild(c));
  }

  gatherData() {
    // We're gathering each content node here and we'll append
    // everything at the end.
    const content = [];
    // Every node that is not a text node and not a sg-* element
    // will be part of a sample. We'll
    let currentSample = [];
    // Once we reach the end of the sample
    const storeCurrentSample = () => {
      if (currentSample.length) {
        const sample = currentSample.join('\n');
        const node = getNode(`<sg-sample>${sample}</sg-sample>`);
        this.samples.push(node);
        content.push(node);
        currentSample = [];
      }
    };

    asArray(this.childNodes).forEach(c => {
      switch (c.nodeType) {
        case 3: {
          const nodeContent = c.textContent;
          if (nodeContent.trim() !== '') {
            const node = getNode(`<sg-text>${nodeContent}</sg-text>`);
            this.texts.push(node);
            content.push(node);
          }
          break;
        }
        case 1: {
          switch (c.nodeName.toLowerCase()) {
            case 'sg-text': {
              storeCurrentSample();
              this.texts.push(c);
              content.push(c);
              break;
            }
            case 'sg-sample': {
              storeCurrentSample();
              this.samples.push(c);
              content.push(c);
              break;
            }
            case 'sg-src': {
              storeCurrentSample();
              this.sources.push(c);
              content.push(c);
              break;
            }
            case 'sg-meta': {
              storeCurrentSample();
              const name = c.getAttribute('name');
              const content = c.getAttribute('content');
              const type = c.getAttribute('type') || 'string';
              if (name && content) {
                this.meta[name] = parseValue(content, type);
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
      const node = getNode(`<sg-src lang="html">${sample.innerHTML}</sg-src>`);
      this.sources.push(node);
      content.push(node);
    }

    return content;
  }
}

customElements.define('sg-item', ItemElement);
