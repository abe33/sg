'use strict';

import expect from 'expect.js';
import {keyboardEvent} from 'widjet-test-utils/events';
import KeyStroke from '../../src/utils/keystroke';
import '../helpers';

describe('KeyStroke', () => {
  describe('.parse()', () => {
    it('returns instances for valid expressions', () => {
      expect(KeyStroke.parse('ctrl+v')).to.matchKey('v', {ctrl: true});
      expect(KeyStroke.parse('ALT+V')).to.matchKey('v', {alt: true});
      expect(KeyStroke.parse('ctrl+-')).to.matchKey('-', {ctrl: true});
      expect(KeyStroke.parse('alt++')).to.matchKey('+', {alt: true});
      expect(KeyStroke.parse('ctrl+shift+alt+b')).to.matchKey('b', {
        alt: true,
        ctrl: true,
        shift: true,
      });
    });
  });

  describe('#match()', () => {
    it('returns true when the keystroke matches the specified key event', () => {
      const ks = KeyStroke.parse('ctrl+v');

      expect(ks.matches(keyboardEvent('keydown', {
        key: 'v',
        ctrlKey: true,
      }))).to.be.ok();
      expect(ks.matches(keyboardEvent('keydown', {
        key: 'v',
        altKey: true,
      }))).not.to.be.ok();
    });

    it('returns true when the keystroke matches the specified key code event', () => {
      const ks = KeyStroke.parse('ctrl+v');

      expect(ks.matches(keyboardEvent('keydown', {
        keyCode: 'v'.charCodeAt(0),
        ctrlKey: true,
      }))).to.be.ok();
      expect(ks.matches(keyboardEvent('keydown', {
        keyCode: 'v'.charCodeAt(0),
        altKey: true,
      }))).not.to.be.ok();
    });
  });
});
