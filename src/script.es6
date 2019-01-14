'use strict';

import {eachParent} from 'widjet-utils';

let scriptId = 0;
const instances = {};

const findRoot = (node) => {
  let root;
  eachParent(node, parent => {
    if (parent.nodeType === 11) {
      root = parent;
    }
  });
  return root;
}

export default class ScriptElement extends HTMLElement {
  static getContext(id) {
    const instance = instances[id];

    const currentRoot = findRoot(instance);
    const currentHost = currentRoot && currentRoot.host;

    return {currentScript: instance, currentRoot, currentHost};
  }

  constructor() {
    super();

    const id = scriptId++;
    instances[id] = this;

    const source = this.innerHTML;
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.innerHTML = `
    (function(){
      const {currentScript, currentHost, currentRoot} = customElements.get('sg-script').getContext(${id});
      ${source}
    })();`;
    this.innerHTML = '';
    this.appendChild(script);
  }
}

customElements.define('sg-script', ScriptElement);
