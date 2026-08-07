import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('provides the complete terrain selector UI', () => {
  assert.ok(existsSync('app/index.html'), 'Missing app/index.html');

  const html = readFileSync('app/index.html', 'utf8');
  assert.match(html, /<select[^>]+id="left"/);
  assert.match(html, /<select[^>]+id="right"/);
  assert.match(html, /id="left-mission"/);
  assert.match(html, /id="right-mission"/);
  assert.equal([...html.matchAll(/<button[^>]+data-layout="[ABC]"/g)].length, 3);
  assert.match(html, /<button[^>]+class="map-button"/);
  assert.match(html, /<img[^>]+id="map"/);
  assert.match(html, /role="alert"/);
  assert.match(html, /<dialog[^>]+id="viewer"/);
  assert.match(html, /<script[^>]+type="module"[^>]+src="app\.js"/);
  assert.ok(existsSync('app/styles.css'), 'Missing app/styles.css');
  assert.ok(existsSync('app/app.js'), 'Missing app/app.js');
});
