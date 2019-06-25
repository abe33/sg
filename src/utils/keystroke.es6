'use strict';

export default class KeyStroke {
  static parse(str, button) {
    const strokes = str.toLowerCase().split(/[-+](?!$)/);
    const key = strokes.pop();
    const modifiers = {
      ctrl: false,
      shift: false,
      alt: false,
      meta: false,
    };

    strokes.forEach((stroke) => modifiers[stroke.toLowerCase()] = true);

    return new KeyStroke(key, modifiers);
  }

  constructor(key, modifiers = {}) {
    this.key = key;
    this.modifiers = modifiers;
  }

  matches(event) {
    const key = event.char || event.key || String.fromCharCode(event.keyCode);

    return key === this.key
        && event.ctrlKey === this.modifiers.ctrl
        && event.shiftKey === this.modifiers.shift
        && event.altKey === this.modifiers.alt
        && event.metaKey === this.modifiers.meta;
  }

  toString() {
    return Object.keys(this.modifiers)
    .filter(k => this.modifiers[k])
    .concat(this.key)
    .join('+');
  }
}
