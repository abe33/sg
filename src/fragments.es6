'use strict';

import stringToFragment from './utils/stringToFragment';
import fetch from './utils/fetch';

export default class FragmentLoader {
  constructor() {
    this.clearCache();
  }

  load(file, options = {}) {
    return Array.isArray(file)
      ? Promise.all(file.map(f => this.loadOnce(f, options)))
      : this.loadOnce(file, options);
  }

  loadOnce(file, options = {}) {
    if(this.cache[file]) { return this.cache[file]; }

    let promise = fetch(file, options)
    .then(res => {
      if (res.status >= 400) {
        throw new Error(`Invalid response status ${res.status}`);
      } else {
        return res.text();
      }
    })
    .then(html => stringToFragment(html));

    if (options.attachTo) {
      promise = promise.then(fragment => {
        const target = document.querySelector(options.attachTo);
        if (target) {
          target.appendChild(fragment);
          return fragment;
        } else {
          throw new Error(`Option attachTo was set to '${options.attachTo}' but no elements match that selector`);
        }
      });
    }

    this.cache[file] = promise;

    return promise;
  }

  clearCache() {
    this.cache = {};
  }
}
