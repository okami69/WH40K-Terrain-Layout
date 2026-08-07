# WH40K Terrain Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an offline Windows application that derives two missions from a selected Force Disposition pair and displays the selected official A, B, or C terrain layout.

**Architecture:** Keep the product as a plain responsive web application with one static mapping module and local image assets. Electron is only a thin Windows shell and packager, preserving the same UI for a later Capacitor Android wrapper.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Node.js built-in test runner, Electron 43.3.0, electron-builder 26.15.3, Python/PDFium only for one-time asset extraction.

**GitHub:** Issue `okami69/WH40K-Terrain-Layout#1` tracks implementation and acceptance criteria.

---

## File map

- `AGENTS.md` - durable requirement to use Superpowers and Ponytail workflows.
- `.gitignore` - excludes dependencies, builds, temporary renders, and source PDFs.
- `package.json` - scripts, Electron dependency, and Windows packaging configuration.
- `electron/main.cjs` - secure desktop window that loads the static app.
- `app/index.html` - one-screen semantic UI.
- `app/styles.css` - responsive Warhammer-inspired presentation.
- `app/matchups.js` - the complete 15-pair source of truth and lookup functions.
- `app/app.js` - DOM wiring and rendering only.
- `app/assets/layouts/*.png` - 45 cropped maps from Event Companion v1.1.
- `tools/extract_layouts.py` - reproducible one-time PDF crop script.
- `tools/requirements.txt` - pinned extraction-only Python packages.
- `test/matchups.test.js` - mapping and reverse-selection checks.
- `test/assets.test.js` - all 45 image assets exist.

### Task 1: Project guardrails and local dependencies

**Files:**
- Create: `AGENTS.md`
- Create: `.gitignore`
- Create: `package.json`

- [ ] **Step 1: Add project workflow instructions**

```markdown
# Project Instructions

- Invoke `using-superpowers` before project work.
- Keep `ponytail` active at `full` intensity for all design and coding work.
- Use `test-driven-development` for features and fixes.
- Use `verification-before-completion` before claiming a task is complete.
- Use `pdf` when extracting or checking source layouts and `playwright` for final responsive UI checks.
- Treat GitHub issue #1, the approved design spec, and Event Companion v1.1 as sources of truth.
- Do not use the older June Event Companion.
```

- [ ] **Step 2: Ignore generated and local-only files**

```gitignore
node_modules/
dist/
tmp/
*.pdf
```

- [ ] **Step 3: Add the minimal Node/Electron manifest**

```json
{
  "name": "wh40k-terrain-layout",
  "version": "0.1.0",
  "private": true,
  "description": "Offline Warhammer 40,000 terrain layout selector",
  "main": "electron/main.cjs",
  "scripts": {
    "start": "electron .",
    "test": "node --test",
    "dist": "npm test && electron-builder --win nsis"
  },
  "devDependencies": {
    "electron": "43.3.0",
    "electron-builder": "26.15.3"
  },
  "build": {
    "appId": "com.okami69.wh40kterrainlayout",
    "productName": "WH40K Terrain Layout",
    "files": [
      "app/**/*",
      "electron/**/*",
      "package.json"
    ],
    "win": {
      "target": "nsis"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

- [ ] **Step 4: Install project-local packages**

Run: `npm install`

Expected: `node_modules/` and `package-lock.json` are created; audit completes without an install error.

- [ ] **Step 5: Verify tool versions**

Run: `node --version; npm exec electron -- --version; npm exec electron-builder -- --version`

Expected: Node prints a version, Electron prints `v43.3.0`, and electron-builder prints `26.15.3`.

- [ ] **Step 6: Commit**

```powershell
git add AGENTS.md .gitignore package.json package-lock.json
git commit -m "chore: set up desktop app tooling refs #1"
```

### Task 2: Matchup data and lookup logic

**Files:**
- Create: `test/matchups.test.js`
- Create: `app/matchups.js`

- [ ] **Step 1: Write the failing mapping tests**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { dispositions, matchups, resolveMatchup } from '../app/matchups.js';

test('covers every ordered disposition selection', () => {
  assert.equal(dispositions.length, 5);
  assert.equal(matchups.length, 15);
  for (const left of dispositions) {
    for (const right of dispositions) {
      const result = resolveMatchup(left, right);
      assert.ok(result.leftMission);
      assert.ok(result.rightMission);
      assert.match(result.image('A'), /-a\.png$/);
      assert.match(result.image('B'), /-b\.png$/);
      assert.match(result.image('C'), /-c\.png$/);
    }
  }
});

test('swaps missions but not the map when selection order is reversed', () => {
  const forward = resolveMatchup('disruption', 'priority-assets');
  const reverse = resolveMatchup('priority-assets', 'disruption');
  assert.equal(forward.leftMission, 'Locate and Deny');
  assert.equal(forward.rightMission, 'Extract Relic');
  assert.equal(reverse.leftMission, 'Extract Relic');
  assert.equal(reverse.rightMission, 'Locate and Deny');
  assert.equal(forward.image('C'), reverse.image('C'));
});

test('rejects an unknown disposition or layout', () => {
  assert.throws(() => resolveMatchup('unknown', 'disruption'), /Unknown matchup/);
  assert.throws(() => resolveMatchup('disruption', 'priority-assets').image('D'), /Unknown layout/);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- test/matchups.test.js`

Expected: FAIL because `app/matchups.js` does not exist.

- [ ] **Step 3: Implement the complete mapping module**

```js
export const dispositions = [
  'take-and-hold',
  'purge-the-foe',
  'disruption',
  'reconnaissance',
  'priority-assets',
];

export const labels = {
  'take-and-hold': 'Take and Hold',
  'purge-the-foe': 'Purge the Foe',
  disruption: 'Disruption',
  reconnaissance: 'Reconnaissance',
  'priority-assets': 'Priority Assets',
};

export const matchups = [
  ['take-and-hold', 'take-and-hold', 'Battlefield Dominance', 'Battlefield Dominance', 'take-and-hold--take-and-hold'],
  ['take-and-hold', 'purge-the-foe', 'Immovable Object', 'Unstoppable Force', 'take-and-hold--purge-the-foe'],
  ['take-and-hold', 'disruption', 'Determined Acquisition', 'Death Trap', 'take-and-hold--disruption'],
  ['take-and-hold', 'reconnaissance', 'Purge and Secure', 'Reconnaissance Sweep', 'take-and-hold--reconnaissance'],
  ['take-and-hold', 'priority-assets', 'Inescapable Dominion', 'Secure Asset', 'take-and-hold--priority-assets'],
  ['purge-the-foe', 'purge-the-foe', 'Meatgrinder', 'Meatgrinder', 'purge-the-foe--purge-the-foe'],
  ['purge-the-foe', 'disruption', 'Punishment', 'Delaying Action', 'purge-the-foe--disruption'],
  ['purge-the-foe', 'reconnaissance', 'Consecrate', 'Triangulation', 'purge-the-foe--reconnaissance'],
  ['purge-the-foe', 'priority-assets', "Destroyer's Wrath", 'Vital Link', 'purge-the-foe--priority-assets'],
  ['disruption', 'disruption', 'Outmanoeuvre', 'Outmanoeuvre', 'disruption--disruption'],
  ['disruption', 'reconnaissance', 'Smoke and Mirrors', 'Surveil the Foe', 'disruption--reconnaissance'],
  ['disruption', 'priority-assets', 'Locate and Deny', 'Extract Relic', 'disruption--priority-assets'],
  ['reconnaissance', 'reconnaissance', 'Gather Intel', 'Gather Intel', 'reconnaissance--reconnaissance'],
  ['reconnaissance', 'priority-assets', 'Search and Scour', 'Vanguard Operation', 'reconnaissance--priority-assets'],
  ['priority-assets', 'priority-assets', 'Sabotage', 'Sabotage', 'priority-assets--priority-assets'],
].map(([left, right, leftMission, rightMission, slug]) => ({ left, right, leftMission, rightMission, slug }));

export function resolveMatchup(left, right) {
  const match = matchups.find(item => item.left === left && item.right === right);
  const reverse = matchups.find(item => item.left === right && item.right === left);
  const item = match || reverse;
  if (!item) throw new Error(`Unknown matchup: ${left} vs ${right}`);
  const swapped = !match;
  return {
    leftMission: swapped ? item.rightMission : item.leftMission,
    rightMission: swapped ? item.leftMission : item.rightMission,
    image(layout) {
      if (!['A', 'B', 'C'].includes(layout)) throw new Error(`Unknown layout: ${layout}`);
      return `assets/layouts/${item.slug}-${layout.toLowerCase()}.png`;
    },
  };
}
```

- [ ] **Step 4: Run the test and verify success**

Run: `npm test -- test/matchups.test.js`

Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```powershell
git add app/matchups.js test/matchups.test.js
git commit -m "feat: add disposition matchup data refs #1"
```

### Task 3: Extract the 45 map assets from PDF v1.1

**Files:**
- Create: `tools/requirements.txt`
- Create: `tools/extract_layouts.py`
- Create: `app/assets/layouts/*.png`
- Create: `test/assets.test.js`

- [ ] **Step 1: Add extraction-only dependencies**

```text
pypdfium2==5.12.1
Pillow==12.2.0
```

- [ ] **Step 2: Add the deterministic extraction script**

```python
from pathlib import Path
import pypdfium2 as pdfium

SOURCE = Path('eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf')
OUTPUT = Path('app/assets/layouts')
SCALE = 2
CROP_POINTS = (82, 245, 513, 765)
GROUPS = [
    ('take-and-hold--take-and-hold', 9),
    ('take-and-hold--purge-the-foe', 12),
    ('take-and-hold--disruption', 15),
    ('take-and-hold--reconnaissance', 18),
    ('take-and-hold--priority-assets', 21),
    ('purge-the-foe--purge-the-foe', 24),
    ('purge-the-foe--disruption', 27),
    ('purge-the-foe--reconnaissance', 30),
    ('purge-the-foe--priority-assets', 33),
    ('disruption--disruption', 36),
    ('disruption--reconnaissance', 39),
    ('disruption--priority-assets', 42),
    ('reconnaissance--reconnaissance', 45),
    ('reconnaissance--priority-assets', 48),
    ('priority-assets--priority-assets', 51),
]

if not SOURCE.exists():
    raise SystemExit(f'Missing source PDF: {SOURCE}')

OUTPUT.mkdir(parents=True, exist_ok=True)
pdf = pdfium.PdfDocument(str(SOURCE))
crop = tuple(round(value * SCALE) for value in CROP_POINTS)
for slug, first_page in GROUPS:
    for offset, layout in enumerate('abc'):
        image = pdf[first_page - 1 + offset].render(scale=SCALE).to_pil().convert('RGB')
        image.crop(crop).save(OUTPUT / f'{slug}-{layout}.png', optimize=True)

print(f'Created {len(GROUPS) * 3} layout images in {OUTPUT}')
```

- [ ] **Step 3: Install extraction dependencies using the bundled workspace Python**

Run:

```powershell
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m pip install -r tools/requirements.txt
```

Expected: both requirements are already satisfied or install successfully. Do not install a separate system Python.

- [ ] **Step 4: Generate the images**

Run:

```powershell
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tools/extract_layouts.py
```

Expected: `Created 45 layout images in app\assets\layouts`.

- [ ] **Step 5: Write the asset integrity test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { matchups, resolveMatchup } from '../app/matchups.js';

test('all 45 official layout images exist', () => {
  const paths = new Set();
  for (const matchup of matchups) {
    for (const layout of ['A', 'B', 'C']) {
      const path = `app/${resolveMatchup(matchup.left, matchup.right).image(layout)}`;
      paths.add(path);
      assert.ok(existsSync(path), `Missing ${path}`);
    }
  }
  assert.equal(paths.size, 45);
});
```

- [ ] **Step 6: Run checks and visually inspect representative crops**

Run: `npm test`

Expected: 4 tests pass.

Open and inspect the A/B/C images for `disruption--priority-assets`; confirm the map, edge measurements, and labels are visible and page numbers/cards are excluded.

- [ ] **Step 7: Commit**

```powershell
git add tools app/assets test/assets.test.js
git commit -m "feat: add official terrain layout assets refs #1"
```

### Task 4: Build the responsive one-screen selector

**Files:**
- Create: `app/index.html`
- Create: `app/styles.css`
- Create: `app/app.js`

- [ ] **Step 1: Add the semantic single-screen HTML**

Use native selects, buttons, and dialog for accessibility and to avoid UI dependencies:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>WH40K Terrain Layout</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <main>
    <section class="matchup" aria-label="Force disposition matchup">
      <article class="card"><label for="left">Force Disposition</label><select id="left"></select><hr><span>Mission</span><strong id="left-mission"></strong></article>
      <b class="versus">VS</b>
      <article class="card"><label for="right">Force Disposition</label><select id="right"></select><hr><span>Mission</span><strong id="right-mission"></strong></article>
    </section>
    <nav class="layouts" aria-label="Terrain layout">
      <button type="button" data-layout="A" aria-pressed="true">A</button>
      <button type="button" data-layout="B" aria-pressed="false">B</button>
      <button type="button" data-layout="C" aria-pressed="false">C</button>
    </nav>
    <h1 id="layout-title">Layout A</h1>
    <button class="map-button" type="button" aria-label="Open layout at full size"><img id="map" alt="Selected terrain layout"></button>
    <p id="error" role="alert" hidden></p>
  </main>
  <dialog id="viewer"><button id="close" type="button" aria-label="Close">Close</button><img id="large-map" alt="Selected terrain layout at full size"></dialog>
  <script type="module" src="app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Add responsive styles**

Implement a parchment-like neutral background, two bordered cards, 44px minimum touch targets, a centered map, and this mobile breakpoint:

```css
* { box-sizing: border-box; }
body { margin: 0; color: #242424; background: #ecebe6; font-family: Arial, sans-serif; }
main { width: min(100% - 24px, 880px); margin: auto; padding: 24px 0; text-align: center; }
.matchup { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: center; }
.card { padding: 16px; border: 1px solid #444; background: rgba(255,255,255,.72); }
.card label, .card span { display: block; font-size: .72rem; text-transform: uppercase; }
.card select { width: 100%; min-height: 44px; border: 0; background: transparent; font: 700 1.1rem Arial, sans-serif; text-align: center; }
.card strong { display: block; min-height: 2.5em; text-transform: uppercase; }
.layouts { display: flex; justify-content: center; gap: 10px; margin-top: 24px; }
.layouts button { min-width: 64px; min-height: 44px; border: 1px solid #333; background: #fff; font-weight: 700; }
.layouts button[aria-pressed="true"] { color: white; background: #222; }
.map-button { width: 100%; padding: 0; border: 0; background: transparent; cursor: zoom-in; }
.map-button img { display: block; width: min(100%, 620px); height: auto; margin: auto; }
#error { padding: 12px; color: #8c1010; background: #fff; }
dialog { width: min(96vw, 1000px); max-height: 96vh; padding: 12px; border: 0; }
dialog::backdrop { background: rgba(0,0,0,.8); }
dialog img { display: block; width: 100%; height: auto; }
#close { min-height: 44px; margin-bottom: 8px; }
@media (max-width: 620px) {
  main { width: min(100% - 12px, 880px); padding-top: 12px; }
  .matchup { grid-template-columns: 1fr 24px 1fr; gap: 4px; }
  .card { padding: 8px 4px; }
  .card select { font-size: .82rem; }
  .card strong { font-size: .78rem; }
}
```

- [ ] **Step 3: Wire selections and the native full-size dialog**

```js
import { dispositions, labels, resolveMatchup } from './matchups.js';

const left = document.querySelector('#left');
const right = document.querySelector('#right');
const leftMission = document.querySelector('#left-mission');
const rightMission = document.querySelector('#right-mission');
const title = document.querySelector('#layout-title');
const map = document.querySelector('#map');
const largeMap = document.querySelector('#large-map');
const error = document.querySelector('#error');
const viewer = document.querySelector('#viewer');
let layout = 'A';

for (const select of [left, right]) {
  for (const value of dispositions) select.add(new Option(labels[value], value));
  select.addEventListener('change', render);
}
right.value = 'priority-assets';

for (const button of document.querySelectorAll('[data-layout]')) {
  button.addEventListener('click', () => {
    layout = button.dataset.layout;
    for (const item of document.querySelectorAll('[data-layout]')) item.setAttribute('aria-pressed', String(item === button));
    render();
  });
}

function render() {
  try {
    const matchup = resolveMatchup(left.value, right.value);
    leftMission.textContent = matchup.leftMission;
    rightMission.textContent = matchup.rightMission;
    title.textContent = `Layout ${layout}`;
    map.src = matchup.image(layout);
    map.alt = `${labels[left.value]} versus ${labels[right.value]}, layout ${layout}`;
    largeMap.src = map.src;
    largeMap.alt = map.alt;
    error.hidden = true;
  } catch (cause) {
    error.textContent = cause.message;
    error.hidden = false;
  }
}

map.addEventListener('error', () => {
  error.textContent = `Missing layout image: ${map.getAttribute('src')}`;
  error.hidden = false;
});
document.querySelector('.map-button').addEventListener('click', () => viewer.showModal());
document.querySelector('#close').addEventListener('click', () => viewer.close());
render();
```

- [ ] **Step 4: Run the logic checks**

Run: `npm test`

Expected: all 4 tests pass.

- [ ] **Step 5: Commit**

```powershell
git add app/index.html app/styles.css app/app.js
git commit -m "feat: add responsive layout selector UI refs #1"
```

### Task 5: Add the Windows shell and build installer

**Files:**
- Create: `electron/main.cjs`

- [ ] **Step 1: Add the secure minimal Electron window**

```js
const { app, BrowserWindow } = require('electron');
const path = require('node:path');

function createWindow() {
  const window = new BrowserWindow({
    width: 900,
    height: 1000,
    minWidth: 360,
    minHeight: 640,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  window.loadFile(path.join(__dirname, '..', 'app', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => BrowserWindow.getAllWindows().length || createWindow());
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

- [ ] **Step 2: Run automated checks**

Run: `npm test`

Expected: all 4 tests pass.

- [ ] **Step 3: Launch the application**

Run: `npm start`

Expected: the selector opens at 900x1000, works offline, switches all three layouts, and opens/closes the large image dialog.

- [ ] **Step 4: Verify responsive behavior with Playwright skill**

Serve `app/` locally, inspect at 900x1000 and 390x844, and verify no horizontal overflow, controls remain at least 44px tall, missions update, and the selected map changes for A/B/C.

- [ ] **Step 5: Build the installer**

Run: `npm run dist`

Expected: electron-builder creates a Windows NSIS installer under `dist/` and exits successfully.

- [ ] **Step 6: Install and smoke-test the packaged build**

Run the generated installer, launch the installed application without the project server, select `Disruption` versus `Priority Assets`, and verify missions `Locate and Deny` / `Extract Relic` with layouts A, B, and C.

- [ ] **Step 7: Commit**

```powershell
git add electron/main.cjs
git commit -m "feat: package terrain selector for Windows refs #1"
```

### Task 6: Final verification and GitHub handoff

**Files:**
- Create: `README.md`

- [ ] **Step 1: Add concise build and usage instructions**

Document `npm install`, the bundled-Python asset command, `npm test`, `npm start`, `npm run dist`, the v1.1 PDF requirement, and the future Capacitor Android path.

- [ ] **Step 2: Run the full verification set**

Run: `npm test; npm run dist`

Expected: tests pass and the installer is recreated successfully.

- [ ] **Step 3: Review repository state**

Run: `git status --short; git log --oneline --decorate -6`

Expected: only intentionally untracked source PDFs or temporary files remain; implementation files are committed.

- [ ] **Step 4: Commit documentation**

```powershell
git add README.md
git commit -m "docs: add build and usage guide refs #1"
```

- [ ] **Step 5: Push and update GitHub issue #1**

Push `main` or the implementation branch, record test/build results on issue #1, and close the issue only after the packaged installer smoke test passes.

---

## Deliberate omissions

- No React/Vue, router, state library, database, backend, updater, analytics, or custom installer framework.
- No separate system Python installation; the available bundled Python is sufficient for the one-time PDF extraction.
- No Android Studio or Android SDK until the Android package is actually scheduled.
- No custom application icon until the user supplies or requests one.
