import test from 'node:test';
import assert from 'node:assert/strict';

import { canonicalJson, normalizeText, semanticText } from '../scripts/audit-rules-sources.mjs';

test('normalizes source text and emits canonical JSON', () => {
  assert.equal(normalizeText('  Cafe\u0301\u00a0\u2019 test  '), "Caf\u00e9 ' test");
  assert.equal(canonicalJson({ z: 1, a: { y: 2, x: 'ok' } }), '{"a":{"x":"ok","y":2},"z":1}\n');
});

test('treats source-only typography as non-substantive', () => {
  assert.equal(semanticText('END OF THE BATTLE'), semanticText('END OF BATTLE'));
});
