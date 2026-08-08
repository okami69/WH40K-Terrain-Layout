# Mission Popover And Layout Key Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Anchor mission summaries below their own mission names and package only the content panel from the official page 8 layouts key.

**Architecture:** Keep the existing shared fixed popover and reset the native top-layer inset and margin that currently override its JavaScript coordinates. Add one crop constant to the existing PDF extraction script and regenerate the lossless WebP; no DOM, localization, or dependency changes are needed.

**Tech Stack:** Plain HTML/CSS/JavaScript, Node.js built-in test runner, Python with pypdfium2/Pillow, lossless WebP, Playwright, Tauri 2.

---

### Task 1: Anchor The Shared Mission Popover

**Files:**
- Modify: `test/ui.test.js`
- Modify: `app/styles.css`

- [ ] **Step 1: Write the failing regression test**

After reading `app/styles.css`, isolate the `.mission-popover` declaration and require the native top-layer geometry reset:

```js
const popoverRule = css.match(/\.mission-popover\s*\{([\s\S]*?)\}/)?.[1] ?? '';
assert.match(popoverRule, /\binset:\s*auto;/);
assert.match(popoverRule, /\bmargin:\s*0;/);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test test/ui.test.js`

Expected: FAIL because the `.mission-popover` rule does not yet contain `inset: auto`.

- [ ] **Step 3: Add the minimal CSS reset**

Add these declarations to the existing `.mission-popover` rule without changing its fixed positioning, z-index, size, or visual styling:

```css
inset: auto;
margin: 0;
```

The existing `openSummary()` coordinates remain authoritative: the popover is placed 8 px below the active trigger and clamped horizontally and vertically to the viewport.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test test/ui.test.js`

Expected: PASS.

- [ ] **Step 5: Commit the popover fix**

```powershell
git add test/ui.test.js app/styles.css
git commit -m "fix: anchor mission summaries to cards refs #3"
```

### Task 2: Crop The Official Layouts Key Panel

**Files:**
- Modify: `test/assets.test.js`
- Modify: `tools/extract_layouts.py`
- Regenerate: `app/assets/key/layouts-key.webp`

- [ ] **Step 1: Write the failing extraction regression test**

Extend the filesystem import and assert the approved page-8 crop and its application:

```js
import { existsSync, readFileSync, statSync } from 'node:fs';

const extractor = readFileSync('tools/extract_layouts.py', 'utf8');
assert.match(extractor, /KEY_CROP_POINTS = \(94, 42, 502, 778\)/);
assert.match(extractor, /key\.crop\(key_crop\)\.save\(/);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test test/assets.test.js`

Expected: FAIL because `KEY_CROP_POINTS` and `key.crop(key_crop)` do not exist.

- [ ] **Step 3: Add and apply the crop**

Define the crop in PDF points alongside `KEY_PAGE`:

```python
KEY_PAGE = 8
KEY_CROP_POINTS = (94, 42, 502, 778)
```

Scale it once with the map crop:

```python
key_crop = tuple(point * SCALE for point in KEY_CROP_POINTS)
```

Crop before the existing lossless WebP save:

```python
key.crop(key_crop).save(KEY_OUTPUT / "layouts-key.webp", "WEBP", lossless=True, method=6)
```

- [ ] **Step 4: Regenerate the official assets**

Run:

```powershell
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tools/extract_layouts.py
```

Expected: 45 maps, five disposition icons, and the layouts key are regenerated from Event Companion v1.1 without errors.

- [ ] **Step 5: Verify dimensions and rendering**

Run:

```powershell
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -c "from PIL import Image; print(Image.open('app/assets/key/layouts-key.webp').size)"
```

Expected: `(816, 1472)`.

Inspect `app/assets/key/layouts-key.webp` visually. It must begin with the grey key panel, include all objective icons, and contain no white PDF page margin or page number.

- [ ] **Step 6: Run the focused test and verify GREEN**

Run: `node --test test/assets.test.js`

Expected: PASS.

- [ ] **Step 7: Commit the cropped key**

```powershell
git add test/assets.test.js tools/extract_layouts.py app/assets/key/layouts-key.webp
git commit -m "fix: crop layouts key to content panel refs #3"
```

### Task 3: Verify The Complete Desktop UI

**Files:**
- Temporary verification script: `D:\Temp\okami\wh40k-playwright-smoke.cjs`
- Screenshot output: `output/playwright/reference.png`
- Screenshot output: `output/playwright/laptop.png`
- Screenshot output: `output/playwright/layouts-key.png`

- [ ] **Step 1: Restore development dependencies**

Run: `npm.cmd install`

Expected: the pinned Tauri CLI is installed and `package-lock.json` remains unchanged.

- [ ] **Step 2: Extend the temporary Playwright smoke check**

For both `#left-mission` and `#right-mission`, open the summary and compare rectangles:

```js
const geometry = await page.locator('#mission-popover').evaluate((popover, selector) => {
  const trigger = document.querySelector(selector).getBoundingClientRect();
  const summary = popover.getBoundingClientRect();
  return { gap: summary.top - trigger.bottom, left: summary.left, right: summary.right };
}, selector);
if (Math.abs(geometry.gap - 8) > 1) throw new Error(`${selector}: popover gap ${geometry.gap}`);
if (geometry.left < 0 || geometry.right > page.viewportSize().width) throw new Error(`${selector}: popover outside viewport`);
```

Record the map rectangle before and after opening each summary and require it to be unchanged. Open `#layout-key-viewer`, require the key natural dimensions to equal `816 × 1472`, and save `output/playwright/layouts-key.png`.

- [ ] **Step 3: Run all Node tests**

Run: `npm.cmd test`

Expected: all tests pass with zero failures.

- [ ] **Step 4: Run the Playwright smoke at both viewports**

Run:

```powershell
$env:NODE_PATH='D:\Temp\okami\pw-smoke\node_modules'
node 'D:\Temp\okami\wh40k-playwright-smoke.cjs'
```

Expected: `playwright smoke passed`, with summaries directly below both mission names and the cropped key rendered without outer PDF chrome.

- [ ] **Step 5: Build the Windows installer**

Run: `npm.cmd run dist`

Expected: Node tests pass again and Tauri creates `src-tauri/target/release/bundle/nsis/WH40K Terrain Layout_0.2.0_x64-setup.exe`.

- [ ] **Step 6: Record verification and commit**

Add the fresh test, Playwright, build, and installer-size results to GitHub issue #3. Do not commit `node_modules`, `src-tauri/target`, temporary scripts, or screenshots.

If no tracked verification files changed, no verification-only commit is needed.
