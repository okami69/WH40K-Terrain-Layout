# WH40K Terrain Layout

An offline table companion that selects the official terrain map for a pair of Warhammer 40,000 Force Dispositions. The current release is a Windows desktop app; a future Android build can wrap the same `app/` web UI with Capacitor.

The five Force Dispositions are:

- Take and Hold
- Purge the Foe
- Disruption
- Reconnaissance
- Priority Assets

## Use

1. Select the left and right players' Force Dispositions. The app derives each player's mission from that pair.
2. Choose layout A, B, or C.
3. Click the map to open the enlarged view.

The app works offline. Its bundled maps and selection logic run locally, and it does not send usage data anywhere.

## Develop and build

Prerequisites: Node.js with npm. Python is needed only to re-extract the bundled layout images from the source PDF.

```powershell
npm.cmd install
npm.cmd test
npm.cmd start
npm.cmd run dist
```

The Windows installer is written to `dist/WH40K Terrain Layout Setup 0.1.0.exe`.

To re-extract the maps with the current bundled Python runtime:

```powershell
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m pip install -r tools/requirements.txt
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tools/extract_layouts.py
```

Place Event Companion v1.1 at the repository root with this exact filename before extraction:

`eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf`

The older June Event Companion is not used. Source PDFs are local inputs and are not committed.

## Project structure

- `app/` — shared web UI, matchup logic, and bundled terrain maps
- `electron/` — Windows desktop shell
- `test/` — Node test suite
- `tools/` — optional PDF extraction script and Python requirements
- `docs/superpowers/` — approved design and implementation records

See the [design specification](docs/superpowers/specs/2026-08-07-wh40k-terrain-layout-design.md), [implementation plan](docs/superpowers/plans/2026-08-07-wh40k-terrain-layout-implementation.md), and [GitHub issue #1](https://github.com/okami69/WH40K-Terrain-Layout/issues/1).
