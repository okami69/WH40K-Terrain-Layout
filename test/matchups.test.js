import test from 'node:test';
import assert from 'node:assert/strict';
import { dispositions, matchups, resolveMatchup } from '../app/matchups.js';

test('contains every canonical disposition matchup', () => {
  assert.equal(dispositions.length, 5);
  assert.equal(matchups.length, 15);
});

test('covers every ordered disposition selection and layout', () => {
  for (const left of dispositions) {
    for (const right of dispositions) {
      const result = resolveMatchup(left, right);
      assert.ok(result.leftMission);
      assert.ok(result.rightMission);
      assert.match(result.image('A'), /-a\.png$/);
      assert.match(result.image('B'), /-b\.png$/);
      assert.match(result.image('C'), /-c\.png$/);
    }
  }
});

test('swaps missions but not the map when selection order is reversed', () => {
  const forward = resolveMatchup('disruption', 'priority-assets');
  const reverse = resolveMatchup('priority-assets', 'disruption');

  assert.equal(forward.leftMission, 'Locate and Deny');
  assert.equal(forward.rightMission, 'Extract Relic');
  assert.equal(reverse.leftMission, 'Extract Relic');
  assert.equal(reverse.rightMission, 'Locate and Deny');
  assert.equal(forward.image('C'), reverse.image('C'));
});

test('rejects an unknown disposition or layout', () => {
  assert.throws(() => resolveMatchup('unknown', 'disruption'), /Unknown matchup/);
  assert.throws(() => resolveMatchup('disruption', 'priority-assets').image('D'), /Unknown layout/);
});
