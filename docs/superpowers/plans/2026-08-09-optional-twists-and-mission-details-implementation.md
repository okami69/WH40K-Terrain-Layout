# Optional Twists And Detailed Mission Reference Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship v0.5.0 with reliably centered disposition menus, full structured Primary Mission VP references, an optional six-Twist chooser/detail flow, and vertically balanced portrait maps.

**Architecture:** Keep the plain HTML/CSS/JavaScript application and existing single `render()` path. Add one focused rules-data module, retain hidden native selects as the existing disposition state/event seam, render deterministic button menus in front of them, and use one stable native dialog for all Twist chooser/detail states. Extend the current responsive sheet calculation instead of introducing a layout framework.

**Tech Stack:** ES modules, semantic HTML, CSS custom properties, native Popover and Dialog APIs, Node's built-in test runner, external Playwright smoke runner, Tauri 2, Rust/Android packaging already present in the repository.

---

## File Map

- Create `app/rules.js`: 25 structured Primary Mission references, six Twist records, data validation, deterministic random selection seam.
- Create `test/rules.test.js`: source-oracle/schema assertions for mission and Twist content.
- Create `docs/rules-sources/2026-27-mission-and-twist-audit.md`: durable source/version audit and manual translation verification record.
- Modify `app/matchups.js`: keep names/summaries and matchup mapping; validate that every matchup has a detailed reference.
- Modify `app/index.html`: hidden state selects, two deterministic disposition triggers, one shared disposition popover, independent Twist button, stable Twist dialog.
- Modify `app/app.js`: custom disposition menu behavior, detailed mission rendering/geometry, Twist state machine, dynamic portrait sheet height.
- Modify `app/styles.css`: centered menus, mirrored wide mission popover, independent Twist-button placement, stable Twist panel, balanced portrait map area.
- Modify `test/matchups.test.js`: require every resolved mission to have a detailed reference.
- Modify `test/ui.test.js`: static UI contract plus runtime interaction harness for menus, mission details, Twists, and portrait fitting.
- Modify `test/tauri.test.js`, `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/gen/android/app/build.gradle.kts`: v0.5.0 version assertions and values.
- Modify `README.md`: optional Twist workflow, detailed mission reference, portrait behavior, new screenshots, artifact instructions.
- Add/update `docs/screenshots/*.png`: final desktop/mobile evidence only after Playwright and physical checks pass.

## Content Source Matrix

Use `https://game-datamissions.com/11th/primary-missions/<deck>/<mission>` for selectable card text, then cross-check numeric values and errata against the current official Warhammer application and Event Companion v1.1. The required deck/mission paths are:

| Deck | Missions |
|---|---|
| `take-and-hold` | `battlefield-dominance`, `determined-acquisition`, `immovable-object`, `inescapable-dominion`, `purge-and-secure` |
| `purge-the-foe` | `unstoppable-force`, `meatgrinder`, `punishment`, `consecrate`, `destroyers-wrath` |
| `disruption` | `death-trap`, `delaying-action`, `outmanoeuvre`, `smoke-and-mirrors`, `locate-and-deny` |
| `reconnaissance` | `reconnaissance-sweep`, `triangulation`, `surveil-the-foe`, `gather-intel`, `search-and-scour` |
| `priority-assets` | `secure-asset`, `vital-link`, `extract-relic`, `vanguard-operation`, `sabotage` |

The only accepted Twist list, in order, is `martial-pride`, `mirrored-world`, `night-fighting`, `nowhere-to-hide`, `ruinscape`, `scrambled-communications`. Obtain effects from the current official Warhammer application or physical Chapter Approved 2026-27 cards. The chooser screenshot supplied in issue #11 establishes names/order/visual reference but not rules text. If neither app data nor all six expanded official screens are available, stop the content task and request those screens; do not substitute the older nine-card web set or invent effects.

### Task 1: Audit Current Rules Sources

**Files:**
- Create: `docs/rules-sources/2026-27-mission-and-twist-audit.md`
- Inspect: `eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf`
- Inspect: 25 URLs from the Content Source Matrix
- Inspect: current official Warhammer application/Chapter Approved 2026-27 Twist screens

- [ ] **Step 1: Record the exact source versions before copying any rule facts**

Create the audit with this fixed structure and fill every row from an inspected source in the same session:

```markdown
# Chapter Approved 2026-27 Content Audit

## Versions

- Event Companion: v1.1 local approved PDF; record the SHA-256 printed by `Get-FileHash`.
- Official Warhammer app: record the application version and data version shown in Profile.
- GDM mission text: record the inspection date and the current version-history entry.

## Primary Missions

| ID | Official app/card checked | GDM text checked | RU checked | Notes |
|---|---:|---:|---:|---|
| battlefield-dominance | yes | yes | yes | timings and VP tiers agree |
```

Continue the table with all 25 IDs in the Content Source Matrix and literal observed version/hash values before Step 5.

- [ ] **Step 2: Extract and compare the 25 Primary Mission structures**

For each URL, record: overview/rule, every timing, trigger, VP tier, cumulative flag, per-unit/per-objective behavior, limit, action, operation-marker rule, status, and reverse side. Use this read-only PowerShell pattern for inspection:

```powershell
$uri = 'https://game-datamissions.com/11th/primary-missions/take-and-hold/battlefield-dominance'
$html = (Invoke-WebRequest -UseBasicParsing -Uri $uri).Content
[System.Net.WebUtility]::HtmlDecode($html) | Select-String -Pattern '\"primary\"|\"primaryBack\"|\"sections\"' -Context 0,4
```

- [ ] **Step 3: Obtain all six current Twist effects from an accepted source**

Preferred connected-device route:

```powershell
$appApkDir = 'D:\Temp\okami\warhammer-app-apks'
$appExtractDir = Join-Path $appApkDir 'extracted'
New-Item -ItemType Directory -Path $appApkDir,$appExtractDir -Force | Out-Null
$apkPaths = adb shell pm path com.gamesworkshop.w40k | ForEach-Object { $_.Replace('package:','').Trim() }
foreach ($apkPath in $apkPaths) { adb pull $apkPath (Join-Path $appApkDir ([IO.Path]::GetFileName($apkPath))) }
Get-ChildItem -LiteralPath $appApkDir -Filter '*.apk' | ForEach-Object {
  $zipPath = Join-Path $appApkDir ($_.BaseName + '.zip')
  Copy-Item -LiteralPath $_.FullName -Destination $zipPath -Force
  Expand-Archive -LiteralPath $zipPath -DestinationPath $appExtractDir -Force
}
rg -n -i "Martial Pride|Mirrored World|Night Fighting|Nowhere to Hide|Ruinscape|Scrambled Communications" $appExtractDir
```

If the package stores remote/encoded data, expand and transcribe each Twist from the official app UI instead. Record a checksum/path for every captured source screen in the audit. Do not commit an APK, private app data, credentials, or copyrighted full-card screenshots.

- [ ] **Step 4: Cross-check translations and global rules**

Confirm the Event Companion's 45VP Primary cap, 15VP-per-round cap, cumulative/or terminology, and applicable FAQs. Translate meaning naturally into Russian while preserving all numbers, timing, keywords, and logical operators.

- [ ] **Step 5: Verify the audit has no incomplete markers**

Run:

```powershell
rg -n "INCOMPLETE|UNVERIFIED|unchecked|unknown" docs/rules-sources/2026-27-mission-and-twist-audit.md
```

Expected: no output and exit 1 from `rg` because every field is resolved.

- [ ] **Step 6: Commit the source audit**

```powershell
git add docs/rules-sources/2026-27-mission-and-twist-audit.md
git commit -m "docs: audit mission and twist sources refs #11"
```

### Task 2: Add Structured Mission And Twist Data

**Files:**
- Create: `app/rules.js`
- Create: `test/rules.test.js`
- Modify: `app/matchups.js:1-84`
- Modify: `test/matchups.test.js:1-190`

- [ ] **Step 1: Write failing schema and source-oracle tests**

Create `test/rules.test.js` with these complete behavioral assertions, adding one explicit oracle assertion per mission from the completed audit rather than duplicating prose:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { missionReferences, twists, pickRandomTwist, validateRules } from '../app/rules.js';

const missionIds = [
  'battlefield-dominance', 'immovable-object', 'unstoppable-force',
  'determined-acquisition', 'death-trap', 'purge-and-secure',
  'reconnaissance-sweep', 'inescapable-dominion', 'secure-asset',
  'meatgrinder', 'punishment', 'delaying-action', 'consecrate',
  'triangulation', 'destroyers-wrath', 'vital-link', 'outmanoeuvre',
  'smoke-and-mirrors', 'surveil-the-foe', 'locate-and-deny',
  'extract-relic', 'gather-intel', 'search-and-scour',
  'vanguard-operation', 'sabotage',
];

const twistIds = [
  'martial-pride', 'mirrored-world', 'night-fighting',
  'nowhere-to-hide', 'ruinscape', 'scrambled-communications',
];

test('provides complete bilingual structured references for all primary missions', () => {
  assert.deepEqual(Object.keys(missionReferences).sort(), missionIds.sort());
  for (const [id, mission] of Object.entries(missionReferences)) {
    assert.ok(mission.overview.ru && mission.overview.en, `${id} overview`);
    assert.ok(mission.sections.length > 0, `${id} sections`);
    for (const section of mission.sections) {
      assert.ok(section.heading.ru && section.heading.en, `${id} heading`);
      assert.ok(section.timing.ru && section.timing.en, `${id} timing`);
      assert.ok(section.conditions.length > 0, `${id} conditions`);
      for (const condition of section.conditions) {
        assert.ok(condition.text.ru && condition.text.en, `${id} condition`);
        assert.ok(condition.vp === null || Number.isFinite(condition.vp), `${id} vp`);
        assert.equal(typeof condition.cumulative, 'boolean', `${id} cumulative`);
      }
    }
  }
  assert.doesNotThrow(validateRules);
});

test('provides the six current twists in official order', () => {
  assert.deepEqual(twists.map(twist => twist.id), twistIds);
  for (const twist of twists) {
    assert.ok(twist.name.ru && twist.name.en, `${twist.id} name`);
    assert.ok(twist.effects.ru.length > 0 && twist.effects.en.length > 0, `${twist.id} effects`);
  }
});

test('selects a twist uniformly through an injectable random source', () => {
  assert.equal(pickRandomTwist(() => 0).id, 'martial-pride');
  assert.equal(pickRandomTwist(() => 0.5).id, 'nowhere-to-hide');
  assert.equal(pickRandomTwist(() => 0.999999).id, 'scrambled-communications');
});
```

Append audit-derived assertions such as exact `vp`, `cumulative`, `limit`, and `timing` values for every ID. Keep them as facts, not copies of full card paragraphs.

- [ ] **Step 2: Run the focused tests to verify RED**

Run:

```powershell
npm.cmd test -- test/rules.test.js
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `app/rules.js`.

- [ ] **Step 3: Implement the rules module and all audited content**

Use this exact public shape in `app/rules.js`: define a fully populated `missionReferences` object with all 25 audited IDs and a fully populated `twists` array with all six audited records. Every mission value uses `{ id, overview: { ru, en }, sections }`; every section uses `{ heading: { ru, en }, timing: { ru, en }, conditions, limit? }`; every condition uses `{ text: { ru, en }, vp: number | null, cumulative: boolean }`; every Twist uses `{ id, name: { ru, en }, effects: { ru: string[], en: string[] } }`.

After those two complete constants, add these functions verbatim:

```js
export function pickRandomTwist(random = Math.random) {
  return twists[Math.floor(random() * twists.length)];
}

export function validateRules() {
  if (Object.keys(missionReferences).length !== 25) throw new Error('Expected 25 mission references');
  if (twists.length !== 6 || new Set(twists.map(item => item.id)).size !== 6) throw new Error('Expected 6 unique twists');
  for (const mission of Object.values(missionReferences)) {
    if (!mission.sections.length) throw new Error(`${mission.id} has no scoring sections`);
  }
  for (const twist of twists) {
    if (!twist.effects.ru.length || !twist.effects.en.length) throw new Error(`${twist.id} has no effects`);
  }
}
```

- [ ] **Step 4: Require detailed references from matchup tests**

Import `missionReferences` in `test/matchups.test.js` and add:

```js
test('every resolved mission has a detailed reference', () => {
  for (const left of dispositions) for (const right of dispositions) {
    const result = resolveMatchup(left, right);
    assert.ok(missionReferences[result.leftMission], `${left}/${right} left details`);
    assert.ok(missionReferences[result.rightMission], `${left}/${right} right details`);
  }
});
```

- [ ] **Step 5: Run focused and full tests to verify GREEN**

Run:

```powershell
npm.cmd test -- test/rules.test.js test/matchups.test.js
npm.cmd test
```

Expected: both commands exit 0; the full suite reports 0 failures.

- [ ] **Step 6: Commit the verified data model**

```powershell
git add app/rules.js test/rules.test.js test/matchups.test.js
git commit -m "feat: add mission and twist reference data refs #11"
```

### Task 3: Replace Platform-Controlled Disposition Popups

**Files:**
- Modify: `app/index.html:27-64`
- Modify: `app/app.js:1-110,221-294`
- Modify: `app/styles.css:196-256,290-294`
- Modify: `test/ui.test.js:10-125,127-334`

- [ ] **Step 1: Replace old native-popup assertions with failing deterministic-menu assertions**

In the first `test/ui.test.js` test, assert two triggers, two hidden state selects, and one shared popover:

```js
assert.match(html, /<select[^>]+id="left"[^>]+hidden/);
assert.match(html, /<button[^>]+id="left-disposition-button"[^>]+aria-controls="disposition-menu"/);
assert.match(html, /<select[^>]+id="right"[^>]+hidden/);
assert.match(html, /<button[^>]+id="right-disposition-button"[^>]+aria-controls="disposition-menu"/);
assert.match(html, /<div[^>]+id="disposition-menu"[^>]+popover="manual"/);
assert.doesNotMatch(css, /\.disposition-select option\s*\{/);
assert.match(css, /\.disposition-menu button\s*\{[\s\S]*text-align:\s*center/);
```

Extend the runtime harness to click both triggers, assert five menu buttons, select `reconnaissance`, verify the hidden select changes and its existing `change` listener rerenders the mission, press Escape, and verify focus returns to the active trigger.

- [ ] **Step 2: Run UI tests to verify RED**

Run:

```powershell
npm.cmd test -- test/ui.test.js
```

Expected: FAIL because the released HTML still exposes native selects and has no shared disposition menu.

- [ ] **Step 3: Add hidden state selects, visible triggers, and the shared menu**

Use this markup in `app/index.html` while preserving the surrounding card order and both existing mission triggers:

```html
<select id="left" hidden tabindex="-1" aria-hidden="true"></select>
<button id="left-disposition-button" class="disposition-select" type="button" aria-controls="disposition-menu" aria-expanded="false"></button>
```

```html
<select id="right" hidden tabindex="-1" aria-hidden="true"></select>
<button id="right-disposition-button" class="disposition-select" type="button" aria-controls="disposition-menu" aria-expanded="false"></button>
```

Add after the sheet:

```html
<div id="disposition-menu" class="disposition-menu" popover="manual" hidden></div>
```

- [ ] **Step 4: Implement one shared five-button menu without changing matchup state flow**

Add `leftDispositionButton`, `rightDispositionButton`, `dispositionMenu`, and `activeDispositionSide`. Render five ordinary buttons from `dispositions`; on selection set the corresponding hidden select's value, dispatch `new Event('change')`, close, and return focus. Position the menu from the active trigger's rectangle and clamp it to 12px viewport edges. Escape and outside pointerdown close it without changing the select.

Keep the existing `left.value`, `right.value`, and `change` listeners so free-layout behavior remains untouched.

- [ ] **Step 5: Replace option compensation CSS with deterministic centered rows**

Retain `.disposition-select` for the visible trigger, remove `.disposition-select option`, and add:

```css
.disposition-menu {
  position: fixed;
  inset: auto;
  z-index: 30;
  margin: 0;
  padding: 4px;
  border: 1px solid var(--line);
  background: var(--surface);
}

.disposition-menu button {
  display: block;
  width: 100%;
  padding: 0 12px;
  border-color: transparent;
  font-weight: 900;
  text-align: center;
  text-transform: uppercase;
}
```

- [ ] **Step 6: Run focused and full tests to verify GREEN**

Run:

```powershell
npm.cmd test -- test/ui.test.js test/matchups.test.js
npm.cmd test
```

Expected: all tests pass; all 25 ordered disposition combinations still resolve.

- [ ] **Step 7: Commit the reliable disposition menus**

```powershell
git add app/index.html app/app.js app/styles.css test/ui.test.js
git commit -m "fix: center disposition menus reliably refs #11"
```

### Task 4: Render Wider Detailed Mission Popovers

**Files:**
- Modify: `app/app.js:1,88-164,221-285,312-325`
- Modify: `app/styles.css:329-344`
- Modify: `test/ui.test.js`

- [ ] **Step 1: Write failing runtime tests for structured rendering and mirrored geometry**

Import a real mission reference into the harness, open left and right mission triggers, and assert:

```js
assert.ok(descendants(popover).some(item => item.className === 'mission-reference-section'));
assert.equal(popover.style.getPropertyValue('--mission-popover-width'), '500px');
assert.equal(popover.dataset.anchor, 'left');
rightMission.dispatch('click');
assert.equal(popover.dataset.anchor, 'right');
assert.equal(map.rectBefore, map.rectAfter);
```

Add static CSS assertions for `max-height: 65dvh`, `overflow-y: auto`, and width clamping.

- [ ] **Step 2: Run the focused test to verify RED**

Run:

```powershell
npm.cmd test -- test/ui.test.js
```

Expected: FAIL because `openSummary()` writes one summary string and sizes the popover to the trigger width.

- [ ] **Step 3: Render the audited structure with DOM nodes, not `innerHTML`**

Import `missionReferences`. Add a renderer that creates a heading, overview, and one `.mission-reference-section` per scoring section. Each condition renders localized text plus an explicit localized VP badge when `vp !== null`; cumulative and limit labels come from structured fields. Append the authoritative-source reminder last.

Do not copy card HTML and do not parse Markdown at runtime.

- [ ] **Step 4: Apply mirrored outer-card geometry**

In `openSummary(trigger, pin)`, use `trigger.closest('.selector-card').getBoundingClientRect()`. Compute `width = Math.min(500, innerWidth - 24)`. For the left trigger use `left = clamp(card.left, 12, innerWidth - width - 12)`; for the right trigger use `left = clamp(card.right - width, 12, innerWidth - width - 12)`. Set top to `triggerRect.bottom + 8`, set max height to the smaller of `65dvh` and remaining viewport space, and mark `data-anchor`.

- [ ] **Step 5: Prevent hover/focus flicker while entering the popover**

Keep click/tap pinning. On trigger `pointerleave`/`blur`, do not close if `event.relatedTarget` is inside the popover. Add matching popover `pointerleave`/`focusout` handlers that close only when the summary is not pinned and focus/pointer returns outside both active trigger and popover.

- [ ] **Step 6: Add viewport-contained scrolling CSS**

```css
.mission-popover {
  width: min(500px, calc(100vw - 24px));
  max-height: 65dvh;
  overflow-y: auto;
}

.mission-reference-section + .mission-reference-section {
  margin-top: 12px;
}
```

Retain fixed positioning, `inset: auto`, existing border/shadow, and no sheet-flow participation.

- [ ] **Step 7: Run focused and full tests to verify GREEN**

Run:

```powershell
npm.cmd test -- test/ui.test.js test/rules.test.js
npm.cmd test
```

Expected: all tests pass with 0 failures.

- [ ] **Step 8: Commit mission details and geometry**

```powershell
git add app/app.js app/styles.css test/ui.test.js
git commit -m "feat: show detailed mission scoring refs #11"
```

### Task 5: Add The Optional Stable Twist Workflow

**Files:**
- Modify: `app/index.html:27-121`
- Modify: `app/app.js`
- Modify: `app/styles.css`
- Modify: `test/ui.test.js`

- [ ] **Step 1: Write failing static and runtime Twist tests**

Assert the existing `VS` remains unchanged and the new control is separate:

```js
assert.match(html, /<b class="versus" aria-hidden="true">VS<\/b>/);
assert.match(html, /<button[^>]+id="twist-button"[^>]+aria-controls="twist-dialog"/);
assert.match(html, /<dialog[^>]+id="twist-dialog"/);
assert.match(css, /\.twist-button\s*\{[\s\S]*position:\s*absolute;[\s\S]*bottom:\s*0;/);
```

Extend the runtime harness to verify: initial `No Twist`; opening shows chooser; six rows; expanding shows description; named selection keeps `dialog.open === true` and switches to detail; closing/reopening shows detail; `Change Twist` returns to chooser; injected random selects the expected record and keeps the same dialog open; repeated central clicks never clear; only `No Twist` clears; every map/layout/gallery control remains enabled.

- [ ] **Step 2: Run UI tests to verify RED**

Run:

```powershell
npm.cmd test -- test/ui.test.js
```

Expected: FAIL because no Twist control or panel exists.

- [ ] **Step 3: Add the independent marked-position button without moving `VS`**

Leave this exact existing line untouched:

```html
<b class="versus" aria-hidden="true">VS</b>
```

Add the Twist button as a separate child of `.matchup` after both cards:

```html
<button id="twist-button" class="twist-button" type="button" aria-controls="twist-dialog" aria-pressed="false">
  <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
    <path d="M7 7h9l-2.5-2.5M17 17H8l2.5 2.5M16 7l-2.5 2.5M8 17l2.5-2.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</button>
```

Add one `#twist-dialog` containing a header, `#twist-panel-body`, and explicit close button. Do not create separate chooser and detail dialogs.

- [ ] **Step 4: Position the button independently at the yellow-marked location**

```css
.matchup {
  position: relative;
}

.twist-button {
  position: absolute;
  left: 50%;
  bottom: 0;
  display: grid;
  width: 44px;
  min-height: 44px;
  padding: 0;
  translate: -50% 0;
  place-items: center;
}
```

Do not edit `.versus`, `grid-template-columns`, card widths, card padding, or matchup gaps in this task.

- [ ] **Step 5: Implement a two-view state machine inside the same open dialog**

Use module state:

```js
let selectedTwist = null;
let twistPanelView = 'chooser';
let expandedTwist = null;
```

`openTwistPanel()` sets `twistPanelView` to `detail` when `selectedTwist` exists, otherwise `chooser`, renders, then calls `showModal()` once. `selectTwist(twist)` assigns the record, sets `detail`, and rerenders without `close()` or `showModal()`. `Change Twist` sets `chooser`; `No Twist` sets `selectedTwist = null` and renders an in-panel confirmation. Only the close button, Escape, or backdrop closes the dialog.

- [ ] **Step 6: Render chooser accordions and stable actions**

Render six rows from `twists` in official order. A row header toggles only `expandedTwist`; its body shows localized effects and `Select this Twist`. Keep `Random Twist` and `No Twist` in a sticky footer inside the dialog. `Random Twist` calls `pickRandomTwist()` and immediately renders that result's detail in the same dialog.

Do not attach `pointerenter`, `pointerleave`, hover-open, delayed-open, or view-transition handlers to Twist UI.

- [ ] **Step 7: Localize optional-state and accessible labels**

Add RU/ENG strings for: optional explanation, Twist title, random, no Twist, select, change, close, selected state, and no-Twist confirmation. `render()` updates the central button `aria-label`, `title`, and `aria-pressed`; no selection remains normal and does not disable any element.

- [ ] **Step 8: Style one viewport-contained no-motion panel**

Use the existing dialog safe-area bounds. Give `#twist-dialog` a desktop maximum width around 620px, a grid of header/body/footer, internal body scrolling, one-column mobile rows, a sticky footer, selected-row treatment, and no transform/opacity/keyframe transitions. The global reduced-motion rule remains authoritative.

- [ ] **Step 9: Run focused and full tests to verify GREEN**

Run:

```powershell
npm.cmd test -- test/ui.test.js test/rules.test.js
npm.cmd test
```

Expected: all tests pass; runtime assertions confirm one continuously open dialog across chooser/detail transitions.

- [ ] **Step 10: Commit the optional Twist workflow**

```powershell
git add app/index.html app/app.js app/styles.css test/ui.test.js
git commit -m "feat: add optional twist reference refs #11"
```

### Task 6: Balance Portrait Map Space

**Files:**
- Modify: `app/app.js:111-124`
- Modify: `app/styles.css:512-552`
- Modify: `test/ui.test.js:250-334`

- [ ] **Step 1: Write failing portrait-height and centering tests**

Extend the harness with portrait viewport values and assert a width-limited tall viewport grows the logical sheet:

```js
document.documentElement.clientWidth = 412;
document.documentElement.clientHeight = 915;
window.innerWidth = 412;
window.innerHeight = 915;
window.dispatch('resize');
assert.equal(document.documentElement.style.getPropertyValue('--sheet-scale'), String(412 / 768));
assert.equal(document.documentElement.style.getPropertyValue('--sheet-height'), `${915 / (412 / 768)}px`);
```

Add static assertions for portrait `.app-sheet { display: flex; flex-direction: column; }`, flexible `.map-panel`, and centered `.map-button`.

- [ ] **Step 2: Run UI tests to verify RED**

Run:

```powershell
npm.cmd test -- test/ui.test.js
```

Expected: FAIL because the released code leaves `--sheet-height: 1280px` fixed.

- [ ] **Step 3: Grow only width-limited portrait sheets**

Replace `fitSheet()` with the same inset calculation plus:

```js
const root = document.documentElement;
const portrait = availableWidth <= 600 && availableHeight > availableWidth;
const sheetWidth = 768;
let sheetHeight = portrait ? 1280 : 1080;
const widthScale = availableWidth / sheetWidth;
if (portrait && sheetHeight * widthScale < availableHeight) sheetHeight = availableHeight / widthScale;
const scale = Math.min(widthScale, availableHeight / sheetHeight);
root.style.setProperty('--sheet-height', `${sheetHeight}px`);
root.style.setProperty('--sheet-scale', String(scale));
```

Reset to 1080 when leaving portrait so desktop resize cannot retain the tall value.

- [ ] **Step 4: Let the portrait map panel consume and center remaining space**

Inside the existing portrait media query add:

```css
.app-sheet {
  display: flex;
  flex-direction: column;
}

.map-panel {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  flex: 1;
  min-height: 0;
}

.map-button {
  height: 100%;
  min-height: 0;
  place-items: center;
}

#map,
.map-button img {
  width: 100%;
  height: auto;
  max-height: 100%;
}
```

Keep the body non-scrolling and top safe-area alignment. Do not change desktop map sizing.

- [ ] **Step 5: Run focused and full tests to verify GREEN**

Run:

```powershell
npm.cmd test -- test/ui.test.js
npm.cmd test
```

Expected: 0 failures; desktop remains 768x1080 and portrait tall viewports fill their safe height.

- [ ] **Step 6: Commit portrait balancing**

```powershell
git add app/app.js app/styles.css test/ui.test.js
git commit -m "fix: balance portrait map spacing refs #11"
```

### Task 7: Responsive Browser And Native Acceptance

**Files:**
- Create temporarily: `D:\Temp\okami\wh40k-v05-smoke.cjs`
- Write artifacts: `output/playwright/`
- Modify only if verification finds a reproduced defect: the file that owns that defect plus its failing test

- [ ] **Step 1: Create the external Playwright smoke from the existing v0.4 runner**

Use `require('playwright')`, a local static server for `app/`, and these viewports: `320x568`, `360x800`, `412x915`, `480x1040`, the supplied phone screenshot surface `560x1280`, `768x1080`, and `1366x728`.

For each viewport assert:

- both custom disposition menus contain five buttons, centered by bounding-box midpoint within 1px, select values, close by Escape, and restore focus;
- `.versus` remains centered on the card-gap midpoint and card vertical midpoint;
- `#twist-button` is centered on the same gap and its bottom equals both card bottoms within 1px;
- named and random Twist choices keep the same dialog open, details are readable, reopen shows details, change returns to chooser, and only `No Twist` clears;
- the Twist dialog has no animation name and no transition duration above 0.01ms under reduced motion;
- left/right mission popovers are 500px or viewport-clamped, mirror from outer card edges, scroll internally when needed, and do not shift the map;
- portrait map free space above and below inside `.map-button` differs by at most 2px;
- page scroll width/height do not exceed viewport; zero console, page, request, or HTTP errors.

- [ ] **Step 2: Run the complete automated suite before browser checks**

Run:

```powershell
npm.cmd test
```

Expected: all tests pass with 0 failures.

- [ ] **Step 3: Run Playwright and inspect screenshots**

Run with the established external runtime:

```powershell
$env:NODE_PATH='D:\Temp\okami\pw-smoke\node_modules'
node 'D:\Temp\okami\wh40k-v05-smoke.cjs'
```

Expected final line: `v0.5 responsive smoke passed`; screenshots show centered option rows, unchanged `VS`, marked-position Twist button, readable panels, and balanced portrait spacing.

- [ ] **Step 4: Package and manually inspect Windows**

Run:

```powershell
npm.cmd run dist
```

Install or launch the fresh packaged executable. Verify the Windows disposition popup no longer has the native left gutter, both mission popovers mirror correctly, `VS` did not move, and the Twist workflow never flashes between windows.

- [ ] **Step 5: Build and verify the signed ARM64 APK**

Run:

```powershell
npm.cmd run android:build
```

Use the existing protected signing configuration. Verify APK Signature Scheme v2, signer certificate SHA-256 equality with v0.4.0, application ID, version code/name, and ARM64-only library contents. Install as an upgrade on the physical device; check all six Twist rows, one named selection, one random result, repeated detail viewing, `No Twist`, disposition menus, mission scrolling, and portrait spacing.

- [ ] **Step 6: Fix only reproduced defects through a fresh RED-GREEN cycle**

For any failure, add the smallest failing Node or Playwright assertion, verify it fails for the observed reason, implement the owning fix, rerun the focused check, then rerun Steps 2-5. Do not bundle unrelated polish.

- [ ] **Step 7: Commit any verification-only test or fix**

```powershell
git add app test
git commit -m "test: harden twist and mission acceptance refs #11"
```

Skip this commit when verification required no tracked changes.

### Task 8: Prepare v0.5.0 Documentation And Review

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src-tauri/tauri.conf.json`
- Modify: `src-tauri/gen/android/app/build.gradle.kts`
- Modify: `test/tauri.test.js`
- Modify: `README.md`
- Add/update: `docs/screenshots/*.png`

- [ ] **Step 1: Write the failing version test**

Change `test/tauri.test.js` to require `0.5.0` in package/Tauri config, Android `versionName`, and the repository's existing numeric Android version-code convention.

- [ ] **Step 2: Run the version test to verify RED**

Run:

```powershell
npm.cmd test -- test/tauri.test.js
```

Expected: FAIL because all tracked versions remain 0.4.0.

- [ ] **Step 3: Bump all application versions together**

Run:

```powershell
npm.cmd version 0.5.0 --no-git-tag-version
```

Then update `src-tauri/tauri.conf.json` and Android Gradle values to the same release, preserving application ID and signer.

- [ ] **Step 4: Update README and screenshots from verified states**

Document: optional-by-default Twist behavior, the six choices, random/manual/no-Twist flow, detailed mission VP references, deterministic disposition menus, balanced portrait layout, offline behavior, and v0.5.0 build commands. Publish only screenshots captured from the verified app; do not mock release evidence.

- [ ] **Step 5: Run final verification before any completion claim**

Run:

```powershell
npm.cmd test
git diff --check
git status --short
```

Then rerun the Playwright smoke, Windows build, Android build/signature check, and physical-device smoke from Task 7. Record exact test counts, artifact paths, sizes, SHA-256 hashes, signature certificate digest, and manual observations in GitHub issue #11.

- [ ] **Step 6: Commit the release preparation**

```powershell
git add package.json package-lock.json src-tauri/tauri.conf.json src-tauri/gen/android/app/build.gradle.kts test/tauri.test.js README.md docs/screenshots
git commit -m "chore: prepare v0.5.0 release refs #11"
```

- [ ] **Step 7: Push and open a draft pull request**

```powershell
git push
gh pr create --draft --base main --head codex/issue-11-twists-mission-details --title "Add optional twists and detailed mission references" --body "Closes #11"
```

Do not merge or publish the GitHub Release until automated checks, Windows inspection, physical Android acceptance, artifact signature/hash verification, and user review are all recorded.

## Final Requirement Checklist

- [ ] Expanded Force Disposition choices are geometrically centered on Windows and keyboard accessible.
- [ ] All 25 missions expose accurate RU/ENG VP details from audited current sources.
- [ ] Mission popovers are wider, mirrored from outer card edges, viewport-contained, and internally scrollable.
- [ ] Twist is explicitly optional and defaults to `No Twist` without blocking anything.
- [ ] All six current Twists have readable RU/ENG effects, manual selection, random selection, and explicit clearing.
- [ ] One stable Twist dialog switches views without close/reopen flashes or hover automation.
- [ ] Reopening an active Twist shows details and never clears it.
- [ ] `VS` markup and placement remain unchanged; the Twist button is independently bottom-centered in the card gap.
- [ ] Portrait maps use balanced remaining space with no large bottom-only block.
- [ ] Desktop, all target phones, Windows package, and signed ARM64 upgrade pass fresh verification.
- [ ] GitHub issue #11, branch, commits, draft PR, test evidence, hashes, and remaining manual actions reflect reality.
