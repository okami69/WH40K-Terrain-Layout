import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('provides the compact bilingual terrain sheet UI', () => {
  assert.ok(existsSync('app/index.html'), 'Missing app/index.html');
  assert.ok(existsSync('app/styles.css'), 'Missing app/styles.css');
  assert.ok(existsSync('app/app.js'), 'Missing app/app.js');

  const html = readFileSync('app/index.html', 'utf8');
  assert.match(html, /<main[^>]+id="sheet"[^>]+class="app-sheet"/);
  assert.match(html, /width="768" height="1080"/);
  assert.match(html, /data-lang="ru"[^>]*>RU<\/button>/);
  assert.match(html, /data-lang="en"[^>]*>ENG<\/button>/);
  assert.match(html, /<img[^>]+id="left-icon"[^>]+class="disposition-icon"/);
  assert.match(html, /<img[^>]+id="right-icon"[^>]+class="disposition-icon"/);
  assert.match(html, /<select[^>]+id="left"[^>]+class="disposition-select"/);
  assert.match(html, /<select[^>]+id="right"[^>]+class="disposition-select"/);
  assert.match(html, /<button[^>]+id="left-mission"[^>]+class="mission-summary-trigger"/);
  assert.match(html, /<button[^>]+id="right-mission"[^>]+class="mission-summary-trigger"/);
  assert.match(html, /id="mission-popover"/);
  assert.match(html, /<div class="layouts" role="group" aria-label="Terrain layout">/);
  assert.match(html, /<button[^>]+id="layout-key-button"[^>]+aria-label=/);
  assert.match(html, /<svg[^>]+aria-hidden="true"/);
  assert.match(html, /<dialog[^>]+id="layout-key-viewer"/);
  assert.match(html, /<dialog[^>]+id="viewer"/);
  assert.match(html, /<script[^>]+type="module"[^>]+src="app\.js"/);

  const css = readFileSync('app/styles.css', 'utf8');
  assert.match(css, /body\s*\{[\s\S]*overflow:\s*hidden/);
  assert.match(css, /\.stage\s*\{[\s\S]*width:\s*calc\(768px \* var\(--sheet-scale\)\)/);
  assert.match(css, /\.stage\s*\{[\s\S]*height:\s*calc\(1080px \* var\(--sheet-scale\)\)/);
  assert.match(css, /\.app-sheet\s*\{[\s\S]*width:\s*768px/);
  assert.match(css, /\.app-sheet\s*\{[\s\S]*height:\s*1080px/);
  assert.match(css, /\.app-sheet\s*\{[\s\S]*transform:\s*scale\(var\(--sheet-scale\)\)/);
  assert.match(css, /object-fit:\s*contain/);
  assert.match(css, /:focus-visible\s*\{[\s\S]*outline:\s*3px solid/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
