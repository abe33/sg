'use strict';

import PreviewElement from '../preview';

export default function HasPreview(superclass) {
  return class extends superclass {
    getPreview(element) {
      const options = {};
      if (this.hasAttribute('preview-margins')) {
        options.margins = this.getAttribute('preview-margins').split(' ').map(n => parseInt(n, 10));
      }
      const preview = new PreviewElement(options);
      preview.innerHTML = element.innerHTML;
      return preview;
    }
  };
}
