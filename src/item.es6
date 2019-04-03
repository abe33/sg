'use strict';

import {asArray, getNode} from 'widjet-utils';
import {forName, copyAttribute} from './utils/attributes';
import getContentAsFragment from './utils/getContentAsFragment';
import getStringAsFragment from './utils/getStringAsFragment';
import HasTemplate from './mixins/has-template';
import HasPreview from './mixins/has-preview';
import parseValue from './utils/parseValue';
import mix from './utils/mix';

const ATTRIBUTES_MAP = {
  'samples-slot': forName('sg-sample', copyAttribute('samples-slot', 'slot')),
  'texts-slot': forName('sg-text', copyAttribute('texts-slot', 'slot')),
  'sources-slot': forName('sg-src', copyAttribute('sources-slot', 'slot')),
};

export default class ItemElement extends mix(HTMLElement).with(HasTemplate, HasPreview) {

  get sources() {
    return this._sources.slice();
  }

  get samples() {
    return this._samples.slice();
  }

  get texts() {
    return this._texts.slice();
  }

  get meta() {
    return this._meta;
  }

  constructor() {
    super();

    this.consumeTemplate({
      defaultTemplateId: 'sg-item',
    });

    this.parseContent(getContentAsFragment(this));
  }

  set innerHTML(html) {
    this.parseContent(getStringAsFragment(html));
  }

  get innerHTML() {
    return super.innerHTML;
  }

  getPreview() {
    return super.getPreview(this._samples[0]);
  }

  parseContent(originalContent) {
    if (originalContent.childNodes.length > 0) {
      const data = this.gatherData(originalContent.childNodes);

      this._sources = data.sources;
      this._samples = data.samples;
      this._texts = data.texts;
      this._meta = data.meta;

      for (const attr in ATTRIBUTES_MAP) {
        if (this.hasAttribute(attr)) {
          ATTRIBUTES_MAP[attr](data.newContent, this);
        }
      }

      data.newContent.forEach(c => this.appendChild(c));
    }
  }

  gatherData(nodes) {
    // We're gathering data in this structure.
    const out = {
      initialContent: asArray(nodes),
      newContent: [],
      sources: [],
      samples: [],
      texts: [],
      meta: {},
    };

    // Every node that is not a text node and not a sg-* element
    // will be part of a sample. We collect them here for later use.
    let currentSample = [];

    // Once we reach the end of the sample, we collect what has been stored
    // here and build a sg-sample object with that.
    const storeCurrentSample = () => {
      if (currentSample.length) {
        const sample = currentSample.join('\n');
        const node = getNode(`<sg-sample>${sample}</sg-sample>`);
        out.samples.push(node);
        out.newContent.push(node);
        currentSample = [];
      }
    };

    asArray(nodes).forEach(c => {
      switch (c.nodeType) {
        case 3: {
          const nodeContent = c.textContent;
          if (nodeContent.trim() !== '') {
            const node = getNode(`<sg-text>${nodeContent}</sg-text>`);
            out.texts.push(node);
            out.newContent.push(node);
          }
          break;
        }
        case 1: {
          switch (c.nodeName.toLowerCase()) {
            case 'sg-text': {
              storeCurrentSample();
              out.texts.push(c);
              out.newContent.push(c);
              break;
            }
            case 'sg-sample': {
              storeCurrentSample();
              out.samples.push(c);
              out.newContent.push(c);
              break;
            }
            case 'sg-src': {
              storeCurrentSample();
              out.sources.push(c);
              out.newContent.push(c);
              break;
            }
            case 'sg-meta': {
              storeCurrentSample();
              const name = c.getAttribute('name');
              const content = c.getAttribute('content');
              const type = c.getAttribute('type') || 'string';
              if (name && content) {
                out.meta[name] = parseValue(content, type);
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
      // c.remove();
    });

    storeCurrentSample();

    // If we endup with samples but no sources, the source is the first sample.
    if (out.sources.length === 0 && out.samples.length > 0) {
      const sample = out.samples[0];
      const node = getNode(`<sg-src lang="html">${sample.innerHTML}</sg-src>`);
      out.sources.push(node);
      out.newContent.push(node);
    }

    return out;
  }
}

customElements.define('sg-item', ItemElement);
