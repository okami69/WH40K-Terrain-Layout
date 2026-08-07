import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { matchups, resolveMatchup } from '../app/matchups.js';

test('all matchup layouts have unique image assets', () => {
  const images = new Set();

  for (const { left, right } of matchups) {
    const matchup = resolveMatchup(left, right);
    for (const layout of ['A', 'B', 'C']) {
      const imagePath = matchup.image(layout);
      images.add(imagePath);
      assert.ok(existsSync(`app/${imagePath}`), `Missing app/${imagePath}`);
    }
  }

  assert.equal(images.size, 45);
});
