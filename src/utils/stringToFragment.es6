'use strict';

export default function stringToFragment(strHTML) {
  var temp = document.createElement('template');
  temp.innerHTML = strHTML;
  return temp.content;
}
