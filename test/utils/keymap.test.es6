'use strict';

import expect from 'expect.js';
import sinon from 'sinon';
import {keyboardEvent} from 'widjet-test-utils/events';
import {setPageContent, getTestRoot} from 'widjet-test-utils/dom';
import KeyMap from '../../src/utils/keymap';

describe('KeyMap', () => {
  let map, target, stub;

  describe('created with a keystroke map', () => {
    beforeEach(() => {
      setPageContent('<div></div>');

      target = getTestRoot().querySelector('div');
      stub = sinon.stub();

      map = new KeyMap(target, {
        'ctrl-v': stub,
      });
    });

    afterEach(() => {
      map.dispose();
    });

    describe('when a keyboard event is triggered on the target', () => {
      beforeEach(() => {
        target.dispatchEvent(keyboardEvent('keydown', {key: 'v', ctrlKey: true}));
      });

      it('invokes the registered function for that key stroke', () => {
        expect(stub.called).to.be.ok();
      });
    });
  });
});
