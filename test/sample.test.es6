'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

import '../src/sample';

describe('SampleElement', () => {
  let sample;

  describe('when no template is present', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-sample>
          <div>text</div>
        </sg-sample`);

      sample = getTestRoot().querySelector('sg-sample');
    });

    it('just leaves its content untouched', () => {
      expect(sample.innerHTML.trim()).to.eql('<div>text</div>');
    });
  });

  describe('when a template is defined', () => {
    describe('and uses the default "sg-sample" id', () => {
      describe('and provides a default slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="sg-sample">
              <div class="container">
                <slot></slot>
              </div>
            </template>

            <sg-sample>
              <div>text</div>
            </sg-sample`);

          sample = getTestRoot().querySelector('sg-sample');
        });

        it('creates a shadow root and uses the provided template', () => {
          expect(sample.innerHTML.trim()).to.eql('<div>text</div>');

          expect(sample.shadowRoot).not.to.be(null);

          expect(sample.shadowRoot.querySelector('.container')).not.to.be(null);
        });
      });
      describe('and provides no slot', () => {
        beforeEach(() => {
          setPageContent(`
              <template id="sg-sample">
                <div class="container"></div>
              </template>

              <sg-sample>
                <div>text</div>
              </sg-sample`);

          sample = getTestRoot().querySelector('sg-sample');
        });

        it('appends a notice message regarding the template in the ', () => {
          expect(sample.innerHTML.trim()).to.eql('<div>text</div>');
          expect(sample.shadowRoot.innerHTML)
          .to.eql(`
          <slot></slot>
          <span style="color: orange;">A #sg-sample template was found but it didn\'t have a slot.</span>`);
        });
      });
    });

    describe('and uses another id', () => {
      describe('and provides a default slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="other-sample">
              <div class="container">
                <slot></slot>
              </div>
            </template>

            <sg-sample template="other-sample">
              <div>text</div>
            </sg-sample`);

          sample = getTestRoot().querySelector('sg-sample');
        });

        it('creates a shadow root and uses the provided template', () => {
          expect(sample.innerHTML.trim()).to.eql('<div>text</div>');

          expect(sample.shadowRoot).not.to.be(null);

          expect(sample.shadowRoot.querySelector('.container')).not.to.be(null);
        });
      });
      describe('and provides no slot', () => {
        beforeEach(() => {
          setPageContent(`
              <template id="other-sample">
                <div class="container"></div>
              </template>

              <sg-sample template="other-sample">
                <div>text</div>
              </sg-sample`);

          sample = getTestRoot().querySelector('sg-sample');
        });

        it('appends a notice message regarding the template in the ', () => {
          expect(sample.innerHTML.trim()).to.eql('<div>text</div>');
          expect(sample.shadowRoot.innerHTML)
          .to.eql(`
          <slot></slot>
          <span style="color: orange;">A #other-sample template was found but it didn\'t have a slot.</span>`);
        });
      });

      describe('and the template does not exist', () => {
        beforeEach(() => {
          setPageContent(`
              <sg-sample template="other-sample">
                <div>text</div>
              </sg-sample`);

          sample = getTestRoot().querySelector('sg-sample');
        });

        it('appends a notice message regarding the template in the ', () => {
          expect(sample.innerHTML.trim()).to.eql('<div>text</div>');
          expect(sample.shadowRoot.innerHTML)
          .to.eql(`
        <slot></slot>
        <span style="color: orange;">The specified template #other-sample was not found.</span>`);
        });
      });
    });
  });
  describe('when the iframe attribute is defined', () => {
    describe('with no template in the page', () => {
      beforeEach(() => {
        setPageContent(`
          <sg-sample iframe>
            <div>text</div>
          </sg-sample`);

        sample = getTestRoot().querySelector('sg-sample');
      });

      it('creates an iframe in the content', () => {
        expect(sample.innerHTML.trim()).to.eql('<iframe></iframe>');
      });

      it('writes the item content in the iframe', () => {
        const iframe = sample.querySelector('iframe');

        expect(iframe.contentDocument.body.innerHTML.trim()).to.eql('<div>text</div>');
      });
    });

    describe('with a template for the sample', () => {
      beforeEach(() => {
        setPageContent(`
            <template id="sg-sample">
              <div class="container">
                <slot></slot>
              </div>
            </template>

            <sg-sample iframe>
              <div>text</div>
            </sg-sample`);

        sample = getTestRoot().querySelector('sg-sample');
      });

      it('creates an iframe in the content', () => {
        expect(sample.innerHTML.trim()).to.eql('<iframe></iframe>');

        expect(sample.shadowRoot).not.to.be(null);

        expect(sample.shadowRoot.querySelector('.container')).not.to.be(null);
      });

      it('writes the item content in the iframe', () => {
        const iframe = sample.querySelector('iframe');

        expect(iframe.contentDocument.body.innerHTML.trim()).to.eql('<div>text</div>');
      });
    });

    describe('with a template for the iframe', () => {
      describe('that has a slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="sg-sample/iframe">
              <div class="container">
                <slot></slot>
              </div>
            </template>

            <sg-sample iframe>
              <div>text</div>
            </sg-sample`);

          sample = getTestRoot().querySelector('sg-sample');
        });

        it('writes the item content in the iframe at the slot position', () => {
          const iframe = sample.querySelector('iframe');

          expect(iframe.contentDocument.body.querySelector('.container')).not.to.be(null);
          expect(iframe.contentDocument.body.querySelector('.container > div')).not.to.be(null);
        });
      });
      describe('that has no slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="sg-sample/iframe">
              <div class="container"></div>
            </template>

            <sg-sample iframe>
              <div>text</div>
            </sg-sample`);

          sample = getTestRoot().querySelector('sg-sample');
        });

        it('writes a warning in the iframe content', () => {
          const iframe = sample.querySelector('iframe');

          expect(iframe.contentDocument.body.querySelector('.container')).to.be(null);
          expect(iframe.contentDocument.body.innerHTML.trim()).to.eql([
            '<span style="color: orange;">A #sg-sample/iframe template was found but it didn\'t have a slot.</span>',
            '<div>text</div>',
          ].join(''));
        });
      });
    });

    describe('with a custom template for the iframe', () => {
      describe('that has a slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="other-sample/iframe">
              <div class="container">
                <slot></slot>
              </div>
            </template>

            <sg-sample iframe iframe-template="other-sample/iframe">
              <div>text</div>
            </sg-sample`);

          sample = getTestRoot().querySelector('sg-sample');
        });

        it('writes the item content in the iframe at the slot position', () => {
          const iframe = sample.querySelector('iframe');

          expect(iframe.contentDocument.body.querySelector('.container')).not.to.be(null);
          expect(iframe.contentDocument.body.querySelector('.container > div')).not.to.be(null);
        });
      });
      describe('that has no slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="other-sample/iframe">
              <div class="container"></div>
            </template>

            <sg-sample iframe iframe-template="other-sample/iframe">
              <div>text</div>
            </sg-sample`);

          sample = getTestRoot().querySelector('sg-sample');
        });

        it('writes a warning in the iframe content', () => {
          const iframe = sample.querySelector('iframe');

          expect(iframe.contentDocument.body.querySelector('.container')).to.be(null);
          expect(iframe.contentDocument.body.innerHTML.trim()).to.eql([
            '<span style="color: orange;">A #other-sample/iframe template was found but it didn\'t have a slot.</span>',
            '<div>text</div>',
          ].join(''));
        });
      });

      describe('and the template does not exist', () => {
        beforeEach(() => {
          setPageContent(`
              <sg-sample iframe iframe-template="other-sample/iframe">
                <div>text</div>
              </sg-sample`);

          sample = getTestRoot().querySelector('sg-sample');
        });

        it('writes a warning in the iframe content', () => {
          const iframe = sample.querySelector('iframe');

          expect(iframe.contentDocument.body.querySelector('.container')).to.be(null);
          expect(iframe.contentDocument.body.innerHTML.trim()).to.eql([
            '<span style="color: orange;">The specified template #other-sample/iframe was not found.</span>',
            '<div>text</div>',
          ].join(''));
        });
      });
    });
  });
});
