'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

import '../src/text';

describe('TextElement', () => {
  let text;

  describe('when no template is present', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-text>
          <em>Some text</em>
        </sg-text>`);

      text = getTestRoot().querySelector('sg-text');
    });

    it('preserves the innerHTML value', () => {
      expect(text.innerHTML.trim()).to.eql('<em>Some text</em>');
    });
  });

  describe('when a template is present', () => {
    describe('and uses the default sg-text id', () => {
      describe('and has no slot but a script', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="sg-text">
              <p></p>
            </template>

            <div class="test"></div>`);

          // We need to create the script here because scripts passed
          // through innerHTML are not executed.
          const script = document.createElement('script');
          script.textContent = `
          const p = currentRoot.querySelector('p');
          p.innerHTML = currentHost.innerHTML.trim();`;

          getTestRoot().querySelector('#sg-text').content.appendChild(script);

          const testContainer = getTestRoot().querySelector('.test');
          testContainer.innerHTML = `
          <sg-text>
            <em>Some text</em>
          </sg-text>`;

          text = getTestRoot().querySelector('sg-text');
        });

        it('preserves the innerHTML value', () => {
          expect(text.innerHTML.trim()).to.eql('<em>Some text</em>');
        });

        it('inserts the template and executes the script in context', () => {
          expect(text.shadowRoot.querySelector('p').outerHTML)
          .to.eql(`<p><em>Some text</em></p>`);
        });
      });

      describe('and has a slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="sg-text">
              <p><slot></slot></p>
            </template>

            <sg-text>
              <em>Some text</em>
            </sg-text>`);

          text = getTestRoot().querySelector('sg-text');
        });

        it('preserves the innerHTML value', () => {
          expect(text.innerHTML.trim()).to.eql('<em>Some text</em>');
        });

        it('creates a shadow root', () => {
          expect(text.shadowRoot).not.to.be(null);

          expect(text.shadowRoot.querySelector('p')).not.to.be(null);
        });
      });
    });

    describe('and uses a different id', () => {
      beforeEach(() => {
        setPageContent(`
          <template id="other-text">
            <p><slot></slot></p>
          </template>

          <sg-text template="other-text">
            <em>Some text</em>
          </sg-text>`);

        text = getTestRoot().querySelector('sg-text');
      });

      it('preserves the innerHTML value', () => {
        expect(text.innerHTML.trim()).to.eql('<em>Some text</em>');
      });

      it('creates a shadow root', () => {
        expect(text.shadowRoot).not.to.be(null);

        expect(text.shadowRoot.querySelector('p')).not.to.be(null);
      });
    });

    describe('and the template does not exist', () => {
      beforeEach(() => {
        setPageContent(`
          <sg-text template="other-text">
            <em>Some text</em>
          </sg-text>`);

        text = getTestRoot().querySelector('sg-text');
      });

      it('appends a notice message regarding the template in the ', () => {
        expect(text.innerHTML.trim()).to.eql('<em>Some text</em>');
        expect(text.shadowRoot.innerHTML)
        .to.eql(`
        <slot></slot>
        <span style="color: orange;">The specified template #other-text was not found.</span>`);
      });
    });
  });
});
