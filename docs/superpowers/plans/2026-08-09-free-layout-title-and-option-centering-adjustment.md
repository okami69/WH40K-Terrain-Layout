# Free Layout Title And Native Option Centering Adjustment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the redundant visible free-layout source row and visually center Windows native popup option labels without replacing the native Force Disposition select.

**Architecture:** Keep catalog source metadata in the gallery, image alternative text, and full-size viewer title, while the main map panel renders only its localized mode title. Preserve the existing native `<select>` and compensate only its expanded option content for the Windows popup's reserved left gutter.

**Tech Stack:** Plain HTML, CSS, JavaScript ES modules, Node's built-in test runner, native `<select>`, external Playwright smoke runner, Tauri 2.

---

## File Structure

- Modify `app/index.html`: remove the redundant main-sheet source element.
- Modify `app/styles.css`: remove dead source-row styles and add option-only native popup compensation.
- Modify `app/app.js`: stop querying and rendering the removed row while retaining source metadata for the gallery, `alt`, and viewer title.
- Modify `test/ui.test.js`: protect the compact title and native option compensation, and keep the dependency-free runtime harness aligned with the DOM.
- Modify temporarily `D:\Temp\okami\wh40k-layout-gallery-smoke.cjs`: add final real-browser no-shift checks; do not commit this file.

### Task 1: Remove The Visible Free-Layout Source Row

**Files:**
- Modify: `app/index.html`
- Modify: `app/styles.css`
- Modify: `app/app.js`
- Modify: `test/ui.test.js`

- [ ] **Step 1: Write failing compact-title tests**

Replace the old source-row HTML assertion in `test/ui.test.js` with:

```js
assert.doesNotMatch(html, /id="layout-source"/);
```

After `css` is read, add:

```js
assert.doesNotMatch(css, /\.layout-source\s*\{/);
```

After `js` is read, add:

```js
assert.doesNotMatch(js, /querySelector\('#layout-source'\)/);
assert.doesNotMatch(js, /layoutSource\.(?:textContent|hidden)/);
```

Remove `layout-source` from the fake DOM element list. Extend the existing runtime gallery test after free-card selection:

```js
assert.equal(title.textContent, 'Free layout');
assert.match(elements.get('viewer-title').textContent, /^Free layout: .+ · Layout [ABC]$/);
assert.match(map.alt, /.+ \/ .+ · Layout [ABC]/);
```

These assertions ensure the redundant main-sheet row is gone while detailed source metadata remains available outside the compact title.

- [ ] **Step 2: Run the focused test and verify the red state**

Run:

```powershell
node --test test/ui.test.js
```

Expected: FAIL because `app/index.html`, `app/styles.css`, and `app/app.js` still contain `layout-source`.

- [ ] **Step 3: Remove only the redundant visible row**

Delete this element from `app/index.html`:

```html
<p id="layout-source" class="layout-source" hidden></p>
```

Delete both `.layout-source` rules from `app/styles.css`, including its portrait-only margin override.

Delete the cached element from `app/app.js`:

```js
const layoutSource = document.querySelector('#layout-source');
```

Delete only these two render statements:

```js
layoutSource.textContent = item ? sourceText(item) : '';
layoutSource.hidden = !item;
```

Keep `text[language].layoutSource`, `sourceText(item)`, gallery card labels, image alternative text, and the detailed full-size viewer title unchanged.

- [ ] **Step 4: Run focused and full tests**

Run:

```powershell
node --test test/ui.test.js
npm.cmd test
```

Expected: the focused UI tests and all Node tests PASS with zero failures.

- [ ] **Step 5: Commit the compact title**

```powershell
git add app/index.html app/styles.css app/app.js test/ui.test.js
git commit -m "fix: keep free layout title compact refs #8"
```

### Task 2: Compensate The Windows Native Option Gutter

**Files:**
- Modify: `app/styles.css`
- Modify: `test/ui.test.js`
- Modify temporarily: `D:\Temp\okami\wh40k-layout-gallery-smoke.cjs`

- [ ] **Step 1: Write the failing option-compensation test**

Extend the existing option-rule assertions in `test/ui.test.js`:

```js
const dispositionOptionRule = css.match(/\.disposition-select option\s*\{([\s\S]*?)\}/)?.[1] ?? '';
assert.match(dispositionOptionRule, /\btext-align:\s*center;/);
assert.match(dispositionOptionRule, /\bpadding-inline-end:\s*30px;/);
```

Keep the existing closed-select assertions for `text-align: center`, `text-align-last: center`, `padding: 0 34px`, and the custom arrow position.

- [ ] **Step 2: Run the focused test and verify the red state**

Run:

```powershell
node --test test/ui.test.js
```

Expected: FAIL because the expanded option rule does not yet compensate the approximately 30 px Windows native left gutter.

- [ ] **Step 3: Add the minimal option-only compensation**

Update only the expanded option rule in `app/styles.css`:

```css
.disposition-select option {
  padding-inline-end: 30px;
  text-align: center;
}
```

Do not change `.disposition-select` padding, arrow, dimensions, typography, events, or native behavior. Do not add a custom dropdown. Android may ignore this rule when it owns the popup surface.

- [ ] **Step 4: Run focused and full tests**

Run:

```powershell
node --test test/ui.test.js
npm.cmd test
```

Expected: the focused UI tests and all Node tests PASS with zero failures.

- [ ] **Step 5: Verify real layout behavior**

Extend the existing external Playwright smoke so every viewport asserts the main-sheet source element is absent:

```js
if (await page.locator('#layout-source').count() !== 0) throw new Error('free source row still visible');
```

For each portrait viewport, record the map rectangle before opening the gallery and after selecting a free map:

```js
const officialMapBox = await page.locator('#map').boundingBox();
// Open gallery and select the free card using the existing smoke flow.
const freeMapBox = await page.locator('#map').boundingBox();
if (!officialMapBox || !freeMapBox || Math.abs(freeMapBox.y - officialMapBox.y) > 1) {
  throw new Error('free mode shifted the map');
}
if (await page.locator('#layout-title').textContent() !== 'Free layout') {
  throw new Error('free title changed');
}
```

Run:

```powershell
$env:NODE_PATH='D:\Temp\okami\pw-smoke\node_modules'
node 'D:\Temp\okami\wh40k-layout-gallery-smoke.cjs'
```

Expected: all five viewports PASS, the free selection does not move the map downward, the gallery retains its detailed card labels, and the run ends with `layout gallery smoke passed` and zero page or console errors.

Open both native Force Disposition menus in the Windows Tauri application and confirm that the visible text center aligns with the popup center more closely than the pre-change screenshot. Record the result in issue #8. On Android, record whether the system popup honors or ignores the option padding; do not replace it with a custom control.

- [ ] **Step 6: Commit the native compensation**

```powershell
git add app/styles.css test/ui.test.js
git commit -m "fix: compensate native option gutter refs #8"
```

- [ ] **Step 7: Re-run final automated verification**

Run:

```powershell
npm.cmd test
$env:NODE_PATH='D:\Temp\okami\pw-smoke\node_modules'
node 'D:\Temp\okami\wh40k-layout-gallery-smoke.cjs'
git diff --check
git status --short
```

Expected: all Node tests PASS, the five-viewport smoke prints `layout gallery smoke passed`, no whitespace errors exist, and the worktree is clean apart from known user-owned files.
