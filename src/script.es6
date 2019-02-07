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
};

const wrapSource = (source, id) => `
  (function(){
    const {currentScript, currentHost, currentRoot} = customElements.get('sg-script').getContext(${id});
    ${source}
  })();`;

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

    if (this.hasAttribute('src')) {
      fetch(this.getAttribute('src'))
      .then(response => response.text())
      .then(source => {
        const script = document.createElement('script');
        this.dispatchEvent(new Event('load'));
        script.setAttribute('type', 'text/javascript');
        script.innerHTML = wrapSource(source, id);
        this.appendChild(script);
      })
      .catch(err => console.log(err));
    } else {
      const source = this.innerHTML;
      const script = document.createElement('script');
      script.setAttribute('type', 'text/javascript');
      script.innerHTML = wrapSource(source, id);
      this.innerHTML = '';
      this.appendChild(script);
    }
  }
}

customElements.define('sg-script', ScriptElement);
