# Paper Background, Dialog Close, and Terrain Rules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the authentic Event Companion paper fill the complete main screen and blend with every map, replace all visible dialog Close labels with one accessible cross, remove the duplicate selected-Twist close action, and render the approved Terrain Layout rules as bilingual semantic HTML.

**Architecture:** Keep the dependency-free single-page application and its existing native dialogs. Extend the reproducible PDF extractor with one background-only render, use CSS plus one small geometry synchronizer to align that paper around the contained map, and keep all long rules copy in one plain object beside the existing translations. Do not split the application module or add dependencies: the current files already own these responsibilities, and the smallest correct change stays there.

**Tech Stack:** Plain HTML/CSS/JavaScript ES modules, Node 24 built-in test runner, Python with existing pypdfium2/Pillow, lossless WebP, native `<dialog>`, Tauri 2.11, external Playwright smoke runner, Windows x64 and Android ARM64 packaging.

---

## Source and File Map

Work from branch `codex/issue-14-paper-background-close-controls`, based on published v0.5.0 main. Keep the user's unrelated `.gitignore`, `.superpowers/`, and `ключ пароль.txt` changes untracked and unstaged.

- Modify `tools/extract_layouts.py`: render the first two full-page objects from Event Companion v1.1 page 9 into the required paper asset; stop generating the obsolete Terrain Layout screenshot.
- Create `app/assets/backgrounds/event-companion-paper.webp`: required offline paper background.
- Delete `app/assets/key/terrain-rules.webp`: semantic HTML replaces it.
- Modify `app/index.html`: icon-only close markup and Terrain Layout content container.
- Modify `app/styles.css`: global paper, map-aligned paper, stable close controls, white dialog surfaces, and scrollable rules content.
- Modify `app/app.js`: map-paper alignment, close accessibility labels, selected-Twist footer de-duplication, bilingual rules data, and semantic renderer.
- Modify `test/assets.test.js`: background extraction and required-asset checks.
- Modify `test/ui.test.js`: static contract plus runtime behavior for paper geometry, close controls, Twist detail, and rules localization.
- Use temporary `D:/Temp/okami/wh40k-issue14-smoke.cjs` for final Playwright coverage; do not commit it.

### Task 1: Extract and Require the Authentic Paper Asset

**Files:**
- Modify: `test/assets.test.js`
- Modify: `tools/extract_layouts.py`
- Create: `app/assets/backgrounds/event-companion-paper.webp`

- [ ] **Step 1: Confirm the published v0.5.0 baseline**

Run:

```powershell
npm.cmd test
```

Expected: 60 tests pass, 0 fail. If the count differs because main advanced, record the actual green baseline on issue #14 before continuing.

- [ ] **Step 2: Write the failing paper-asset tests**

In `test/assets.test.js`, add the background to `required` and add this test:

```js
test('extracts the shared Event Companion paper as a required offline asset', () => {
  const background = 'app/assets/backgrounds/event-companion-paper.webp';
  assert.ok(existsSync(background), `Missing ${background}`);
  assert.ok(statSync(background).size > 0, `Empty ${background}`);

  const extractor = readFileSync('tools/extract_layouts.py', 'utf8');
  assert.match(extractor, /PAPER_PAGE = 9/);
  assert.match(extractor, /PAPER_OBJECT_COUNT = 2/);
  assert.match(extractor, /paper_objects = list\(paper_page\.get_objects\(\)\)/);
  assert.match(extractor, /for object_ in paper_objects\[PAPER_OBJECT_COUNT:\]:\s+paper_page\.remove_obj\(object_\)/);
  assert.match(extractor, /paper\.save\(\s*BACKGROUND_OUTPUT \/ "event-companion-paper\.webp"/);
});
```

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```powershell
node --test test/assets.test.js
```

Expected: FAIL with `Missing app/assets/backgrounds/event-companion-paper.webp`.

- [ ] **Step 4: Add the minimal reproducible extraction**

In `tools/extract_layouts.py`, add these constants beside the existing output and page constants:

```python
BACKGROUND_OUTPUT = ROOT / "app" / "assets" / "backgrounds"
PAPER_PAGE = 9
PAPER_OBJECT_COUNT = 2
PAPER_TILES = 3
```

Add the existing Pillow dependency imports at the top:

```python
from PIL import Image, ImageOps
```

Create the directory with the other outputs:

```python
BACKGROUND_OUTPUT.mkdir(parents=True, exist_ok=True)
```

After all 45 map pages have already been rendered, but before leaving the existing `PdfDocument` context, add:

```python
        paper_page = document[PAPER_PAGE - 1]
        paper_objects = list(paper_page.get_objects())
        if len(paper_objects) < PAPER_OBJECT_COUNT:
            raise SystemExit("Event Companion paper objects are missing")

        page_width, page_height = paper_page.get_size()
        for object_ in paper_objects[:PAPER_OBJECT_COUNT]:
            left, bottom, right, top = object_.get_bounds()
            if left > 0 or bottom > 0 or right < page_width or top < page_height:
                raise SystemExit("Event Companion paper object no longer covers the full page")

        for object_ in paper_objects[PAPER_OBJECT_COUNT:]:
            paper_page.remove_obj(object_)

        paper = paper_page.render(scale=SCALE).to_pil().convert("RGB")
        paper_width, paper_height = paper.size
        extended = Image.new("RGB", (paper_width * PAPER_TILES, paper_height * PAPER_TILES))
        for row in range(PAPER_TILES):
            for column in range(PAPER_TILES):
                tile = paper
                if column != 1:
                    tile = ImageOps.mirror(tile)
                if row != 1:
                    tile = ImageOps.flip(tile)
                extended.paste(tile, (column * paper_width, row * paper_height))

        extended.save(
            BACKGROUND_OUTPUT / "event-companion-paper.webp",
            "WEBP",
            lossless=True,
            method=6,
        )
```

Add the final status line:

```python
    print(f"Created Event Companion paper in {BACKGROUND_OUTPUT.relative_to(ROOT)}")
```

Do not move this extraction before the 45-map loop: removing page 9 objects first would corrupt the first map asset.

- [ ] **Step 5: Generate and validate the asset**

Run:

```powershell
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tools\extract_layouts.py
@'
from pathlib import Path
from PIL import Image
p = Path('app/assets/backgrounds/event-companion-paper.webp')
im = Image.open(p)
assert im.size == (3570, 5052), im.size
assert p.stat().st_size > 0
print(im.size, p.stat().st_size)
'@ | & 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -
```

Expected: extractor reports 45 maps, five icons, key, Terrain Layout screenshot, and paper; the check prints `(3570, 5052)` and a positive byte size. Inspect `app/assets/backgrounds/event-companion-paper.webp` with the image viewer: its center tile must be the exact official grey-white paper, its eight mirrored edge-extension tiles must join without seams, and it must contain no text, cards, map, page number, or colored deployment zones.

- [ ] **Step 6: Run GREEN and commit**

Run:

```powershell
node --test test/assets.test.js
git add -- tools/extract_layouts.py test/assets.test.js app/assets/backgrounds/event-companion-paper.webp
git diff --cached --check
git commit -m "feat: extract authentic paper background refs #14"
```

Expected: focused tests pass and the commit contains only the extractor, asset test, and new WebP.

### Task 2: Cover the Viewport and Align Paper Around the Map

**Files:**
- Modify: `test/ui.test.js`
- Modify: `app/styles.css`
- Modify: `app/app.js`

- [ ] **Step 1: Add failing static and runtime geometry tests**

In the first UI contract test in `test/ui.test.js`, add:

```js
  assert.match(css, /--paper-image:\s*url\("assets\/backgrounds\/event-companion-paper\.webp"\)/);
  assert.match(css, /html\s*\{[\s\S]*background-image:\s*var\(--paper-image\)/);
  assert.match(css, /html\s*\{[\s\S]*background-size:\s*var\(--paper-size, cover\)/);
  assert.match(css, /body\s*\{[\s\S]*background:\s*transparent/);
  assert.match(css, /\.map-button\s*\{[\s\S]*background-image:\s*var\(--paper-image\)/);
  assert.match(css, /\.map-button\s*\{[\s\S]*background-size:\s*var\(--map-paper-size, cover\)/);
  assert.match(js, /const paperGeometry = Object\.freeze\(\{ width: 3570, height: 5052, cropLeft: 1354, cropTop: 2174 \}\)/);
  assert.match(js, /function syncMapPaper\(\)/);
  assert.match(js, /map\.addEventListener\('load', syncMapPaper\)/);
```

In `createAppHarness()`, give `map` and `mapButton` logical dimensions after they are created:

```js
  const map = elements.get('map');
  const mapButton = document.querySelector('.map-button');
  Object.assign(map, {
    naturalWidth: 862,
    naturalHeight: 1040,
    clientWidth: 704,
    clientHeight: 600,
    rect: { left: 0, right: 704, top: 0, bottom: 600, width: 704, height: 600 },
  });
  Object.assign(mapButton, { clientWidth: 704, clientHeight: 600 });
```

In the existing gallery/runtime test, after importing the application, add:

```js
    const mapButton = document.querySelector('.map-button');
    elements.get('map').dispatch('load');
    assert.equal(mapButton.style.getPropertyValue('--map-paper-size'), '2059.6153846153843px 2914.6153846153843px');
    assert.equal(mapButton.style.getPropertyValue('--map-paper-position'), '-677.8076923076922px -1254.230769230769px');
    assert.equal(document.documentElement.style.getPropertyValue('--paper-size'), '2059.6153846153843px 2914.6153846153843px');
    assert.equal(document.documentElement.style.getPropertyValue('--paper-position'), '-677.8076923076922px -1254.230769230769px');
```

These values come from `scale = min(704 / 862, 600 / 1040)` and must stay in logical pre-transform CSS pixels.

- [ ] **Step 2: Run the focused UI test and verify RED**

Run:

```powershell
node --test test/ui.test.js
```

Expected: FAIL because the paper CSS and `syncMapPaper()` do not exist.

- [ ] **Step 3: Add the global and map-local paper CSS**

In `:root`, replace the old neutral background token and add the asset token:

```css
  --background: oklch(0.994 0 0);
  --paper-image: url("assets/backgrounds/event-companion-paper.webp");
```

Update `html` and `body`:

```css
html {
  min-width: 320px;
  background-color: var(--background);
  background-image: var(--paper-image);
  background-position: var(--paper-position, center);
  background-repeat: no-repeat;
  background-size: var(--paper-size, cover);
}

body {
  /* keep all existing sizing, safe-area, typography, and placement declarations */
  background: transparent;
}
```

Extend the existing `.map-button` rule without changing its size or layout:

```css
  background-color: var(--background);
  background-image: var(--paper-image);
  background-position: var(--map-paper-position, center);
  background-repeat: no-repeat;
  background-size: var(--map-paper-size, cover);
```

Keep `.map-button:hover` and `.map-button:active` transparent by changing those rules to `background-color: transparent`; do not use the shorthand `background`, because that would remove the paper image.

- [ ] **Step 4: Add the minimal map-paper geometry synchronizer**

In `app/app.js`, add beside the other fixed UI state:

```js
const paperGeometry = Object.freeze({ width: 3570, height: 5052, cropLeft: 1354, cropTop: 2174 });
```

Add after `fitSheet()`:

```js
function syncMapPaper() {
  if (!map.naturalWidth || !map.naturalHeight || !map.clientWidth || !map.clientHeight) return;

  const logicalScale = Math.min(map.clientWidth / map.naturalWidth, map.clientHeight / map.naturalHeight);
  const logicalLeft = (mapButton.clientWidth - map.naturalWidth * logicalScale) / 2;
  const logicalTop = (mapButton.clientHeight - map.naturalHeight * logicalScale) / 2;
  mapButton.style.setProperty('--map-paper-size', `${paperGeometry.width * logicalScale}px ${paperGeometry.height * logicalScale}px`);
  mapButton.style.setProperty('--map-paper-position', `${logicalLeft - paperGeometry.cropLeft * logicalScale}px ${logicalTop - paperGeometry.cropTop * logicalScale}px`);

  const rect = map.getBoundingClientRect();
  const viewportScale = Math.min(rect.width / map.naturalWidth, rect.height / map.naturalHeight);
  const viewportLeft = rect.left + (rect.width - map.naturalWidth * viewportScale) / 2;
  const viewportTop = rect.top + (rect.height - map.naturalHeight * viewportScale) / 2;
  document.documentElement.style.setProperty('--paper-size', `${paperGeometry.width * viewportScale}px ${paperGeometry.height * viewportScale}px`);
  document.documentElement.style.setProperty('--paper-position', `${viewportLeft - paperGeometry.cropLeft * viewportScale}px ${viewportTop - paperGeometry.cropTop * viewportScale}px`);
}
```

Register and resize it:

```js
map.addEventListener('load', syncMapPaper);

function handleViewportResize() {
  fitSheet();
  syncMapPaper();
  positionSummary();
}
```

After initial `render()`, add one final `syncMapPaper()` call for already-decoded cached images:

```js
fitSheet();
render();
syncMapPaper();
```

- [ ] **Step 5: Run GREEN and commit**

Run:

```powershell
node --test test/ui.test.js
npm.cmd test
git add -- app/app.js app/styles.css test/ui.test.js
git diff --cached --check
git commit -m "feat: blend map into paper background refs #14"
```

Expected: all Node tests pass; no selector-card, VS, layout button, or map dimensions change.

### Task 3: Replace Every Visible Close Label and Remove the Twist Duplicate

**Files:**
- Modify: `test/ui.test.js`
- Modify: `app/index.html`
- Modify: `app/styles.css`
- Modify: `app/app.js`

- [ ] **Step 1: Write failing close-control tests**

In the static UI contract test, add:

```js
  assert.equal(html.match(/class="dialog-close"/g)?.length, 5);
  for (const id of ['twist-dialog-close', 'terrain-rules-close', 'layout-key-close', 'close', 'layout-gallery-close']) {
    assert.match(html, new RegExp(`<button[^>]+id="${id}"[^>]+class="dialog-close"[^>]+aria-label="Close"[^>]+title="Close"[^>]*>×<\\/button>`));
  }
  const closeRule = css.match(/\.dialog-close\s*\{([\s\S]*?)\}/)?.[1] ?? '';
  assert.match(closeRule, /\bwidth:\s*44px;/);
  assert.match(closeRule, /\bheight:\s*44px;/);
  assert.match(closeRule, /\bpadding:\s*0;/);
  assert.doesNotMatch(js, /twistDialogFooter\.replaceChildren\(change, close\)/);
  assert.doesNotMatch(js, /(?:twistDialogClose|terrainRulesClose|layoutKeyClose|viewerClose|layoutGalleryClose)\.textContent\s*=\s*copy\.close/);
```

In the existing Twist runtime test, immediately after selecting the first Twist, add:

```js
    assert.deepEqual(footer.children.map(control => control.dataset.action), ['change']);
```

After switching to Russian, add:

```js
    assert.equal(close.textContent, '×');
    assert.equal(close.getAttribute('aria-label'), 'Закрыть');
    assert.equal(close.title, 'Закрыть');
```

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test test/ui.test.js
```

Expected: FAIL because the five buttons still display localized text and selected Twist details still render two close actions.

- [ ] **Step 3: Replace the five dialog buttons in HTML**

Use this exact pattern for each existing ID in `app/index.html`:

```html
<button id="twist-dialog-close" class="dialog-close" type="button" aria-label="Close" title="Close">×</button>
<button id="terrain-rules-close" class="dialog-close" type="button" aria-label="Close" title="Close">×</button>
<button id="layout-key-close" class="dialog-close" type="button" aria-label="Close" title="Close">×</button>
<button id="close" class="dialog-close" type="button" aria-label="Close" title="Close">×</button>
<button id="layout-gallery-close" class="dialog-close" type="button" aria-label="Close" title="Close">×</button>
```

Keep every ID and listener unchanged.

- [ ] **Step 4: Add one shared close style**

Replace the old ID-specific close padding rule with:

```css
.dialog-close {
  display: grid;
  width: 44px;
  height: 44px;
  min-height: 44px;
  padding: 0;
  flex: 0 0 44px;
  place-items: center;
  font-size: 1.6rem;
  line-height: 1;
}
```

- [ ] **Step 5: Localize only the accessible label and remove the footer duplicate**

In `app/app.js`, immediately after the existing `twistDialogClose` declaration, cache the other four controls and build the array:

```js
const terrainRulesClose = document.querySelector('#terrain-rules-close');
const layoutKeyClose = document.querySelector('#layout-key-close');
const viewerClose = document.querySelector('#close');
const layoutGalleryClose = document.querySelector('#layout-gallery-close');
const dialogCloseButtons = [twistDialogClose, terrainRulesClose, layoutKeyClose, viewerClose, layoutGalleryClose];
```

In `render()`, replace every close `.textContent` assignment with:

```js
    for (const button of dialogCloseButtons) {
      button.setAttribute('aria-label', copy.close);
      button.title = copy.close;
    }
```

Delete `twistDialogClose.textContent = text[language].close` from `renderTwistPanel()`.

In `renderTwistDetail()`, delete the dynamically created `close` button and its listener, then use:

```js
  twistDialogFooter.replaceChildren(change);
```

Use the cached close constants in the existing click listeners; behavior does not change:

```js
viewerClose.addEventListener('click', () => viewer.close());
layoutGalleryClose.addEventListener('click', () => layoutGallery.close());
terrainRulesClose.addEventListener('click', () => terrainRulesViewer.close());
layoutKeyClose.addEventListener('click', () => keyViewer.close());
```

- [ ] **Step 6: Run GREEN and commit**

Run:

```powershell
node --test test/ui.test.js
npm.cmd test
git add -- app/index.html app/styles.css app/app.js test/ui.test.js
git diff --cached --check
git commit -m "fix: use one stable close cross per dialog refs #14"
```

Expected: all tests pass, the Twist detail footer has only `Change`, and all five headers keep one 44 x 44 cross.

### Task 4: Replace the Terrain Layout Screenshot with Bilingual Semantic HTML

**Files:**
- Modify: `test/ui.test.js`
- Modify: `test/assets.test.js`
- Modify: `app/index.html`
- Modify: `app/styles.css`
- Modify: `app/app.js`
- Modify: `tools/extract_layouts.py`
- Delete: `app/assets/key/terrain-rules.webp`

- [ ] **Step 1: Write failing semantic-content tests**

Replace the old Terrain Layout image assertions in the static UI test with:

```js
  assert.match(html, /<div[^>]+id="terrain-rules-content"[^>]+class="terrain-rules-content"/);
  assert.doesNotMatch(html, /id="terrain-rules-image"/);
  assert.doesNotMatch(html, /assets\/key\/terrain-rules\.webp/);
  assert.match(css, /\.terrain-rules-content\s*\{[\s\S]*overflow-y:\s*auto/);
  assert.match(css, /\.terrain-footprints\s*\{[\s\S]*border-collapse:\s*collapse/);
  assert.match(js, /const terrainRulesCopy = \{/);
  assert.match(js, /function renderTerrainRules\(\)/);
  assert.match(js, /warhammer-community\.com/);
  assert.match(js, /Battlefields: Armageddon/);
```

Remove `terrain-rules.webp` from required assets in `test/assets.test.js`, and add:

```js
test('does not package the replaced Terrain Layout screenshot', () => {
  assert.equal(existsSync('app/assets/key/terrain-rules.webp'), false);
  const extractor = readFileSync('tools/extract_layouts.py', 'utf8');
  assert.doesNotMatch(extractor, /TERRAIN_RULES_PAGE|TERRAIN_RULES_CROP_POINTS|terrain-rules\.webp/);
});
```

Add `terrain-rules-content` to the harness ID list and remove `terrain-rules-image`.

Add this runtime test after the application harness setup tests:

```js
test('renders and translates the semantic Terrain Layout reference', async () => {
  const saved = Object.fromEntries(['document', 'window', 'navigator', 'localStorage', 'getComputedStyle', 'Option'].map(name => [name, Object.getOwnPropertyDescriptor(globalThis, name)]));
  const harness = createAppHarness();
  const { document, elements } = harness;
  installAppGlobals(harness);

  try {
    await import(`../app/app.js?terrain-rules-test=${Date.now()}`);
    const content = elements.get('terrain-rules-content');
    const tableRows = () => descendants(content).filter(item => item.tagName === 'TR');
    assert.match(textOf(content), /Recommended Terrain Area Footprints/);
    assert.match(textOf(content), /Battlefields: Armageddon/);
    assert.match(textOf(content), /warhammer-community\.com/);
    assert.equal(tableRows().length, 6);

    content.scrollTop = 64;
    document.querySelectorAll('[data-lang]')[0].dispatch('click');
    assert.match(textOf(content), /Рекомендуемые размеры зон террейна/);
    assert.match(textOf(content), /Элементы террейна/);
    assert.equal(tableRows().length, 6);
    assert.equal(content.scrollTop, 64);
  } finally {
    for (const [name, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else delete globalThis[name];
    }
  }
});
```

Update `FakeElement` so its constructor stores the uppercase tag used by the new table test:

```js
  constructor({ id = '', className = '', dataset = {}, hidden = false, tagName = '' } = {}) {
    this.tagName = tagName.toUpperCase();
```

Update the fake `document.createElement` implementation to pass the tag:

```js
createElement: tagName => new FakeElement({ tagName }),
```

- [ ] **Step 2: Run RED**

Run:

```powershell
node --test test/ui.test.js test/assets.test.js
```

Expected: FAIL because the dialog still contains `terrain-rules.webp`, the old file still exists, and no rules renderer exists.

- [ ] **Step 3: Replace the image with one scroll container**

In `app/index.html`, replace `#terrain-rules-image` with:

```html
    <div id="terrain-rules-content" class="terrain-rules-content"></div>
```

- [ ] **Step 4: Add the approved structured bilingual copy**

In `app/app.js`, add after `text`:

```js
const terrainRulesCopy = {
  en: {
    intro: [
      "The following layouts are presented for Warhammer Event organisers and players to use in all of their games of Warhammer 40,000 using the most recent Chapter Approved Mission Deck. These are the layouts that are used at Games Workshop events and are designed for the best experience by the Warhammer Studio team, to reflect battlefields that create risk-and-reward decisions with each player's objectives in mind.",
      'Each combination of Primary Missions has three recommended layouts, labelled A, B and C. As directed by the Warhammer Event organiser, the players either use the layout specified or randomly determine which of these layouts to use.',
    ],
    footprintsHeading: 'Recommended Terrain Area Footprints',
    footprintsIntro: 'We have listed the terrain area footprints these recommended layouts use. You can find a PDF with these footprints ready for you to print on warhammer-community.com.',
    sizeHeading: 'Terrain area footprint size',
    quantityHeading: 'Quantity',
    polygon: 'Polygon',
    featuresHeading: 'Terrain Features',
    features: [
      "Each layout is shown with the terrain features from the Battlefields: Armageddon box using the 'Warhammer recommended' build configuration from the construction booklet. We've denoted each terrain feature from that set as either a dense or light terrain feature in these layouts. The configurations of the terrain features and terrain areas are designed to create the best experience with the Hidden rule and movement rules for various units, and to create plenty of interesting decisions during a battle. We've also purposely left space between a terrain feature and the edge of the terrain area to allow a line of models to be on the terrain area from the 'outside'.",
      'If you do not have the Battlefields: Armageddon terrain, it is possible to recreate these layouts with your own terrain that is close to the same size of the various terrain features by denoting for all players if they are dense or light terrain features.',
    ],
  },
  ru: {
    intro: [
      'Следующие схемы предназначены для организаторов мероприятий Warhammer и игроков и могут использоваться во всех играх Warhammer 40,000 с самой актуальной колодой миссий Chapter Approved. Эти схемы используются на мероприятиях Games Workshop и разработаны командой Warhammer Studio для наиболее интересной игры на полях боя, где игрокам приходится сопоставлять риск и награду с учётом своих целей.',
      'Для каждой комбинации основных миссий предусмотрены три рекомендуемые схемы: A, B и C. По указанию организатора мероприятия Warhammer игроки используют назначенную схему или определяют одну из этих схем случайным образом.',
    ],
    footprintsHeading: 'Рекомендуемые размеры зон террейна',
    footprintsIntro: 'Ниже перечислены размеры зон террейна, используемых в рекомендуемых схемах. На сайте warhammer-community.com можно найти готовый к печати PDF с этими контурами.',
    sizeHeading: 'Размер зоны террейна',
    quantityHeading: 'Количество',
    polygon: 'Многоугольник',
    featuresHeading: 'Элементы террейна',
    features: [
      'Каждая схема показана с элементами террейна из набора Battlefields: Armageddon в рекомендованной Warhammer конфигурации сборки из инструкции. Каждый элемент этого набора обозначен на схемах как плотный или лёгкий элемент террейна. Конфигурации элементов и зон террейна рассчитаны на наиболее интересную игру с учётом правила Hidden и правил перемещения различных подразделений и создают множество значимых решений во время боя. Между элементом террейна и краем зоны террейна намеренно оставлено место, чтобы ряд моделей мог размещаться в зоне террейна со стороны внешнего края.',
      'Если у вас нет террейна Battlefields: Armageddon, эти схемы можно воспроизвести с собственным террейном близкого размера. Перед игрой сообщите всем игрокам, какие элементы считаются плотными, а какие лёгкими.',
    ],
  },
};

const terrainFootprints = [
  ['6" x 4"', 4],
  ['10" x 2.5"', 2],
  ['6" x 2"', 4],
  ['7" x 11.5"', 4],
  ['8" x 11.5"', 2, 'polygon'],
];
```

- [ ] **Step 5: Render semantic headings, paragraphs, and table without `innerHTML`**

Replace the old `terrainRulesImage` query with:

```js
const terrainRulesContent = document.querySelector('#terrain-rules-content');
```

Add beside the existing render helpers:

```js
function renderTerrainRules() {
  const copy = terrainRulesCopy[language];
  const scrollTop = terrainRulesContent.scrollTop;
  const intro = copy.intro.map(paragraph => createReferenceElement('p', 'terrain-rules-paragraph', paragraph));
  const footprintsHeading = createReferenceElement('h3', 'terrain-rules-heading', copy.footprintsHeading);
  const footprintsIntro = createReferenceElement('p', 'terrain-rules-paragraph', copy.footprintsIntro);
  const table = document.createElement('table');
  table.className = 'terrain-footprints';
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  const sizeHeading = createReferenceElement('th', '', copy.sizeHeading);
  const quantityHeading = createReferenceElement('th', '', copy.quantityHeading);
  sizeHeading.scope = 'col';
  quantityHeading.scope = 'col';
  headRow.append(sizeHeading, quantityHeading);
  head.append(headRow);

  const body = document.createElement('tbody');
  for (const [size, quantity, qualifier] of terrainFootprints) {
    const row = document.createElement('tr');
    row.append(
      createReferenceElement('td', '', qualifier ? `${size} ${copy[qualifier]}` : size),
      createReferenceElement('td', '', String(quantity)),
    );
    body.append(row);
  }
  table.append(head, body);

  const featuresHeading = createReferenceElement('h3', 'terrain-rules-heading', copy.featuresHeading);
  const features = copy.features.map(paragraph => createReferenceElement('p', 'terrain-rules-paragraph', paragraph));
  terrainRulesContent.replaceChildren(...intro, footprintsHeading, footprintsIntro, table, featuresHeading, ...features);
  terrainRulesContent.scrollTop = scrollTop;
}
```

In `render()`, remove `terrainRulesImage.alt = copy.mapDescription` and call:

```js
    renderTerrainRules();
```

- [ ] **Step 6: Style a white, contained, readable rules dialog**

Replace the old `#terrain-rules-image` rules with:

```css
#terrain-rules-viewer {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
  background: var(--surface);
}

#terrain-rules-viewer:not([open]) {
  display: none;
}

.terrain-rules-content {
  min-height: 0;
  padding: 4px 8px 8px;
  overflow-y: auto;
  overscroll-behavior: contain;
  line-height: 1.45;
}

.terrain-rules-heading {
  margin: 18px 0 6px;
  font-size: 1rem;
  text-transform: uppercase;
}

.terrain-rules-paragraph {
  margin: 0 0 12px;
}

.terrain-footprints {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0 18px;
}

.terrain-footprints th,
.terrain-footprints td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--line-soft);
  text-align: center;
}

.terrain-footprints th {
  color: var(--surface);
  background: oklch(0.27 0.035 150);
  text-transform: uppercase;
}

.terrain-footprints tbody tr:nth-child(even) {
  background: var(--disabled);
}
```

Do not add the paper image to this dialog or any other white surface.

- [ ] **Step 7: Remove the obsolete screenshot extraction and file**

Delete `TERRAIN_RULES_PAGE`, `TERRAIN_RULES_CROP_POINTS`, `terrain_rules_crop`, the page-7 render/save block, and its print line from `tools/extract_layouts.py`. Then delete only the tracked obsolete asset:

```powershell
git rm -- app/assets/key/terrain-rules.webp
```

- [ ] **Step 8: Run GREEN and commit**

Run:

```powershell
node --test test/ui.test.js test/assets.test.js
npm.cmd test
git add -- app/index.html app/styles.css app/app.js tools/extract_layouts.py test/ui.test.js test/assets.test.js
git diff --cached --check
git commit -m "feat: localize semantic terrain rules refs #14"
```

Expected: all tests pass, both languages render six table rows including the header, and `terrain-rules.webp` is deleted.

### Task 5: Run the Seven-Viewport Playwright Acceptance Matrix

**Files:**
- Create temporarily: `D:/Temp/okami/wh40k-issue14-smoke.cjs`
- Create ignored evidence: `output/playwright/issue14-*.png`

- [ ] **Step 1: Start the local app server**

Run with a hidden process:

```powershell
$python = 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
Start-Process -FilePath $python -ArgumentList @('-m','http.server','8894','--bind','127.0.0.1','--directory','D:\WH40K Terrain Layout\app') -WindowStyle Hidden -RedirectStandardOutput 'D:\Temp\okami\wh40k-issue14-server.log' -RedirectStandardError 'D:\Temp\okami\wh40k-issue14-server.err.log' -PassThru
```

Expected: process starts and `Invoke-WebRequest http://127.0.0.1:8894/` returns HTTP 200.

- [ ] **Step 2: Create the exact smoke runner with `apply_patch`**

Create `D:/Temp/okami/wh40k-issue14-smoke.cjs` with:

```js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 412, height: 915 },
  { width: 480, height: 1040 },
  { width: 560, height: 1280 },
  { width: 768, height: 1080 },
  { width: 1366, height: 728 },
];
const output = 'D:/WH40K Terrain Layout/output/playwright';
fs.mkdirSync(output, { recursive: true });

async function assertWhiteDialog(page, selector) {
  const values = await page.locator(selector).evaluate(dialog => {
    const style = getComputedStyle(dialog);
    return { backgroundImage: style.backgroundImage, backgroundColor: style.backgroundColor };
  });
  assert.equal(values.backgroundImage, 'none', `${selector} has textured background`);
  assert.notEqual(values.backgroundColor, 'rgba(0, 0, 0, 0)', `${selector} is transparent`);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      const failures = [];
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => failures.push(request.url()));
      const paperResponses = [];
      page.on('response', response => {
        if (response.url().endsWith('/assets/backgrounds/event-companion-paper.webp')) paperResponses.push(response.status());
      });

      await page.goto('http://127.0.0.1:8894/', { waitUntil: 'networkidle' });
      await page.locator('#map').evaluate(image => image.complete && image.naturalWidth ? true : new Promise(resolve => image.addEventListener('load', () => resolve(true), { once: true })));
      assert.deepEqual([...new Set(paperResponses)], [200]);
      assert.match(await page.locator('html').evaluate(node => getComputedStyle(node).backgroundImage), /event-companion-paper\.webp/);
      assert.equal(await page.locator('body').evaluate(node => getComputedStyle(node).overflow), 'hidden');
      const paperVars = await page.locator('.map-button').evaluate(node => ({
        size: node.style.getPropertyValue('--map-paper-size'),
        position: node.style.getPropertyValue('--map-paper-position'),
      }));
      assert.ok(Object.values(paperVars).every(Boolean), `missing map paper geometry at ${viewport.width}x${viewport.height}`);
      const paperCoverage = await page.evaluate(() => {
        const style = document.documentElement.style;
        const [width, height] = style.getPropertyValue('--paper-size').split(' ').map(Number.parseFloat);
        const [left, top] = style.getPropertyValue('--paper-position').split(' ').map(Number.parseFloat);
        return { width, height, left, top };
      });
      assert.ok(paperCoverage.left <= 0 && paperCoverage.top <= 0, `paper misses top/left at ${viewport.width}x${viewport.height}`);
      assert.ok(paperCoverage.left + paperCoverage.width >= viewport.width, `paper misses right edge at ${viewport.width}x${viewport.height}`);
      assert.ok(paperCoverage.top + paperCoverage.height >= viewport.height, `paper misses bottom edge at ${viewport.width}x${viewport.height}`);

      const mainShot = path.join(output, `issue14-${viewport.width}x${viewport.height}-main.png`);
      await page.screenshot({ path: mainShot, fullPage: true });

      await page.locator('#twist-button').click();
      await assertWhiteDialog(page, '#twist-dialog');
      await page.locator('.twist-row-toggle').filter({ hasText: 'Martial Pride' }).click();
      await page.locator('.twist-select').click();
      assert.equal(await page.locator('#twist-dialog-footer button').count(), 1);
      assert.equal(await page.locator('#twist-dialog-footer button').textContent(), 'Change');
      await page.locator('#twist-dialog-close').click();

      await page.locator('#terrain-rules-button').click();
      await assertWhiteDialog(page, '#terrain-rules-viewer');
      assert.equal(await page.locator('.terrain-footprints tbody tr').count(), 5);
      assert.match(await page.locator('#terrain-rules-content').textContent(), /Battlefields: Armageddon/);
      await page.locator('[data-lang="ru"]').click();
      assert.match(await page.locator('#terrain-rules-content').textContent(), /Рекомендуемые размеры зон террейна/);
      assert.equal(await page.locator('#terrain-rules-close').getAttribute('aria-label'), 'Закрыть');
      assert.equal(await page.locator('#terrain-rules-close').textContent(), '×');
      const closeBox = await page.locator('#terrain-rules-close').boundingBox();
      assert.ok(closeBox.width >= 44 && closeBox.height >= 44);
      if (viewport.width <= 412) {
        await page.locator('#terrain-rules-content').evaluate(node => { node.scrollTop = node.scrollHeight; });
        assert.ok(await page.locator('#terrain-rules-content').evaluate(node => node.scrollTop > 0));
      }
      await page.locator('#terrain-rules-close').click();
      await page.locator('[data-lang="en"]').click();

      for (const [open, dialog, close] of [
        ['#layout-key-button', '#layout-key-viewer', '#layout-key-close'],
        ['.map-button', '#viewer', '#close'],
        ['#free-layout-button', '#layout-gallery', '#layout-gallery-close'],
      ]) {
        await page.locator(open).click();
        await assertWhiteDialog(page, dialog);
        const box = await page.locator(close).boundingBox();
        assert.ok(box.width >= 44 && box.height >= 44, `${close} is smaller than 44px`);
        assert.equal(await page.locator(close).textContent(), '×');
        await page.locator(close).click();
      }

      const before = await page.locator('.map-button').evaluate(node => [
        node.style.getPropertyValue('--map-paper-size'),
        node.style.getPropertyValue('--map-paper-position'),
      ]);
      await page.locator('[data-layout="B"]').click();
      await page.locator('#map').evaluate(image => image.complete && image.naturalWidth ? true : new Promise(resolve => image.addEventListener('load', () => resolve(true), { once: true })));
      const after = await page.locator('.map-button').evaluate(node => [
        node.style.getPropertyValue('--map-paper-size'),
        node.style.getPropertyValue('--map-paper-position'),
      ]);
      assert.deepEqual(after, before, 'paper shifted while changing layout');
      assert.deepEqual(errors, []);
      assert.deepEqual(failures, []);
      await page.close();
    }
    console.log('issue #14 Playwright smoke passed: 7/7 viewports');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
```

- [ ] **Step 3: Run Playwright and inspect the visual evidence**

Run:

```powershell
$env:NODE_PATH='C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' 'D:\Temp\okami\wh40k-issue14-smoke.cjs'
```

Expected: `issue #14 Playwright smoke passed: 7/7 viewports`.

Inspect at minimum these latest images with the image viewer:

```text
output/playwright/issue14-412x915-main.png
output/playwright/issue14-1366x728-main.png
```

Acceptance is visual as well as automated: the paper must cover every viewport edge, the map's rectangular paper cutout must not be visible, stains next to the map must stay at the same scale, and white controls/dialogs must remain clearly separated. If either screenshot fails, Task 2 is still RED; do not proceed to packaging.

### Task 6: Final Verification, Packaging, GitHub Record, and Review

**Files:**
- No required source changes
- Update issue #14 and open/update the branch pull request

- [ ] **Step 1: Invoke the required completion skills**

Before claiming completion, invoke `verification-before-completion`. Before opening the final PR, invoke `requesting-code-review` and address any valid findings with a new failing test first.

- [ ] **Step 2: Run the complete fresh verification set**

Run:

```powershell
npm.cmd test
git diff --check origin/main...HEAD
git status --short
```

Expected: all Node tests pass; committed diff has no whitespace errors; only the user's pre-existing `.gitignore`, `.superpowers/`, and `ключ пароль.txt` remain dirty/untracked.

- [ ] **Step 3: Build Windows x64 and Android ARM64 packages**

Run:

```powershell
npm.cmd run dist
npm.cmd run android:build
```

Expected: Tauri produces a Windows x64 executable/NSIS installer and an ARM64 APK without missing-asset errors. Do not bump or publish a version in this task.

- [ ] **Step 4: Record artifact paths, sizes, and SHA-256 hashes**

Resolve the newest outputs and hash them:

```powershell
$windowsExe = Get-ChildItem -Path 'src-tauri\target\release' -Filter '*.exe' | Where-Object Name -NotLike '*setup*' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$windowsInstaller = Get-ChildItem -Path 'src-tauri\target\release\bundle\nsis' -Filter '*.exe' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$androidApk = Get-ChildItem -Path 'src-tauri\gen\android\app\build\outputs\apk' -Recurse -Filter '*.apk' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$windowsExe,$windowsInstaller,$androidApk | ForEach-Object {
  $hash = Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName
  [pscustomobject]@{ Path=$_.FullName; Bytes=$_.Length; SHA256=$hash.Hash }
}
```

Expected: three non-empty artifacts and three SHA-256 values.

- [ ] **Step 5: Push the implementation branch and open a draft PR**

Run:

```powershell
git push
gh pr create --repo okami69/WH40K-Terrain-Layout --base main --head codex/issue-14-paper-background-close-controls --draft --title "Polish paper background and dialog references" --body "Closes #14

Implements the approved authentic paper background, one-cross dialog controls, selected-Twist close de-duplication, and bilingual semantic Terrain Layout reference.

Verification evidence and package hashes are recorded on issue #14."
```

If a PR already exists, use `gh pr edit` to update its title/body instead of creating a duplicate.

- [ ] **Step 6: Update issue #14 with reality**

Post one issue comment containing:

```text
- final commit and draft PR URL;
- Node pass count;
- Playwright 7/7 viewport result;
- inspected desktop/mobile screenshot paths;
- Windows EXE/installer and Android APK paths, byte sizes, and SHA-256 hashes;
- confirmation that the paper request returned HTTP 200, all dialogs remained white, every close target was 44 x 44, and Terrain Layout rendered in RU/ENG;
- any remaining physical-device review, if the user has not yet installed this build.
```

Do not close issue #14 or mark the PR ready until the user accepts the rendered background on the intended physical Android device.
