'use strict';

import expect from 'expect.js';
import {asArray} from 'widjet-utils';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

import '../src/group';

describe('GroupElement', () => {
  let group;

  [
    'template',
    'samples-slot',
    'sources-slot',
    'previews-slot',
    'texts-slot',
  ].forEach(attr => {

    describe(`${attr} attribute`, () => {
      beforeEach(() => {
        setPageContent(`
          <sg-group ${attr}="value">
            <sg-item></sg-item>
            <sg-item></sg-item>
            <sg-item></sg-item>
            <div>
              <sg-item></sg-item>
            </div>
          </sg-group>
        `);

        group = getTestRoot().querySelector('sg-group');
      });

      it('forwards the attribute to all its matching children', () => {
        expect(asArray(group.querySelectorAll('sg-item')).every(n => n.getAttribute(attr) === 'value')).to.be.ok();
        expect(group.querySelector('div').getAttribute(attr)).to.be(null);
      });

      describe('adding an item in the group', () => {
        it('forwards the attribute to the newly added child', () => {
          const item = document.createElement('sg-item');
          group.appendChild(item);
          expect(item.getAttribute(attr)).to.eql('value');
        });

        it('forwards the attribute to a newly added descendant', () => {
          const item = document.createElement('sg-item');
          const parent = document.createElement('div');

          parent.appendChild(item);
          group.appendChild(parent);

          expect(item.getAttribute(attr)).to.eql('value');
        });
      });

      describe('inserting an item in the group', () => {
        it('forwards the attribute to the newly added element', () => {
          const item = document.createElement('sg-item');
          group.insertBefore(item, group.firstChild);
          expect(item.getAttribute(attr)).to.eql('value');
        });

        it('forwards the attribute to a newly inserted descendant', () => {
          const item = document.createElement('sg-item');
          const parent = document.createElement('div');

          parent.insertBefore(item, parent.firstChild);
          group.insertBefore(parent, group.firstChild);

          expect(item.getAttribute(attr)).to.eql('value');
        });
      });

      describe('replacing the element inner HTML', () => {
        it('forwards the attribute to the newly added elements', () => {
          group.innerHTML = `
            <sg-item></sg-item>
            <sg-item></sg-item>
            <sg-item></sg-item>
            <div>
              <sg-item></sg-item>
            </div>`;

          expect(asArray(group.querySelectorAll('sg-item')).every(n => n.getAttribute(attr) === 'value')).to.be.ok();
          expect(group.querySelector('div').getAttribute(attr)).to.be(null);
        });
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
