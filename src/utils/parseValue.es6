'use strict';

export default function parseValue(value, type) {
  switch(type) {
    case 'boolean':
      return value === 'true';
    case 'number':
      return parseFloat(value);
    default:
      return value;
  }
}
