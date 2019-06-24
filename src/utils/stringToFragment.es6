'use strict';

export default function stringToFragment(strHTML) {
  return document.createRange().createContextualFragment(strHTML);
}
