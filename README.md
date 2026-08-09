# WH40K Terrain Layout

Offline Windows and Android companion for finding the official Warhammer 40,000 terrain map for a match. Choose both players' Force Dispositions and layout A, B, or C; the app shows the corresponding terrain placement diagram, assigned missions, and detailed scoring references.

**Current source version:** v0.5.0 (local artifacts built and automated verification complete; physical-device verification pending)

**Latest published release:** [v0.4.0](https://github.com/okami69/WH40K-Terrain-Layout/releases/tag/v0.4.0)

Everything needed at the table is bundled with the application, so it works without an internet connection after installation. The interface supports Russian and English, includes the official Layouts Key and Terrain Layouts rules, and can enlarge any map for closer inspection.

## What's new in v0.5.0

- Added optional Twists, defaulting to **No Twist**. The six choices follow the current official Warhammer 40,000 app order: Martial Pride, Mirrored World, Night Fighting, Nowhere to Hide, Ruinscape, and Scrambled Communications.
- Supports choosing a named Twist, selecting one at random, returning to No Twist, and reviewing the selected Twist's full effects.
- Expanded mission references with scoring conditions, timing, per-condition VP, and the 45 VP total / 15 VP per battle round limit where applicable.
- Made Force Disposition menus open in a deterministic centered position and balanced the map and controls in portrait layouts.

## Features

- Resolves the terrain map from two Force Dispositions and layout A, B, or C.
- Shows each assigned mission's detailed RU/ENG scoring conditions, timing, VP values, and applicable limits.
- Offers the six optional Twists in official order with named, random, and No Twist selection; No Twist is the default.
- Includes the official Terrain Layouts rules, recommended terrain footprints, and Layouts Key from Event Companion v1.1.
- Opens each terrain map in a full-size viewer.
- Opens a large-preview gallery to use any of the 45 bundled terrain maps without changing the selected missions.
- Remembers the selected language and follows the OS language on first launch.
- Runs offline in a compact Windows desktop window or a portrait-only Android phone view.
- Uses a denser portrait-phone layout so the main map fills more of the available screen.

## Screenshots

These screenshots were captured from the verified v0.5.0 source and locally built Windows package.

| Centered desktop disposition menu | Mobile mission details |
| --- | --- |
| ![English desktop disposition menu with all five centered choices](docs/screenshots/v05-desktop-disposition-menu.png) | ![Mobile Locate and Deny detailed mission reference](docs/screenshots/v05-mobile-mission-details.png) |
| Mobile Twist chooser | Packaged Windows application |
| ![Mobile chooser showing all six optional Twists](docs/screenshots/v05-mobile-twist-chooser.png) | ![Locally built v0.5.0 Windows application](docs/screenshots/v05-windows-packaged.png) |

## Download

Download the signed **Android ARM64** APK from the [v0.4.0 release](https://github.com/okami69/WH40K-Terrain-Layout/releases/tag/v0.4.0). It is intended for direct installation on modern ARM64 phones without Google Play: download the APK, allow installation from the browser or file manager when Android asks, then open it normally. The Android build is portrait-only, works offline, and packages the original lossless WebP map assets without further resizing. It was physically verified on a OnePlus 15R and checked at 320 x 568, 360 x 800, 412 x 915, and 480 x 1040 portrait viewports.

The Windows x64 NSIS installer is available from the [v0.4.0 release](https://github.com/okami69/WH40K-Terrain-Layout/releases/tag/v0.4.0). It uses the Windows WebView2 Runtime and downloads it only if it is not already present.

## Local v0.5.0 verification

The following v0.5.0 artifacts were built and checked locally. They have **not** been published as a GitHub release.

- Windows application: `src-tauri/target/release/wh40k-terrain-layout.exe` — 24,181,248 bytes; SHA-256 `FC7414168A370CBA645EF07A515838CCCD9CC5CEFB9E7175C72D8115051593DC`.
- Windows NSIS installer: `src-tauri/target/release/bundle/nsis/WH40K Terrain Layout_0.5.0_x64-setup.exe` — 22,053,250 bytes; SHA-256 `A4EDC1E0829A9DD57DBFAF57AA02ED27A121222CD5B7776639F115FBDBE24449`. Both Windows binaries report version `0.5.0`; neither is Authenticode-signed.
- Signed Android ARM64 release APK: source `src-tauri/gen/android/app/build/outputs/apk/arm64/release/app-arm64-release.apk`; stable copy `output/android/WH40K-Terrain-Layout-v0.5.0-arm64-release.apk` — 32,141,398 bytes; SHA-256 `C4A775D5CB229359641EB0F958AD6873733834823965277A30E2F4D7D2CF4AC7`.
- APK verification: application ID `com.okami69.wh40kterrainlayout`, version name `0.5.0`, version code `5000`, only `arm64-v8a`, APK Signature Scheme v2 verified, and signer certificate SHA-256 `f26b5207728358d27b718e47c1e09e02c3c80c181b71fb73ca1f34607807ca54` matching v0.4.0. No v3 signature is present.

Automated acceptance passed 60 Node tests and Chromium checks at 320×568, 360×800, 412×915, 480×1040, 560×1280, 768×1080, and 1366×728. The packaged Windows executable also launched successfully. Physical-device v0.5.0 verification is pending; no v0.5.0 release is published yet.

## Use

1. Select each player's Force Disposition from the two top cards.
2. Choose layout A, B, or C.
3. Use `+` to open the scrollable all-layout gallery; choosing a free map does not change either Force Disposition or mission.
4. Leave the centered Twist control at No Twist, choose one of the six named Twists in official order, or use Random; reopen the control to review or change the selection.
5. Hover, focus, click, or tap a mission name for its detailed RU/ENG scoring and VP reference.
6. Use the key icon for the official layouts key, or click the map for the enlarged map viewer.

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

Current published v0.4.0 verification covers the Node test suite, signed APK verification, ARM64-only native contents, packaged offline assets, representative portrait Playwright checks, and a physical OnePlus 15R smoke test. The v0.5.0 evidence above is local automated verification only; physical-device verification and publication remain pending.

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
