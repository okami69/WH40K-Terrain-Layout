# Signed Android ARM64 APK - Design

## Goal

Produce a signed release APK of WH40K Terrain Layout for direct installation on modern Android phones without Google Play. OnePlus 15R is the primary physical test device, but the application must scale and operate correctly across current ARM64 Android phones and common phone display sizes.

GitHub issue: [#7](https://github.com/okami69/WH40K-Terrain-Layout/issues/7)

## Source of truth

- Keep GitHub issue #1, the approved project design, and Event Companion v1.1 as the product and content sources of truth.
- Continue using the existing shared frontend and the current Tauri 2 shell.
- Continue using only the current 45 lossless WebP layout maps at 862 x 1040 pixels, five disposition icons, Layouts Key, and Terrain Layouts rules.
- Do not use the older June Event Companion.

## Android package

- Initialize Android support inside the existing Tauri 2 project rather than adding Capacitor or a second mobile application.
- Keep the application identifier `com.okami69.wh40kterrainlayout` and the current product name.
- Build one release APK for `arm64-v8a` / `aarch64-linux-android` only.
- Lock the Android activity to portrait orientation. The application must not rotate into landscape when the device turns.
- Sign the release APK with a dedicated long-lived keystore so later builds can update an installed copy.
- Keep the keystore, passwords, generated signing properties, and other credentials outside Git.
- Produce an APK for direct installation. Google Play publishing, Android App Bundles, and multi-ABI universal packages are out of scope.

## Assets and size

- Do not resize, recompress, or otherwise change the current map and reference images.
- Package all content locally so the installed application remains fully offline.
- Avoid mobile-only dependencies or plugins unless a verified Android incompatibility requires one.
- Record the final APK byte size and SHA-256 checksum. The preliminary estimate is 23-28 MB; the measured build is authoritative.

## Responsive behavior

- Preserve the existing 768 x 1080 reference sheet and fit it uniformly inside the available Android WebView area without distorting the map.
- Account for Android status/navigation bars, display cutouts, and safe-area insets so controls are not obscured.
- Recalculate the sheet scale when the available portrait viewport changes, including after system-bar or window-size changes.
- Keep the complete main sheet visible without page-level scrolling at supported phone viewports.
- Keep dialogs inside the current dynamic portrait viewport, with their close controls reachable.
- Preserve native selects, pinch zoom, visible focus, and tap operation for mission summaries, maps, rules, and Layouts Key; controls may scale with the complete reference sheet on narrow phones.
- OnePlus 15R is the primary physical target, using its 2800 x 1272 display and 19.8:9 aspect ratio. Verification must also cover representative narrow, standard, and large-phone portrait viewports so the implementation is not device-specific.

## Application behavior and data flow

- Keep matchup resolution, translations, layout selection, and local asset paths in the existing HTML, CSS, and JavaScript modules.
- Keep language persistence in local storage and verify it survives closing and reopening the Android application.
- Do not add Rust commands, a network service, accounts, analytics, or online dependencies.
- Use Android only as a native package and WebView host for the same offline application.

## Error handling

- Preserve the existing user-visible fallback for missing matchup or image data.
- Treat a missing Android SDK/NDK component, signing credential, or expected build artifact as a failed build with a clear diagnostic.
- Verify the APK signature before delivery.
- Keep signing secrets out of command output, documentation, commits, and GitHub.

## Verification

- Run the existing Node test suite before and after Android integration.
- Add the smallest static checks needed for Android configuration, ARM64-only targeting, and secret exclusions.
- Run Playwright checks against representative Android portrait viewport dimensions, including safe-area behavior, scaling, dialogs, language switching, and touch interactions.
- Build the signed release APK and verify its signature, architecture, package identifier, exact size, and SHA-256 checksum.
- Install and smoke-test the APK on the physical OnePlus 15R: first launch, both disposition selectors, all layout buttons, map viewer, rules, Layouts Key, both languages, mission summaries, preference restoration, portrait lock, and offline relaunch.
- Where an emulator or additional physical device is available, repeat a focused smoke test on a second current ARM64 Android profile.

## Deliverables

- Signed ARM64 release APK.
- SHA-256 checksum and recorded file size.
- Reproducible build and installation instructions that do not expose secrets.
- GitHub issue #7 updated with verification results and the artifact location.

## Non-goals

- No image optimization or content changes.
- No Google Play release, Android App Bundle, updater, or store metadata.
- No support for x86, x86_64, ARMv7, or other legacy/non-phone Android architectures in this release.
- No landscape layout or automatic orientation changes.
- No redesign, mobile-specific feature set, server, or separate Android frontend.
- No separate reflowed mobile control layout or guaranteed 44 px post-scale target for every control in this compact-sheet release.
