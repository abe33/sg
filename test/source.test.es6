'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

import '../src/source';

const getSrcScript = () => {
  // We need to create the script here because scripts passed
  // through innerHTML are not executed.
  const script = document.createElement('script');
  script.textContent = `
  const code = currentRoot.querySelector('code');
  code.textContent = currentHost.innerHTML.trim();`;
  return script;
};

describe('SourceElement', () => {
  let src;

  describe('when no template is present', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-src>
          <div>text</div>
        </sg-src>`);

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

  describe('when a template is present', () => {
    describe('and uses the default sg-src id', () => {
      beforeEach(() => {
        setPageContent(`
          <template id="sg-src">
            <code></code>
          </template>

          <div class="test"></div>`);

        const script = getSrcScript();

        getTestRoot().querySelector('#sg-src').content.appendChild(script);

        const testContainer = getTestRoot().querySelector('.test');
        testContainer.innerHTML = `
        <sg-src>
          <div>text</div>
        </sg-src>`;

        src = getTestRoot().querySelector('sg-src');
      });

      it('preserves the innerHTML value', () => {
        expect(src.innerHTML.trim()).to.eql('<div>text</div>');
      });

      it('inserts the template and executes the script in context', () => {
        expect(src.shadowRoot.querySelector('code').outerHTML)
        .to.eql(`<code>&lt;div&gt;text&lt;/div&gt;</code>`);
      });
    });

    describe('and uses a different id', () => {
      beforeEach(() => {
        setPageContent(`
          <template id="other-src">
            <code></code>
          </template>

          <div class="test"></div>`);

        const script = getSrcScript();

        getTestRoot().querySelector('#other-src').content.appendChild(script);

        const testContainer = getTestRoot().querySelector('.test');
        testContainer.innerHTML = `
        <sg-src template="other-src">
          <div>text</div>
        </sg-src>`;

        src = getTestRoot().querySelector('sg-src');
      });

      it('preserves the innerHTML value', () => {
        expect(src.innerHTML.trim()).to.eql('<div>text</div>');
      });

      it('inserts the template and executes the script in context', () => {
        expect(src.shadowRoot.querySelector('code').outerHTML)
        .to.eql(`<code>&lt;div&gt;text&lt;/div&gt;</code>`);
      });
    });

    describe('and the template does not exist', () => {
      beforeEach(() => {
        setPageContent(`
          <sg-src template="other-src">
            <div>text</div>
          </sg-src>`);

        src = getTestRoot().querySelector('sg-src');
      });

      it('appends a notice message regarding the template in the ', () => {
        expect(src.innerHTML.trim()).to.eql('<div>text</div>');
        expect(src.shadowRoot.innerHTML)
        .to.eql(`
        <slot></slot>
        <span style="color: orange;">The specified template #other-src was not found.</span>`);
      });
    });
  });
});
