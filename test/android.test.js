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
