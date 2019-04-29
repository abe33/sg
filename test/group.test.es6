'use strict';

import expect from 'expect.js';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

import '../src/group';

describe('GroupElement', () => {
  let group;

  [
    'template',
    'items-template',
    'samples-slot',
    'sources-slot',
    'previews-slot',
    'texts-slot',
  ].forEach(attr => {

    describe(`${attr} attribute`, () => {
      beforeEach(() => {
        setPageContent(`
          <sg-group ${attr}="value">
            <sg-group ${attr}="other-value">
              <sg-item></sg-item>
            </sg-group>

            <sg-group>
              <sg-item></sg-item>
            </sg-group>
          </sg-group>
        `);

        group = getTestRoot().querySelector('sg-group');
      });

      it('inherits the attribute from its parent group', () => {
        const target = group.querySelector(`sg-group:not([${attr}])`);
        expect(target.getAttribute(attr)).to.eql('value');
        expect(target.hasAttribute(attr)).to.be(false);
        expect(target.hasInheritedAttribute(attr)).to.be(true);
      });

      it('preserves its own attribute value', () => {
        const target = group.querySelector(`sg-group[${attr}]`);
        expect(target.getAttribute(attr)).to.eql('other-value');
        expect(target.hasAttribute(attr)).to.be(true);
        expect(target.hasInheritedAttribute(attr)).to.be(false);
      });
    });
  });

  describe('meta children', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-group>
          <sg-meta name="string" content="foo"></sg-meta>
          <sg-meta name="bool" content="true" type="boolean"></sg-meta>
          <sg-meta name="number" content="15.5" type="number"></sg-meta>

          <sg-item>
            <sg-meta name="bar" content="bars"></sg-meta>
          </sg-item>
          <div></div>
        </sg-group>
      `);

      group = getTestRoot().querySelector('sg-group');
    });

    it('are used to set the group meta', () => {
      expect(group.meta).to.eql({
        string: 'foo',
        bool: true,
        number: 15.5,
      });
    });
  });

  describe('when no template is present', () => {
    beforeEach(() => {
      setPageContent(`
        <sg-group>
          <div>text</div>
        </sg-group`);

      group = getTestRoot().querySelector('sg-group');
    });

    it('just leaves its content untouched', () => {
      expect(group.innerHTML.trim()).to.eql('<div>text</div>');
    });
  });

  describe('when a template is defined', () => {
    describe('and uses the default "sg-group" id', () => {
      describe('and provides a default slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="sg-group">
              <div class="container">
                <slot></slot>
              </div>
            </template>

            <sg-group>
              <div>text</div>
            </sg-group`);

          group = getTestRoot().querySelector('sg-group');
        });

        it('creates a shadow root and uses the provided template', () => {
          expect(group.innerHTML.trim()).to.eql('<div>text</div>');

          expect(group.shadowRoot).not.to.be(null);

          expect(group.shadowRoot.querySelector('.container')).not.to.be(null);
        });
      });
      describe('and provides no slot', () => {
        beforeEach(() => {
          setPageContent(`
              <template id="sg-group">
                <div class="container"></div>
              </template>

              <sg-group>
                <div>text</div>
              </sg-group`);

          group = getTestRoot().querySelector('sg-group');
        });

        it('appends a notice message regarding the template in the ', () => {
          expect(group.innerHTML.trim()).to.eql('<div>text</div>');
          expect(group.shadowRoot.innerHTML)
          .to.eql(`
          <slot></slot>
          <span style="color: orange;">A #sg-group template was found but it didn\'t have a slot.</span>`);
        });
      });
    });

    describe('and uses another id', () => {
      describe('and provides a default slot', () => {
        beforeEach(() => {
          setPageContent(`
            <template id="other-group">
              <div class="container">
                <slot></slot>
              </div>
            </template>

            <sg-group template="other-group">
              <div>text</div>
            </sg-group`);

          group = getTestRoot().querySelector('sg-group');
        });

        it('creates a shadow root and uses the provided template', () => {
          expect(group.innerHTML.trim()).to.eql('<div>text</div>');

          expect(group.shadowRoot).not.to.be(null);

          expect(group.shadowRoot.querySelector('.container')).not.to.be(null);
        });
      });
      describe('and provides no slot', () => {
        beforeEach(() => {
          setPageContent(`
              <template id="other-group">
                <div class="container"></div>
              </template>

              <sg-group template="other-group">
                <div>text</div>
              </sg-group`);

          group = getTestRoot().querySelector('sg-group');
        });

        it('appends a notice message regarding the template in the ', () => {
          expect(group.innerHTML.trim()).to.eql('<div>text</div>');
          expect(group.shadowRoot.innerHTML)
          .to.eql(`
          <slot></slot>
          <span style="color: orange;">A #other-group template was found but it didn\'t have a slot.</span>`);
        });
      });

      describe('and the template does not exist', () => {
        beforeEach(() => {
          setPageContent(`
              <sg-group template="other-group">
                <div>text</div>
              </sg-group`);

          group = getTestRoot().querySelector('sg-group');
        });

        it('appends a notice message regarding the template in the ', () => {
          expect(group.innerHTML.trim()).to.eql('<div>text</div>');
          expect(group.shadowRoot.innerHTML)
          .to.eql(`
        <slot></slot>
        <span style="color: orange;">The specified template #other-group was not found.</span>`);
        });
      });
    });
  });
});
