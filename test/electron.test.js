import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('starts the app in a secure Electron window', () => {
  const main = readFileSync('electron/main.cjs', 'utf8');

  assert.match(main, /new BrowserWindow\(\{/);
  assert.match(main, /loadFile\(path\.join\(__dirname, '\.\.', 'app', 'index\.html'\)\)/);
  for (const setting of [
    'width: 900',
    'height: 1000',
    'minWidth: 360',
    'minHeight: 640',
    'autoHideMenuBar: true',
    'contextIsolation: true',
    'nodeIntegration: false',
    'sandbox: true',
  ]) {
    assert.match(main, new RegExp(setting));
  }
  assert.match(main, /process\.platform !== 'darwin'[\s\S]*app\.quit\(\)/);
});
