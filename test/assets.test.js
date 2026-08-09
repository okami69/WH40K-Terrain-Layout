import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { layoutCatalog, matchups, resolveMatchup } from '../app/matchups.js';

test('all matchup layouts have unique image assets', () => {
  const images = new Set();
  const required = [
    'app/assets/backgrounds/event-companion-paper.webp',
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

test('every gallery catalog entry has a bundled non-empty image', () => {
  for (const item of layoutCatalog) {
    assert.ok(existsSync(`app/${item.image}`), `Missing app/${item.image}`);
    assert.ok(statSync(`app/${item.image}`).size > 0, `Empty app/${item.image}`);
  }
});

test('layout key extraction crops to the official content panel', () => {
  const extractor = readFileSync('tools/extract_layouts.py', 'utf8');
  assert.match(extractor, /KEY_CROP_POINTS = \(94, 42, 502, 778\)/);
  assert.match(extractor, /key\.crop\(key_crop\)\.save\(/);
});

test('extracts the shared Event Companion paper as a required offline asset', () => {
  const background = 'app/assets/backgrounds/event-companion-paper.webp';
  assert.ok(existsSync(background), `Missing ${background}`);
  assert.ok(statSync(background).size > 0, `Empty ${background}`);

  const webp = readFileSync(background);
  assert.equal(webp.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(webp.subarray(8, 12).toString('ascii'), 'WEBP');
  assert.equal(webp.subarray(12, 16).toString('ascii'), 'VP8L');
  assert.equal(webp[20], 0x2f);
  const dimensions = webp.readUInt32LE(21);
  assert.equal((dimensions & 0x3fff) + 1, 3570);
  assert.equal(((dimensions >>> 14) & 0x3fff) + 1, 5052);

  const extractor = readFileSync('tools/extract_layouts.py', 'utf8');
  assert.match(extractor, /PAPER_PAGE = 9/);
  assert.match(extractor, /PAPER_OBJECT_COUNT = 2/);
  assert.match(extractor, /paper_objects = list\(paper_page\.get_objects\(\)\)/);
  assert.match(extractor, /for object_ in paper_objects\[PAPER_OBJECT_COUNT:\]:\s+paper_page\.remove_obj\(object_\)/);
  assert.match(extractor, /if paper_tile\.size != \(1191, 1684\):\s+raise SystemExit\(f"Unexpected Event Companion paper render size: expected \(1191, 1684\), got \{paper_tile\.size\}"\)/);
  assert.match(extractor, /paper\.save\(\s*BACKGROUND_OUTPUT \/ "event-companion-paper\.webp"/);
});
