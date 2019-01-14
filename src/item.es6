'use strict';

import {asArray, getNode} from 'widjet-utils';
import HasTemplate from './has-template';
import HasPreview from './has-preview';
import HasLazyContent from './has-lazy-content';
import parseValue from './utils/parseValue';
import mix from './utils/mix';

export default class ItemElement extends mix(HTMLElement).with(HasTemplate, HasPreview, HasLazyContent) {

  get sources() {
    this.lazyInit();
    return this._sources.slice();
  }

  get samples() {
    this.lazyInit();
    return this._samples.slice();
  }

  get texts() {
    this.lazyInit();
    return this._texts.slice();
  }

  get meta() {
    this.lazyInit();
    return this._meta;
  }

  connectedCallback() {
    requestAnimationFrame(() => this.lazyInit());
  }

  getPreview() {
    this.lazyInit();
    return super.getPreview(this._samples[0]);
  }

  init() {
    this._sources = [];
    this._samples = [];
    this._texts = [];
    this._meta = {};

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
        this._samples.push(node);
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
            this._texts.push(node);
            content.push(node);
          }
          break;
        }
        case 1: {
          switch (c.nodeName.toLowerCase()) {
            case 'sg-text': {
              storeCurrentSample();
              this._texts.push(c);
              content.push(c);
              break;
            }
            case 'sg-sample': {
              storeCurrentSample();
              this._samples.push(c);
              content.push(c);
              break;
            }
            case 'sg-src': {
              storeCurrentSample();
              this._sources.push(c);
              content.push(c);
              break;
            }
            case 'sg-meta': {
              storeCurrentSample();
              const name = c.getAttribute('name');
              const content = c.getAttribute('content');
              const type = c.getAttribute('type') || 'string';
              if (name && content) {
                this._meta[name] = parseValue(content, type);
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
    if (this._sources.length === 0 && this._samples.length > 0) {
      const sample = this._samples[0];
      const node = getNode(`<sg-src lang="html">${sample.innerHTML}</sg-src>`);
      this._sources.push(node);
      content.push(node);
    }

    return content;
  }
}

customElements.define('sg-item', ItemElement);
