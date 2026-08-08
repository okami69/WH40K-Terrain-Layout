# WH40K Terrain Layout

Offline Windows table companion for choosing the official Warhammer 40,000 terrain map from two Force Dispositions. v0.2 uses a compact Tauri shell around the same plain HTML/CSS/JavaScript app.

## Use

1. Select each player's Force Disposition from the two top cards.
2. Choose layout A, B, or C.
3. Hover, focus, click, or tap a mission name for a concise RU/ENG objective summary.
4. Use the key icon for the official layouts key, or click the map for the enlarged map viewer.

The UI switches between RU and ENG. First launch follows the OS language when it starts with `ru`; explicit RU/ENG clicks are saved locally. Official map/key images remain English because they are packaged from Event Companion v1.1.

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

Current verification note: `npm.cmd test`, `cargo check --manifest-path src-tauri/Cargo.toml`, `npm.cmd run dist`, and the final Playwright smoke pass completed on Windows with the MSVC toolchain. The Playwright smoke was run from a temporary external runner against the packaged `app/` files and checked the 768 x 1080 reference viewport, laptop-scale viewport, RU/ENG persistence, mission popovers, and key/map dialogs.

The v0.2.0 NSIS installer is 21.11 MiB and installs 23.23 MiB under `%LOCALAPPDATA%\Programs\WH40K Terrain Layout`.

## Re-extract assets

Place Event Companion v1.1 at the repository root with this exact filename:

`eng_22_07_warhammer_40,000_event_companion_alyapl19us_b2drgwkji4.pdf`

Then run:

```powershell
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m pip install -r tools/requirements.txt
& 'C:\Users\okami\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' tools/extract_layouts.py
```

The extractor writes 45 lossless WebP maps, five disposition icons, and `app/assets/key/layouts-key.webp`. The older June Event Companion is not used.

## Project structure

- `app/` - shared offline web UI and packaged WebP assets
- `src-tauri/` - minimal Tauri 2 desktop shell
- `test/` - Node static/behavior tests
- `tools/` - optional PDF extraction script
- `docs/superpowers/` - approved design and implementation records

See the [v0.2 design specification](docs/superpowers/specs/2026-08-08-tauri-shell-and-layout-key-design.md), [v0.2 implementation plan](docs/superpowers/plans/2026-08-08-tauri-shell-and-layout-key-implementation.md), and [GitHub issue #2](https://github.com/okami69/WH40K-Terrain-Layout/issues/2).
