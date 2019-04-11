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
});
