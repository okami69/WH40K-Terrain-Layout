import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('provides the compact bilingual terrain sheet UI', () => {
  assert.ok(existsSync('app/index.html'), 'Missing app/index.html');
  assert.ok(existsSync('app/styles.css'), 'Missing app/styles.css');
  assert.ok(existsSync('app/app.js'), 'Missing app/app.js');
  assert.ok(existsSync('app/assets/key/terrain-rules.webp'), 'Missing app/assets/key/terrain-rules.webp');

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
  assert.match(html, /<button[^>]+id="terrain-rules-button"[^>]+class="title-button"/);
  assert.match(html, /<button[^>]+id="layout-key-button"[^>]+aria-label=/);
  assert.match(html, /<svg[^>]+aria-hidden="true"/);
  assert.match(html, /<dialog[^>]+id="terrain-rules-viewer"/);
  assert.match(html, /<img[^>]+id="terrain-rules-image"[^>]+src="assets\/key\/terrain-rules\.webp"/);
  assert.match(html, /<dialog[^>]+id="layout-key-viewer"/);
  assert.match(html, /<dialog[^>]+id="viewer"/);
  assert.match(html, /<script[^>]+type="module"[^>]+src="app\.js"/);

  const css = readFileSync('app/styles.css', 'utf8');
  assert.match(css, /\.title-button\s*\{[\s\S]*font-size:\s*1\.55rem/);
  assert.match(css, /#terrain-rules-viewer\s*\{[\s\S]*overflow:\s*hidden/);
  assert.match(css, /#terrain-rules-image\s*\{[\s\S]*height:\s*auto/);
  assert.match(css, /#terrain-rules-image\s*\{[\s\S]*max-height:\s*calc\(100vh - 106px\)/);
  const dispositionRule = css.match(/\.disposition-select\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(dispositionRule, /\bappearance:\s*none;/);
  assert.match(dispositionRule, /\bpadding:\s*0 34px;/);
  assert.match(dispositionRule, /\btext-align:\s*center;/);
  assert.match(dispositionRule, /\bbackground-position:\s*calc\(100% - 18px\) 50%, calc\(100% - 12px\) 50%;/);
  const popoverRule = css.match(/\.mission-popover\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(popoverRule, /\binset:\s*auto;/);
  assert.match(popoverRule, /\bmargin:\s*0;/);
  assert.doesNotMatch(popoverRule, /\bmax-width:/);
  assert.match(popoverRule, /\boverflow-wrap:\s*anywhere;/);
  assert.match(css, /#layout-key-viewer\s*\{[\s\S]*overflow:\s*hidden/);
  assert.match(css, /#layout-key-image\s*\{[\s\S]*height:\s*auto/);
  assert.match(css, /#layout-key-image\s*\{[\s\S]*max-height:\s*calc\(100vh - 106px\)/);
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

  const js = readFileSync('app/app.js', 'utf8');
  assert.match(js, /const terrainRulesButton = document\.querySelector\('#terrain-rules-button'\)/);
  assert.match(js, /const terrainRulesViewer = document\.querySelector\('#terrain-rules-viewer'\)/);
  assert.match(js, /terrainRulesImage\.alt = copy\.mapDescription/);
  assert.match(js, /terrainRulesButton\.addEventListener\('click', \(\) => terrainRulesViewer\.showModal\(\)\)/);
  assert.match(js, /setDialogBackdropClose\(terrainRulesViewer\)/);
  assert.match(js, /popover\.style\.width\s*=\s*`\$\{rect\.width\}px`/);
  assert.match(js, /popover\.style\.left\s*=\s*`\$\{rect\.left\}px`/);
  assert.match(js, /popover\.style\.top\s*=\s*`\$\{rect\.bottom \+ 8\}px`/);
});

test('publishes six current application screenshots in the README', () => {
  const screenshots = [
    'disruption-vs-reconnaissance-layout-a.png',
    'terrain-layouts-rules.png',
    'layouts-key.png',
    'take-and-hold-vs-purge-the-foe-layout-b.png',
    'priority-assets-vs-disruption-layout-c.png',
    'reconnaissance-vs-priority-assets-layout-a.png',
  ];
  const readme = readFileSync('README.md', 'utf8');

  for (const screenshot of screenshots) {
    assert.ok(existsSync(`docs/screenshots/${screenshot}`), `Missing ${screenshot}`);
    assert.match(readme, new RegExp(`docs/screenshots/${screenshot.replaceAll('.', '\\.')}`));
  }
});
