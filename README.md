# WH40K Terrain Layout

Offline Windows desktop companion for finding the official Warhammer 40,000 terrain map for a match. Choose both players' Force Dispositions and layout A, B, or C; the app shows the corresponding terrain placement diagram, assigned missions, and concise mission summaries.

**Latest version:** [v0.2.2](https://github.com/okami69/WH40K-Terrain-Layout/releases/tag/v0.2.2)

Everything needed at the table is bundled with the application, so it works without an internet connection after installation. The interface supports Russian and English, includes the official Layouts Key and Terrain Layouts rules, and can enlarge any map for closer inspection.

## Features

- Resolves the terrain map from two Force Dispositions and layout A, B, or C.
- Shows the mission assigned to each player with a short RU/ENG objective summary.
- Includes the official Terrain Layouts rules, recommended terrain footprints, and Layouts Key from Event Companion v1.1.
- Opens each terrain map in a full-size viewer.
- Remembers the selected language and follows the OS language on first launch.
- Runs offline in a compact Windows desktop window.

## Screenshots

| Main selector (RU) | Terrain Layouts rules |
| --- | --- |
| ![Russian main selector with Disruption versus Reconnaissance on Layout A](docs/screenshots/disruption-vs-reconnaissance-layout-a.png) | ![Terrain Layouts rules dialog](docs/screenshots/terrain-layouts-rules.png) |
| Layouts Key | Mission summary |
| ![Official Layouts Key dialog](docs/screenshots/layouts-key.png) | ![Russian mission summary for Take and Hold versus Purge the Foe on Layout B](docs/screenshots/take-and-hold-vs-purge-the-foe-layout-b.png) |
| Another matchup and layout (RU) | English interface |
| ![Russian Priority Assets versus Disruption matchup on Layout C](docs/screenshots/priority-assets-vs-disruption-layout-c.png) | ![English Reconnaissance versus Priority Assets matchup on Layout A](docs/screenshots/reconnaissance-vs-priority-assets-layout-a.png) |

## Download

Download the current Windows x64 NSIS installer from the [v0.2.2 release](https://github.com/okami69/WH40K-Terrain-Layout/releases/tag/v0.2.2). The application uses the Windows WebView2 Runtime; the installer downloads it only if it is not already present.

## Use

1. Select each player's Force Disposition from the two top cards.
2. Choose layout A, B, or C.
3. Hover, focus, click, or tap a mission name for a concise RU/ENG objective summary.
4. Use the key icon for the official layouts key, or click the map for the enlarged map viewer.

The UI switches between RU and ENG. First launch follows the OS language when it starts with `ru`; explicit RU/ENG clicks are saved locally. Official map, key, and rules images remain English because they are packaged from Event Companion v1.1.

## How it is built

The desktop application is a minimal [Tauri 2](https://tauri.app/) shell around a dependency-free frontend written in plain HTML, CSS, and JavaScript. All maps, disposition icons, rules, translations, and matchup data are packaged locally as static assets; no server or account is required at runtime.

## Develop and build

Prerequisites:

- Node.js with npm
- Rust stable MSVC toolchain
- Microsoft Visual Studio 2022 Build Tools with `Microsoft.VisualStudio.Workload.VCTools`
- WebView2 Runtime
- Python only when re-extracting PDF assets

```powershell
npm.cmd install
npm.cmd test
npm.cmd start
npm.cmd run dist
```

The Tauri NSIS installer is written under:

`src-tauri/target/release/bundle/nsis/`

Current v0.2.2 verification covers the Node test suite, Tauri production build, NSIS installer smoke check, and Playwright checks at the 768 x 1080 reference viewport and a laptop-scale viewport.

## Re-extract assets

Place Event Companion v1.1 at the repository root with this exact filename:

`eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf`

Then run:

```powershell
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m pip install -r tools/requirements.txt
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tools/extract_layouts.py
```

The extractor writes 45 lossless WebP maps, five disposition icons, `app/assets/key/layouts-key.webp`, and `app/assets/key/terrain-rules.webp`. The older June Event Companion is not used.

## Project structure

- `app/` - shared offline web UI and packaged WebP assets
- `src-tauri/` - minimal Tauri 2 desktop shell
- `test/` - Node static/behavior tests
- `tools/` - optional PDF extraction script
- `docs/superpowers/` - approved design and implementation records

See the [v0.2 design specification](docs/superpowers/specs/2026-08-08-tauri-shell-and-layout-key-design.md), [v0.2 implementation plan](docs/superpowers/plans/2026-08-08-tauri-shell-and-layout-key-implementation.md), and [GitHub issue #1](https://github.com/okami69/WH40K-Terrain-Layout/issues/1).
