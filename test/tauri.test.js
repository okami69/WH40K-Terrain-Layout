import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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

test('uses Tauri scripts and no Electron packaging dependencies', () => {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

  assert.equal(packageJson.scripts.start, 'tauri dev');
  assert.equal(packageJson.scripts.test, 'node --test');
  assert.equal(packageJson.scripts.dist, 'npm test && tauri build');
  assert.equal(packageJson.main, undefined);
  assert.equal(packageJson.build, undefined);
  assert.equal(packageJson.devDependencies.electron, undefined);
  assert.equal(packageJson.devDependencies['electron-builder'], undefined);
  assert.equal(packageJson.devDependencies['@tauri-apps/cli'], '2.11.4');
});
