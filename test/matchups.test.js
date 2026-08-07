import test from 'node:test';
import assert from 'node:assert/strict';
import { dispositions, labels, matchups, resolveMatchup } from '../app/matchups.js';

test('contains every canonical disposition matchup', () => {
  assert.deepEqual(dispositions, [
    'take-and-hold',
    'purge-the-foe',
    'disruption',
    'reconnaissance',
    'priority-assets',
  ]);
  assert.deepEqual(labels, {
    'take-and-hold': 'Take and Hold',
    'purge-the-foe': 'Purge the Foe',
    disruption: 'Disruption',
    reconnaissance: 'Reconnaissance',
    'priority-assets': 'Priority Assets',
  });
  assert.deepEqual(matchups, [
    { left: 'take-and-hold', right: 'take-and-hold', leftMission: 'Battlefield Dominance', rightMission: 'Battlefield Dominance', slug: 'take-and-hold--take-and-hold' },
    { left: 'take-and-hold', right: 'purge-the-foe', leftMission: 'Immovable Object', rightMission: 'Unstoppable Force', slug: 'take-and-hold--purge-the-foe' },
    { left: 'take-and-hold', right: 'disruption', leftMission: 'Determined Acquisition', rightMission: 'Death Trap', slug: 'take-and-hold--disruption' },
    { left: 'take-and-hold', right: 'reconnaissance', leftMission: 'Purge and Secure', rightMission: 'Reconnaissance Sweep', slug: 'take-and-hold--reconnaissance' },
    { left: 'take-and-hold', right: 'priority-assets', leftMission: 'Inescapable Dominion', rightMission: 'Secure Asset', slug: 'take-and-hold--priority-assets' },
    { left: 'purge-the-foe', right: 'purge-the-foe', leftMission: 'Meatgrinder', rightMission: 'Meatgrinder', slug: 'purge-the-foe--purge-the-foe' },
    { left: 'purge-the-foe', right: 'disruption', leftMission: 'Punishment', rightMission: 'Delaying Action', slug: 'purge-the-foe--disruption' },
    { left: 'purge-the-foe', right: 'reconnaissance', leftMission: 'Consecrate', rightMission: 'Triangulation', slug: 'purge-the-foe--reconnaissance' },
    { left: 'purge-the-foe', right: 'priority-assets', leftMission: "Destroyer's Wrath", rightMission: 'Vital Link', slug: 'purge-the-foe--priority-assets' },
    { left: 'disruption', right: 'disruption', leftMission: 'Outmanoeuvre', rightMission: 'Outmanoeuvre', slug: 'disruption--disruption' },
    { left: 'disruption', right: 'reconnaissance', leftMission: 'Smoke and Mirrors', rightMission: 'Surveil the Foe', slug: 'disruption--reconnaissance' },
    { left: 'disruption', right: 'priority-assets', leftMission: 'Locate and Deny', rightMission: 'Extract Relic', slug: 'disruption--priority-assets' },
    { left: 'reconnaissance', right: 'reconnaissance', leftMission: 'Gather Intel', rightMission: 'Gather Intel', slug: 'reconnaissance--reconnaissance' },
    { left: 'reconnaissance', right: 'priority-assets', leftMission: 'Search and Scour', rightMission: 'Vanguard Operation', slug: 'reconnaissance--priority-assets' },
    { left: 'priority-assets', right: 'priority-assets', leftMission: 'Sabotage', rightMission: 'Sabotage', slug: 'priority-assets--priority-assets' },
  ]);
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
