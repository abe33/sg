'use strict';

import KeyStroke from './keystroke';
import {DisposableEvent} from 'widjet-disposables';

export default class KeyMap {
  constructor(target, map) {
    this.target = target;

    const keystrokes = Object.keys(map).map(k => [KeyStroke.parse(k), map[k]]);

    if (keystrokes.length) {
      this.subscription = new DisposableEvent(target, 'keydown', (e) => {
        const [match] = keystrokes.filter(([ks]) => ks.matches(e));

        if (match) {
          e.preventDefault();
          match[1](e);
        }
      });
    }
  }

  dispose() {
    this.subscription && this.subscription.dispose();
  }
}
