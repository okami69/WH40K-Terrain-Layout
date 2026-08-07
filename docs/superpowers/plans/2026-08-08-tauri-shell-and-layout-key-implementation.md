# Tauri Shell and Layout Key Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Electron with a compact Tauri 2 Windows app, preserve the official fixed-sheet layout, and add official disposition icons, a layout key, RU/ENG UI, and bilingual mission summaries.

**Architecture:** Keep the existing static HTML/CSS/JavaScript frontend and Node tests. Tauri only supplies the desktop window and installer; all selection, localization, summaries, and assets remain static and offline. The 768 x 1080 reference sheet scales as one unit inside a centered, resizable window whose creation is capped to the monitor work area.

**Tech Stack:** Tauri 2.11, Rust stable MSVC, WebView2, plain HTML/CSS/JavaScript, Node 24 test runner, Python with pypdfium2/Pillow, WebP assets, Playwright for final browser checks.

---

## File map

- Modify `package.json` and `package-lock.json`: replace Electron scripts/dependencies with Tauri CLI.
- Create `src-tauri/Cargo.toml`, `src-tauri/build.rs`, `src-tauri/src/main.rs`, `src-tauri/tauri.conf.json`, and `src-tauri/capabilities/default.json`: minimal desktop shell and NSIS bundle.
- Delete `electron/main.cjs` and `test/electron.test.js`: obsolete Electron shell.
- Create `test/tauri.test.js`: static shell/package assertions.
- Modify `tools/extract_layouts.py`: create lossless WebP maps, page 8 key, and five disposition icons.
- Modify `app/matchups.js`: canonical mission IDs, localized labels/summaries, icon paths, and WebP paths.
- Modify `test/matchups.test.js` and `test/assets.test.js`: cover both languages and all new assets.
- Modify `app/index.html`, `app/app.js`, `app/styles.css`, and `test/ui.test.js`: fixed sheet, interactive PDF-style cards, language control, key dialog, mission popovers, and keyboard/touch behavior.
- Modify `README.md`: Tauri prerequisites, commands, installer path, and measured sizes.

### Task 1: Install the Tauri Windows toolchain

**Files:** None.

- [ ] **Step 1: Confirm the currently missing prerequisites**

Run:

```powershell
rustc --version
cargo --version
```

Expected before installation: both commands are not found. WebView2 is already installed.

- [ ] **Step 2: Install Rust and the Microsoft C++ workload**

Run from an elevated PowerShell after approval:

```powershell
choco install rustup.install visualstudio2022buildtools visualstudio2022-workload-vctools -y
```

Expected: Chocolatey reports all three packages installed successfully.

- [ ] **Step 3: Verify the toolchain in a fresh shell**

Run:

```powershell
rustc --version
cargo --version
```

Expected: Rust 1.94.1 or newer and the stable MSVC host toolchain.

### Task 2: Replace Electron packaging with a minimal Tauri shell

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `src-tauri/Cargo.toml`
- Create: `src-tauri/build.rs`
- Create: `src-tauri/src/main.rs`
- Create: `src-tauri/tauri.conf.json`
- Create: `src-tauri/capabilities/default.json`
- Create: `test/tauri.test.js`
- Delete: `electron/main.cjs`
- Delete: `test/electron.test.js`

- [ ] **Step 1: Replace the Electron test with a failing Tauri configuration test**

Create `test/tauri.test.js` that parses `src-tauri/tauri.conf.json` and asserts:

```js
assert.equal(config.productName, 'WH40K Terrain Layout');
assert.equal(config.identifier, 'com.okami69.wh40kterrainlayout');
assert.equal(config.build.frontendDist, '../app');
assert.deepEqual(config.bundle.targets, ['nsis']);
assert.deepEqual(config.app.windows[0], {
  label: 'main',
  title: 'WH40K Terrain Layout',
  width: 768,
  height: 1080,
  minWidth: 360,
  minHeight: 640,
  center: true,
  preventOverflow: true,
  resizable: true,
  maximized: false,
  fullscreen: false,
});
```

- [ ] **Step 2: Run the test and verify it fails**

Run: `npm.cmd test`

Expected: FAIL because `src-tauri/tauri.conf.json` does not exist.

- [ ] **Step 3: Remove Electron and install the pinned Tauri CLI**

Run:

```powershell
npm.cmd uninstall electron electron-builder
npm.cmd install --save-dev @tauri-apps/cli@2.11.4
```

Set scripts to:

```json
{
  "start": "tauri dev",
  "test": "node --test",
  "dist": "npm test && tauri build"
}
```

- [ ] **Step 4: Add the minimal Rust shell**

Use this `src-tauri/Cargo.toml` dependency set:

```toml
[package]
name = "wh40k-terrain-layout"
version = "0.2.0"
description = "Offline WH40K terrain layout selector"
edition = "2021"

[build-dependencies]
tauri-build = { version = "2.6.3", features = [] }

[dependencies]
tauri = { version = "2.11.5", features = [] }

[profile.release]
codegen-units = 1
lto = true
opt-level = "s"
panic = "abort"
strip = true
```

`src-tauri/build.rs`:

```rust
fn main() {
    tauri_build::build()
}
```

`src-tauri/src/main.rs`:

```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running WH40K Terrain Layout");
}
```

Use the exact tested window values in `tauri.conf.json`, set `bundle.active` to `true`, and use the default `downloadBootstrapper` WebView2 install mode. Keep capabilities at `core:default` only.

- [ ] **Step 5: Run shell tests and a Rust compile check**

Run:

```powershell
npm.cmd test
cargo check --manifest-path src-tauri/Cargo.toml
```

Expected: all Node tests pass except later asset/UI expectations not yet introduced; Cargo check succeeds.

- [ ] **Step 6: Commit the shell migration**

```powershell
git add package.json package-lock.json src-tauri test/tauri.test.js electron/main.cjs test/electron.test.js
git commit -m "build: replace Electron shell with Tauri refs #2"
```

### Task 3: Generate compact official assets

**Files:**
- Modify: `tools/extract_layouts.py`
- Modify: `test/assets.test.js`
- Create: `app/assets/key/layouts-key.webp`
- Create: `app/assets/dispositions/*.webp`
- Replace: `app/assets/layouts/*.png` with `app/assets/layouts/*.webp`

- [ ] **Step 1: Change asset tests to require WebP, key, and icons**

Assert 45 unique paths ending in `.webp`, plus these exact files:

```js
const required = [
  'app/assets/key/layouts-key.webp',
  'app/assets/dispositions/take-and-hold.webp',
  'app/assets/dispositions/purge-the-foe.webp',
  'app/assets/dispositions/disruption.webp',
  'app/assets/dispositions/reconnaissance.webp',
  'app/assets/dispositions/priority-assets.webp',
];
```

- [ ] **Step 2: Run the asset test and verify it fails**

Run: `node --test test/assets.test.js`

Expected: FAIL on `.png` paths and missing key/icon assets.

- [ ] **Step 3: Extend the extractor**

Keep the existing 45 page/crop mappings, but save with:

```python
target.save(path, "WEBP", lossless=True, method=6)
```

Render page 8 at scale 2 to `app/assets/key/layouts-key.webp`. Crop the five symbols from the upper cards on pages 9, 12, 15, 18, and 21, remove only bright neutral background pixels, and save transparent lossless WebP files. Use pages 12/15/18/21 right-hand card symbols for Purge the Foe, Disruption, Reconnaissance, and Priority Assets; use page 9 left-hand card for Take and Hold.

- [ ] **Step 4: Generate assets and remove packaged PNG copies**

Run:

```powershell
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tools\extract_layouts.py
```

Expected: the script reports 45 maps, five disposition icons, and one key image.

- [ ] **Step 5: Visually inspect assets**

Inspect one dense-label map from each layout letter, all five icons, and the page 8 key. Reject any output with blurred measurements, clipped symbols, or visible rectangular icon backgrounds.

- [ ] **Step 6: Run tests and commit**

Run: `node --test test/assets.test.js`

Expected: PASS.

```powershell
git add tools/extract_layouts.py app/assets test/assets.test.js
git commit -m "perf: convert terrain assets to WebP refs #2"
```

### Task 4: Add bilingual matchup content and mission summaries

**Files:**
- Modify: `app/matchups.js`
- Modify: `test/matchups.test.js`

- [ ] **Step 1: Write failing content tests**

Test that `languages` equals `['ru', 'en']`; each disposition has `label.ru`, `label.en`, and an icon path; each of the 25 unique missions has non-empty `name.ru`, `name.en`, `summary.ru`, and `summary.en`; every summary is at most two sentences and includes a localized exact-scoring disclaimer.

- [ ] **Step 2: Run the tests and verify they fail**

Run: `node --test test/matchups.test.js`

Expected: FAIL because localized content and summaries do not exist.

- [ ] **Step 3: Change matchups to stable mission IDs**

Keep the existing 15 canonical pairs, but store mission IDs such as `battlefield-dominance`, `immovable-object`, and `unstoppable-force`. Return IDs from `resolveMatchup`; resolve display strings separately through `missions[id]`.

- [ ] **Step 4: Add the five disposition translations and 25 mission records**

For every mission listed in the approved design matrix, read the corresponding 11th-edition card text at `https://game-datamissions.com/11th/primary-missions/<disposition>/<mission-slug>`. Write one practical English sentence, translate that sentence naturally into Russian, and append the localized short disclaimer that the official card/app controls exact scoring. Do not copy full card text or invent VP values.

- [ ] **Step 5: Update image generation to `.webp` and run tests**

Run: `node --test test/matchups.test.js test/assets.test.js`

Expected: PASS with all 25 missions, 25 ordered selections, and 45 assets covered.

- [ ] **Step 6: Commit the content model**

```powershell
git add app/matchups.js test/matchups.test.js test/assets.test.js
git commit -m "feat: add bilingual mission reference data refs #2"
```

### Task 5: Build the interactive fixed-sheet interface

**Files:**
- Modify: `app/index.html`
- Modify: `app/app.js`
- Modify: `app/styles.css`
- Modify: `test/ui.test.js`

- [ ] **Step 1: Replace static UI assertions with failing requirements**

Assert the HTML contains: a 768 x 1080 sheet wrapper; `RU` and `ENG` buttons; two official-icon images; two accessible native selects integrated into the disposition-name line; two mission summary triggers/popovers; the A/B/C group; an icon-only key button with inline SVG; a key dialog; and the existing map dialog. Assert CSS contains `overflow: hidden`, sheet-level proportional scaling, `object-fit: contain`, visible focus, 44 px targets, and reduced-motion handling.

- [ ] **Step 2: Run the UI test and verify it fails**

Run: `node --test test/ui.test.js`

Expected: FAIL on the new sheet, language, icon, key, and popover requirements.

- [ ] **Step 3: Rebuild the HTML in official PDF order**

Inside one `.app-sheet`, place the language control and key icon first, then the two selector cards with `VS`, then layout A/B/C, then the map. Each card order is icon, `FORCE DISPOSITION`, select, divider, `MISSION`, and mission trigger. Use visually hidden labels for left/right selects and meaningful `aria-expanded`/`aria-controls` relationships for summaries.

- [ ] **Step 4: Implement rendering and language state**

Use one `render()` path to update selects, icons, mission names, summaries, map path/alts, dialog labels, errors, and `document.documentElement.lang`. Read the saved language from `localStorage`; otherwise use `navigator.language.startsWith('ru') ? 'ru' : 'en'`. Save only explicit RU/ENG clicks.

- [ ] **Step 5: Implement pointer and keyboard interactions**

Use the native Popover API for mission summaries: hover/focus opens, pointer leave/blur closes unless click/tap pinned it, Escape closes. Use native dialogs for map and key; add backdrop-click close and explicit close buttons. Keep key visible as an icon-only control with localized tooltip and accessible name.

- [ ] **Step 6: Implement fixed-sheet sizing and PDF-like cards**

Set the page viewport to no-scroll. Size `.app-sheet` at 768 x 1080 logical pixels and use one resize calculation:

```js
function fitSheet() {
  const scale = Math.min(window.innerWidth / 768, window.innerHeight / 1080);
  document.documentElement.style.setProperty('--sheet-scale', String(scale));
}

window.addEventListener('resize', fitSheet);
fitSheet();
```

Give the sheet `transform: scale(var(--sheet-scale))` with a centered transform origin and reserve its scaled width/height in a stage wrapper. Keep the map in a fixed slot with `object-fit: contain`. Preserve the existing neutral palette, official card borders, typography hierarchy, focus contrast, and minimum touch targets.

- [ ] **Step 7: Run tests and commit**

Run: `npm.cmd test`

Expected: all Node tests pass.

```powershell
git add app/index.html app/app.js app/styles.css test/ui.test.js
git commit -m "feat: add fixed bilingual terrain sheet refs #2"
```

### Task 6: Verify behavior visually and fix only observed defects

**Files:** Modify only files implicated by observed failures.

- [ ] **Step 1: Start the frontend and run browser checks**

Serve `app/` locally and use Playwright at 768 x 1080 and 1366 x 728 viewport sizes. Confirm no page scrollbars, the complete map is visible, cards do not clip in RU or ENG, and the full sheet preserves its proportions.

- [ ] **Step 2: Exercise every interaction**

Test all 25 ordered disposition selections, A/B/C, RU/ENG persistence, both mission popovers by hover/focus/click, key open/close, map viewer open/close, and Escape/backdrop behavior.

- [ ] **Step 3: Run full automated verification**

Run:

```powershell
npm.cmd test
cargo check --manifest-path src-tauri/Cargo.toml
```

Expected: all Node tests and Cargo check pass.

- [ ] **Step 4: Commit verified fixes if any**

```powershell
git add app test src-tauri
git commit -m "fix: polish Tauri terrain interface refs #2"
```

Skip this commit when verification required no edits.

### Task 7: Build, install, measure, document, and publish

**Files:**
- Modify: `README.md`
- Modify: `package.json`
- Modify: `package-lock.json`
- Generated: `src-tauri/target/release/bundle/nsis/*.exe`

- [ ] **Step 1: Bump the application version to 0.2.0 and build**

Run: `npm.cmd run dist`

Expected: tests pass and Tauri produces an NSIS installer under `src-tauri/target/release/bundle/nsis/`.

- [ ] **Step 2: Launch and smoke-test the packaged app**

Install it, confirm the initial window is centered and capped to the work area, and repeat one RU/ENG selection, one matchup change, one mission summary, the key, and the map viewer.

- [ ] **Step 3: Measure sizes**

Record the installer byte size and the installed application directory total. Compare both with v0.1.0: 122.59 MiB installer and approximately 375 MiB unpacked Electron files.

- [ ] **Step 4: Update documentation**

Document Rust/MSVC prerequisites, `npm.cmd start`, `npm.cmd test`, `npm.cmd run dist`, the final installer path, the measured sizes, RU/ENG behavior, mission summaries, and the official-English image exception.

- [ ] **Step 5: Final verification and commit**

Run:

```powershell
npm.cmd test
cargo check --manifest-path src-tauri/Cargo.toml
npm.cmd run dist
```

Expected: all checks pass and the installer is recreated successfully.

```powershell
git add README.md package.json package-lock.json
git commit -m "release: prepare compact Tauri v0.2.0 refs #2"
```

- [ ] **Step 6: Push, update issue #2, and create the v0.2.0 GitHub release**

Push the completed branch, merge it into `main` after review, attach the NSIS installer to release `v0.2.0`, report verification and size results in issue #2, then close the issue.
