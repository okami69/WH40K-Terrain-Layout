import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const manifestPath = 'src-tauri/gen/android/app/src/main/AndroidManifest.xml';
const gradlePath = 'src-tauri/gen/android/app/build.gradle.kts';

function pngDimensions(path) {
  const png = readFileSync(path);
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  return [png.readUInt32BE(16), png.readUInt32BE(20)];
}

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

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

test('uses a high-resolution square PNG as the canonical icon source', () => {
  const dimensions = pngDimensions('src-tauri/icons/icon.png');
  assert.deepEqual(dimensions, [1024, 1024]);
});

test('packages branded normal and adaptive Android launcher resources', () => {
  const manifest = readFileSync(manifestPath, 'utf8');
  assert.match(manifest, /android:icon="@mipmap\/ic_launcher"/);

  const defaultTauriHashes = new Set([
    '320e552422179b81dae014ee6cc00561bd6e7455767b28f5518b8862a8c7987c',
    '7a9ae0632bfe5b28a1e6e9a7b38982fef62be07c95de46c26bd4f901ac6b9753',
    '75322a261ba38a23a25647af0d1298f204f3b3fafd317b8122a1b9a1f38284ff',
    '2425d59d27578f75ca97d31d9ae8385898badce3d6a1774bfc2f0fd191dc12c7',
    '44e5c3dc1dfb392f65e3dbcc9b986d30f10dd95b57e306657e56281b572fa684',
    'b1d19b8b78d0ed6903dd35b7640afba29b4cf02f3780e0d1cd46d9ebcbc93695',
    '0b250fc4451dfd1e5a41128234d93225726a2984448b0b966af25677b167d8de',
    'ab9397c9827aef4b3a1f1f917fc722d54abcf26488880c8bf9c724d1e59ab905',
    'dae1ff05b101efea50e4b622fe6a3af8ba8f761162fa7c4fd864adc7cb39eeac',
    '27cf0cdbc78bec8b9a14eaedb084c541a3c191fe5db89766e831fbfd21ce955d',
  ]);
  const densitySizes = {
    mdpi: [48, 108],
    hdpi: [49, 162],
    xhdpi: [96, 216],
    xxhdpi: [144, 324],
    xxxhdpi: [192, 432],
  };

  for (const [density, [launcherSize, foregroundSize]] of Object.entries(densitySizes)) {
    for (const [name, size] of [
      ['ic_launcher.png', launcherSize],
      ['ic_launcher_round.png', launcherSize],
      ['ic_launcher_foreground.png', foregroundSize],
    ]) {
      const path = `src-tauri/gen/android/app/src/main/res/mipmap-${density}/${name}`;
      assert.ok(existsSync(path), `Missing ${path}`);
      assert.deepEqual(pngDimensions(path), [size, size], `Wrong dimensions for ${path}`);
      assert.ok(!defaultTauriHashes.has(sha256(path)), `Default Tauri launcher resource: ${path}`);
    }
  }

  const adaptive = readFileSync(
    'src-tauri/gen/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
    'utf8',
  );
  assert.match(adaptive, /foreground android:drawable="@mipmap\/ic_launcher_foreground"/);
  assert.match(adaptive, /background android:drawable="@color\/ic_launcher_background"/);
  assert.ok(existsSync('src-tauri/gen/android/app/src/main/res/values/ic_launcher_background.xml'));
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
