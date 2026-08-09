# Optional Twists And Detailed Mission Reference

GitHub issue: #11

## Goal

Prepare the next release from v0.4.0 with four focused improvements:

- reliably center every expanded Force Disposition option on Windows;
- replace short mission summaries with wider, structured mission references that include exact VP values;
- add the six current Chapter Approved 2026-27 Twists as a completely optional workflow;
- vertically center portrait maps in the unused mobile space instead of leaving a large empty block below them.

The application remains an offline terrain and mission reference. This release does not add battle tracking, score entry, secondary missions, attacker/defender setup, army lists, accounts, or network access.

## Sources Of Truth

- GitHub issue #1 and the approved base product design.
- Event Companion v1.1 for the event sequence, mission matrix, terrain layouts, and global VP limits.
- The current Chapter Approved 2026-27 Primary Mission cards for mission scoring conditions.
- The current official Warhammer 40,000 application and physical Chapter Approved 2026-27 deck for Twist names, effects, order, and icon reference.
- GitHub issue #11 for the interaction decisions approved in this design discussion.

Do not use the older June Event Companion or the older nine-card GDM Twist set. Detailed rules copy is a concise structured reference derived from the current cards, not an unrelated mission rewrite. Numeric values, timing, cumulative conditions, limits, and required actions must remain exact in RU and ENG.

## Force Disposition Menu Alignment

The v0.4.0 native option workaround adds `padding-inline-end: 30px`, but the Windows popup still reserves and renders a platform-controlled gutter inconsistently. The result remains visibly off-center in the released desktop application. More padding guesses are not a reliable fix.

Replace each visible native selector with the smallest deterministic accessible menu:

- a button retains the current selected-value typography, custom arrow, dimensions, and card position;
- activating it opens one anchored list of the five Force Dispositions;
- every option is a full-width button with geometrically centered text;
- the current value has a non-layout-shifting selected indicator and `aria-current="true"`;
- Enter or Space opens/selects, Escape closes, Tab remains usable, and focus returns to the trigger after selection or dismissal;
- selecting a disposition continues through the existing `render()` path and does not change map-mode behavior.

Use normal buttons rather than implementing a custom ARIA combobox/listbox state machine. Five button choices provide deterministic layout and ordinary keyboard semantics with less code and fewer accessibility failure modes.

## Detailed Mission Popovers

Retain one shared mission popover and the existing mission-name triggers. Replace each two-sentence summary with a structured localized mission reference containing only sections applicable to that mission:

- mission name and concise purpose;
- timing, such as battle-round restrictions and scoring phase;
- each VP condition with its exact VP value;
- cumulative, per-objective, and maximum-value labels where applicable;
- mission actions, operation markers, statuses, or card-side details where applicable;
- the existing reminder that the current physical card or official app controls if later rules updates differ.

The reference must cover all 25 Primary Missions and both sides of double-sided cards. The longest current mission is substantially larger than the existing summary, so the popover geometry changes as follows:

- the left popover starts at the left edge of the left selector card and expands rightward and downward;
- the right popover ends at the right edge of the right selector card and expands leftward and downward;
- target width is 500 logical pixels, clamped to the viewport with 12 physical pixels of clearance;
- target vertical position is 8 physical pixels below the active mission trigger;
- height is clamped to the space below the trigger and at most 65dvh;
- the content region owns `overflow-y: auto` when the complete reference is taller;
- the sheet and map never move when the popover opens;
- click/tap pins the popover, Escape and outside interaction close it, and focus/hover behavior must not flicker while the pointer moves into the popover.

RU and ENG use the same structured fields and numeric assertions. Translations may reorder words for natural language but cannot alter rules meaning.

## Optional Twist State

Twist state is independent from dispositions, missions, layout A/B/C, free-layout mode, language, and map viewers.

The initial state is `No Twist`. This is a complete valid state, not an error or unfinished setup step. It does not disable, block, warn, redirect, or modify any other application feature. A user may use the application indefinitely without opening the Twist control.

If selected, the Twist lives only for the current application session. Reload persistence and battle history are not required.

The six selectable Twists, in official application order, are:

1. Martial Pride
2. Mirrored World
3. Night Fighting
4. Nowhere to Hide
5. Ruinscape
6. Scrambled Communications

Each record contains a stable ID, official English name, natural Russian name, concise RU/ENG description, and exact structured rule effects. Random selection is uniform across these six records. Independent rerolls may return the currently selected Twist; avoiding repeats would no longer be a simple random draw and is not required.

## Central Twist Control

Preserve the existing `VS` element, grid placement, and exact centered coordinates. Do not wrap it in a new vertical rail, move it upward, or let the Twist control participate in its layout.

- make the matchup container the positioning context while leaving the existing `VS` grid item unchanged;
- place a 44 by 44 logical-pixel Twist button independently at the horizontal center of the gap between the cards;
- align the button to the bottom of the selector cards, at the marked position between the two mission portions;
- the button may occupy the existing inter-card gap but must not widen the center grid column, shrink either card, or alter either card's geometry;
- the button uses the official current Twist symbol reference: two opposing bent arrows;
- its default accessible name states that Twists are optional and none is selected;
- an active Twist changes the button's selected treatment and accessible name without trying to fit the Twist title into the narrow rail.

The central button is never a toggle. Repeating the click or tap never clears the selected Twist.

## One Stable Twist Panel

The central button opens one responsive native dialog. It is viewport-contained and uses the existing safe-area and close patterns:

- on portrait phones it occupies nearly the available viewport;
- on desktop it is a centered modal with a readable maximum width;
- only its inner body scrolls;
- it uses no decorative entrance, exit, accordion, or view-transition animation;
- `prefers-reduced-motion` continues to disable all non-essential transitions.

The same open dialog switches between two internal views without closing and reopening.

### Chooser View

- Show a clear note: `Optional - choose a Twist or continue with No Twist` in the active language.
- Show the six Twists as accordion rows in official order.
- Expanding a row reveals what the Twist changes and a `Select this Twist` action.
- Only one row needs to be expanded at a time.
- Keep `Random Twist` and `No Twist` actions visible at the bottom of the panel.
- Mark the current Twist when the chooser is reopened.

### Detail View

- Show the selected Twist name and complete concise rule reference.
- Provide `Change Twist` and `Close` actions.
- Reopening the central control while a Twist is active opens directly to this detail view.
- Choosing a named Twist changes the current dialog from chooser to detail without closing it.
- Choosing `Random Twist` selects one of the six and changes the current dialog to that result's detail without closing it.
- Choosing `No Twist` clears the selection and shows a calm in-panel confirmation. The user closes the panel explicitly.

There is no hover-triggered Twist panel on desktop and no automatic panel opening after any background interaction. Desktop and mobile use the same click/tap model so the interface cannot repeatedly flash open and closed.

## Portrait Map Balance

The v0.4.0 portrait sheet uses a fixed 1280 logical-pixel height and top-aligns it. On tall phones the sheet is width-limited, so its scaled height is shorter than the available viewport and the remaining space becomes one large empty block below the map.

For portrait widths up to 600 physical pixels:

1. Calculate the width-limited scale from the available width and the 768-pixel logical sheet width.
2. If that scale leaves unused viewport height, grow the logical sheet height to `availableHeight / widthScale` so the stage fills the safe viewport.
3. Make the map panel consume the logical height left after the header, matchup, layout controls, and title.
4. Center the natural-aspect map image vertically inside that remaining map area.
5. Keep the map at the maximum width that fits; do not enlarge it past the current full-width portrait size.
6. Preserve safe-area clearance and the non-scrolling body.

On short portrait screens, retain scale-to-fit behavior with no clipping. Desktop remains the centered 768 by 1080 composition with the existing 600-logical-pixel map slot.

## Failure Behavior

- Missing or invalid mission detail data fails the existing data validation and must not silently fall back to invented scoring text.
- A missing Twist description disables selection of only that Twist and leaves `No Twist`, other Twists, and every terrain feature usable.
- Closing the Twist panel at any point preserves the last committed Twist state.
- Closing the chooser without selecting anything changes nothing.
- Existing image, gallery, dialog, and language failure behavior remains unchanged.

## Verification

Use test-driven development for every behavior change.

Automated data checks must verify:

- exactly 25 missions contain non-empty RU/ENG structured details;
- every matchup references an existing detailed mission;
- numeric VP values, timing fields, cumulative flags, action fields, and per-mission maxima match a checked source oracle;
- exactly six uniquely identified Twists exist in official order with RU/ENG names and effects;
- random selection returns only one of those six records;
- `No Twist` is the initial valid state and never blocks another control;
- repeated central-button activation does not clear the selected Twist;
- named and random selection switch the same open panel to detail view;
- `Change Twist` returns to the chooser and only `No Twist` clears the state;
- adding or changing the Twist button leaves the `VS` bounding rectangle and both selector-card rectangles unchanged;
- disposition menus contain five geometrically centered option buttons and preserve all 25 ordered matchup results;
- portrait logical height grows only when width scaling leaves unused height.

Playwright checks must cover 320 by 568, 360 by 800, 412 by 915, 480 by 1040, the physical Android viewport, 768 by 1080, and a representative laptop viewport. Verify:

- both disposition menus are optically centered and keyboard usable;
- the `VS` bounding rectangle matches the v0.4.0 reference at every viewport while the Twist button remains centered at the bottom of the inter-card gap;
- left and right mission popovers use mirrored outer-edge anchors, remain in the viewport, scroll internally, and do not move the map;
- Twist chooser, accordion details, named selection, random result, reopening details, change flow, explicit `No Twist`, Escape, backdrop, and close button;
- the Twist panel never closes and reopens during chooser/detail transitions;
- zero automatic hover opening and zero decorative motion under reduced-motion settings;
- portrait map top and bottom free space inside its remaining area differ by no more than 2 physical pixels;
- no body scrolling, clipping, console errors, failed requests, or regressions in A/B/C, free-layout gallery, map viewer, rules, layouts key, and RU/ENG behavior.

Package and manually inspect both the Windows application and signed ARM64 Android APK. Windows acceptance must include the expanded disposition menu that the v0.4.0 workaround failed to center. Android acceptance must include one named Twist, one random Twist, repeated detail viewing, `No Twist`, and the balanced portrait map spacing.

## Non-Goals

- No Twist requirement, warning, score effect, or event-mode enforcement.
- No secondary missions, battle-round tracker, score entry, attacker/defender flow, or army setup wizard.
- No remote rules fetch, account, cloud sync, or persistent battle history.
- No random-history list, no-repeat randomization, favorites, Twist search, or filters.
- No new frontend framework or runtime dependency.
