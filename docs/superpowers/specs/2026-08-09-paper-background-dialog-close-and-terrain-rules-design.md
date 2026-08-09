# Paper Background, Dialog Close, and Terrain Rules - Design

**Issue:** #14

**Date:** 2026-08-09
**Sources of truth:** GitHub issue #1, this approved design, and `eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf` (Event Companion v1.1). Do not use the older June Event Companion.

## Goal

Polish the released v0.5.0 application in four focused ways:

1. remove the duplicate close action from selected Twist details;
2. replace every visible dialog `Close` label with a stable icon-only cross;
3. replace the Terrain Layout rules screenshot with bilingual semantic HTML;
4. cover the complete main-screen background with the authentic Event Companion paper so the cropped map no longer looks pasted onto a different white surface.

All existing Force Disposition, mission, Twist, A/B/C, free-layout, map, localization, desktop, and Android behavior remains unchanged unless this document explicitly says otherwise.

## Authentic Paper Background

### Source

Extract one reproducible paper asset from the shared background used by Event Companion v1.1 layout pages 9-53. Inspection confirms that all 45 current lossless WebP maps use the same paper artwork: paper-like pixels in representative outer bands match at 99.4-100%, and the PDF pages reuse the same underlying artwork.

The extraction belongs in the existing `tools/extract_layouts.py` workflow. The packaged application must not depend on the source PDF at runtime.

### Placement

The paper is only the rear background of the main application screen:

- it covers the complete viewport, including letterboxed space outside the scaled logical sheet;
- the logical `.app-sheet` and map container do not introduce a second white background;
- selector cards, buttons, menus, popovers, and all native dialogs retain their existing white surfaces;
- dialog backdrops retain their existing dark overlay;
- the paper does not appear as a new texture inside Twist, Terrain Layout, Layouts Key, All Layouts, mission details, or the enlarged-map dialog.

Use one authentic paper asset and one coordinate system. Preserve its aspect ratio and texture scale; do not stretch it independently on either axis and do not substitute a CSS noise approximation. During extraction, extend the asset beyond its exact central source region using only the source's outer paper so the single packaged image covers the widest supported viewport at the aligned scale. At runtime, position that central source region from the existing map crop rectangle `(82, 245, 513, 765)` and the rendered map geometry. The viewport crops only the prebuilt outer extension; it never rescales or moves the aligned stains beside the map.

The result must work for the current fixed logical sheet, its proportional mobile scaling, portrait-specific map sizing, and landscape/desktop letterboxing. Changing A/B/C or selecting any of the 45 free layouts must not shift the paper because all maps share the same source background coordinates.

### Required Packaging

The paper WebP is a required local application asset and must be bundled in both Windows and Android outputs. Its absence or failure to load is a failed test/build, not an accepted runtime mode. A matching solid background color may sit beneath the image only to avoid a flash while the local image decodes; it is not a fallback product state.

## Dialog Close Controls

Every native dialog has one icon-only `×` close button in the right side of its header:

- Twist chooser and selected Twist detail;
- Terrain Layout;
- Layouts Key;
- enlarged map;
- All Layouts gallery.

The visible glyph does not change with language. Each button keeps a 44 x 44 CSS-pixel interactive target, visible focus, normal hover/active behavior, and a localized accessible name (`Закрыть` or `Close`). Escape and backdrop-click closing remain available.

When a Twist has been selected, remove the footer `Close` action entirely. The header cross is the only close action and `Change` is the only footer action. The chooser footer keeps its existing `Random` and `No Twist` actions.

The icon-only control prevents title/header movement when RU and ENG are switched.

## Localized Terrain Layout Content

Replace `#terrain-rules-image` with semantic content in the existing white Terrain Layout dialog. Keep the dialog header and its new cross. Do not reproduce the decorative vertical `TERRAIN LAYOUTS` wordmark because the dialog header already supplies the title.

The scrollable body contains, in order:

1. two introductory paragraphs;
2. the `Recommended Terrain Area Footprints` heading and explanatory paragraph;
3. a two-column, five-row footprints table;
4. the `Terrain Features` heading and two explanatory paragraphs.

The body is the scrolling region on constrained screens; the dialog header remains reachable. Use semantic headings, paragraphs, emphasis, and `<table>` markup. Units and quantities remain unchanged between languages.

### Footprints Table

| Terrain area footprint size | Quantity |
| --- | ---: |
| 6" x 4" | 4 |
| 10" x 2.5" | 2 |
| 6" x 2" | 4 |
| 7" x 11.5" | 4 |
| 8" x 11.5" Polygon | 2 |

### Copy Rules

The English view preserves the Event Companion v1.1 wording shown on page 7. The Russian view is a faithful translation rather than a summary. Preserve the named source `Battlefields: Armageddon`, the `Hidden` rules term, the dense/light terrain classification, and the `warhammer-community.com` reference. Keep existing project terminology for terrain, missions, players, and layouts.

Store the long localized body in one plain `terrainRulesCopy` object adjacent to the existing `text.ru` and `text.en` interface copy. Keep DOM rendering in the existing application module. Do not add a templating library, Markdown parser, remote content, or runtime fetch.

#### Approved English Copy

The following layouts are presented for Warhammer Event organisers and players to use in all of their games of Warhammer 40,000 using the most recent Chapter Approved Mission Deck. These are the layouts that are used at Games Workshop events and are designed for the best experience by the Warhammer Studio team, to reflect battlefields that create risk-and-reward decisions with each player's objectives in mind.

Each combination of Primary Missions has three recommended layouts, labelled A, B and C. As directed by the Warhammer Event organiser, the players either use the layout specified or randomly determine which of these layouts to use.

**Recommended Terrain Area Footprints**

We have listed the terrain area footprints these recommended layouts use. You can find a PDF with these footprints ready for you to print on warhammer-community.com.

**Terrain Features**

Each layout is shown with the terrain features from the Battlefields: Armageddon box using the 'Warhammer recommended' build configuration from the construction booklet. We've denoted each terrain feature from that set as either a dense or light terrain feature in these layouts. The configurations of the terrain features and terrain areas are designed to create the best experience with the Hidden rule and movement rules for various units, and to create plenty of interesting decisions during a battle. We've also purposely left space between a terrain feature and the edge of the terrain area to allow a line of models to be on the terrain area from the 'outside'.

If you do not have the Battlefields: Armageddon terrain, it is possible to recreate these layouts with your own terrain that is close to the same size of the various terrain features by denoting for all players if they are dense or light terrain features.

#### Approved Russian Copy

Следующие схемы предназначены для организаторов мероприятий Warhammer и игроков и могут использоваться во всех играх Warhammer 40,000 с самой актуальной колодой миссий Chapter Approved. Эти схемы используются на мероприятиях Games Workshop и разработаны командой Warhammer Studio для наиболее интересной игры на полях боя, где игрокам приходится сопоставлять риск и награду с учётом своих целей.

Для каждой комбинации основных миссий предусмотрены три рекомендуемые схемы: A, B и C. По указанию организатора мероприятия Warhammer игроки используют назначенную схему или определяют одну из этих схем случайным образом.

**Рекомендуемые размеры зон террейна**

Ниже перечислены размеры зон террейна, используемых в рекомендуемых схемах. На сайте warhammer-community.com можно найти готовый к печати PDF с этими контурами.

**Элементы террейна**

Каждая схема показана с элементами террейна из набора Battlefields: Armageddon в рекомендованной Warhammer конфигурации сборки из инструкции. Каждый элемент этого набора обозначен на схемах как плотный или лёгкий элемент террейна. Конфигурации элементов и зон террейна рассчитаны на наиболее интересную игру с учётом правила Hidden и правил перемещения различных подразделений и создают множество значимых решений во время боя. Между элементом террейна и краем зоны террейна намеренно оставлено место, чтобы ряд моделей мог размещаться в зоне террейна со стороны внешнего края.

Если у вас нет террейна Battlefields: Armageddon, эти схемы можно воспроизвести с собственным террейном близкого размера. Перед игрой сообщите всем игрокам, какие элементы считаются плотными, а какие лёгкими.

## State and Interaction

- Language switching immediately updates the Terrain Layout title, body copy, table headings, accessible close name, and relevant alternative/accessibility text.
- Switching language while the Terrain Layout dialog is open preserves its open state and scroll ownership.
- No new persistent state is introduced.
- The background is independent of application state and does not rerender when layouts, dispositions, missions, or Twists change.
- Existing focus restoration, Escape behavior, backdrop close, and dialog containment remain intact.

## Failure Boundaries

- The extraction script fails explicitly when Event Companion v1.1 is absent, consistent with the existing asset workflow.
- Tests fail if the required paper asset is absent, empty, not referenced by the application, or unavailable from the local app server.
- The Terrain Layout body is bundled HTML/data, so it has no image-load or network failure mode.
- Existing map and gallery image-error behavior remains unchanged.

## Verification

Follow test-driven development during implementation.

### Automated Node Checks

- assert the required paper asset exists and the extraction script creates it from Event Companion v1.1;
- assert the application references the bundled paper and does not approximate it with CSS noise;
- assert every native dialog header has one icon-only close control with an accessible name;
- assert the selected Twist detail footer contains `Change` but no second close action;
- assert the Terrain Layout dialog uses semantic content rather than `terrain-rules.webp`;
- assert both languages include all sections and all five table rows;
- retain all existing v0.5.0 behavior and geometry tests.

### Responsive Playwright Checks

Run the current seven-view viewport matrix: 320 x 568, 360 x 800, 412 x 915, 480 x 1040, 560 x 1280, 768 x 1080, and 1366 x 728.

At representative phone and desktop sizes, verify:

- paper covers the entire main viewport with no remaining white strip;
- the map boundary does not read as a separate rectangular paper cutout;
- stains adjacent to the map retain their scale and position across A/B/C and a free layout;
- every dialog remains solid white;
- every close cross is reachable, stable across RU/ENG, keyboard-operable, and 44 x 44;
- Terrain Layout headings, paragraphs, emphasis, table, and scrolling remain readable in both languages;
- no page overflow, clipped dialog, console error, failed local request, or unexpected HTTP response occurs.

Visually inspect the latest screenshots rather than relying only on geometry assertions. The paper/map blend is an acceptance criterion and must be judged from rendered output.

### Packaging Checks

- run the complete Node suite;
- build the Windows application and signed ARM64 Android APK using the existing release workflow;
- verify the paper asset is present and loads in both packages;
- record final hashes and verification evidence on issue #14 before closing it.

## Non-Goals

- no redesign of selector cards, VS placement, Twist control, layout buttons, gallery cards, mission details, or map content;
- no texture inside dialogs or white UI surfaces;
- no new dependency or runtime image processing;
- no translated/redrawn map artwork, Layouts Key artwork, or mission-map labels;
- no use of the older June Event Companion.
