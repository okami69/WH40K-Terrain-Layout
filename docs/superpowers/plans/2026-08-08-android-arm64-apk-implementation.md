# Signed Android ARM64 APK Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a signed, portrait-only ARM64 APK of the existing offline application for direct installation on modern Android phones.

**Architecture:** Reuse the existing static HTML/CSS/JavaScript frontend and Tauri 2 Rust shell. Commit the generated Tauri Android project, configure its activity and release signing, and build only `aarch64` with a split-per-ABI APK; keep the keystore and signing properties outside Git.

**Tech Stack:** Tauri 2.11, Rust stable, Android Studio/JBR, Android SDK 36, Build Tools 36.0.0, NDK r29, Gradle/Kotlin, Node test runner, Playwright, ADB.

---

## File map

- Modify `.gitignore`: track the Android scaffold while excluding generated build state and signing secrets.
- Modify `package.json`, `package-lock.json`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock`, and `src-tauri/tauri.conf.json`: set v0.3.0 and add exact Android commands.
- Create `src-tauri/src/lib.rs` and modify `src-tauri/src/main.rs`: expose the Tauri mobile library entry point while preserving the Windows executable entry point.
- Modify `app/index.html`, `app/styles.css`, and `app/app.js`: account for portrait safe areas and dynamic Android viewport changes.
- Modify `test/tauri.test.js` and `test/ui.test.js`: lock the release/build and responsive contracts with small static tests.
- Create `test/android.test.js`: verify the generated manifest, ARM64 build contract, release signing configuration, and secret exclusions.
- Create and commit `src-tauri/gen/android/**`: Tauri-generated Android project plus portrait/signing configuration.
- Create locally, never commit, `src-tauri/gen/android/keystore.properties`: release-signing credentials and keystore path.
- Create outside the repository, never commit, `C:\Users\okami\.android-keystores\wh40k-terrain-layout-release.jks`: long-lived signing key.
- Modify `README.md`: document the Android download, supported devices, direct installation, and reproducible build steps without credentials.
- Create locally, never commit, `dist/android/WH40K-Terrain-Layout_0.3.0_arm64.apk` and `.sha256`: release artifacts uploaded to GitHub Release v0.3.0.

### Task 1: Lock the Android release contract

**Files:**
- Modify: `test/tauri.test.js`
- Modify: `.gitignore`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src-tauri/Cargo.toml`
- Modify: `src-tauri/Cargo.lock`
- Modify: `src-tauri/tauri.conf.json`
- Create: `src-tauri/src/lib.rs`
- Modify: `src-tauri/src/main.rs`

- [ ] **Step 1: Write failing package, version, and secret-exclusion tests**

Add to `test/tauri.test.js`:

```js
test('defines an ARM64-only Android APK build', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const gitignore = readFileSync('.gitignore', 'utf8');

  assert.equal(packageJson.scripts['android:init'], 'tauri android init --ci --skip-targets-install');
  assert.equal(
    packageJson.scripts['android:build'],
    'tauri android build --apk --target aarch64 --split-per-abi',
  );
  assert.doesNotMatch(gitignore, /^src-tauri\/gen\/$/m);
  assert.match(gitignore, /^src-tauri\/gen\/android\/keystore\.properties$/m);
  assert.match(gitignore, /^\*\.jks$/m);
});

test('provides the Tauri mobile library entry point', () => {
  const cargo = readFileSync('src-tauri/Cargo.toml', 'utf8');
  const main = readFileSync('src-tauri/src/main.rs', 'utf8');
  const library = readFileSync('src-tauri/src/lib.rs', 'utf8');

  assert.match(cargo, /\[lib\][\s\S]*name = "wh40k_terrain_layout_lib"/);
  assert.match(cargo, /crate-type = \["staticlib", "cdylib", "rlib"\]/);
  assert.match(library, /#\[cfg_attr\(mobile, tauri::mobile_entry_point\)\]/);
  assert.match(library, /pub fn run\(\)/);
  assert.match(main, /wh40k_terrain_layout_lib::run\(\)/);
});

test('keeps package and Tauri versions at v0.3.0', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  const packageLock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  const tauriConfig = JSON.parse(readFileSync('src-tauri/tauri.conf.json', 'utf8'));

  assert.equal(packageJson.version, '0.3.0');
  assert.equal(packageLock.version, '0.3.0');
  assert.equal(packageLock.packages[''].version, '0.3.0');
  assert.equal(tauriConfig.version, '0.3.0');
});
```

Replace the existing v0.2.2 version test rather than keeping two contradictory tests.

- [ ] **Step 2: Run the tests and confirm the new contract fails**

Run: `npm.cmd test`

Expected: FAIL because the Android scripts/ignore rules and mobile library entry point do not exist and the version is still 0.2.2.

- [ ] **Step 3: Add the minimum scripts, ignore rules, and version bump**

Set these scripts in `package.json`:

```json
{
  "scripts": {
    "start": "tauri dev",
    "test": "node --test",
    "dist": "npm test && tauri build",
    "android:init": "tauri android init --ci --skip-targets-install",
    "android:build": "tauri android build --apk --target aarch64 --split-per-abi"
  }
}
```

Replace the broad `src-tauri/gen/` entry in `.gitignore` with:

```gitignore
src-tauri/gen/schemas/
src-tauri/gen/android/.gradle/
src-tauri/gen/android/.idea/
src-tauri/gen/android/build/
src-tauri/gen/android/app/build/
src-tauri/gen/android/local.properties
src-tauri/gen/android/keystore.properties
*.jks
*.keystore
```

Run:

```powershell
npm.cmd version 0.3.0 --no-git-tag-version
```

Set `version = "0.3.0"` in `src-tauri/Cargo.toml` and `"version": "0.3.0"` in `src-tauri/tauri.conf.json`. Update the root package entry for `wh40k-terrain-layout` in `src-tauri/Cargo.lock` to 0.3.0; do not update third-party crates.

Add this library section to `src-tauri/Cargo.toml`:

```toml
[lib]
name = "wh40k_terrain_layout_lib"
crate-type = ["staticlib", "cdylib", "rlib"]
```

Create `src-tauri/src/lib.rs`:

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running WH40K Terrain Layout");
}
```

Replace the builder in `src-tauri/src/main.rs` with the shared entry point:

```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    wh40k_terrain_layout_lib::run();
}
```

- [ ] **Step 4: Run the tests and inspect the diff**

Run: `npm.cmd test`

Expected: all Node tests PASS.

Run: `& 'C:\Users\okami\.cargo\bin\cargo.exe' check --manifest-path src-tauri/Cargo.toml`

Expected: the shared library and Windows binary compile successfully.

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 5: Commit the release contract**

```powershell
git add .gitignore package.json package-lock.json src-tauri/Cargo.toml src-tauri/Cargo.lock src-tauri/tauri.conf.json src-tauri/src/lib.rs src-tauri/src/main.rs test/tauri.test.js
git commit -m "build: define Android ARM64 release refs #7"
```

### Task 2: Make the shared sheet safe on portrait Android viewports

**Files:**
- Modify: `test/ui.test.js`
- Modify: `app/index.html`
- Modify: `app/styles.css`
- Modify: `app/app.js`

- [ ] **Step 1: Add failing static checks for safe-area and viewport handling**

Add these assertions to the existing compact UI test in `test/ui.test.js`:

```js
assert.match(html, /name="viewport"[^>]+viewport-fit=cover/);
assert.match(css, /min-height:\s*100dvh/);
assert.match(css, /padding-top:\s*env\(safe-area-inset-top\)/);
assert.match(css, /padding-right:\s*env\(safe-area-inset-right\)/);
assert.match(css, /padding-bottom:\s*env\(safe-area-inset-bottom\)/);
assert.match(css, /padding-left:\s*env\(safe-area-inset-left\)/);
assert.match(js, /document\.documentElement\.clientWidth/);
assert.match(js, /document\.documentElement\.clientHeight/);
assert.match(js, /window\.visualViewport\?\.addEventListener\('resize', fitSheet\)/);
```

- [ ] **Step 2: Run the UI test and confirm it fails**

Run: `node --test test/ui.test.js`

Expected: FAIL on the first missing Android viewport assertion.

- [ ] **Step 3: Implement safe-area-aware portrait fitting**

Change the viewport meta tag in `app/index.html` to:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

In `app/styles.css`, retain the existing `100vh` fallback and add the dynamic height and safe-area padding to `body`:

```css
body {
  min-height: 100vh;
  min-height: 100dvh;
  padding-top: env(safe-area-inset-top);
  padding-right: env(safe-area-inset-right);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
}
```

Replace `fitSheet()` in `app/app.js` with:

```js
function cssPixels(value) {
  return Number.parseFloat(value) || 0;
}

function fitSheet() {
  const bodyStyle = getComputedStyle(document.body);
  const horizontalInsets = cssPixels(bodyStyle.paddingLeft) + cssPixels(bodyStyle.paddingRight);
  const verticalInsets = cssPixels(bodyStyle.paddingTop) + cssPixels(bodyStyle.paddingBottom);
  const availableWidth = document.documentElement.clientWidth - horizontalInsets;
  const availableHeight = document.documentElement.clientHeight - verticalInsets;
  const scale = Math.min(availableWidth / 768, availableHeight / 1080);
  document.documentElement.style.setProperty('--sheet-scale', String(scale));
}
```

Keep the existing `window` resize listener and add:

```js
window.visualViewport?.addEventListener('resize', fitSheet);
```

- [ ] **Step 4: Run the UI and full Node suites**

Run: `node --test test/ui.test.js`

Expected: PASS.

Run: `npm.cmd test`

Expected: all tests PASS.

- [ ] **Step 5: Commit the shared mobile viewport support**

```powershell
git add app/index.html app/styles.css app/app.js test/ui.test.js
git commit -m "fix: fit Android portrait safe areas refs #7"
```

### Task 3: Install and verify the Android build toolchain

**Files:**
- No repository files.

- [ ] **Step 1: Verify the expected tools are initially unavailable**

Run:

```powershell
Get-Command winget -ErrorAction Stop
Test-Path 'C:\Program Files\Android\Android Studio\jbr\bin\java.exe'
Test-Path "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat"
& 'C:\Users\okami\.cargo\bin\rustup.exe' target list --installed
```

Expected before setup: `winget` exists; Android Studio/SDK checks are false; only `x86_64-pc-windows-msvc` is listed.

- [ ] **Step 2: Install Android Studio after obtaining command approval**

Run:

```powershell
winget install --exact --id Google.AndroidStudio --accept-package-agreements --accept-source-agreements
```

Expected: Android Studio installs successfully under `C:\Program Files\Android\Android Studio`.

- [ ] **Step 3: Install the exact stable SDK components**

Open Android Studio once if needed to install Android SDK Command-line Tools (latest), then run:

```powershell
$sdkManager = "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat"
& $sdkManager --licenses
& $sdkManager 'platform-tools' 'platforms;android-36' 'build-tools;36.0.0' 'ndk;29.0.14206865'
```

Expected: all licenses are accepted and the four packages install without errors.

- [ ] **Step 4: Configure persistent and current-session environment variables**

Run:

```powershell
$javaHome = 'C:\Program Files\Android\Android Studio\jbr'
$androidHome = "$env:LOCALAPPDATA\Android\Sdk"
$ndkHome = "$androidHome\ndk\29.0.14206865"
[Environment]::SetEnvironmentVariable('JAVA_HOME', $javaHome, 'User')
[Environment]::SetEnvironmentVariable('ANDROID_HOME', $androidHome, 'User')
[Environment]::SetEnvironmentVariable('NDK_HOME', $ndkHome, 'User')
$env:JAVA_HOME = $javaHome
$env:ANDROID_HOME = $androidHome
$env:NDK_HOME = $ndkHome
$env:Path = "C:\Users\okami\.cargo\bin;$javaHome\bin;$androidHome\platform-tools;$env:Path"
```

Expected: the variables point to existing directories.

- [ ] **Step 5: Install only the Rust Android ARM64 target and verify Tauri**

Run:

```powershell
& 'C:\Users\okami\.cargo\bin\rustup.exe' target add aarch64-linux-android
npm.cmd exec tauri info
```

Expected: `aarch64-linux-android` is installed and Tauri reports the Android environment without missing Java, SDK, NDK, Rust, or Cargo errors.

### Task 4: Generate and configure the Android project

**Files:**
- Create: `src-tauri/gen/android/**`
- Create: `test/android.test.js`
- Modify: `src-tauri/gen/android/app/src/main/AndroidManifest.xml`
- Modify: `src-tauri/gen/android/app/build.gradle.kts`

- [ ] **Step 1: Generate the Android scaffold without installing extra Rust targets**

Run: `npm.cmd run android:init`

Expected: `src-tauri/gen/android/app/src/main/AndroidManifest.xml` and `src-tauri/gen/android/app/build.gradle.kts` exist; no ARMv7, i686, or x86_64 Rust target is installed.

- [ ] **Step 2: Write failing tests for portrait lock and release signing**

Create `test/android.test.js`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const manifestPath = 'src-tauri/gen/android/app/src/main/AndroidManifest.xml';
const gradlePath = 'src-tauri/gen/android/app/build.gradle.kts';

test('locks the Android activity to portrait', () => {
  const manifest = readFileSync(manifestPath, 'utf8');
  assert.match(manifest, /android:screenOrientation="portrait"/);
});

test('signs Android release builds from an ignored properties file', () => {
  const gradle = readFileSync(gradlePath, 'utf8');
  assert.match(gradle, /rootProject\.file\("keystore\.properties"\)/);
  assert.match(gradle, /create\("release"\)/);
  assert.match(gradle, /signingConfig = signingConfigs\.getByName\("release"\)/);
  assert.match(gradle, /keystoreProperties\["password"\]/);
  assert.doesNotMatch(gradle, /storePassword\s*=\s*"[^"$]+"/);
});
```

- [ ] **Step 3: Run the Android contract test and confirm it fails**

Run: `node --test test/android.test.js`

Expected: FAIL because portrait orientation and release signing have not been configured.

- [ ] **Step 4: Lock the generated activity to portrait**

In the main `<activity>` in `src-tauri/gen/android/app/src/main/AndroidManifest.xml`, add:

```xml
android:screenOrientation="portrait"
```

Do not add sensor-landscape, unspecified, or user-controlled orientation modes.

- [ ] **Step 5: Configure Gradle release signing without embedding credentials**

At the top of `src-tauri/gen/android/app/build.gradle.kts`, add missing imports:

```kotlin
import java.io.FileInputStream
import java.util.Properties
```

Inside `android {}`, immediately before `buildTypes`, add:

```kotlin
signingConfigs {
    create("release") {
        val keystorePropertiesFile = rootProject.file("keystore.properties")
        val keystoreProperties = Properties()
        keystoreProperties.load(FileInputStream(keystorePropertiesFile))
        keyAlias = keystoreProperties["keyAlias"] as String
        keyPassword = keystoreProperties["password"] as String
        storeFile = file(keystoreProperties["storeFile"] as String)
        storePassword = keystoreProperties["password"] as String
    }
}
```

Inside the existing release build type, add:

```kotlin
signingConfig = signingConfigs.getByName("release")
```

- [ ] **Step 6: Run tests, confirm secrets are ignored, and commit the scaffold**

Run:

```powershell
npm.cmd test
git check-ignore src-tauri/gen/android/keystore.properties
git status --short
```

Expected: all tests PASS; `keystore.properties` is ignored; generated source/config files are visible for commit while Gradle/build/local state is ignored.

Commit:

```powershell
git add src-tauri/gen/android test/android.test.js
git commit -m "build: configure portrait Android shell refs #7"
```

### Task 5: Create the private signing key and build the APK

**Files:**
- Create outside Git: `C:\Users\okami\.android-keystores\wh40k-terrain-layout-release.jks`
- Create ignored: `src-tauri/gen/android/keystore.properties`
- Create ignored: `dist/android/WH40K-Terrain-Layout_0.3.0_arm64.apk`
- Create ignored: `dist/android/WH40K-Terrain-Layout_0.3.0_arm64.apk.sha256`

- [ ] **Step 1: Resolve and verify the exact private targets before writing**

Run:

```powershell
$keystoreDir = [IO.Path]::GetFullPath('C:\Users\okami\.android-keystores')
$keystorePath = [IO.Path]::GetFullPath((Join-Path $keystoreDir 'wh40k-terrain-layout-release.jks'))
$propertiesPath = [IO.Path]::GetFullPath('D:\WH40K Terrain Layout\src-tauri\gen\android\keystore.properties')
$keystoreDir
$keystorePath
$propertiesPath
```

Expected: the keystore resolves only under `C:\Users\okami\.android-keystores`; the properties file resolves only under this repository's generated Android directory.

- [ ] **Step 2: Create a long-lived key without printing its generated password**

After obtaining approval to write outside the workspace, create the directory and run Android Studio's `keytool.exe` interactively with alias `upload`, RSA-2048, JKS, and 10,000-day validity. The user enters the password at the non-echoing prompt. Then have the user create the ignored properties file locally with exactly three keys: `password` set to that same private value, `keyAlias` set to `upload`, and `storeFile` set to the escaped absolute keystore path `C:\\Users\\okami\\.android-keystores\\wh40k-terrain-layout-release.jks`. Do not pass the password through an agent tool call.

The command must not echo the password or include it in GitHub, documentation, or a committed script. Confirm both private files are excluded:

```powershell
git check-ignore src-tauri/gen/android/keystore.properties
git check-ignore src-tauri/gen/android/test-release.jks
git status --short
```

Expected: neither private file appears as trackable content. Tell the user that losing this keystore or password prevents in-place upgrades and arrange an offline backup after the APK is verified.

- [ ] **Step 3: Build only the split ARM64 release APK**

Run:

```powershell
npm.cmd test
npm.cmd run android:build
```

Expected: tests PASS and Tauri produces `src-tauri/gen/android/app/build/outputs/apk/aarch64/release/app-aarch64-release.apk`.

- [ ] **Step 4: Verify signature, package, architecture, and assets**

Run:

```powershell
$apk = 'src-tauri\gen\android\app\build\outputs\apk\aarch64\release\app-aarch64-release.apk'
$buildTools = "$env:ANDROID_HOME\build-tools\36.0.0"
& "$buildTools\apksigner.bat" verify --verbose --print-certs $apk
& "$env:JAVA_HOME\bin\jar.exe" tf $apk | Select-String '^lib/'
& "$env:ANDROID_HOME\cmdline-tools\latest\bin\apkanalyzer.bat" manifest application-id $apk
& "$env:ANDROID_HOME\cmdline-tools\latest\bin\apkanalyzer.bat" files list $apk | Select-String 'assets/(layouts|key|dispositions)'
```

Expected: signature verification succeeds; all native libraries are under `lib/arm64-v8a/`; application id is `com.okami69.wh40kterrainlayout`; packaged assets include layouts, key, and dispositions.

- [ ] **Step 5: Copy the immutable deliverable and record size/checksum**

Run:

```powershell
$releaseDir = 'dist\android'
New-Item -ItemType Directory -Path $releaseDir -Force | Out-Null
$releaseApk = Join-Path $releaseDir 'WH40K-Terrain-Layout_0.3.0_arm64.apk'
Copy-Item -LiteralPath $apk -Destination $releaseApk
$hash = Get-FileHash -Algorithm SHA256 -LiteralPath $releaseApk
"$($hash.Hash.ToLowerInvariant())  $(Split-Path $releaseApk -Leaf)" | Set-Content -LiteralPath "$releaseApk.sha256" -Encoding ascii
Get-Item -LiteralPath $releaseApk | Select-Object FullName, Length
Get-Content -LiteralPath "$releaseApk.sha256"
```

Expected: the APK and checksum exist; record the exact byte count in issue #7.

### Task 6: Verify responsive behavior and the physical phone

**Files:**
- Modify only if a failure is found: `app/styles.css`, `app/app.js`, and their existing tests.

- [ ] **Step 1: Run the complete automated baseline**

Run: `npm.cmd test`

Expected: all tests PASS.

- [ ] **Step 2: Start the static frontend for Playwright**

Run the existing local HTTP server from the repository root on `127.0.0.1:8891`, serving `app/`.

Expected: `http://127.0.0.1:8891/` returns the application.

- [ ] **Step 3: Run portrait-only Playwright checks**

Use Playwright at these CSS-pixel viewports: 320 x 568, 360 x 800, 412 x 915, and 480 x 1040. At every viewport verify:

```js
const metrics = await page.evaluate(() => ({
  documentWidth: document.documentElement.scrollWidth,
  documentHeight: document.documentElement.scrollHeight,
  viewportWidth: document.documentElement.clientWidth,
  viewportHeight: document.documentElement.clientHeight,
  sheet: document.querySelector('#sheet').getBoundingClientRect().toJSON(),
}));

expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth);
expect(metrics.documentHeight).toBeLessThanOrEqual(metrics.viewportHeight);
expect(metrics.sheet.left).toBeGreaterThanOrEqual(0);
expect(metrics.sheet.top).toBeGreaterThanOrEqual(0);
expect(metrics.sheet.right).toBeLessThanOrEqual(metrics.viewportWidth);
expect(metrics.sheet.bottom).toBeLessThanOrEqual(metrics.viewportHeight);
```

Also select both dispositions, choose layouts A/B/C, switch RU/ENG, open and close the map/rules/key dialogs, tap both mission summaries, reload, and confirm the chosen language persists. Capture one screenshot at 412 x 915 for the issue.

Expected: no page scrolling, clipping, unreachable close button, distorted image, or failed touch interaction.

- [ ] **Step 4: Treat any responsive failure as a gated defect**

Expected: all Step 3 checks pass with the Task 2 implementation. If any assertion fails, stop delivery, capture the failing viewport and measured bounds, invoke `systematic-debugging`, and amend this plan with the evidence-specific failing test and minimal fix before changing application code. Do not improvise device-specific breakpoints or release a knowingly clipped build.

- [ ] **Step 5: Install and smoke-test on OnePlus 15R**

On the phone, enable developer options and USB debugging, approve this computer, then run:

```powershell
adb devices
adb install -r 'dist\android\WH40K-Terrain-Layout_0.3.0_arm64.apk'
adb shell monkey -p com.okami69.wh40kterrainlayout -c android.intent.category.LAUNCHER 1
```

Expected: one authorized device is listed; installation succeeds; the app launches in portrait and stays portrait when the phone is turned.

Manually verify both selectors, A/B/C, map viewer, rules, Layouts Key, RU/ENG, both mission summaries, preference restoration after force-stop/relaunch, and launch while the phone has no network connection.

If a second current ARM64 phone is available, repeat installation, launch, one disposition/layout change, and one dialog check there; otherwise record that the additional-device check was unavailable and rely on the required multi-viewport Playwright coverage.

- [ ] **Step 6: Rebuild if code changed and repeat artifact verification**

If Task 6 changed source files, rerun Task 5 Steps 3-5 so the delivered APK, size, checksum, and tested code are identical.

### Task 7: Document and publish v0.3.0

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Write a failing documentation test**

Add to `test/tauri.test.js`:

```js
test('documents the signed ARM64 Android release', () => {
  const readme = readFileSync('README.md', 'utf8');
  assert.match(readme, /v0\.3\.0/);
  assert.match(readme, /Android ARM64/);
  assert.match(readme, /OnePlus 15R/);
  assert.match(readme, /npm\.cmd run android:build/);
  assert.match(readme, /keystore/i);
});
```

- [ ] **Step 2: Run the documentation test and confirm it fails**

Run: `node --test test/tauri.test.js`

Expected: FAIL because README still describes only v0.2.2 Windows delivery.

- [ ] **Step 3: Update README without exposing secrets**

Update the latest version to v0.3.0. Add an Android ARM64 download paragraph stating that the signed APK is for direct installation on modern ARM64 phones, is portrait-only, works offline, keeps original map assets, and was physically verified on OnePlus 15R plus representative portrait viewports. Add build commands:

```powershell
npm.cmd run android:init
npm.cmd run android:build
```

State that `src-tauri/gen/android/keystore.properties` and the external keystore are required for release signing but must never be committed, and that the same key is required for upgrades.

- [ ] **Step 4: Run all final local verification**

Run:

```powershell
npm.cmd test
git diff --check
git status --short
```

Expected: all tests PASS; no whitespace errors; only intentional source/docs changes remain.

- [ ] **Step 5: Commit and push the final source state**

```powershell
git add README.md test/tauri.test.js
git commit -m "docs: publish Android ARM64 release refs #7"
git push origin main
```

- [ ] **Step 6: Create the GitHub release and close the issue with evidence**

Run:

```powershell
gh release create v0.3.0 `
  'dist\android\WH40K-Terrain-Layout_0.3.0_arm64.apk#WH40K Terrain Layout v0.3.0 Android ARM64 APK' `
  'dist\android\WH40K-Terrain-Layout_0.3.0_arm64.apk.sha256#SHA-256 checksum' `
  --title 'WH40K Terrain Layout v0.3.0' `
  --notes 'Signed portrait-only ARM64 APK for direct installation on modern Android phones. Original offline map assets are unchanged. Verified on OnePlus 15R and representative portrait viewports.'
```

Add a final issue #7 comment containing the release URL, commit, exact APK size, SHA-256, signature verification result, ARM64-only result, Playwright viewport results, and OnePlus 15R smoke-test result. Close issue #7 only after every acceptance criterion is met.

Expected: v0.3.0 release contains both artifacts and issue #7 is closed with complete verification evidence.

## Final verification gate

Before claiming completion, invoke `verification-before-completion` and rerun fresh checks for Node tests, signed APK verification, ARM64-only contents, package identifier, artifact checksum, Git status, GitHub release assets, and issue status. Do not treat a successful Gradle build alone as completion.
