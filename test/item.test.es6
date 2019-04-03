'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

import '../src/item';

const asSource = a => a.map(e => e.outerHTML);

describe('ItemElement', () => {
  let item;
  describe('with plain html content', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-item>
          <div class="dummy"></div>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');
    });

    it('stores its content as both sample and source', () => {
      expect(asSource(item.samples))
      .to.eql(['<sg-sample><div class="dummy"></div></sg-sample>']);

      expect(asSource(item.sources))
      .to.eql(['<sg-src lang="html"><div class="dummy"></div></sg-src>']);

      expect(item.texts).to.eql([]);

      expect(item.innerHTML).to.eql([
        '<sg-sample><div class="dummy"></div></sg-sample>',
        '<sg-src lang="html"><div class="dummy"></div></sg-src>',
      ].join(''));
    });
  });

  describe('when content is not available in the constructor', () => {
    beforeEach(() => {
      item = document.createElement('sg-item');

      item.innerHTML = `
            Some text
            <div class="dummy"></div>`;
    });

    describe('when accessing one its derived properties', () => {
      it('gathers data lazily', () => {
        expect(asSource(item.samples))
        .to.eql(['<sg-sample><div class="dummy"></div></sg-sample>']);

        expect(asSource(item.sources))
        .to.eql(['<sg-src lang="html"><div class="dummy"></div></sg-src>']);

        expect(asSource(item.texts))
        .to.eql([`<sg-text>
            Some text
            </sg-text>`]);

        expect(item.innerHTML).to.eql([
          `<sg-text>
            Some text
            </sg-text>`,
          '<sg-sample><div class="dummy"></div></sg-sample>',
          '<sg-src lang="html"><div class="dummy"></div></sg-src>',
        ].join(''));
      });
    });
  });

  describe('with mixed html content', () => {
    describe('with no source node but text and many samples', () => {
      beforeEach(() => {
        setPageContent(`
          <sg-item>
            Some text content

            <div class="dummy"></div>

            <sg-sample>
              <div></div>
            </sg-sample>
          </sg-item>
          `);

        item = getTestRoot().querySelector('sg-item');
      });

      it('uses the first sample as source', () => {
        expect(asSource(item.samples)).to.eql([
          '<sg-sample><div class="dummy"></div></sg-sample>',
          `<sg-sample>
              <div></div>
            </sg-sample>`,
        ]);
        expect(asSource(item.sources)).to.eql([
          '<sg-src lang="html"><div class="dummy"></div></sg-src>',
        ]);

        expect(asSource(item.texts)).to.eql([
          `<sg-text>
            Some text content

            </sg-text>`]);

        expect(item.innerHTML).to.eql([
          `<sg-text>
            Some text content

            </sg-text>`,
          '<sg-sample><div class="dummy"></div></sg-sample>',
          `<sg-sample>
              <div></div>
            </sg-sample>`,
          '<sg-src lang="html"><div class="dummy"></div></sg-src>',
        ].join(''));
      });
    });

    describe('with a source node', () => {
      beforeEach(() => {
        setPageContent(`
          <sg-item>
            Some text content

            <div class="dummy"></div>

            <sg-src>
              <div></div>
            </sg-src>
          </sg-item>
          `);

        item = getTestRoot().querySelector('sg-item');
      });

      it('stores its content as both sample and source', () => {
        expect(asSource(item.samples)).to.eql(['<sg-sample><div class="dummy"></div></sg-sample>']);
        expect(asSource(item.sources)).to.eql([`<sg-src>
              <div></div>
            </sg-src>`]);
        expect(asSource(item.texts)).to.eql([`<sg-text>
            Some text content

            </sg-text>`]);
        expect(item.innerHTML).to.eql([
          `<sg-text>
            Some text content

            </sg-text>`,
          '<sg-sample><div class="dummy"></div></sg-sample>',
          `<sg-src>
              <div></div>
            </sg-src>`,
        ].join(''));
      });
    });
  });

  describe('with only custom elements containers', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-item>
          <sg-sample>
            <div class="dummy"></div>
          </sg-sample>

          <sg-text>
            Some text content
          </sg-text>

          <sg-src>
            <div></div>
          </sg-src>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');
    });

    it('stores its content as both sample and source', () => {
      expect(asSource(item.samples)).to.eql([`<sg-sample>
            <div class="dummy"></div>
          </sg-sample>`]);
      expect(asSource(item.sources)).to.eql([`<sg-src>
            <div></div>
          </sg-src>`]);
      expect(asSource(item.texts)).to.eql([`<sg-text>
            Some text content
          </sg-text>`]);
      expect(item.innerHTML).to.eql([
        `<sg-sample>
            <div class="dummy"></div>
          </sg-sample>`,
        `<sg-text>
            Some text content
          </sg-text>`,
        `<sg-src>
            <div></div>
          </sg-src>`,
      ].join(''));
    });

    it('preserves all attributes on the custom elements', () => {
      setPageContent(`
        <sg-item>
          <sg-sample foo="bar">
            <div class="dummy"></div>
          </sg-sample>

          <sg-text foo="bar">
            Some text content
          </sg-text>

          <sg-src foo="bar">
            <div></div>
          </sg-src>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');

      expect(item.innerHTML).to.eql([
        `<sg-sample foo="bar">
            <div class="dummy"></div>
          </sg-sample>`,
        `<sg-text foo="bar">
            Some text content
          </sg-text>`,
        `<sg-src foo="bar">
            <div></div>
          </sg-src>`,
      ].join(''));
    });
  });

  describe('with meta properties', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-item>
          <sg-meta name="string" content="foo"></sg-meta>
          <sg-meta name="bool" content="true" type="boolean"></sg-meta>
          <sg-meta name="number" content="15.5" type="number"></sg-meta>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');
    });

    it('fills the meta property of the node with the data from the meta', () => {
      expect(item.meta).to.eql({
        string: 'foo',
        bool: true,
        number: 15.5,
      });
    });
  });

  describe('once connected to the DOM', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-item>
          Some text content

          <div class="dummy"></div>

          <sg-src>
            <div></div>
          </sg-src>
        </sg-item>
        `);

      item = getTestRoot().querySelector('sg-item');
    });

    it('does not alter the declared content', () => {
      expect(item.querySelector('sg-sample')).not.to.be(null);
      expect(item.querySelector('sg-text')).not.to.be(null);
      expect(item.querySelector('sg-src')).not.to.be(null);
    });
  });

  describe('.getPreview()', () => {
    describe('when there are many samples', () => {
      beforeEach(() => {
        setPageContent(`
        <sg-item>
          <sg-sample><div>foo</div></sg-sample>
          <sg-sample><div>bar</div></sg-sample>
        </sg-item>
        `);

        item = getTestRoot().querySelector('sg-item');
      });

      it('returns a sg-preview object with the first sample as content', () => {
        const preview = item.getPreview();

        expect(preview.querySelector('div').textContent).to.eql('foo');
        expect(preview.querySelectorAll('div').length).to.eql(1);
      });
    });
  });

  describe('when a template is defined', () => {
    const itemContent = [
      '<sg-sample><div>text</div></sg-sample>',
      '<sg-src lang="html"><div>text</div></sg-src>',
    ].join('');

    describe('and uses the default "sg-item" id', () => {
      describe('and provides a default slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="sg-item">
              <div class="container">
                <slot></slot>
              </div>
            </template>

            <sg-item>
              <div>text</div>
            </sg-item`);

          item = getTestRoot().querySelector('sg-item');
        });

        it('creates a shadow root and uses the provided template', () => {
          expect(item.innerHTML.trim()).to.eql(itemContent);

          expect(item.shadowRoot).not.to.be(null);

          expect(item.shadowRoot.querySelector('.container')).not.to.be(null);
        });
      });
      describe('and provides no slot', () => {
        beforeEach(() => {
          setPageContent(`
              <template id="sg-item">
                <div class="container"></div>
              </template>

              <sg-item>
                <div>text</div>
              </sg-item`);

          item = getTestRoot().querySelector('sg-item');
        });

        it('appends a notice message regarding the template in the ', () => {
          expect(item.innerHTML.trim()).to.eql(itemContent);
          expect(item.shadowRoot.innerHTML)
          .to.eql(`
          <slot></slot>
          <span style="color: orange;">A #sg-item template was found but it didn\'t have a slot.</span>`);
        });
      });
    });

    describe('and uses another id', () => {
      describe('and provides a default slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="other-item">
              <div class="container">
                <slot></slot>
              </div>
            </template>

            <sg-item template="other-item">
              <div>text</div>
            </sg-item`);

          item = getTestRoot().querySelector('sg-item');
        });

        it('creates a shadow root and uses the provided template', () => {
          expect(item.innerHTML.trim()).to.eql(itemContent);

          expect(item.shadowRoot).not.to.be(null);

          expect(item.shadowRoot.querySelector('.container')).not.to.be(null);
        });
      });
      describe('and provides no slot', () => {
        beforeEach(() => {
          setPageContent(`
              <template id="other-item">
                <div class="container"></div>
              </template>

              <sg-item template="other-item">
                <div>text</div>
              </sg-item`);

          item = getTestRoot().querySelector('sg-item');
        });

        it('appends a notice message regarding the template in the ', () => {
          expect(item.innerHTML.trim()).to.eql(itemContent);
          expect(item.shadowRoot.innerHTML)
          .to.eql(`
          <slot></slot>
          <span style="color: orange;">A #other-item template was found but it didn\'t have a slot.</span>`);
        });
      });

      describe('and the template does not exist', () => {
        beforeEach(() => {
          setPageContent(`
              <sg-item template="other-item">
                <div>text</div>
              </sg-item`);

          item = getTestRoot().querySelector('sg-item');
        });

        it('appends a notice message regarding the template in the ', () => {
          expect(item.innerHTML.trim()).to.eql(itemContent);
          expect(item.shadowRoot.innerHTML)
          .to.eql(`
        <slot></slot>
        <span style="color: orange;">The specified template #other-item was not found.</span>`);
        });
      });
    });
  });

  describe('samples-slot attribute', () => {
    it('sets the slot attribute on generated samples', () => {
      setPageContent(`
        <sg-item samples-slot="name">
          <div class="dummy"></div>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');
      expect(item.querySelector('sg-sample').getAttribute('slot')).to.eql('name');
    });
  });
  describe('sources-slot attribute', () => {
    it('sets the slot attribute on generated sources', () => {
      setPageContent(`
        <sg-item sources-slot="name">
          <div class="dummy"></div>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');
      expect(item.querySelector('sg-src').getAttribute('slot')).to.eql('name');
    });
  });
  describe('texts-slot attribute', () => {
    it('sets the slot attribute on generated texts', () => {
      setPageContent(`
        <sg-item texts-slot="name">
          Some text
          <div class="dummy"></div>
        </sg-item>
      `);

      item = getTestRoot().querySelector('sg-item');
      expect(item.querySelector('sg-text').getAttribute('slot')).to.eql('name');
    });
  });
});
