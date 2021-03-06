'use strict';

import {asArray, getNode} from 'widjet-utils';
import {forSelector, copyAttribute} from './utils/attributes';
import getContentAsFragment from './utils/getContentAsFragment';
import stringToFragment from './utils/stringToFragment';
import HasTemplate from './mixins/has-template';
import HasPreview from './mixins/has-preview';
import HasMeta from './mixins/has-meta';
import ForwardAttributes from './mixins/forward-attributes';
import InheritAttributes from './mixins/inherit-attributes';
import mix from './utils/mix';

const INHERITED = {
  'template': 'items-template',
  'samples-slot': 'samples-slot',
  'texts-slot': 'texts-slot',
  'sources-slot': 'sources-slot',
  'previews-slot': 'previews-slot',
};

const FORWARDED = {
  'samples-slot': forSelector('sg-sample', copyAttribute('samples-slot', 'slot')),
  'texts-slot': forSelector('sg-text', copyAttribute('texts-slot', 'slot')),
  'sources-slot': forSelector('sg-src', copyAttribute('sources-slot', 'slot')),
  'previews-slot': forSelector('sg-preview', copyAttribute('previews-slot', 'slot')),
};

export default class ItemElement extends mix(HTMLElement)
  .with(HasTemplate, HasPreview, HasMeta,
        InheritAttributes('sg-group', INHERITED),
        ForwardAttributes(FORWARDED)) {

  get sources() {
    return asArray(this.querySelectorAll('sg-src'));
  }

  get samples() {
    return asArray(this.querySelectorAll('sg-sample'));
  }

  get texts() {
    return asArray(this.querySelectorAll('sg-text'));
  }

  set innerHTML(html) {
    this.parseContent(stringToFragment(html));
  }

  get innerHTML() {
    return super.innerHTML;
  }

  constructor() {
    super();

    this.parseContent(getContentAsFragment(this));
  }

  connectedCallback() {
    super.connectedCallback();

    this.consumeTemplate({
      defaultTemplateId: 'sg-item',
    });
  }

  getPreview() {
    return super.getPreview(this.samples[0]);
  }

  appendChild(node) {
    if (['sg-sample', 'sg-src', 'sg-text', 'sg-meta', 'sg-preview'].includes(node.nodeName.toLowerCase())) {
      super.appendChild(node);
    } else {
      if (node.nodeType === 1) {
        const sample = getNode(`<sg-sample>${node.outerHTML}</sg-sample>`);
        super.appendChild(sample);
      } else {
        const text = getNode(`<sg-text>${node.textContent}</sg-text>`);
        super.appendChild(text);
      }
    }
  }

  insertBefore(node, target) {
    if (['sg-sample', 'sg-src', 'sg-text', 'sg-meta', 'sg-preview'].includes(node.nodeName.toLowerCase())) {
      super.insertBefore(node, target);
    } else {
      if (node.nodeType === 1) {
        const sample = getNode(`<sg-sample>${node.outerHTML}</sg-sample>`);
        super.insertBefore(sample, target);
      } else {
        const text = getNode(`<sg-text>${node.textContent}</sg-text>`);
        super.insertBefore(text, target);
      }
    }
  }

  parseContent(originalContent) {
    if (originalContent.childNodes.length > 0) {
      const data = this.gatherData(originalContent.childNodes);
      data.forEach(c => this.appendChild(c));
    }
  }

  gatherData(nodes) {
    const out = [];
    const samples = [];
    const sources = [];
    // Every node that is not a text node and not a sg-* element
    // will be part of a sample. We collect them here for later use.
    let currentSample = [];

    // Once we reach the end of the sample, we collect what has been stored
    // here and build a sg-sample object with that.
    const storeCurrentSample = () => {
      if (currentSample.length) {
        const sample = currentSample.join('\n');
        const node = getNode(`<sg-sample>${sample}</sg-sample>`);
        samples.push(node);
        out.push(node);
        currentSample = [];
      }
    };

    asArray(nodes).forEach(c => {
      switch (c.nodeType) {
        case 3: {
          const nodeContent = c.textContent;
          if (nodeContent.trim() !== '') {
            const node = getNode(`<sg-text>${nodeContent}</sg-text>`);
            out.push(node);
          }
          break;
        }
        case 1: {
          switch (c.nodeName.toLowerCase()) {
            case 'sg-sample': {
              storeCurrentSample();
              samples.push(c);
              out.push(c);
              break;
            }
            case 'sg-src': {
              storeCurrentSample();
              sources.push(c);
              out.push(c);
              break;
            }
            case 'sg-text':
            case 'sg-preview':
            case 'sg-meta': {
              storeCurrentSample();
              out.push(c);
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
    if (sources.length === 0 && samples.length > 0) {
      const sample = samples[0];
      const node = getNode(`<sg-src lang="html">${sample.innerHTML}</sg-src>`);
      out.push(node);
    }

    return out;
  }
}

customElements.define('sg-item', ItemElement);
