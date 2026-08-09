# Free Layout Gallery And Portrait Map Sizing

GitHub issue: #8

## Goal

Add a free-choice path for selecting any of the 45 Event Companion v1.1 terrain maps without changing the selected Force Dispositions or their missions. At the same time, remove wasted vertical space and enlarge the main map on portrait phones. Keep the desktop main screen unchanged.

## Scope

This remains a terrain-map selector, not a battle setup or battle-tracking tool. The change adds:

- a plus control after the existing A, B, and C controls;
- a contained gallery of all 45 bundled maps;
- a free-layout selection state independent of Force Dispositions;
- a denser portrait-mobile composition with a larger map;
- centered labels in the expanded Force Disposition menus.

The change does not add twists, attacker/defender selection, army deployment, secondary missions, scoring, a battlefield editor, custom deployment zones, or user image import.

## Selection Model

The application has two map modes:

1. **Official pair mode.** A, B, or C selects the corresponding official map for the current Force Disposition pair. This is the existing behavior.
2. **Free-layout mode.** The plus control opens the gallery. Selecting any gallery item displays that map and marks plus as active.

Force Dispositions and missions remain independent from the free map. While plus is active:

- changing either Force Disposition updates both mission names and summaries;
- the selected free map does not change;
- the map may intentionally contain deployment zones or objective positions that do not match the selected missions.

Pressing A, B, or C exits free-layout mode and restores the official map for the current disposition pair. Pressing plus always opens the gallery. If a free map was already selected, it remains selected and is highlighted when the gallery reopens. Closing the gallery without selecting a map changes nothing.

The last free selection only needs to live for the current application session. Persistence across application restarts is not required.

## Main-Screen Controls

Retain the existing A, B, and C buttons and add one equally sized plus button to the same group. The four controls retain 44 px minimum touch targets, keyboard operation, visible focus, and `aria-pressed` state.

In official pair mode, the existing localized `Layout A`, `Layout B`, or `Layout C` title remains. In free-layout mode, the map panel shows only the localized `Free layout` title. It does not show a second visible source line, because that variable-height row would shift the map downward when free mode is selected.

The bundled image source remains visible on its gallery card and remains available in the map image alternative text and full-size map viewer title. Removing the redundant main-sheet source row does not change Force Dispositions, missions, or the selected map.

## Gallery

Use the existing native `dialog` pattern. The dialog stays inside the application viewport and safe-area insets on desktop and mobile. Its header remains visible and contains a localized title and close action.

The gallery body is the application's only scrolling surface. The main sheet, page body, and other dialogs remain non-scrolling. The dialog itself is viewport-contained and hides overflow; an inner gallery region owns `overflow-y: auto`.

Maps must be large enough to inspect before selection:

- one card per row on portrait phones;
- up to two cards per row when the desktop dialog has enough width;
- each card contains a large aspect-correct preview, source pair, layout letter, and deployment name;
- the active free map has a persistent selected border and accessible selected state;
- selecting anywhere on a card chooses the map and closes the gallery.

Group cards under the six deployment headings so the long list remains scannable:

- Crucible of Battle: 7 maps;
- Dawn of War: 6 maps;
- Hammer and Anvil: 5 maps;
- Search and Destroy: 8 maps;
- Sweeping Engagement: 9 maps;
- Tipping Point: 10 maps.

Use native image lazy loading and asynchronous decoding for gallery previews. Do not add virtualization, a search field, filters, or a frontend dependency. The 45 lossless WebP files are already bundled and total about 19.1 MB; no new map assets are required.

## Layout Catalog

Extend the existing matchup data into a flat catalog entry for each asset. Each entry exposes the canonical disposition pair, layout letter, image path, and deployment name. Gallery cards and accessible free-layout metadata consume this catalog; official pair resolution continues to use the existing matchup resolver.

The deployment grouping for the bundled maps is:

### Crucible of Battle

- `disruption--disruption-a`
- `priority-assets--priority-assets-b`
- `purge-the-foe--reconnaissance-c`
- `reconnaissance--priority-assets-a`
- `reconnaissance--reconnaissance-b`
- `take-and-hold--disruption-b`
- `take-and-hold--priority-assets-a`

### Dawn of War

- `disruption--reconnaissance-b`
- `purge-the-foe--priority-assets-a`
- `purge-the-foe--reconnaissance-b`
- `take-and-hold--priority-assets-c`
- `take-and-hold--reconnaissance-b`
- `take-and-hold--take-and-hold-b`

### Hammer and Anvil

- `purge-the-foe--priority-assets-c`
- `purge-the-foe--reconnaissance-a`
- `take-and-hold--disruption-c`
- `take-and-hold--priority-assets-b`
- `take-and-hold--purge-the-foe-c`

### Search and Destroy

- `disruption--priority-assets-c`
- `disruption--reconnaissance-c`
- `purge-the-foe--disruption-a`
- `purge-the-foe--priority-assets-b`
- `purge-the-foe--purge-the-foe-a`
- `take-and-hold--purge-the-foe-b`
- `take-and-hold--reconnaissance-c`
- `take-and-hold--take-and-hold-c`

### Sweeping Engagement

- `disruption--disruption-c`
- `disruption--priority-assets-a`
- `priority-assets--priority-assets-a`
- `purge-the-foe--disruption-c`
- `purge-the-foe--purge-the-foe-c`
- `reconnaissance--priority-assets-c`
- `reconnaissance--reconnaissance-a`
- `take-and-hold--disruption-a`
- `take-and-hold--purge-the-foe-a`

### Tipping Point

- `disruption--disruption-b`
- `disruption--priority-assets-b`
- `disruption--reconnaissance-a`
- `priority-assets--priority-assets-c`
- `purge-the-foe--disruption-b`
- `purge-the-foe--purge-the-foe-b`
- `reconnaissance--priority-assets-b`
- `reconnaissance--reconnaissance-c`
- `take-and-hold--reconnaissance-a`
- `take-and-hold--take-and-hold-a`

Each catalog slug receives the existing `-a.webp`, `-b.webp`, or `-c.webp` suffix represented by its final layout letter.

## Portrait Mobile Layout

The current mobile gap is caused by scaling a fixed 768 x 1080 sheet and vertically centering the scaled result. On a tall phone, width determines the scale, leaving unused space above and below the sheet. The map is also constrained to a fixed logical height of 600 px, so its portrait image cannot use the available content width.

For portrait mobile only:

- top-align the scaled sheet immediately below the top safe-area inset;
- preserve the existing header, selector-card content, typography, and minimum touch sizes;
- retain the current horizontal selector-card arrangement;
- let the map render at the available content width with its natural aspect ratio instead of a fixed 600 px height;
- let the sheet and stage use the resulting taller logical content height so the map is not clipped;
- keep the page body non-scrolling and preserve bottom safe-area clearance.

The sheet-fitting calculation must use the active logical sheet dimensions instead of assuming 768 x 1080. Short portrait phones still scale the entire sheet down to fit. Tall portrait phones remove the current top offset and devote the extra height to the larger map. Desktop keeps the existing centered 768 x 1080 composition and map sizing.

## Force Disposition Menu Alignment

Keep both native Force Disposition selects and their existing dimensions, typography, custom right-side arrow, keyboard behavior, and 44 px minimum target. Center both the selected value in the closed control and every label in the expanded options menu.

The Windows native popup reserves a system gutter on the left of its option content. Plain `text-align: center` therefore centers text inside an asymmetric content region and leaves the label visually shifted to the right. Retain explicit centered alignment and add the smallest option-only inline-end compensation supported by the Windows WebView so the visible text center aligns with the popup center. Keep this adjustment out of the closed select so its already-centered value and custom arrow do not move.

Android may replace the HTML popup with a system-owned selection surface that ignores option CSS. Record that platform behavior if observed; do not replace the native select or add a custom dropdown.

## Data Flow

1. Startup resolves the current disposition pair and official layout A as today.
2. A/B/C updates the official layout letter, switches to official pair mode, and renders through `resolveMatchup`.
3. Plus opens the gallery without changing the current screen state.
4. Selecting a catalog entry stores that entry as the current free map, switches to free-layout mode, renders its image with accessible source metadata, and closes the dialog. The main sheet shows only the localized `Free layout` title.
5. Disposition changes always re-render missions. They resolve a new image only in official pair mode.
6. The map viewer always opens the image currently visible on the main sheet.

## Failure Handling

- If a gallery image fails to load, its card shows the existing localized missing-image message and cannot be selected.
- If the active free image fails to load, use the existing main-map error treatment and keep the gallery available so another image can be chosen.
- An invalid catalog entry is rejected by the same data-level checks used for matchup assets.
- Closing the gallery by its button, Escape, or backdrop preserves the prior mode and image.

## Verification

Use test-driven development for implementation.

Automated checks must verify:

- the catalog contains exactly 45 unique existing WebP assets;
- every entry has a known pair, A/B/C letter, and one of the six deployment names;
- deployment group counts are 7, 6, 5, 8, 9, and 10;
- selecting a free map does not change either disposition or mission;
- disposition changes preserve the active free map;
- A/B/C exits free mode and resolves the current pair normally;
- plus reopens the gallery with the current free item selected;
- gallery previews use native lazy loading;
- free mode has no visible source row below its title, and selecting it does not shift the map downward;
- the main sheet remains non-scrolling and the gallery inner region is the only scroll container;
- closed Force Disposition values have explicit centered alignment;
- Windows expanded option labels are visually centered after accounting for the native left gutter, while any Android system-popup limitation is recorded rather than hidden by a custom control.

Final Playwright checks must cover:

- portrait widths 320 x 568, 360 x 800, 412 x 915, and 480 x 1040;
- the physical Android portrait viewport used for the current release;
- a representative desktop viewport;
- top alignment and safe-area clearance on portrait mobile;
- visibly larger portrait map sizing without clipping;
- one-column mobile and readable desktop gallery cards;
- contained gallery dimensions, internal scrolling to the final group, selection, reopening, Escape, and backdrop close;
- centered expanded Force Disposition labels in the Windows application and the Android WebView where the platform exposes HTML option styling;
- zero console errors and successful enlargement of both official and free maps.

## Non-Goals

- No twist selection.
- No attacker/defender, army deployment, secondary mission, scoring, history, or battle tracking.
- No user-uploaded images or terrain editor.
- No random-map button, search, filters, favorites, or map persistence across restarts.
- No desktop main-sheet redesign.
- No new framework or dependency.
