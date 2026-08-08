import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';

test('configures a compact Tauri desktop shell', () => {
  const config = JSON.parse(readFileSync('src-tauri/tauri.conf.json', 'utf8'));

  assert.equal(config.productName, 'WH40K Terrain Layout');
  assert.equal(config.identifier, 'com.okami69.wh40kterrainlayout');
  assert.equal(config.build.frontendDist, '../app');
  assert.deepEqual(config.bundle.targets, ['nsis']);
  assert.deepEqual(config.app.windows[0], {
    label: 'main',
    title: 'WH40K Terrain Layout',
    width: 768,
    height: 1080,
    minWidth: 360,
    minHeight: 640,
    center: true,
    preventOverflow: true,
    resizable: true,
    maximized: false,
    fullscreen: false,
  });
});

test('provides the Windows resource icon required by Tauri', () => {
  const icon = 'src-tauri/icons/icon.ico';
  assert.ok(existsSync(icon), `Missing ${icon}`);
  assert.ok(statSync(icon).size > 0, `Empty ${icon}`);
});

test('provides the PNG icon required by Tauri mobile builds', () => {
  const icon = 'src-tauri/icons/icon.png';
  assert.ok(existsSync(icon), `Missing ${icon}`);
  assert.ok(statSync(icon).size > 0, `Empty ${icon}`);
});

test('uses Tauri scripts and no Electron packaging dependencies', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

  assert.equal(packageJson.scripts.start, 'tauri dev');
  assert.equal(packageJson.scripts.tauri, 'tauri');
  assert.equal(packageJson.scripts.test, 'node --test');
  assert.equal(packageJson.scripts.dist, 'npm test && tauri build');
  assert.equal(packageJson.scripts['android:init'], 'tauri android init --ci --skip-targets-install');
  assert.equal(packageJson.scripts['android:build'], 'tauri android build --apk --target aarch64 --split-per-abi');
  assert.equal(packageJson.main, undefined);
  assert.equal(packageJson.build, undefined);
  assert.equal(packageJson.devDependencies.electron, undefined);
  assert.equal(packageJson.devDependencies['electron-builder'], undefined);
  assert.equal(packageJson.devDependencies['@tauri-apps/cli'], '2.11.4');
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

test('tracks the Android scaffold without committing local signing secrets', () => {
  const ignoreLines = readFileSync('.gitignore', 'utf8').split(/\r?\n/);

  assert.ok(!ignoreLines.includes('src-tauri/gen/'));
  assert.ok(ignoreLines.includes('src-tauri/gen/android/keystore.properties'));
  assert.ok(ignoreLines.includes('*.jks'));
});

test('defines the Tauri mobile library entry point', () => {
  const cargoToml = readFileSync('src-tauri/Cargo.toml', 'utf8');
  const libRs = readFileSync('src-tauri/src/lib.rs', 'utf8');
  const mainRs = readFileSync('src-tauri/src/main.rs', 'utf8');

  assert.match(cargoToml, /\[lib\]\r?\nname = "wh40k_terrain_layout_lib"\r?\ncrate-type = \["staticlib", "cdylib", "rlib"\]/);
  assert.match(libRs, /#\[cfg_attr\(mobile, tauri::mobile_entry_point\)\]/);
  assert.match(libRs, /pub fn run\(\)/);
  assert.match(mainRs, /wh40k_terrain_layout_lib::run\(\);/);
});
