'use strict';

import expect from 'expect.js';
import {merge} from 'widjet-utils';

const i = expect.stringify;
const KEY_MODIFIERS = {
  ctrl: false,
  shift: false,
  alt: false,
  meta: false,
};

expect.Assertion.prototype.matchKey = function match(key, modifiers) {
  const expectation =
    this.obj.key === key &&
    expect.eql(this.obj.modifiers, merge(KEY_MODIFIERS, modifiers));

  const label = Object.keys(modifiers)
    .filter(k => modifiers[k])
    .concat(key)
    .join('+');

  this.assert(
    expectation,
    function() {
      return `expected ${i(this.obj)} to match '${label}'`;
    },
    function() {
      return `expected ${i(this.obj)} to not match '${label}'`;
    });

  return this;
};
