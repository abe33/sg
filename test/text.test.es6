'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';
import {ignoreHTMLSpaces} from './helpers';

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

              <sg-script>
                const p = currentRoot.querySelector('p');
                p.innerHTML = currentHost.innerHTML.trim();
              </sg-script>
            </template>

            <sg-text>
              <em>Some text</em>
            </sg-text>`);

          text = getTestRoot().querySelector('sg-text');
        });

        it('preserves the innerHTML value', () => {
          expect(text.innerHTML.trim()).to.eql('<em>Some text</em>');
        });

        it('inserts the template and executes the script in context', () => {
          expect(text.shadowRoot.querySelector('p').outerHTML)
            .to.eql('<p><em>Some text</em></p>');
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
        expect(ignoreHTMLSpaces(text.shadowRoot.innerHTML))
          .to.eql(ignoreHTMLSpaces(`
          <slot></slot>
          <span style="color: orange;">The specified template #other-text was not found.</span>`));
      });
    });
  });
});
