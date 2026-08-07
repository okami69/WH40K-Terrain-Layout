import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('provides the complete terrain selector UI', () => {
  assert.ok(existsSync('app/index.html'), 'Missing app/index.html');

  const html = readFileSync('app/index.html', 'utf8');
  assert.match(html, /<select[^>]+id="left"/);
  assert.match(html, /<select[^>]+id="right"/);
  assert.match(html, /<label for="left">Left Force Disposition<\/label>/);
  assert.match(html, /<label for="right">Right Force Disposition<\/label>/);
  assert.match(html, /<output[^>]+id="left-mission"[^>]+for="left right"[^>]+aria-live="polite"/);
  assert.match(html, /<output[^>]+id="right-mission"[^>]+for="left right"[^>]+aria-live="polite"/);
  const layoutButtons = [...html.matchAll(/<button[^>]+data-layout="[ABC]"[^>]*>/g)];
  assert.equal(layoutButtons.length, 3);
  assert.deepEqual(
    layoutButtons.map(([button]) => button.match(/aria-pressed="(true|false)"/)?.[1]),
    ['true', 'false', 'false'],
  );
  assert.match(html, /<div class="layouts" role="group" aria-label="Terrain layout">/);
  assert.doesNotMatch(html, /<nav class="layouts"/);
  assert.match(html, /<button[^>]+class="map-button"/);
  assert.match(html, /<img[^>]+id="map"[^>]+aria-describedby="map-description"/);
  assert.match(html, /<img[^>]+id="large-map"[^>]+aria-describedby="map-description"/);
  assert.match(html, /id="map-description"[^>]*>\s*Official terrain placement diagram\. Terrain footprints, objective positions and exact edge measurements are printed in the image\./);
  assert.match(html, /role="alert"/);
  assert.match(html, /<dialog[^>]+id="viewer"/);
  assert.match(html, /<script[^>]+type="module"[^>]+src="app\.js"/);
  assert.ok(existsSync('app/styles.css'), 'Missing app/styles.css');
  assert.ok(existsSync('app/app.js'), 'Missing app/app.js');

  const css = readFileSync('app/styles.css', 'utf8');
  assert.match(css, /\.layouts button\[aria-pressed="true"\]\s*\{[^}]*outline:\s*3px/);
  assert.match(css, /@media \(max-width: 520px\)[\s\S]*?\.selector-card label[\s\S]*?font-size:\s*0\.75rem/);
  assert.match(css, /@media \(max-width: 520px\)[\s\S]*?\.selector-card select,[\s\S]*?\.selector-card output[\s\S]*?font-size:\s*0\.875rem/);
});
