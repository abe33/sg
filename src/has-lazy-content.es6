'use strict';

export default function HasLazyContent (superclass) {
  return class extends superclass {
    constructor(...args) {
      super(...args);

      if(this.childNodes.length > 0) {
        this.lazyInit();
      }
    }

    lazyInit() {
      if(this._initialized) {
        return;
      }

      this._initialized = true;
      this.init();
    }

    init() {}
  }
}
