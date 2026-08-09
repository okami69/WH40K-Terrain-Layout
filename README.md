# WH40K Terrain Layout

Offline Windows and Android companion for finding the official Warhammer 40,000 terrain map for a match. Choose both players' Force Dispositions and layout A, B, or C; the app shows the corresponding terrain placement diagram, assigned missions, and concise mission summaries.

**Latest version:** [v0.4.0](https://github.com/okami69/WH40K-Terrain-Layout/releases/tag/v0.4.0)

Everything needed at the table is bundled with the application, so it works without an internet connection after installation. The interface supports Russian and English, includes the official Layouts Key and Terrain Layouts rules, and can enlarge any map for closer inspection.

## What's new in v0.4.0

- Added A / B / C / + layout controls and a scrollable gallery with large previews for all 45 bundled maps.
- Free layout selection preserves both Force Dispositions and missions, including after either disposition changes.
- Kept the free-map title compact so switching layouts does not push the map down.
- Enlarged the map in portrait phone layouts and improved native Force Disposition option alignment where the platform supports it.

## Features

- Resolves the terrain map from two Force Dispositions and layout A, B, or C.
- Shows the mission assigned to each player with a short RU/ENG objective summary.
- Includes the official Terrain Layouts rules, recommended terrain footprints, and Layouts Key from Event Companion v1.1.
- Opens each terrain map in a full-size viewer.
- Opens a large-preview gallery to use any of the 45 bundled terrain maps without changing the selected missions.
- Remembers the selected language and follows the OS language on first launch.
- Runs offline in a compact Windows desktop window or a portrait-only Android phone view.
- Uses a denser portrait-phone layout so the main map fills more of the available screen.

## Screenshots

| Main selector (RU) | Terrain Layouts rules |
| --- | --- |
| ![Russian main selector with Disruption versus Reconnaissance on Layout A](docs/screenshots/disruption-vs-reconnaissance-layout-a.png) | ![Terrain Layouts rules dialog](docs/screenshots/terrain-layouts-rules.png) |
| Layouts Key | Mission summary |
| ![Official Layouts Key dialog](docs/screenshots/layouts-key.png) | ![Russian mission summary for Take and Hold versus Purge the Foe on Layout B](docs/screenshots/take-and-hold-vs-purge-the-foe-layout-b.png) |
| Another matchup and layout (RU) | English interface |
| ![Russian Priority Assets versus Disruption matchup on Layout C](docs/screenshots/priority-assets-vs-disruption-layout-c.png) | ![English Reconnaissance versus Priority Assets matchup on Layout A](docs/screenshots/reconnaissance-vs-priority-assets-layout-a.png) |

## Download

Download the signed **Android ARM64** APK from the [v0.4.0 release](https://github.com/okami69/WH40K-Terrain-Layout/releases/tag/v0.4.0). It is intended for direct installation on modern ARM64 phones without Google Play: download the APK, allow installation from the browser or file manager when Android asks, then open it normally. The Android build is portrait-only, works offline, and packages the original lossless WebP map assets without further resizing. It was physically verified on a OnePlus 15R and checked at 320 x 568, 360 x 800, 412 x 915, and 480 x 1040 portrait viewports.

The Windows x64 NSIS installer is available from the [v0.4.0 release](https://github.com/okami69/WH40K-Terrain-Layout/releases/tag/v0.4.0). It uses the Windows WebView2 Runtime and downloads it only if it is not already present.

## Use

1. Select each player's Force Disposition from the two top cards.
2. Choose layout A, B, or C.
3. Use `+` to open the scrollable all-layout gallery; choosing a free map does not change either Force Disposition or mission.
4. Hover, focus, click, or tap a mission name for a concise RU/ENG objective summary.
5. Use the key icon for the official layouts key, or click the map for the enlarged map viewer.

The UI switches between RU and ENG. First launch follows the OS language when it starts with `ru`; explicit RU/ENG clicks are saved locally. Official map, key, and rules images remain English because they are packaged from Event Companion v1.1.

## How it is built

The Windows and Android applications use a minimal [Tauri 2](https://tauri.app/) shell around a shared dependency-free frontend written in plain HTML, CSS, and JavaScript. All maps, disposition icons, rules, translations, and matchup data are packaged locally as static assets; no server or account is required at runtime.

## Develop and build

Prerequisites:

- Node.js with npm
- Rust stable MSVC toolchain
- Microsoft Visual Studio 2022 Build Tools with `Microsoft.VisualStudio.Workload.VCTools`
- WebView2 Runtime
- Microsoft OpenJDK 21, Android SDK 36, Build Tools 36.0.0, NDK r29, and the Rust `aarch64-linux-android` target for Android builds
- Python only when re-extracting PDF assets

```powershell
npm.cmd install
npm.cmd test
npm.cmd start
npm.cmd run dist
npm.cmd run android:init
npm.cmd run android:build
```

The Tauri NSIS installer is written under:

`src-tauri/target/release/bundle/nsis/`

The signed Android APK is written under `src-tauri/gen/android/app/build/outputs/apk/arm64/release/`. Release signing requires the ignored `src-tauri/gen/android/keystore.properties` file and the external private keystore it references. Never commit either file. Keep a secure backup of the same keystore and password: both are required to publish installable upgrades. On Windows, Android builds also require Developer Mode or an elevated shell because Tauri creates JNI symbolic links.

Current v0.4.0 verification covers the Node test suite, signed APK verification, ARM64-only native contents, packaged offline assets, representative portrait Playwright checks, and a physical OnePlus 15R smoke test.

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
- `src-tauri/` - shared Tauri 2 Windows and Android shell
- `test/` - Node static/behavior tests
- `tools/` - optional PDF extraction script
- `docs/superpowers/` - approved design and implementation records

See the [Android v0.3 design specification](docs/superpowers/specs/2026-08-08-android-arm64-apk-design.md), [Android v0.3 implementation plan](docs/superpowers/plans/2026-08-08-android-arm64-apk-implementation.md), and [GitHub issue #7](https://github.com/okami69/WH40K-Terrain-Layout/issues/7).
