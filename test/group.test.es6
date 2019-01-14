'use strict';

import expect from 'expect.js';
import {asArray} from 'widjet-utils';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';

import '../src/group';

describe('GroupElement', () => {

  [
    'template',
    'samples-slot',
    'sources-slot',
    'texts-slot',
  ].forEach(attr => {
    let group;

    beforeEach(() => {
      setPageContent(`
        <sg-group ${attr}="value">
          <div></div>
          <div></div>
          <div></div>
        </sg-group>
      `);

      group = getTestRoot().querySelector('sg-group');
    });
    describe(`${attr} attribute`, () => {
      it('is passed to all its children', () => {
        expect(asArray(group.querySelectorAll('div')).every(n => n.getAttribute(attr) === 'value')).to.be.ok()
      });
    })
  });
});
