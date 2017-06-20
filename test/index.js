const test = require('tape');
const crook = require('../');

// Add favicon
const linkTag = document.createElement('link');

linkTag.href = 'data:;base64,iVBORw0KGgo=';
linkTag.rel = 'icon';

document.head.appendChild(linkTag);

test('will return', (t) => {
  t.equal(typeof crook, 'function', 'returns funtion on init');
  t.end();
});

