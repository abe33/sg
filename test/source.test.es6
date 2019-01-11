'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

import '../src/source';

describe('SourceElement', () => {
  let src;

  describe('when no template is present', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-src>
          <div>text</div>
        </sg-src`);

      src = getTestRoot().querySelector('sg-src');
    });

    it('preserves the innerHTML value', () => {
      expect(src.innerHTML.trim()).to.eql('<div>text</div>');
    });

    it('places the inner html sources in a pre and code tags', () => {
      expect(src.shadowRoot.innerHTML.trim())
      .to.eql(`<pre><code>&lt;div&gt;text&lt;/div&gt;</code></pre>`);
    });
  });
});
