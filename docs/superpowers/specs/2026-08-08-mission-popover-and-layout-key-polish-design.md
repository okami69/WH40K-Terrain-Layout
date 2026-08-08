# Mission Popover And Layout Key Polish

GitHub issue: #3

## Goal

Keep mission summaries visually attached to the mission that opened them and make the official layouts key look like a native app asset rather than a full PDF page.

## Mission Summary

Retain the single shared `#mission-popover` and the existing hover, focus, click, tap, Escape, localization, and pinned-summary behavior. Reset the native popover top-layer auto-centering so the existing fixed coordinates take effect. Position the popover 8 px below the active left or right mission trigger and clamp it to the viewport. It floats above the sheet without changing card height or moving the map.

Do not duplicate popover markup, place summaries inside the selector cards, or add CSS Anchor Positioning. The current shared element plus corrected top-layer geometry is the smallest compatible solution.

## Layouts Key

Use only Event Companion v1.1 page 8. Add an explicit crop rectangle to `tools/extract_layouts.py` and crop the rendered page before saving `app/assets/key/layouts-key.webp`. The crop includes the complete grey `LAYOUTS KEY` panel from its heading through all objective icons, while excluding the white outer page, page number, and unrelated page texture.

Keep lossless WebP output and the existing offline dialog, accessible title, close action, localized alternative text, and viewport-contained image sizing. Do not package the PDF or hide unwanted page content with CSS.

## Failure Behavior

If the key cannot be regenerated because the approved PDF is absent, the extraction script continues to fail with its existing explicit missing-source message. Existing map and dialog error behavior is unchanged.

## Verification

- Add a failing Node regression test for the popover geometry reset and key crop configuration before implementation.
- Regenerate the key and verify its pixel dimensions and visual bounds against page 8.
- Run the complete Node test suite.
- Use Playwright at 768 x 1080 and a laptop viewport to verify left and right popovers appear directly below their own mission names, do not move the sheet, and remain inside the viewport.
- Open the layouts-key dialog in Playwright and verify that no PDF page number or outer page margin is visible.

## Non-Goals

- No mission-summary copy changes.
- No selector-card, map, dialog-flow, localization, or Tauri-shell redesign.
- No frontend dependency or framework.
