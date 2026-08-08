import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const manifestPath = 'src-tauri/gen/android/app/src/main/AndroidManifest.xml';
const gradlePath = 'src-tauri/gen/android/app/build.gradle.kts';

test('locks the Android activity to portrait', () => {
  const manifest = readFileSync(manifestPath, 'utf8');
  assert.match(manifest, /android:screenOrientation="portrait"/);
});

test('does not advertise Android TV support', () => {
  const manifest = readFileSync(manifestPath, 'utf8');
  assert.doesNotMatch(manifest, /android\.software\.leanback/i);
});

test('uses the phone launcher without an Android TV launcher', () => {
  const manifest = readFileSync(manifestPath, 'utf8');
  assert.doesNotMatch(manifest, /android\.intent\.category\.LEANBACK_LAUNCHER/i);
  assert.match(manifest, /android\.intent\.category\.LAUNCHER/);
});

test('signs Android release builds from an ignored properties file', () => {
  const gradle = readFileSync(gradlePath, 'utf8');
  assert.match(gradle, /rootProject\.file\("keystore\.properties"\)/);
  assert.match(gradle, /create\("release"\)/);
  assert.match(gradle, /signingConfig = signingConfigs\.getByName\("release"\)/);
  assert.match(gradle, /requiredProperty\("password"\)/);
  assert.doesNotMatch(gradle, /storePassword\s*=\s*"[^"$]+"/);
});

test('validates Android release signing configuration with actionable errors', () => {
  const gradle = readFileSync(gradlePath, 'utf8');
  assert.match(gradle, /require\(keystorePropertiesFile\.isFile\)/);
  assert.match(
    gradle,
    /src-tauri\/gen\/android\/keystore\.properties is required for Android release signing/,
  );
  assert.match(gradle, /keystorePropertiesFile\.inputStream\(\)\.use/);
  assert.match(gradle, /Missing required Android release signing property '\$name'/);
  assert.match(gradle, /requiredProperty\("keyAlias"\)/);
  assert.match(gradle, /requiredProperty\("password"\)/);
  assert.match(gradle, /requiredProperty\("storeFile"\)/);
});
