'use strict';

export default function fragmentFromString(strHTML) {
  var temp = document.createElement('template');
  temp.innerHTML = strHTML;
  return temp.content;
}
