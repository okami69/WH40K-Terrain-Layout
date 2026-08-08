# GitHub Screenshot Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four representative English application screenshots to the GitHub README.

**Architecture:** Use the existing external Playwright runner to load the real offline frontend, select deterministic dispositions and layouts, open mission summaries, and write PNGs to `docs/screenshots/`. A small Node test protects the README gallery and expected files.

**Tech Stack:** Plain HTML/CSS/JavaScript, Node test runner, Playwright, Markdown

---

### Task 1: Define the gallery contract

**Files:**
- Modify: `test/ui.test.js`

- [ ] Add a test that requires four named PNG files and matching README references.
- [ ] Run `node --test test/ui.test.js` and confirm it fails because the screenshots are absent.

### Task 2: Capture representative states

**Files:**
- Create: `docs/screenshots/disruption-vs-reconnaissance-layout-a.png`
- Create: `docs/screenshots/feint-vs-counterattack-layout-b.png`
- Create: `docs/screenshots/rapid-escalation-vs-encirclement-layout-c.png`
- Create: `docs/screenshots/hammer-and-anvil-vs-probe-layout-a.png`

- [ ] Serve `app/` locally and capture four 768 x 1080 English states with Playwright.
- [ ] Open the left mission summary in the first state and the right mission summary in the third state.
- [ ] Visually inspect every PNG at original resolution.

### Task 3: Publish the gallery

**Files:**
- Modify: `README.md`

- [ ] Add a `Screenshots` section near the top with a two-column HTML table and concise captions.
- [ ] Run `npm.cmd test` and confirm all tests pass.
- [ ] Check Markdown image paths and image dimensions.
- [ ] Commit, push `main`, update and close GitHub issue #4.

