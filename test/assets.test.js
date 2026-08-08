import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { matchups, resolveMatchup } from '../app/matchups.js';

test('all matchup layouts have unique image assets', () => {
  const images = new Set();
  const required = [
    'app/assets/key/layouts-key.webp',
    'app/assets/dispositions/take-and-hold.webp',
    'app/assets/dispositions/purge-the-foe.webp',
    'app/assets/dispositions/disruption.webp',
    'app/assets/dispositions/reconnaissance.webp',
    'app/assets/dispositions/priority-assets.webp',
  ];

  for (const { left, right } of matchups) {
    const matchup = resolveMatchup(left, right);
    for (const layout of ['A', 'B', 'C']) {
      const imagePath = matchup.image(layout);
      images.add(imagePath);
      assert.match(imagePath, /\.webp$/);
      assert.ok(existsSync(`app/${imagePath}`), `Missing app/${imagePath}`);
      assert.ok(statSync(`app/${imagePath}`).size > 0, `Empty app/${imagePath}`);
    }
  }

  assert.equal(images.size, 45);
  for (const path of required) {
    assert.ok(existsSync(path), `Missing ${path}`);
    assert.ok(statSync(path).size > 0, `Empty ${path}`);
  }
});

test('layout key extraction crops to the official content panel', () => {
  const extractor = readFileSync('tools/extract_layouts.py', 'utf8');
  assert.match(extractor, /KEY_CROP_POINTS = \(94, 42, 502, 778\)/);
  assert.match(extractor, /key\.crop\(key_crop\)\.save\(/);
});
