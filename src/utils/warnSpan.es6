'use  strict';

export default function warnSpan(message) {
  const warning = document.createElement('span');
  warning.style.color = 'orange';
  warning.textContent = message;

  return warning;
}
