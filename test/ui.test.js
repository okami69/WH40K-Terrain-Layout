import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { missionReferences, twists } from '../app/rules.js';

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
  assert.match(html, /<select[^>]+id="left"[^>]+hidden[^>]+tabindex="-1"[^>]+aria-hidden="true"/);
  assert.match(html, /<select[^>]+id="right"[^>]+hidden[^>]+tabindex="-1"[^>]+aria-hidden="true"/);
  assert.match(html, /<button[^>]+id="left-disposition-button"[^>]+class="disposition-button"[^>]+aria-controls="disposition-menu"/);
  assert.match(html, /<button[^>]+id="right-disposition-button"[^>]+class="disposition-button"[^>]+aria-controls="disposition-menu"/);
  assert.match(html, /<button[^>]+id="left-mission"[^>]+class="mission-summary-trigger"/);
  assert.match(html, /<button[^>]+id="right-mission"[^>]+class="mission-summary-trigger"/);
  assert.equal(html.match(/<b class="versus" aria-hidden="true">VS<\/b>/g)?.length, 1);
  assert.match(html, /<button[^>]+id="twist-button"[^>]+aria-controls="twist-dialog"/);
  assert.equal(html.match(/<dialog[^>]+id="twist-dialog"/g)?.length, 1);
  assert.match(html, /<dialog[^>]+id="twist-dialog"[^>]+aria-labelledby="twist-dialog-title"/);
  assert.match(html, /id="twist-dialog-title"/);
  assert.match(html, /id="twist-dialog-body"/);
  assert.match(html, /id="twist-dialog-footer"/);
  assert.match(html, /id="twist-dialog-close"/);
  assert.match(html, /<div[^>]+id="mission-popover"[^>]+role="region"[^>]+tabindex="0"[^>]+aria-labelledby="mission-popover-title"/);
  assert.match(html, /<div[^>]+id="disposition-menu"[^>]+popover="manual"/);
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
  const dispositionRule = css.match(/\.disposition-button\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(dispositionRule, /\btext-align:\s*center;/);
  const matchupRule = css.match(/\.matchup\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(matchupRule, /\bgrid-template-columns:\s*minmax\(0, 1fr\) 38px minmax\(0, 1fr\);/);
  assert.match(matchupRule, /\bgap:\s*12px;/);
  const twistButtonRule = css.match(/\.twist-button\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(twistButtonRule, /\bposition:\s*absolute;/);
  assert.match(twistButtonRule, /\bleft:\s*50%;/);
  assert.match(twistButtonRule, /\bbottom:\s*0;/);
  assert.match(twistButtonRule, /\bwidth:\s*44px;/);
  assert.match(twistButtonRule, /\bheight:\s*44px;/);
  assert.match(twistButtonRule, /\btransform:\s*translate\(-50%, 0\);/);
  assert.doesNotMatch(css, /\.disposition-select option/);
  const dispositionMenuRule = css.match(/\.disposition-menu\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(dispositionMenuRule, /\bposition:\s*fixed;/);
  assert.match(dispositionMenuRule, /\binset:\s*auto;/);
  assert.match(dispositionMenuRule, /\bz-index:\s*30;/);
  assert.match(dispositionMenuRule, /\bmargin:\s*0;/);
  assert.match(dispositionMenuRule, /\bpadding:\s*4px;/);
  assert.match(dispositionMenuRule, /\bborder:/);
  assert.match(dispositionMenuRule, /\bbackground:/);
  const dispositionMenuButtonRule = css.match(/\.disposition-menu button\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(dispositionMenuButtonRule, /\bwidth:\s*100%;/);
  assert.match(dispositionMenuButtonRule, /\btext-align:\s*center;/);
  assert.match(dispositionMenuButtonRule, /\bfont-weight:\s*900;/);
  assert.match(dispositionMenuButtonRule, /\btext-transform:\s*uppercase;/);
  const popoverRule = css.match(/\.mission-popover\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(popoverRule, /\bposition:\s*fixed;/);
  assert.match(popoverRule, /\binset:\s*auto;/);
  assert.match(popoverRule, /\bmargin:\s*0;/);
  assert.match(popoverRule, /\bwidth:\s*min\(500px, calc\(100vw - 24px\)\);/);
  assert.match(popoverRule, /\bmax-height:\s*65dvh;/);
  assert.match(popoverRule, /\boverflow-y:\s*auto;/);
  assert.match(popoverRule, /\boverflow-wrap:\s*anywhere;/);
  assert.match(css, /\.mission-reference-section\s*\{/);
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
  const twistDialogRule = css.match(/#twist-dialog\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(twistDialogRule, /\bdisplay:\s*grid;/);
  assert.match(twistDialogRule, /\bgrid-template-rows:\s*auto minmax\(0, 1fr\) auto;/);
  assert.match(twistDialogRule, /\bwidth:\s*min\(calc\(100% - env\(safe-area-inset-left\) - env\(safe-area-inset-right\) - 24px\), 620px\);/);
  assert.match(css, /#twist-dialog-body\s*\{[\s\S]*?overflow-y:\s*auto;/);
  assert.match(css, /#twist-dialog-footer\s*\{[\s\S]*?position:\s*sticky;/);
  assert.doesNotMatch(css, /#twist-dialog[^{]*\{[^}]*\b(?:transform|opacity|animation|view-transition-name)\s*:/);
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
  assert.match(js, /window\.visualViewport\?\.addEventListener\('resize', handleViewportResize\)/);
  assert.match(js, /sheetStyle\.width/);
  assert.match(js, /sheetStyle\.height/);
  assert.match(js, /const terrainRulesButton = document\.querySelector\('#terrain-rules-button'\)/);
  assert.match(js, /const terrainRulesViewer = document\.querySelector\('#terrain-rules-viewer'\)/);
  assert.match(js, /terrainRulesImage\.alt = copy\.mapDescription/);
  assert.match(js, /terrainRulesButton\.addEventListener\('click', \(\) => terrainRulesViewer\.showModal\(\)\)/);
  assert.match(js, /setDialogBackdropClose\(terrainRulesViewer\)/);
  assert.match(js, /missionReferences/);
  assert.match(js, /mission-reference-section/);
  assert.match(js, /--mission-popover-width/);
  assert.match(js, /trigger\.closest\('\.selector-card'\)\.getBoundingClientRect\(\)/);
  assert.match(js, /popover\.dataset\.anchor/);
  assert.match(js, /function positionSummary\(trigger = activeSummaryTrigger\)/);
  assert.match(js, /window\.addEventListener\('orientationchange', handleViewportResize\)/);
  assert.doesNotMatch(js, /popover\.textContent\s*=\s*missions\[mission\]\.summary\[language\]/);
  assert.doesNotMatch(js, /innerHTML/);
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
    for (const child of children) child.parentElement = this;
    this.children.push(...children);
  }

  close() {
    this.open = false;
    this.dispatch('close');
  }

  dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) ?? []) listener({ target: this, key: type === 'keydown' ? 'Escape' : undefined, ...event });
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  matches(selector) {
    return selector === ':popover-open' && Boolean(this.open);
  }

  closest(selector) {
    for (let element = this; element; element = element.parentElement) {
      if (selector === '.selector-card' && element.className === 'selector-card') return element;
    }
    return null;
  }

  querySelector(selector) {
    return descendants(this).find(item => selector === '[aria-pressed="true"]' && item.getAttribute('aria-pressed') === 'true') ?? null;
  }

  replaceChildren(...children) {
    for (const child of children) child.parentElement = this;
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
    this.showModalCalls = (this.showModalCalls ?? 0) + 1;
  }

  showPopover() {
    this.hidden = false;
    this.open = true;
  }

  hidePopover() {
    this.open = false;
    this.hidden = true;
  }

  dispatchEvent(event) {
    for (const listener of this.listeners.get(event.type) ?? []) listener(event);
    return true;
  }

  focus() {
    this.focused = true;
    if (this.ownerDocument) {
      const previous = this.ownerDocument.activeElement;
      if (previous === this) return;
      this.ownerDocument.activeElement = this;
      previous?.dispatch('focusout', { relatedTarget: this });
      this.dispatch('focus', { relatedTarget: previous });
    }
  }

  contains(target) {
    return target === this || descendants(this).includes(target);
  }

  getBoundingClientRect() {
    return this.rect ?? { left: 24, right: 324, top: 100, bottom: 148, width: 300, height: 48 };
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
    'left-icon', 'right-icon', 'left-disposition-button', 'right-disposition-button', 'left-mission', 'right-mission', 'layout-title', 'terrain-rules-button', 'viewer-title',
    'terrain-rules-title', 'terrain-rules-image', 'layout-key-title', 'map', 'large-map', 'layout-key-button', 'layout-key-image',
    'error', 'free-layout-button', 'viewer', 'terrain-rules-viewer', 'layout-key-viewer', 'layout-gallery',
    'layout-gallery-title', 'layout-gallery-scroll', 'mission-popover', 'disposition-menu', 'terrain-rules-close', 'layout-key-close', 'close',
    'layout-gallery-close', 'map-description', 'twist-button', 'twist-button-label', 'twist-dialog', 'twist-dialog-title',
    'twist-dialog-body', 'twist-dialog-footer', 'twist-dialog-close',
  ]) add(id, { hidden: ['error', 'mission-popover', 'disposition-menu'].includes(id) });

  const leftCard = new FakeElement({ className: 'selector-card' });
  const rightCard = new FakeElement({ className: 'selector-card' });
  leftCard.rect = { left: 24, right: 360, top: 40, bottom: 180, width: 336, height: 140 };
  rightCard.rect = { left: 408, right: 744, top: 40, bottom: 180, width: 336, height: 140 };
  leftCard.append(elements.get('left-mission'));
  rightCard.append(elements.get('right-mission'));

  const mapButton = new FakeElement({ className: 'map-button' });
  const languageToggle = new FakeElement({ className: 'language-toggle' });
  const window = new FakeElement();
  window.innerWidth = 768;
  window.innerHeight = 1080;
  window.visualViewport = new FakeElement();
  const documentListeners = new Map();
  const document = {
    body: new FakeElement(),
    documentElement: new FakeElement(),
    addEventListener(type, listener) {
      documentListeners.set(type, [...(documentListeners.get(type) ?? []), listener]);
    },
    dispatch(type, event = {}) {
      for (const listener of documentListeners.get(type) ?? []) listener({ type, ...event });
    },
    createElement() {
      const element = new FakeElement();
      element.ownerDocument = document;
      return element;
    },
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
  for (const element of elements.values()) element.ownerDocument = document;
  return { document, elements, layoutButtons, window };
}

function byClass(root, className) {
  return descendants(root).filter(item => item.className === className);
}

function byAction(root, action) {
  return descendants(root).find(item => item.dataset.action === action);
}

function textOf(root) {
  return [root, ...descendants(root)].map(item => item.textContent ?? '').join(' ');
}

test('keeps optional twists stable until No Twist is explicitly selected', async () => {
  const saved = Object.fromEntries(['document', 'window', 'navigator', 'localStorage', 'getComputedStyle', 'Option'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const originalRandom = Math.random;
  const originalEffects = twists.map(twist => ({ ...twist.effects }));
  const harness = createAppHarness();
  const { document, elements, layoutButtons } = harness;
  installAppGlobals(harness);
  twists.at(-1).effects.en = [];

  try {
    await import(`../app/app.js?twist-test=${Date.now()}`);
    const button = elements.get('twist-button');
    const dialog = elements.get('twist-dialog');
    const body = elements.get('twist-dialog-body');
    const footer = elements.get('twist-dialog-footer');
    const close = elements.get('twist-dialog-close');
    const chooserRows = () => byClass(body, 'twist-row');

    assert.equal(button.title, 'No Twist');
    assert.equal(elements.get('twist-button-label').textContent, 'No Twist');
    assert.equal(button.getAttribute('aria-pressed'), 'false');
    assert.match(button.getAttribute('aria-label'), /optional/i);

    button.focus();
    button.dispatch('click');
    assert.equal(dialog.open, true);
    assert.equal(dialog.showModalCalls, 1);
    assert.equal(chooserRows().length, 6);
    assert.deepEqual(chooserRows().map(row => row.dataset.twist), twists.map(twist => twist.id));
    assert.match(body.children[0].textContent, /optional/i);
    assert.equal(chooserRows().at(-1).children[0].disabled, true);
    assert.equal(chooserRows().slice(0, -1).some(row => row.children[0].disabled), false);

    chooserRows()[0].children[0].dispatch('click');
    const firstHeader = chooserRows()[0].children[0];
    const firstPanel = chooserRows()[0].children[1];
    assert.equal(firstHeader.id, 'twist-header-martial-pride');
    assert.equal(firstHeader.getAttribute('aria-controls'), 'twist-panel-martial-pride');
    assert.equal(firstPanel.id, 'twist-panel-martial-pride');
    assert.equal(firstPanel.getAttribute('role'), 'region');
    assert.equal(firstPanel.getAttribute('aria-labelledby'), firstHeader.id);
    assert.equal(document.activeElement, firstHeader);
    assert.equal(byClass(body, 'twist-effects').length, 1);
    assert.notEqual(byAction(body, 'select').disabled, true);
    byAction(body, 'select').dispatch('click');
    assert.equal(dialog.open, true);
    assert.equal(dialog.showModalCalls, 1);
    assert.equal(button.title, twists[0].name.en);
    assert.equal(button.getAttribute('aria-pressed'), 'true');
    assert.match(textOf(body), new RegExp(twists[0].name.en));
    assert.equal(document.activeElement, byClass(body, 'twist-detail-title')[0]);

    byAction(footer, 'change').dispatch('click');
    assert.equal(chooserRows().length, 6);
    assert.equal(document.activeElement, chooserRows()[0].children[0]);
    chooserRows()[1].children[0].dispatch('click');
    assert.equal(document.activeElement, chooserRows()[1].children[0]);
    assert.equal(byClass(body, 'twist-row-panel').length, 1);
    byAction(body, 'select').dispatch('click');
    assert.equal(dialog.showModalCalls, 1);
    assert.equal(button.title, twists[1].name.en);
    assert.match(textOf(body), new RegExp(twists[1].name.en));
    assert.equal(document.activeElement, byClass(body, 'twist-detail-title')[0]);

    close.dispatch('click');
    assert.equal(dialog.open, false);
    assert.equal(document.activeElement, button);
    button.dispatch('click');
    assert.equal(dialog.showModalCalls, 2);
    assert.match(textOf(body), new RegExp(twists[1].name.en));

    byAction(footer, 'change').dispatch('click');
    assert.equal(document.activeElement, chooserRows()[1].children[0]);
    Math.random = () => 0.999999;
    byAction(footer, 'random').dispatch('click');
    assert.equal(dialog.open, true);
    assert.equal(dialog.showModalCalls, 2);
    assert.equal(button.title, twists[4].name.en);
    assert.equal(document.activeElement, byClass(body, 'twist-detail-title')[0]);
    button.dispatch('click');
    button.dispatch('click');
    assert.equal(button.title, twists[4].name.en);
    assert.equal(dialog.showModalCalls, 2);

    byAction(footer, 'change').dispatch('click');
    byAction(footer, 'none').dispatch('click');
    assert.equal(dialog.open, true);
    assert.equal(button.title, 'No Twist');
    assert.equal(button.getAttribute('aria-pressed'), 'false');
    assert.match(byClass(body, 'twist-confirmation')[0].textContent, /no twist selected/i);
    assert.equal(document.activeElement, byClass(body, 'twist-confirmation')[0]);

    for (const control of [
      elements.get('left-disposition-button'), elements.get('right-disposition-button'),
      elements.get('left-mission'), elements.get('right-mission'), elements.get('free-layout-button'),
      elements.get('layout-key-button'), elements.get('terrain-rules-button'), ...layoutButtons,
    ]) assert.notEqual(control.disabled, true);

    document.querySelectorAll('[data-lang]')[0].dispatch('click');
    assert.equal(button.title, 'Без особенности');
    assert.match(button.getAttribute('aria-label'), /необязатель/i);

    for (const twist of twists) twist.effects = { ru: [], en: [] };
    byAction(footer, 'random').dispatch('click');
    assert.equal(dialog.open, true);
    assert.equal(button.title, 'Без особенности');
    const unavailable = byClass(body, 'twist-confirmation').find(item => /нет доступных/i.test(item.textContent));
    assert.ok(unavailable);
    assert.equal(document.activeElement, unavailable);
    assert.notEqual(byAction(footer, 'none').disabled, true);

    dialog.dispatch('click', { target: dialog });
    assert.equal(dialog.open, false);
    assert.equal(document.activeElement, button);
    button.dispatch('click');
    dialog.dispatch('cancel');
    dialog.close();
    assert.equal(button.title, 'Без особенности');
  } finally {
    Math.random = originalRandom;
    twists.forEach((twist, index) => { twist.effects = originalEffects[index]; });
    for (const [name, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});

test('renders and positions detailed bilingual mission references without moving the map', async () => {
  const saved = Object.fromEntries(['document', 'window', 'navigator', 'localStorage', 'getComputedStyle', 'Option'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const harness = createAppHarness();
  const { document, elements } = harness;
  installAppGlobals(harness);

  try {
    await import(`../app/app.js?mission-reference-test=${Date.now()}`);
    const trigger = elements.get('left-mission');
    const popover = elements.get('mission-popover');
    const map = elements.get('map');
    const reference = missionReferences[trigger.dataset.mission];
    const mapRect = map.getBoundingClientRect();

    trigger.dispatch('pointerenter');
    assert.equal(popover.open, true);
    assert.equal(popover.dataset.anchor, 'left');
    assert.equal(popover.style.getPropertyValue('--mission-popover-width'), '500px');
    assert.equal(popover.style.left, '24px');
    assert.equal(popover.style.top, '156px');
    assert.equal(popover.style.maxHeight, '702px');
    assert.deepEqual(map.getBoundingClientRect(), mapRect);

    const sections = descendants(popover).filter(item => item.className === 'mission-reference-section');
    assert.equal(sections.length, reference.sections.length);
    assert.match(descendants(popover)[0].textContent, /Mission: /);
    assert.ok(descendants(popover).some(item => item.textContent === reference.overview.en));
    assert.equal(descendants(popover).filter(item => item.className === 'mission-reference-condition-text').length,
      reference.sections.reduce((count, section) => count + section.conditions.length, 0));
    assert.ok(descendants(popover).some(item => item.className === 'mission-reference-vp' && / VP$/.test(item.textContent)));
    assert.ok(descendants(popover).some(item => item.className === 'mission-reference-limit' && /45 VP total/.test(item.textContent) && /15 VP per battle round/.test(item.textContent) && /end-of-battle scoring is exempt/i.test(item.textContent)));
    assert.match(popover.children.at(-1).textContent, /physical mission card or official app/i);

    trigger.dispatch('pointerleave', { relatedTarget: popover });
    assert.equal(popover.open, true);
    popover.dispatch('pointerleave', { relatedTarget: new FakeElement() });
    assert.equal(popover.open, false);

    const rightTrigger = elements.get('right-mission');
    rightTrigger.rect = { left: 420, right: 732, top: 100, bottom: 148, width: 312, height: 48 };
    rightTrigger.dispatch('click');
    assert.equal(popover.dataset.anchor, 'right');
    assert.equal(popover.style.left, '244px');
    assert.equal(popover.open, true);
    document.dispatch('pointerdown', { target: new FakeElement() });
    assert.equal(popover.open, false);

    harness.document.querySelectorAll('[data-lang]').find(button => button.dataset.lang === 'ru').dispatch('click');
    trigger.dispatch('pointerenter');
    assert.ok(descendants(popover).some(item => item.textContent === reference.overview.ru));
    assert.ok(descendants(popover).some(item => item.className === 'mission-reference-vp' && / ПО$/.test(item.textContent)));
    assert.match(popover.children.at(-1).textContent, /Физическая карта миссии/);
  } finally {
    for (const [name, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});

test('isolates pinned mission content and restores keyboard focus on Escape', async () => {
  const saved = Object.fromEntries(['document', 'window', 'navigator', 'localStorage', 'getComputedStyle', 'Option'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const harness = createAppHarness();
  const { document, elements } = harness;
  installAppGlobals(harness);

  try {
    await import(`../app/app.js?mission-pin-test=${Date.now()}`);
    const leftTrigger = elements.get('left-mission');
    const rightTrigger = elements.get('right-mission');
    const popover = elements.get('mission-popover');
    const title = () => descendants(popover).find(item => item.className === 'mission-reference-title').textContent;

    leftTrigger.focus();
    leftTrigger.dispatch('click');
    const leftTitle = title();
    assert.equal(document.activeElement, popover);
    assert.equal(leftTrigger.getAttribute('aria-expanded'), 'true');
    assert.equal(rightTrigger.getAttribute('aria-expanded'), 'false');

    rightTrigger.dispatch('pointerenter');
    rightTrigger.focus();
    rightTrigger.dispatch('focus');
    assert.equal(title(), leftTitle);
    assert.equal(leftTrigger.getAttribute('aria-expanded'), 'true');
    assert.equal(rightTrigger.getAttribute('aria-expanded'), 'false');
    rightTrigger.dispatch('pointerleave', { relatedTarget: new FakeElement() });
    rightTrigger.dispatch('focusout', { relatedTarget: new FakeElement() });
    assert.equal(popover.open, true);
    assert.equal(title(), leftTitle);

    rightTrigger.dispatch('click');
    assert.notEqual(title(), leftTitle);
    assert.equal(document.activeElement, popover);
    assert.equal(leftTrigger.getAttribute('aria-expanded'), 'false');
    assert.equal(rightTrigger.getAttribute('aria-expanded'), 'true');
    document.dispatch('keydown', { key: 'Escape' });
    assert.equal(popover.open, false);
    assert.equal(document.activeElement, rightTrigger);
    assert.equal(rightTrigger.getAttribute('aria-expanded'), 'false');

    leftTrigger.dispatch('pointerenter');
    assert.equal(document.activeElement, rightTrigger, 'hover preview must not steal focus');
  } finally {
    for (const [name, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});

test('restores the pinned trigger when a non-focusable outside pointer target dismisses the popover', async () => {
  const saved = Object.fromEntries(['document', 'window', 'navigator', 'localStorage', 'getComputedStyle', 'Option'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const harness = createAppHarness();
  const { document, elements } = harness;
  installAppGlobals(harness);

  try {
    await import(`../app/app.js?mission-outside-test=${Date.now()}`);
    const trigger = elements.get('left-mission');
    const popover = elements.get('mission-popover');
    trigger.dispatch('click');
    assert.equal(document.activeElement, popover);

    document.dispatch('pointerdown', { target: new FakeElement() });
    assert.equal(popover.open, false);
    assert.equal(document.activeElement, trigger);
    assert.equal(trigger.getAttribute('aria-expanded'), 'false');

    trigger.dispatch('click');
    const focusableTarget = new FakeElement();
    focusableTarget.ownerDocument = document;
    focusableTarget.tabIndex = 0;
    document.dispatch('pointerdown', { target: focusableTarget });
    assert.equal(document.activeElement, popover, 'focusable target receives focus after pointerdown default handling');
    focusableTarget.focus();
    assert.equal(popover.open, false);
    assert.equal(document.activeElement, focusableTarget);
  } finally {
    for (const [name, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});

test('repositions an open mission reference for narrow and short viewports', async () => {
  const saved = Object.fromEntries(['document', 'window', 'navigator', 'localStorage', 'getComputedStyle', 'Option'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const harness = createAppHarness();
  const { document, elements, window } = harness;
  installAppGlobals(harness);

  try {
    await import(`../app/app.js?mission-resize-test=${Date.now()}`);
    const trigger = elements.get('left-mission');
    const popover = elements.get('mission-popover');
    trigger.dispatch('pointerenter');

    window.innerWidth = document.documentElement.clientWidth = 340;
    window.innerHeight = document.documentElement.clientHeight = 300;
    trigger.rect = { left: 20, right: 320, top: 172, bottom: 220, width: 300, height: 48 };
    window.dispatch('resize');
    assert.equal(popover.style.width, '316px');
    assert.equal(popover.style.left, '12px');
    assert.equal(popover.style.top, '228px');
    assert.equal(popover.style.maxHeight, '60px');

    window.innerWidth = document.documentElement.clientWidth = 360;
    window.innerHeight = document.documentElement.clientHeight = 340;
    trigger.rect = { left: 16, right: 344, top: 112, bottom: 160, width: 328, height: 48 };
    window.visualViewport.dispatch('resize');
    assert.equal(popover.style.width, '336px');
    assert.equal(popover.style.left, '12px');
    assert.equal(popover.style.top, '168px');
    assert.equal(popover.style.maxHeight, '160px');

    window.visualViewport.width = 240;
    window.visualViewport.height = 180;
    window.visualViewport.offsetLeft = 100;
    window.visualViewport.offsetTop = 200;
    window.visualViewport.dispatch('resize');
    assert.equal(window.innerWidth, 360, 'layout viewport width must stay unchanged');
    assert.equal(window.innerHeight, 340, 'layout viewport height must stay unchanged');
    assert.equal(popover.style.width, '216px');
    assert.equal(popover.style.left, '112px');
    assert.equal(popover.style.top, '212px');
    assert.equal(popover.style.maxHeight, '117px');
  } finally {
    for (const [name, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});

function installAppGlobals({ document, elements, window }) {
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
  return sheet;
}

test('runs the free-layout gallery interactions without duplicate cards', async () => {
  const saved = Object.fromEntries(['document', 'window', 'navigator', 'localStorage', 'getComputedStyle', 'Option'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const harness = createAppHarness();
  const { document, elements, layoutButtons, window } = harness;
  const sheet = installAppGlobals(harness);

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

test('runs the shared disposition menu through the existing select change path', async () => {
  const saved = Object.fromEntries(['document', 'window', 'navigator', 'localStorage', 'getComputedStyle', 'Option'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const harness = createAppHarness();
  const { document, elements, window } = harness;
  installAppGlobals(harness);

  try {
    await import(`../app/app.js?disposition-test=${Date.now()}`);
    const left = elements.get('left');
    const right = elements.get('right');
    const leftTrigger = elements.get('left-disposition-button');
    const rightTrigger = elements.get('right-disposition-button');
    const menu = elements.get('disposition-menu');
    const map = elements.get('map');

    leftTrigger.focus();
    leftTrigger.dispatch('click');
    assert.equal(menu.open, true);
    assert.equal(menu.children.length, 5);
    assert.equal(menu.children.filter(button => button.getAttribute('aria-current') === 'true').length, 1);
    assert.equal(menu.children.find(button => button.getAttribute('aria-current') === 'true').dataset.disposition, 'disruption');
    assert.equal(document.activeElement, menu.children.find(button => button.getAttribute('aria-current') === 'true'));

    const reconnaissance = menu.children.find(button => button.dataset.disposition === 'reconnaissance');
    reconnaissance.dispatch('click');
    assert.equal(left.value, 'reconnaissance');
    assert.equal(leftTrigger.textContent, 'Reconnaissance');
    assert.match(map.alt, /^Reconnaissance versus /);
    assert.equal(menu.open, false);
    assert.equal(document.activeElement, leftTrigger);

    rightTrigger.rect = { left: 700, right: 1000, top: 1012, bottom: 1060, width: 300, height: 48 };
    rightTrigger.focus();
    rightTrigger.dispatch('click');
    assert.equal(menu.open, true);
    assert.equal(menu.style.left, '456px');
    assert.equal(menu.style.top, '840px');
    document.dispatch('keydown', { key: 'Escape' });
    assert.equal(menu.open, false);
    assert.equal(document.activeElement, rightTrigger);

    rightTrigger.dispatch('click');
    document.dispatch('pointerdown', { target: new FakeElement() });
    assert.equal(menu.open, false);
    assert.equal(right.value, 'priority-assets');
  } finally {
    for (const [name, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});

test('keeps the disposition menu usable without the Popover API', async () => {
  const saved = Object.fromEntries(['document', 'window', 'navigator', 'localStorage', 'getComputedStyle', 'Option'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const harness = createAppHarness();
  const { document, elements } = harness;
  const menu = elements.get('disposition-menu');
  menu.showPopover = undefined;
  menu.hidePopover = undefined;
  installAppGlobals(harness);

  try {
    await import(`../app/app.js?disposition-fallback-test=${Date.now()}`);
    const trigger = elements.get('left-disposition-button');
    trigger.focus();
    trigger.dispatch('click');
    assert.equal(menu.hidden, false);
    assert.equal(document.activeElement.dataset.disposition, 'disruption');

    menu.children.find(button => button.dataset.disposition === 'reconnaissance').dispatch('click');
    assert.equal(elements.get('left').value, 'reconnaissance');
    assert.equal(menu.hidden, true);
    assert.equal(document.activeElement, trigger);
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
