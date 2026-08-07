# Tauri Shell and Layout Key - Design

## Goal

Replace Electron with a smaller Tauri 2 desktop shell, keep the existing selector behavior and visual style, show the complete app without scrolling, and add the official layout key from Event Companion v1.1 page 8.

GitHub issue: [#2](https://github.com/okami69/WH40K-Terrain-Layout/issues/2)

## Source of truth

- Continue using only `eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf`.
- Layout maps remain sourced from pages 9-53.
- The new key view is sourced from page 8, titled `LAYOUTS KEY`.
- The older June PDF remains unused.

## Window and composition

- Treat the complete app as one fixed-proportion reference sheet measuring 768 x 1080 logical pixels.
- Open the window centered at the largest size that fits the monitor's working area without maximizing it or covering the taskbar.
- Keep the selector cards, layout selector, map, and margins in the same relative positions as the approved reference image.
- Fit the complete 768 x 1080 sheet uniformly when the available screen is smaller. Do not scale or distort the map independently.
- Do not show page-level horizontal or vertical scrollbars in the normal app view.
- Keep the window resizable. Resizing fits the whole sheet proportionally and preserves its aspect ratio inside the available client area.
- Clicking the map continues to open a larger viewer for inspecting fine measurements.

## Disposition selectors

- Reproduce both selector cards in the visual structure used by the Event Companion pages: official icon, `FORCE DISPOSITION`, large disposition name, horizontal divider, `MISSION`, and large mission name.
- Use the large disposition name itself as the native selection control instead of showing a separate conventional select box.
- Keep the control visually integrated with the printed card while retaining a clear dropdown indicator, keyboard operation, hover state, and visible focus.
- Update the disposition name, official icon, and derived mission together immediately after a selection changes.
- Extract one clean icon asset for each of the five dispositions from Event Companion v1.1; do not redraw or approximate the official symbols.
- Give the two controls distinct visually hidden accessible labels for the left and right force dispositions.
- Keep the icon as reinforcement rather than the only way to identify the selected disposition.

## Layout key

- Place a compact icon-only button in the upper-right corner of the sheet.
- Draw the key icon as an inline SVG so no icon package or font is added.
- Give the button an accessible name and a short tooltip even though it has no visible text.
- Open the rendered page 8 key in an in-app overlay sized to the available viewport.
- Fit the full key page in the overlay without scrolling or a second zoom mode.
- Close the overlay with its close control, the Escape key, or a click on the backdrop.

## Mission summaries

- Make each displayed mission name an information target without changing the printed-card appearance.
- Show a compact one- or two-sentence summary on mouse hover or keyboard focus; click or tap toggles the same summary for touch use.
- Summarize the practical objective of the mission rather than reproducing the complete card or every VP condition.
- Keep all 25 summaries in the static matchup data and provide both Russian and English text.
- Derive the summaries from the Chapter Approved mission cards available through GDM 2026, cross-checking official Warhammer Community previews and Event Companion FAQ entries where available.
- State in the summary that the physical mission card or official app remains authoritative for exact scoring.

## Language selection

- Replace the current upper-right `Force disposition quick reference` text with a compact `RU / ENG` segmented language control.
- Translate all live interface text, disposition names, mission names, mission summaries, errors, tooltips, and accessible labels.
- Keep the official map images and page 8 key image unchanged in English.
- On first launch, select Russian when the operating-system language begins with `ru`; otherwise select English.
- Save the user's explicit choice locally and restore it on later launches.
- Update the document language and all visible text immediately without reloading the app.
- Store the two small translation dictionaries in the existing JavaScript code; add no localization dependency.

## Desktop architecture

- Keep the current plain HTML, CSS, JavaScript, matchup data, and Node tests.
- Replace the Electron main process and electron-builder packaging with a minimal Tauri 2 shell.
- Add no Rust commands or Tauri plugins unless the static app demonstrably requires them.
- Use the operating system WebView2 runtime rather than bundling Chromium.
- Preserve fully offline operation after installation.
- Keep the shared web UI portable to a future Tauri Android build; Android packaging is not part of this change.

## Assets and size

- Package all 45 maps and the page 8 key locally.
- Package the five official disposition icons locally.
- Convert packaged PNG assets to lossless WebP and update their paths.
- Visually compare representative maps with dense labels and the key page before removing packaged PNG copies.
- Do not package PDFs, extraction tools, tests, Electron, or development dependencies in the installer.
- Report both installer size and installed application size after the final build; there is no artificial size target that can override legibility.

## Accessibility and interaction

- Preserve native keyboard access, visible focus, minimum 44 px touch targets, and reduced-motion behavior.
- Retain readable contrast and the current restrained official style.
- Keep all existing error handling for missing matchup data or assets.
- Ensure longer Russian labels fit the fixed reference-sheet composition without clipping.

## Verification

- Existing tests continue to verify all 15 canonical pairs, missions, and A/B/C assets.
- Add checks for the new WebP paths and key asset.
- Verify the normal view has no page scrollbars at the reference size and at a smaller laptop-sized viewport.
- Verify map and key dialogs by mouse and keyboard.
- Verify both languages, saved language restoration, and mission summaries by hover, focus, click, and tap.
- Build and launch the Windows installer, then record its compressed and installed sizes.

## Non-goals

- No redesign, new visual theme, account system, server, updater, or additional rules reference.
- No forced fullscreen or automatic maximization.
- No Android package in this release.
