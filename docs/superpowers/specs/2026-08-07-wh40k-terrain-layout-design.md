# WH40K Terrain Layout - Design

## Goal

Build a small offline Windows application that selects the official Warhammer 40,000 terrain layout for a pair of Force Dispositions. The first release is a Windows installer; the shared UI must remain portable to Android.

## Source of truth

- Use only `eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf` (Warhammer Event Companion, version 1.1).
- Terrain rules and key are on pages 7-8.
- The 45 layouts are on pages 9-53: 15 disposition pairs, each with layouts A, B, and C.
- The older June PDF is not used.

## User interface

The application has one responsive screen:

1. Two selectable Force Disposition cards at the top, separated by `VS`.
2. Each card shows the mission derived from the complete disposition pair.
3. A large `A / B / C` layout selector appears below the cards.
4. The selected terrain map appears below the selector.
5. The map can be opened at a larger size.

The five selectable dispositions are:

- Take and Hold
- Purge the Foe
- Disruption
- Reconnaissance
- Priority Assets

Selecting the same disposition on both sides is valid. Reversing two different dispositions swaps the displayed cards and missions but uses the same official map; the terrain image is not rotated.

## Pair-to-mission mapping

| Left disposition | Right disposition | Left mission | Right mission | PDF pages |
| --- | --- | --- | --- | --- |
| Take and Hold | Take and Hold | Battlefield Dominance | Battlefield Dominance | 9-11 |
| Take and Hold | Purge the Foe | Immovable Object | Unstoppable Force | 12-14 |
| Take and Hold | Disruption | Determined Acquisition | Death Trap | 15-17 |
| Take and Hold | Reconnaissance | Purge and Secure | Reconnaissance Sweep | 18-20 |
| Take and Hold | Priority Assets | Inescapable Dominion | Secure Asset | 21-23 |
| Purge the Foe | Purge the Foe | Meatgrinder | Meatgrinder | 24-26 |
| Purge the Foe | Disruption | Punishment | Delaying Action | 27-29 |
| Purge the Foe | Reconnaissance | Consecrate | Triangulation | 30-32 |
| Purge the Foe | Priority Assets | Destroyer's Wrath | Vital Link | 33-35 |
| Disruption | Disruption | Outmanoeuvre | Outmanoeuvre | 36-38 |
| Disruption | Reconnaissance | Smoke and Mirrors | Surveil the Foe | 39-41 |
| Disruption | Priority Assets | Locate and Deny | Extract Relic | 42-44 |
| Reconnaissance | Reconnaissance | Gather Intel | Gather Intel | 45-47 |
| Reconnaissance | Priority Assets | Search and Scour | Vanguard Operation | 48-50 |
| Priority Assets | Priority Assets | Sabotage | Sabotage | 51-53 |

Each row maps to three image assets: layouts A, B, and C in page order.

## Architecture

- Plain HTML, CSS, and JavaScript; no frontend framework and no server.
- One static data module contains all 15 pair mappings, missions, and image paths.
- One render function updates both mission labels and the selected layout image whenever a disposition or A/B/C choice changes.
- Electron supplies only the Windows window and packaging layer.
- All data and images ship inside the application and work offline.

## Assets

Crop the map area from each of the 45 relevant PDF pages at a resolution suitable for zooming. Keep the selector cards as HTML so they remain sharp and interactive. Use stable filenames derived from the canonical pair and layout letter.

## Failure handling

- Start with a valid default pair and layout A.
- If mapping data or an image is missing, show a clear in-app error instead of a broken image.
- Disable no valid disposition combinations because all 25 ordered selections are covered by the 15 canonical pairs.

## Verification

Keep one small runnable automated check that iterates through every canonical pair and verifies:

- both mission names exist;
- layout A, B, and C paths exist;
- all 45 image files are present.

Also manually verify one desktop width and one phone-sized width before packaging.

## Packaging and future Android build

- First delivery: a Windows installer and executable built with Electron.
- Later delivery: reuse the same web UI and data in a Capacitor Android wrapper.
- Avoid Electron-only behavior in the shared UI so Android does not require a rewrite.

## Non-goals for the first release

- No accounts, cloud sync, database, server, or automatic updates.
- No rules reference, army management, scoring, or tournament features.
- No Android package in the first delivery.
