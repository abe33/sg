'use strict';

import PreviewElement from './preview';

export default function HasPreview (superclass) {
  return class extends superclass {
    getPreview(element) {
      const preview = new PreviewElement();
      preview.innerHTML = element.innerHTML;
      return preview;
    }
  }
}
