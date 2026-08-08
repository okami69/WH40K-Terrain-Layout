import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

test('provides the compact bilingual terrain sheet UI', () => {
  assert.ok(existsSync('app/index.html'), 'Missing app/index.html');
  assert.ok(existsSync('app/styles.css'), 'Missing app/styles.css');
  assert.ok(existsSync('app/app.js'), 'Missing app/app.js');
  assert.ok(existsSync('app/assets/key/terrain-rules.webp'), 'Missing app/assets/key/terrain-rules.webp');

  const html = readFileSync('app/index.html', 'utf8');
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/);
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
  assert.match(html, /<button[^>]+id="free-layout-button"[^>]+aria-pressed="false"[^>]*>\+<\/button>/);
  assert.match(html, /<button[^>]+id="terrain-rules-button"[^>]+class="title-button"/);
  assert.match(html, /<button[^>]+id="layout-key-button"[^>]+aria-label=/);
  assert.match(html, /<svg[^>]+aria-hidden="true"/);
  assert.match(html, /<dialog[^>]+id="terrain-rules-viewer"/);
  assert.match(html, /<img[^>]+id="terrain-rules-image"[^>]+src="assets\/key\/terrain-rules\.webp"/);
  assert.match(html, /<dialog[^>]+id="layout-key-viewer"/);
  assert.match(html, /<dialog[^>]+id="viewer"/);
  assert.doesNotMatch(html, /id="layout-source"/);
  assert.match(html, /<dialog[^>]+id="layout-gallery"[^>]+aria-labelledby="layout-gallery-title"/);
  assert.match(html, /<button[^>]+id="layout-gallery-close"/);
  assert.match(html, /<div[^>]+id="layout-gallery-scroll"[^>]+class="layout-gallery-scroll"/);
  assert.match(html, /<script[^>]+type="module"[^>]+src="app\.js"/);

  const css = readFileSync('app/styles.css', 'utf8');
  assert.doesNotMatch(css, /\.layout-source\s*\{/);
  assert.match(css, /min-height:\s*100dvh/);
  assert.match(css, /padding-top:\s*env\(safe-area-inset-top\)/);
  assert.match(css, /padding-right:\s*env\(safe-area-inset-right\)/);
  assert.match(css, /padding-bottom:\s*env\(safe-area-inset-bottom\)/);
  assert.match(css, /padding-left:\s*env\(safe-area-inset-left\)/);
  assert.doesNotMatch(css, /\.app-sheet :is\(button, select\)\s*\{[\s\S]*?44px \/ var\(--sheet-scale\)/);
  assert.match(css, /\.title-button\s*\{[\s\S]*font-size:\s*1\.55rem/);
  assert.match(css, /#terrain-rules-viewer\s*\{[\s\S]*overflow:\s*hidden/);
  assert.match(css, /#terrain-rules-image\s*\{[\s\S]*height:\s*auto/);
  assert.match(css, /#terrain-rules-image\s*\{[\s\S]*max-height:\s*calc\(100vh - 106px\)/);
  const dispositionRule = css.match(/\.disposition-select\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(dispositionRule, /\bappearance:\s*none;/);
  assert.match(dispositionRule, /\bpadding:\s*0 34px;/);
  assert.match(dispositionRule, /\btext-align:\s*center;/);
  assert.match(dispositionRule, /\btext-align-last:\s*center;/);
  assert.match(dispositionRule, /\bbackground-position:\s*calc\(100% - 18px\) 50%, calc\(100% - 12px\) 50%;/);
  const dispositionOptionRule = css.match(/\.disposition-select option\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(dispositionOptionRule, /\btext-align:\s*center;/);
  assert.match(dispositionOptionRule, /\bpadding-inline-end:\s*30px;/);
  const popoverRule = css.match(/\.mission-popover\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(popoverRule, /\binset:\s*auto;/);
  assert.match(popoverRule, /\bmargin:\s*0;/);
  assert.doesNotMatch(popoverRule, /\bmax-width:/);
  assert.match(popoverRule, /\boverflow-wrap:\s*anywhere;/);
  assert.match(css, /#layout-key-viewer\s*\{[\s\S]*overflow:\s*hidden/);
  assert.match(css, /#layout-key-image\s*\{[\s\S]*height:\s*auto/);
  assert.match(css, /#layout-key-image\s*\{[\s\S]*max-height:\s*calc\(100vh - 106px\)/);
  const dialogRule = css.match(/dialog\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(dialogRule, /\binset:\s*calc\(env\(safe-area-inset-top\) \+ 12px\) calc\(env\(safe-area-inset-right\) \+ 12px\) calc\(env\(safe-area-inset-bottom\) \+ 12px\) calc\(env\(safe-area-inset-left\) \+ 12px\);/);
  assert.match(dialogRule, /\bwidth:\s*min\(calc\(100% - env\(safe-area-inset-left\) - env\(safe-area-inset-right\) - 24px\), 1000px\);/);
  assert.match(dialogRule, /\bmax-height:\s*calc\(100dvh - env\(safe-area-inset-top\) - env\(safe-area-inset-bottom\) - 24px\);/);
  const largeMapRule = css.match(/#large-map\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(largeMapRule, /\bmax-height:\s*calc\(100dvh - env\(safe-area-inset-top\) - env\(safe-area-inset-bottom\) - 98px\);/);
  const terrainRulesImageRule = css.match(/#terrain-rules-image\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(terrainRulesImageRule, /\bmax-height:\s*calc\(100dvh - env\(safe-area-inset-top\) - env\(safe-area-inset-bottom\) - 106px\);/);
  const layoutKeyImageRule = css.match(/#layout-key-image\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(layoutKeyImageRule, /\bmax-height:\s*calc\(100dvh - env\(safe-area-inset-top\) - env\(safe-area-inset-bottom\) - 106px\);/);
  assert.match(css, /body\s*\{[\s\S]*overflow:\s*hidden/);
  assert.match(css, /:root\s*\{[\s\S]*?--sheet-width:\s*768px;/);
  assert.match(css, /:root\s*\{[\s\S]*?--sheet-height:\s*1080px;/);
  assert.match(css, /\.stage\s*\{[\s\S]*width:\s*calc\(var\(--sheet-width\) \* var\(--sheet-scale\)\)/);
  assert.match(css, /\.stage\s*\{[\s\S]*height:\s*calc\(var\(--sheet-height\) \* var\(--sheet-scale\)\)/);
  assert.match(css, /\.app-sheet\s*\{[\s\S]*width:\s*var\(--sheet-width\)/);
  assert.match(css, /\.app-sheet\s*\{[\s\S]*height:\s*var\(--sheet-height\)/);
  assert.match(css, /\.app-sheet\s*\{[\s\S]*transform:\s*scale\(var\(--sheet-scale\)\)/);
  assert.match(css, /object-fit:\s*contain/);
  assert.match(css, /:focus-visible\s*\{[\s\S]*outline:\s*3px solid/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  const galleryScrollRule = css.match(/\.layout-gallery-scroll\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(galleryScrollRule, /\boverflow-y:\s*auto;/);
  const galleryGridRule = css.match(/\.layout-gallery-grid\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(galleryGridRule, /\bgrid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/);
  assert.match(css, /@media \(max-width: 600px\)\s*\{[\s\S]*?\.layout-gallery-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr;/);
  const portraitRule = css.match(/@media \(orientation: portrait\) and \(max-width: 600px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(portraitRule, /:root\s*\{[\s\S]*?--sheet-height:\s*1280px;/);
  assert.match(portraitRule, /body\s*\{[\s\S]*?place-items:\s*start center;/);
  assert.match(portraitRule, /#map\s*\{[\s\S]*?height:\s*auto;/);
  assert.match(portraitRule, /\.app-sheet\s*\{[\s\S]*?padding:\s*8px 32px;/);
  assert.match(portraitRule, /\.masthead\s*\{[\s\S]*?margin-bottom:\s*8px;/);
  assert.match(portraitRule, /\.masthead h1\s*\{[\s\S]*?margin-bottom:\s*4px;/);
  assert.match(portraitRule, /\.masthead-tools\s*\{[\s\S]*?margin-bottom:\s*4px;/);
  assert.match(portraitRule, /\.layouts\s*\{[\s\S]*?margin:\s*8px 0 4px;/);
  assert.match(portraitRule, /\.map-panel h2\s*\{[\s\S]*?margin:\s*4px 0;/);

  const js = readFileSync('app/app.js', 'utf8');
  assert.doesNotMatch(js, /querySelector\('#layout-source'\)/);
  assert.doesNotMatch(js, /layoutSource\.(?:textContent|hidden)/);
  assert.match(js, /document\.documentElement\.clientWidth/);
  assert.match(js, /document\.documentElement\.clientHeight/);
  assert.match(js, /window\.visualViewport\?\.addEventListener\('resize', fitSheet\)/);
  assert.match(js, /sheetStyle\.width/);
  assert.match(js, /sheetStyle\.height/);
  assert.match(js, /const terrainRulesButton = document\.querySelector\('#terrain-rules-button'\)/);
  assert.match(js, /const terrainRulesViewer = document\.querySelector\('#terrain-rules-viewer'\)/);
  assert.match(js, /terrainRulesImage\.alt = copy\.mapDescription/);
  assert.match(js, /terrainRulesButton\.addEventListener\('click', \(\) => terrainRulesViewer\.showModal\(\)\)/);
  assert.match(js, /setDialogBackdropClose\(terrainRulesViewer\)/);
  assert.match(js, /popover\.style\.width\s*=\s*`\$\{rect\.width\}px`/);
  assert.match(js, /popover\.style\.left\s*=\s*`\$\{rect\.left\}px`/);
  assert.match(js, /popover\.style\.top\s*=\s*`\$\{rect\.bottom \+ 8\}px`/);
  assert.match(js, /layoutCatalog/);
  assert.match(js, /image\.loading\s*=\s*'lazy'/);
  assert.match(js, /image\.decoding\s*=\s*'async'/);
});

class FakeElement {
  constructor({ id = '', className = '', dataset = {}, hidden = false } = {}) {
    this.id = id;
    this.className = className;
    this.dataset = dataset;
    this.hidden = hidden;
    this.children = [];
    this.listeners = new Map();
    this.attributes = new Map();
    this.options = [];
    this.styleValues = new Map();
    this.style = {
      setProperty: (name, value) => this.styleValues.set(name, String(value)),
      getPropertyValue: name => this.styleValues.get(name) ?? '',
    };
  }

  add(option) {
    this.options.push(option);
  }

  addEventListener(type, listener) {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  append(...children) {
    this.children.push(...children);
  }

  close() {
    this.open = false;
  }

  dispatch(type) {
    for (const listener of this.listeners.get(type) ?? []) listener({ target: this, key: type === 'keydown' ? 'Escape' : undefined });
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  matches(selector) {
    return selector === ':popover-open' && Boolean(this.open);
  }

  querySelector(selector) {
    return descendants(this).find(item => selector === '[aria-pressed="true"]' && item.getAttribute('aria-pressed') === 'true') ?? null;
  }

  replaceChildren(...children) {
    this.children = children;
  }

  scrollIntoView() {
    this.scrolledIntoView = true;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  showModal() {
    this.open = true;
  }
}

function descendants(element) {
  return element.children.flatMap(child => [child, ...descendants(child)]);
}

function createAppHarness() {
  const elements = new Map();
  const add = (id, options) => {
    const element = new FakeElement({ id, ...options });
    elements.set(id, element);
    return element;
  };
  const left = add('left');
  const right = add('right');
  const layoutButtons = ['A', 'B', 'C'].map(layout => new FakeElement({ dataset: { layout } }));
  const languageButtons = ['ru', 'en'].map(lang => new FakeElement({ dataset: { lang } }));
  const cardKickers = [new FakeElement(), new FakeElement()];
  const missionLabels = [new FakeElement(), new FakeElement()];
  const layouts = new FakeElement({ className: 'layouts' });

  for (const id of [
    'sheet',
    'left-icon', 'right-icon', 'left-mission', 'right-mission', 'layout-title', 'terrain-rules-button', 'viewer-title',
    'terrain-rules-title', 'terrain-rules-image', 'layout-key-title', 'map', 'large-map', 'layout-key-button', 'layout-key-image',
    'error', 'free-layout-button', 'viewer', 'terrain-rules-viewer', 'layout-key-viewer', 'layout-gallery',
    'layout-gallery-title', 'layout-gallery-scroll', 'mission-popover', 'terrain-rules-close', 'layout-key-close', 'close',
    'layout-gallery-close', 'map-description',
  ]) add(id, { hidden: id === 'error' || id === 'mission-popover' });

  const mapButton = new FakeElement({ className: 'map-button' });
  const languageToggle = new FakeElement({ className: 'language-toggle' });
  const window = new FakeElement();
  window.visualViewport = new FakeElement();
  const document = {
    body: new FakeElement(),
    documentElement: new FakeElement(),
    addEventListener() {},
    createElement() { return new FakeElement(); },
    querySelector(selector) {
      if (selector === '#language-toggle') return languageToggle;
      if (selector.startsWith('#')) return elements.get(selector.slice(1)) ?? null;
      if (selector === '.map-button') return mapButton;
      if (selector === '.layouts') return layouts;
      return null;
    },
    querySelectorAll(selector) {
      if (selector === '[data-layout]') return layoutButtons;
      if (selector === '[data-lang]') return languageButtons;
      if (selector === '.card-kicker') return cardKickers;
      if (selector === '.mission-label') return missionLabels;
      return [];
    },
  };
  document.documentElement.clientWidth = 768;
  document.documentElement.clientHeight = 1080;
  return { document, elements, layoutButtons, window };
}

test('runs the free-layout gallery interactions without duplicate cards', async () => {
  const saved = Object.fromEntries(['document', 'window', 'navigator', 'localStorage', 'getComputedStyle', 'Option'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const { document, elements, layoutButtons, window } = createAppHarness();
  const sheet = elements.get('sheet');
  sheet.computedWidth = '768px';
  sheet.computedHeight = '1080px';
  Object.defineProperties(globalThis, {
    document: { configurable: true, value: document },
    window: { configurable: true, value: window },
    navigator: { configurable: true, value: { language: 'en-US' } },
    localStorage: { configurable: true, value: { getItem() { return null; }, setItem() {} } },
    getComputedStyle: { configurable: true, value: element => element === sheet
      ? { width: sheet.computedWidth, height: sheet.computedHeight }
      : { paddingLeft: '0', paddingRight: '0', paddingTop: '0', paddingBottom: '0' } },
    Option: { configurable: true, value: function Option(text, value) { this.textContent = text; this.value = value; } },
  });

  try {
    await import(`../app/app.js?gallery-test=${Date.now()}`);
    assert.equal(document.documentElement.style.getPropertyValue('--sheet-scale'), '1');
    sheet.computedHeight = '1280px';
    window.dispatch('resize');
    assert.equal(document.documentElement.style.getPropertyValue('--sheet-scale'), '0.84375');
    const gallery = elements.get('layout-gallery');
    const galleryScroll = elements.get('layout-gallery-scroll');
    const freeButton = elements.get('free-layout-button');
    const map = elements.get('map');
    const title = elements.get('layout-title');
    const viewerTitle = elements.get('viewer-title');
    const error = elements.get('error');
    const left = elements.get('left');
    const right = elements.get('right');
    const leftMission = elements.get('left-mission');
    const rightMission = elements.get('right-mission');
    const cards = () => descendants(galleryScroll).filter(item => item.className === 'layout-gallery-card');

    const initialInputs = [left.value, right.value, leftMission.dataset.mission, rightMission.dataset.mission];
    freeButton.dispatch('click');
    assert.equal(gallery.open, true);
    assert.equal(galleryScroll.children.length, 6);
    assert.equal(cards().length, 45);

    const freeCard = cards().find(card => card.dataset.layoutId.endsWith('-b'));
    const freeImage = freeCard.children[0];
    const freeLabel = freeCard.children[1];
    assert.match(freeImage.alt, /.+ \/ .+ · Layout [ABC]/);
    assert.match(freeLabel.textContent, /.+ \/ .+ · Layout [ABC]/);
    assert.equal(freeLabel.textContent, freeImage.alt);
    freeCard.dispatch('click');
    assert.equal(gallery.open, false);
    assert.equal(title.textContent, 'Free layout');
    assert.match(viewerTitle.textContent, /^Free layout: .+ · Layout [ABC]$/);
    assert.match(map.alt, /.+ \/ .+ · Layout [ABC]/);
    assert.deepEqual([left.value, right.value, leftMission.dataset.mission, rightMission.dataset.mission], initialInputs);

    left.value = 'purge-the-foe';
    left.dispatch('change');
    assert.equal(title.textContent, 'Free layout');
    assert.equal(map.src, freeImage.src);
    map.dispatch('error');
    assert.match(error.textContent, /Layout B image is missing/);

    layoutButtons[0].dispatch('click');
    assert.equal(title.textContent, 'Layout A');
    assert.equal(freeButton.getAttribute('aria-pressed'), 'false');
    assert.equal(layoutButtons[0].getAttribute('aria-pressed'), 'true');

    freeButton.dispatch('click');
    assert.equal(cards().length, 45);
    gallery.close();
    freeButton.dispatch('click');
    assert.equal(cards().length, 45);
    const brokenCard = cards()[0];
    brokenCard.children[0].dispatch('error');
    assert.equal(brokenCard.children[0].hidden, true);
    assert.equal(brokenCard.children[2].hidden, false);
    assert.equal(brokenCard.disabled, true);
    assert.equal(cards()[1].disabled, undefined);
  } finally {
    for (const [name, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
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
