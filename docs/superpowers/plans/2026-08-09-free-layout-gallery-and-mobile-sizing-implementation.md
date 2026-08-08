# Free Layout Gallery And Portrait Map Sizing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a contained gallery for freely selecting any bundled terrain map, enlarge and top-align the portrait-mobile map, and center expanded Force Disposition labels without changing mission selection behavior.

**Architecture:** Extend `app/matchups.js` with one flat, validated catalog derived from the existing 15 matchups plus explicit deployment metadata. Keep UI state and DOM wiring in the existing dependency-free `app/app.js`; use the existing native dialog pattern for the only scroll container. Preserve the fixed desktop sheet and switch to a taller, top-aligned logical sheet only at portrait phone widths.

**Tech Stack:** Plain HTML, CSS, JavaScript ES modules, Node's built-in test runner, native `<dialog>` and `<select>`, Tauri 2, external Playwright smoke runner.

**Source:** `docs/superpowers/specs/2026-08-08-free-layout-gallery-and-mobile-sizing-design.md`, GitHub issue #8, Event Companion v1.1.

---

## File Structure

- Modify `app/matchups.js`: own canonical matchup data, deployment metadata, and the derived 45-entry map catalog.
- Modify `app/app.js`: own official/free map state, gallery rendering, selection behavior, localization, and active-map rendering.
- Modify `app/index.html`: add the plus control, free-map source label, and contained gallery dialog.
- Modify `app/styles.css`: style the gallery, portrait sheet geometry, larger map, and centered native option labels.
- Modify `test/matchups.test.js`: verify catalog identity, metadata, and group counts.
- Modify `test/assets.test.js`: verify every catalog image exists and is unique.
- Modify `test/ui.test.js`: protect gallery semantics, single-scroll ownership, responsive sheet dimensions, and select alignment.
- Modify `README.md`: document free map selection and the portrait behavior after verification.
- Create temporary `D:\Temp\okami\wh40k-layout-gallery-smoke.cjs`: run browser behavior and responsive geometry checks; never commit it.

### Task 1: Build The 45-Map Catalog

**Files:**
- Modify: `app/matchups.js`
- Modify: `test/matchups.test.js`
- Modify: `test/assets.test.js`

- [ ] **Step 1: Write failing catalog tests**

Extend the import in `test/matchups.test.js` with `deployments` and `layoutCatalog`, then add:

```js
test('catalogs all 45 layouts by deployment', () => {
  assert.deepEqual(deployments, [
    'crucible-of-battle',
    'dawn-of-war',
    'hammer-and-anvil',
    'search-and-destroy',
    'sweeping-engagement',
    'tipping-point',
  ]);

  assert.equal(layoutCatalog.length, 45);
  assert.equal(new Set(layoutCatalog.map(item => item.id)).size, 45);
  assert.equal(new Set(layoutCatalog.map(item => item.image)).size, 45);
  assert.deepEqual(
    Object.fromEntries(deployments.map(deployment => [
      deployment,
      layoutCatalog.filter(item => item.deployment === deployment).length,
    ])),
    {
      'crucible-of-battle': 7,
      'dawn-of-war': 6,
      'hammer-and-anvil': 5,
      'search-and-destroy': 8,
      'sweeping-engagement': 9,
      'tipping-point': 10,
    },
  );

  for (const item of layoutCatalog) {
    assert.ok(matchups.some(matchup => matchup.slug === item.slug), item.slug);
    assert.ok(['A', 'B', 'C'].includes(item.layout), item.id);
    assert.ok(deployments.includes(item.deployment), item.id);
    assert.equal(item.id, `${item.slug}-${item.layout.toLowerCase()}`);
    assert.equal(item.image, `assets/layouts/${item.id}.webp`);
  }
});
```

Change `test/assets.test.js` to import `layoutCatalog` and add:

```js
test('every gallery catalog entry has a bundled non-empty image', () => {
  for (const item of layoutCatalog) {
    const path = `app/${item.image}`;
    assert.ok(existsSync(path), `Missing ${path}`);
    assert.ok(statSync(path).size > 0, `Empty ${path}`);
  }
});
```

- [ ] **Step 2: Run the focused tests and verify the red state**

Run: `node --test test/matchups.test.js test/assets.test.js`

Expected: FAIL because `deployments` and `layoutCatalog` are not exported.

- [ ] **Step 3: Add deployment metadata and derive the catalog**

Append this data after `matchups` and before `resolveMatchup` in `app/matchups.js`:

```js
export const deployments = [
  'crucible-of-battle',
  'dawn-of-war',
  'hammer-and-anvil',
  'search-and-destroy',
  'sweeping-engagement',
  'tipping-point',
];

const deploymentByLayout = Object.fromEntries([
  ['crucible-of-battle', [
    'disruption--disruption-a',
    'priority-assets--priority-assets-b',
    'purge-the-foe--reconnaissance-c',
    'reconnaissance--priority-assets-a',
    'reconnaissance--reconnaissance-b',
    'take-and-hold--disruption-b',
    'take-and-hold--priority-assets-a',
  ]],
  ['dawn-of-war', [
    'disruption--reconnaissance-b',
    'purge-the-foe--priority-assets-a',
    'purge-the-foe--reconnaissance-b',
    'take-and-hold--priority-assets-c',
    'take-and-hold--reconnaissance-b',
    'take-and-hold--take-and-hold-b',
  ]],
  ['hammer-and-anvil', [
    'purge-the-foe--priority-assets-c',
    'purge-the-foe--reconnaissance-a',
    'take-and-hold--disruption-c',
    'take-and-hold--priority-assets-b',
    'take-and-hold--purge-the-foe-c',
  ]],
  ['search-and-destroy', [
    'disruption--priority-assets-c',
    'disruption--reconnaissance-c',
    'purge-the-foe--disruption-a',
    'purge-the-foe--priority-assets-b',
    'purge-the-foe--purge-the-foe-a',
    'take-and-hold--purge-the-foe-b',
    'take-and-hold--reconnaissance-c',
    'take-and-hold--take-and-hold-c',
  ]],
  ['sweeping-engagement', [
    'disruption--disruption-c',
    'disruption--priority-assets-a',
    'priority-assets--priority-assets-a',
    'purge-the-foe--disruption-c',
    'purge-the-foe--purge-the-foe-c',
    'reconnaissance--priority-assets-c',
    'reconnaissance--reconnaissance-a',
    'take-and-hold--disruption-a',
    'take-and-hold--purge-the-foe-a',
  ]],
  ['tipping-point', [
    'disruption--disruption-b',
    'disruption--priority-assets-b',
    'disruption--reconnaissance-a',
    'priority-assets--priority-assets-c',
    'purge-the-foe--disruption-b',
    'purge-the-foe--purge-the-foe-b',
    'reconnaissance--priority-assets-b',
    'reconnaissance--reconnaissance-c',
    'take-and-hold--reconnaissance-a',
    'take-and-hold--take-and-hold-a',
  ]],
].flatMap(([deployment, ids]) => ids.map(id => [id, deployment])));

export const layoutCatalog = matchups.flatMap(matchup => ['A', 'B', 'C'].map(layout => {
  const id = `${matchup.slug}-${layout.toLowerCase()}`;
  const deployment = deploymentByLayout[id];
  if (!deployment) throw new Error(`Missing deployment metadata: ${id}`);
  return {
    id,
    slug: matchup.slug,
    left: matchup.left,
    right: matchup.right,
    layout,
    deployment,
    image: `assets/layouts/${id}.webp`,
  };
}));
```

- [ ] **Step 4: Run focused and full tests**

Run: `node --test test/matchups.test.js test/assets.test.js`

Expected: all focused tests PASS and report 45 unique entries.

Run: `npm.cmd test`

Expected: full Node suite PASS with zero failures.

- [ ] **Step 5: Commit the catalog**

```powershell
git add app/matchups.js test/matchups.test.js test/assets.test.js
git commit -m "feat: catalog free terrain layouts refs #8"
```

### Task 2: Add The Contained Large-Preview Gallery

**Files:**
- Modify: `app/index.html`
- Modify: `app/styles.css`
- Modify: `app/app.js`
- Modify: `test/ui.test.js`

- [ ] **Step 1: Add failing structural tests for the gallery**

Add these checks to the compact UI test in `test/ui.test.js`:

```js
assert.match(html, /<button[^>]+id="free-layout-button"[^>]+aria-pressed="false"[^>]*>\+<\/button>/);
assert.match(html, /<p[^>]+id="layout-source"[^>]+hidden/);
assert.match(html, /<dialog[^>]+id="layout-gallery"[^>]+aria-labelledby="layout-gallery-title"/);
assert.match(html, /<div[^>]+id="layout-gallery-scroll"[^>]+class="layout-gallery-scroll"/);
assert.match(html, /<button[^>]+id="layout-gallery-close"/);
assert.match(css, /\.layout-gallery-scroll\s*\{[\s\S]*overflow-y:\s*auto/);
assert.match(css, /\.layout-gallery-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
assert.match(css, /@media[^\{]+max-width:\s*600px[\s\S]*\.layout-gallery-grid\s*\{[\s\S]*grid-template-columns:\s*1fr/);
assert.match(js, /layoutCatalog/);
assert.match(js, /loading\s*=\s*'lazy'/);
assert.match(js, /decoding\s*=\s*'async'/);
```

- [ ] **Step 2: Run the UI test and verify the red state**

Run: `node --test test/ui.test.js`

Expected: FAIL on the missing `free-layout-button`.

- [ ] **Step 3: Add gallery markup**

Add the plus control after C in `app/index.html`:

```html
<button id="free-layout-button" type="button" aria-pressed="false" aria-label="Choose any layout">+</button>
```

Add the source label under `#layout-title`:

```html
<p id="layout-source" class="layout-source" hidden></p>
```

Add this dialog after the existing map viewer:

```html
<dialog id="layout-gallery" class="layout-gallery" aria-labelledby="layout-gallery-title">
  <header>
    <h2 id="layout-gallery-title">Choose any layout</h2>
    <button id="layout-gallery-close" type="button">Close</button>
  </header>
  <div id="layout-gallery-scroll" class="layout-gallery-scroll"></div>
</dialog>
```

- [ ] **Step 4: Add gallery localization and rendering**

Import `deployments` and `layoutCatalog` in `app/app.js`. Add localized deployment names and copy to each language object:

```js
const deploymentNames = {
  'crucible-of-battle': { ru: 'Горнило битвы', en: 'Crucible of Battle' },
  'dawn-of-war': { ru: 'Рассвет войны', en: 'Dawn of War' },
  'hammer-and-anvil': { ru: 'Молот и наковальня', en: 'Hammer and Anvil' },
  'search-and-destroy': { ru: 'Найти и уничтожить', en: 'Search and Destroy' },
  'sweeping-engagement': { ru: 'Охватывающее сражение', en: 'Sweeping Engagement' },
  'tipping-point': { ru: 'Переломный момент', en: 'Tipping Point' },
};
```

```js
freeLayout: 'Свободная расстановка',
chooseFreeLayout: 'Выбрать любую расстановку',
galleryTitle: 'Все расстановки',
layoutSource: (leftLabel, rightLabel, value) => `${leftLabel} / ${rightLabel} · Расстановка ${value}`,
```

```js
freeLayout: 'Free layout',
chooseFreeLayout: 'Choose any layout',
galleryTitle: 'All layouts',
layoutSource: (leftLabel, rightLabel, value) => `${leftLabel} / ${rightLabel} · Layout ${value}`,
```

Cache the new elements and add session state:

```js
const freeLayoutButton = document.querySelector('#free-layout-button');
const layoutSource = document.querySelector('#layout-source');
const layoutGallery = document.querySelector('#layout-gallery');
const layoutGalleryTitle = document.querySelector('#layout-gallery-title');
const layoutGalleryScroll = document.querySelector('#layout-gallery-scroll');
let mapMode = 'official';
let freeMap = null;
```

Add these functions before `render()`:

```js
function sourceText(item) {
  return text[language].layoutSource(
    labels[item.left][language],
    labels[item.right][language],
    item.layout,
  );
}

function renderGallery() {
  layoutGalleryScroll.replaceChildren(...deployments.map(deployment => {
    const section = document.createElement('section');
    const heading = document.createElement('h3');
    const grid = document.createElement('div');
    heading.textContent = deploymentNames[deployment][language];
    grid.className = 'layout-gallery-grid';

    for (const item of layoutCatalog.filter(candidate => candidate.deployment === deployment)) {
      const button = document.createElement('button');
      const image = document.createElement('img');
      const label = document.createElement('span');
      const failure = document.createElement('span');
      button.type = 'button';
      button.className = 'layout-gallery-card';
      button.dataset.layoutId = item.id;
      button.setAttribute('aria-pressed', String(freeMap?.id === item.id));
      image.src = item.image;
      image.alt = sourceText(item);
      image.loading = 'lazy';
      image.decoding = 'async';
      label.textContent = sourceText(item);
      failure.className = 'gallery-error';
      failure.textContent = text[language].missingImage(item.layout);
      failure.hidden = true;
      image.addEventListener('error', () => {
        image.hidden = true;
        failure.hidden = false;
        button.disabled = true;
      });
      button.addEventListener('click', () => {
        freeMap = item;
        mapMode = 'free';
        layoutGallery.close();
        render();
      });
      button.append(image, label, failure);
      grid.append(button);
    }

    section.append(heading, grid);
    return section;
  }));
}

function openGallery() {
  renderGallery();
  layoutGallery.showModal();
  layoutGallery.querySelector('[aria-pressed="true"]')?.scrollIntoView({ block: 'nearest' });
}
```

Add gallery copy updates inside `render()` and attach listeners:

```js
freeLayoutButton.setAttribute('aria-label', copy.chooseFreeLayout);
layoutGalleryTitle.textContent = copy.galleryTitle;
document.querySelector('#layout-gallery-close').textContent = copy.close;
```

```js
freeLayoutButton.addEventListener('click', openGallery);
document.querySelector('#layout-gallery-close').addEventListener('click', () => layoutGallery.close());
setDialogBackdropClose(layoutGallery);
```

- [ ] **Step 5: Implement official/free rendering behavior**

In `render()`, keep mission resolution based only on `left.value` and `right.value`, then choose the visible map independently:

```js
const item = mapMode === 'free' ? freeMap : null;
const image = item?.image ?? matchup.image(layout);
const source = item ? sourceText(item) : '';
const alt = item
  ? `${copy.freeLayout}: ${source}`
  : copy.mapAlt(leftLabel, rightLabel, layout);

title.textContent = item ? copy.freeLayout : copy.layout(layout);
viewerTitle.textContent = item ? `${copy.freeLayout}: ${source}` : copy.layout(layout);
layoutSource.textContent = source;
layoutSource.hidden = !item;
freeLayoutButton.setAttribute('aria-pressed', String(Boolean(item)));
for (const button of layoutButtons) {
  button.setAttribute('aria-pressed', String(!item && button.dataset.layout === layout));
}
```

Update the A/B/C listener so it explicitly exits free mode:

```js
for (const button of layoutButtons) {
  button.addEventListener('click', () => {
    mapMode = 'official';
    layout = button.dataset.layout;
    render();
  });
}
```

Do not change the two disposition listeners: their existing `render()` calls update missions, while the new `mapMode` branch preserves `freeMap`.

- [ ] **Step 6: Style large previews and the single scroll surface**

Add to `app/styles.css`:

```css
.layout-source {
  margin: -2px 0 6px;
  color: var(--muted-ink);
  font-size: 0.85rem;
  font-weight: 700;
}

.layout-gallery {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  overflow: hidden;
}

.layout-gallery:not([open]) {
  display: none;
}

.layout-gallery-scroll {
  min-height: 0;
  padding-right: 4px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.layout-gallery-scroll h3 {
  margin: 18px 0 8px;
  text-align: left;
  text-transform: uppercase;
}

.layout-gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.layout-gallery-card {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding: 10px;
  font-weight: 800;
  line-height: 1.25;
}

.layout-gallery-card[aria-pressed="true"] {
  border: 3px solid var(--primary);
}

.layout-gallery-card img {
  display: block;
  width: 100%;
  height: auto;
}

.gallery-error {
  padding: 12px;
  color: var(--primary-dark);
  background: var(--error-bg);
}

@media (max-width: 600px) {
  .layout-gallery-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Run UI and full tests, then commit**

Run: `node --test test/ui.test.js`

Expected: PASS.

Run: `npm.cmd test`

Expected: full Node suite PASS with zero failures.

```powershell
git add app/index.html app/styles.css app/app.js test/ui.test.js
git commit -m "feat: add free layout gallery refs #8"
```

### Task 3: Enlarge The Portrait Map And Center Disposition Options

**Files:**
- Modify: `app/styles.css`
- Modify: `app/app.js`
- Modify: `test/ui.test.js`

- [ ] **Step 1: Add failing static geometry and alignment checks**

Replace the old fixed-dimension assertions in `test/ui.test.js` with:

```js
assert.match(css, /--sheet-width:\s*768px/);
assert.match(css, /--sheet-height:\s*1080px/);
assert.match(css, /\.stage\s*\{[\s\S]*var\(--sheet-width\)[\s\S]*var\(--sheet-height\)/);
assert.match(css, /@media \(orientation: portrait\) and \(max-width: 600px\)/);
assert.match(css, /@media \(orientation: portrait\) and \(max-width: 600px\)[\s\S]*--sheet-height:\s*1280px/);
assert.match(css, /@media \(orientation: portrait\) and \(max-width: 600px\)[\s\S]*place-items:\s*start center/);
assert.match(css, /@media \(orientation: portrait\) and \(max-width: 600px\)[\s\S]*#map[\s\S]*height:\s*auto/);
assert.match(js, /sheetStyle\.width/);
assert.match(js, /sheetStyle\.height/);
assert.match(css, /\.disposition-select option\s*\{[\s\S]*text-align:\s*center/);
assert.match(css, /text-align-last:\s*center/);
```

- [ ] **Step 2: Run the UI test and verify the red state**

Run: `node --test test/ui.test.js`

Expected: FAIL because the logical sheet CSS variables do not exist.

- [ ] **Step 3: Make sheet fitting use active logical dimensions**

Add logical dimensions to `:root` and replace literal sheet dimensions:

```css
:root {
  --sheet-width: 768px;
  --sheet-height: 1080px;
}

.stage {
  width: calc(var(--sheet-width) * var(--sheet-scale));
  height: calc(var(--sheet-height) * var(--sheet-scale));
}

.app-sheet {
  width: var(--sheet-width);
  height: var(--sheet-height);
}
```

Replace the scale calculation in `fitSheet()`:

```js
const sheetStyle = getComputedStyle(document.querySelector('#sheet'));
const sheetWidth = cssPixels(sheetStyle.width);
const sheetHeight = cssPixels(sheetStyle.height);
const scale = Math.min(availableWidth / sheetWidth, availableHeight / sheetHeight);
```

- [ ] **Step 4: Add the portrait-only natural-size map**

Append this media query after the base map rules:

```css
@media (orientation: portrait) and (max-width: 600px) {
  :root {
    --sheet-height: 1280px;
  }

  body {
    place-items: start center;
  }

  .map-panel {
    height: auto;
  }

  .map-button {
    height: auto;
  }

  #map,
  .map-button img {
    width: 100%;
    height: auto;
    max-height: none;
  }
}
```

Keep desktop `.map-panel`, `.map-button`, and map height declarations unchanged outside this media query.

- [ ] **Step 5: Center both closed and expanded disposition labels**

Extend the existing select rule and add the option rule:

```css
.disposition-select {
  text-align: center;
  text-align-last: center;
}

.disposition-select option {
  text-align: center;
}
```

Do not replace the native select or alter its arrow, padding, dimensions, or events.

- [ ] **Step 6: Run focused and full tests, then commit**

Run: `node --test test/ui.test.js`

Expected: PASS.

Run: `npm.cmd test`

Expected: full Node suite PASS with zero failures.

```powershell
git add app/styles.css app/app.js test/ui.test.js
git commit -m "fix: enlarge portrait layouts and center options refs #8"
```

### Task 4: Verify Real Gallery Behavior And Responsive Geometry

**Files:**
- Create temporarily: `D:\Temp\okami\wh40k-layout-gallery-smoke.cjs`
- Modify after successful checks: `README.md`

- [ ] **Step 1: Restore dependencies and start the local static frontend**

Run: `npm.cmd install`

Expected: install succeeds and `package-lock.json` remains unchanged.

Start the static server in a hidden background process:

```powershell
Start-Process -FilePath 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -ArgumentList @('-m','http.server','8891','--bind','127.0.0.1','--directory','D:\WH40K Terrain Layout\app') -WindowStyle Hidden -RedirectStandardOutput 'D:\Temp\okami\wh40k-gallery-server.log' -RedirectStandardError 'D:\Temp\okami\wh40k-gallery-server.err.log' -PassThru
```

Expected: `http://127.0.0.1:8891/` returns the app.

- [ ] **Step 2: Write the failing Playwright behavior check before relying on the UI**

Create `D:\Temp\okami\wh40k-layout-gallery-smoke.cjs` with the external Playwright runtime used by prior project smoke checks. For each viewport `320 x 568`, `360 x 800`, `412 x 915`, `480 x 1040`, and `900 x 1000`, assert:

```js
const initialLeft = await page.locator('#left').inputValue();
const initialRight = await page.locator('#right').inputValue();
const initialMission = await page.locator('#left-mission').textContent();

await page.locator('#free-layout-button').click();
if (!await page.locator('#layout-gallery').evaluate(dialog => dialog.open)) throw new Error('gallery closed');
if (await page.locator('#layout-gallery-scroll').evaluate(node => getComputedStyle(node).overflowY) !== 'auto') throw new Error('gallery does not own scroll');
if (await page.locator('body').evaluate(node => getComputedStyle(node).overflow) !== 'hidden') throw new Error('body scroll enabled');
if (await page.locator('.layout-gallery-card').count() !== 45) throw new Error('catalog count');

const dialogBox = await page.locator('#layout-gallery').boundingBox();
if (!dialogBox || dialogBox.y < 0 || dialogBox.y + dialogBox.height > page.viewportSize().height) throw new Error('gallery outside viewport');

const card = page.locator('[data-layout-id="take-and-hold--take-and-hold-a"]');
const imageBox = await card.locator('img').boundingBox();
if (!imageBox || imageBox.width < (page.viewportSize().width <= 600 ? 220 : 260)) throw new Error('preview too small');
await card.click();

if (await page.locator('#left').inputValue() !== initialLeft) throw new Error('free map changed left disposition');
if (await page.locator('#right').inputValue() !== initialRight) throw new Error('free map changed right disposition');
if (await page.locator('#left-mission').textContent() !== initialMission) throw new Error('free map changed mission');
if (await page.locator('#free-layout-button').getAttribute('aria-pressed') !== 'true') throw new Error('free mode inactive');

await page.locator('#left').selectOption('take-and-hold');
if (!await page.locator('#map').getAttribute('src').then(src => src.endsWith('take-and-hold--take-and-hold-a.webp'))) throw new Error('free map did not persist');
await page.locator('[data-layout="B"]').click();
if (!await page.locator('#map').getAttribute('src').then(src => src.endsWith('-b.webp'))) throw new Error('official B not restored');

await page.locator('#free-layout-button').click();
if (await page.locator('[data-layout-id="take-and-hold--take-and-hold-a"]').getAttribute('aria-pressed') !== 'true') throw new Error('previous free map not selected');
await page.keyboard.press('Escape');
```

Also record the sheet and map rectangles. At widths up to 600, require the sheet top to equal the top safe-area content origin within one pixel and the visible map width to be greater than its pre-change baseline. At 900 x 1000, require the existing desktop map height to remain 600 logical pixels after undoing `--sheet-scale`.

Run the smoke once before implementation is complete whenever possible; expected red state is a missing plus control or gallery. After Tasks 1-3, rerun and require `layout gallery smoke passed` with zero page errors.

- [ ] **Step 3: Manually confirm native expanded select alignment**

Open both Force Disposition selects in the Windows Tauri application and the physical Android build. Confirm every option label is horizontally centered. Browser automation cannot reliably screenshot the operating system's native expanded select surface, so record this as a manual platform check in issue #8.

If Android replaces the HTML popup with a system-owned selection surface that ignores option CSS, record the platform limitation; do not build a custom dropdown unless the user separately approves that scope expansion.

- [ ] **Step 4: Update the README after checks pass**

Add to the feature list in `README.md`:

```markdown
- Opens a large-preview gallery to use any of the 45 bundled terrain maps without changing the selected missions.
- Uses a denser portrait-phone layout so the main map fills more of the available screen.
```

Add to the Use section after choosing A/B/C:

```markdown
3. Use `+` to open the scrollable all-layout gallery; choosing a free map does not change either Force Disposition or mission.
```

Renumber the remaining steps.

- [ ] **Step 5: Run all tests and commit documentation**

Run: `npm.cmd test`

Expected: full Node suite PASS with zero failures.

```powershell
git add README.md
git commit -m "docs: describe free layout selection refs #8"
```

### Task 5: Package, Record, And Publish The Verified Change

**Files:**
- No source files unless verification exposes a defect.
- Update: GitHub issue #8.

- [ ] **Step 1: Run fresh complete verification**

Run: `npm.cmd test`

Expected: all Node tests PASS with zero failures.

Run:

```powershell
$env:NODE_PATH='D:\Temp\okami\pw-smoke\node_modules'
node 'D:\Temp\okami\wh40k-layout-gallery-smoke.cjs'
```

Expected: `layout gallery smoke passed`, with all five viewports, 45 cards, free-map persistence, official-mode restoration, contained scrolling, and zero console errors.

- [ ] **Step 2: Build both supported application packages**

Run: `npm.cmd run dist`

Expected: tests pass again and Tauri produces a Windows NSIS installer under `src-tauri/target/release/bundle/nsis/`.

Run: `npm.cmd run android:build`

Expected: Tauri produces a signed ARM64 APK under `src-tauri/gen/android/app/build/outputs/apk/arm64/release/` using the existing ignored signing configuration.

- [ ] **Step 3: Perform the physical Android smoke check**

Install the newly built APK as an upgrade on the current physical Android test phone. Verify:

- the main sheet begins below the status-bar safe area;
- selector cards remain usable and mission popovers stay attached;
- the map is visibly larger than v0.3.0 and is not clipped;
- the gallery stays inside the app, is the only scrolling surface, and reaches Tipping Point;
- gallery previews are readable before selection;
- free-map selection survives disposition changes and A/B/C returns to official mode;
- expanded disposition option labels are centered where Android permits HTML option styling.

- [ ] **Step 4: Inspect the final diff and repository state**

Run:

```powershell
git diff --check
git status --short
git log -5 --oneline
```

Expected: no whitespace errors; only known user-owned unrelated files remain uncommitted; feature commits reference #8.

- [ ] **Step 5: Record evidence in GitHub issue #8**

Post exact Node test counts, Playwright viewport results, Windows installer path and size, Android APK path/signature result, physical-device findings, and any native option-styling limitation. Do not close the issue until every approved acceptance criterion is evidenced.

- [ ] **Step 6: Push the completed branch**

Run: `git push origin <current-branch>`

Expected: the remote branch contains every verified feature commit and GitHub issue #8 links to the final commit or pull request.
