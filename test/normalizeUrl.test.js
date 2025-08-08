const assert = require('assert');
const { normalizeUrl } = require('../url-utils');

assert.strictEqual(
  normalizeUrl('https://Example.com/foo/?bar=1#hash'),
  'https://example.com/foo'
);
assert.strictEqual(
  normalizeUrl('https://example.com/'),
  'https://example.com'
);
assert.strictEqual(
  normalizeUrl('invalid-url'),
  'invalid-url'
);

console.log('All tests passed');
