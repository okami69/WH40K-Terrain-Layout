import test from 'node:test';
import assert from 'node:assert/strict';
import {
  dispositions,
  deployments,
  labels,
  layoutCatalog,
  languages,
  matchups,
  missions,
  resolveMatchup,
} from '../app/matchups.js';

const expectedDispositions = [
  'take-and-hold',
  'purge-the-foe',
  'disruption',
  'reconnaissance',
  'priority-assets',
];

test('contains every canonical disposition matchup', () => {
  assert.deepEqual(dispositions, expectedDispositions);
  assert.deepEqual(
    matchups.map(({ left, right, leftMission, rightMission, slug }) => ({
      left,
      right,
      leftMission,
      rightMission,
      slug,
    })),
    [
      { left: 'take-and-hold', right: 'take-and-hold', leftMission: 'battlefield-dominance', rightMission: 'battlefield-dominance', slug: 'take-and-hold--take-and-hold' },
      { left: 'take-and-hold', right: 'purge-the-foe', leftMission: 'immovable-object', rightMission: 'unstoppable-force', slug: 'take-and-hold--purge-the-foe' },
      { left: 'take-and-hold', right: 'disruption', leftMission: 'determined-acquisition', rightMission: 'death-trap', slug: 'take-and-hold--disruption' },
      { left: 'take-and-hold', right: 'reconnaissance', leftMission: 'purge-and-secure', rightMission: 'reconnaissance-sweep', slug: 'take-and-hold--reconnaissance' },
      { left: 'take-and-hold', right: 'priority-assets', leftMission: 'inescapable-dominion', rightMission: 'secure-asset', slug: 'take-and-hold--priority-assets' },
      { left: 'purge-the-foe', right: 'purge-the-foe', leftMission: 'meatgrinder', rightMission: 'meatgrinder', slug: 'purge-the-foe--purge-the-foe' },
      { left: 'purge-the-foe', right: 'disruption', leftMission: 'punishment', rightMission: 'delaying-action', slug: 'purge-the-foe--disruption' },
      { left: 'purge-the-foe', right: 'reconnaissance', leftMission: 'consecrate', rightMission: 'triangulation', slug: 'purge-the-foe--reconnaissance' },
      { left: 'purge-the-foe', right: 'priority-assets', leftMission: 'destroyers-wrath', rightMission: 'vital-link', slug: 'purge-the-foe--priority-assets' },
      { left: 'disruption', right: 'disruption', leftMission: 'outmanoeuvre', rightMission: 'outmanoeuvre', slug: 'disruption--disruption' },
      { left: 'disruption', right: 'reconnaissance', leftMission: 'smoke-and-mirrors', rightMission: 'surveil-the-foe', slug: 'disruption--reconnaissance' },
      { left: 'disruption', right: 'priority-assets', leftMission: 'locate-and-deny', rightMission: 'extract-relic', slug: 'disruption--priority-assets' },
      { left: 'reconnaissance', right: 'reconnaissance', leftMission: 'gather-intel', rightMission: 'gather-intel', slug: 'reconnaissance--reconnaissance' },
      { left: 'reconnaissance', right: 'priority-assets', leftMission: 'search-and-scour', rightMission: 'vanguard-operation', slug: 'reconnaissance--priority-assets' },
      { left: 'priority-assets', right: 'priority-assets', leftMission: 'sabotage', rightMission: 'sabotage', slug: 'priority-assets--priority-assets' },
    ],
  );
});

test('catalogs all 45 layouts by deployment', () => {
  assert.deepEqual(deployments, [
    'crucible-of-battle',
    'dawn-of-war',
    'hammer-and-anvil',
    'search-and-destroy',
    'sweeping-engagement',
    'tipping-point',
  ]);
  assert.equal(layoutCatalog.length, 45);
  assert.equal(new Set(layoutCatalog.map(item => item.id)).size, 45);
  assert.equal(new Set(layoutCatalog.map(item => item.image)).size, 45);
  assert.deepEqual(
    Object.fromEntries(deployments.map(deployment => [
      deployment,
      layoutCatalog.filter(item => item.deployment === deployment).length,
    ])),
    {
      'crucible-of-battle': 7,
      'dawn-of-war': 6,
      'hammer-and-anvil': 5,
      'search-and-destroy': 8,
      'sweeping-engagement': 9,
      'tipping-point': 10,
    },
  );

  for (const item of layoutCatalog) {
    assert.ok(matchups.some(matchup => matchup.slug === item.slug), `${item.id} has unknown matchup`);
    assert.ok(['A', 'B', 'C'].includes(item.layout), `${item.id} has unknown layout`);
    assert.ok(deployments.includes(item.deployment), `${item.id} has unknown deployment`);
    assert.equal(item.id, `${item.slug}-${item.layout.toLowerCase()}`);
    assert.equal(item.image, `assets/layouts/${item.id}.webp`);
  }
});

test('provides localized disposition labels and icons', () => {
  assert.deepEqual(languages, ['ru', 'en']);

  for (const disposition of dispositions) {
    assert.ok(labels[disposition].ru, `${disposition} missing ru label`);
    assert.ok(labels[disposition].en, `${disposition} missing en label`);
    assert.equal(labels[disposition].icon, `assets/dispositions/${disposition}.webp`);
  }
});

test('provides localized summaries for all 25 missions', () => {
  const ids = new Set();

  for (const matchup of matchups) {
    ids.add(matchup.leftMission);
    ids.add(matchup.rightMission);
  }

  assert.equal(ids.size, 25);
  assert.deepEqual([...ids].sort(), Object.keys(missions).sort());

  for (const id of ids) {
    const mission = missions[id];
    assert.ok(mission.name.ru, `${id} missing ru name`);
    assert.ok(mission.name.en, `${id} missing en name`);
    assert.ok(mission.summary.ru, `${id} missing ru summary`);
    assert.ok(mission.summary.en, `${id} missing en summary`);
    assert.ok(mission.summary.ru.includes('точный подсчет очков'), `${id} missing ru disclaimer`);
    assert.ok(mission.summary.en.includes('exact scoring'), `${id} missing en disclaimer`);
    assert.ok(mission.summary.ru.split(/[.!?]/).filter(Boolean).length <= 2, `${id} ru summary too long`);
    assert.ok(mission.summary.en.split(/[.!?]/).filter(Boolean).length <= 2, `${id} en summary too long`);
  }
});

test('covers every ordered disposition selection and layout', () => {
  for (const left of dispositions) {
    for (const right of dispositions) {
      const result = resolveMatchup(left, right);
      assert.ok(missions[result.leftMission]);
      assert.ok(missions[result.rightMission]);
      assert.match(result.image('A'), /-a\.webp$/);
      assert.match(result.image('B'), /-b\.webp$/);
      assert.match(result.image('C'), /-c\.webp$/);
    }
  }
});

test('swaps missions but not the map when selection order is reversed', () => {
  const forward = resolveMatchup('disruption', 'priority-assets');
  const reverse = resolveMatchup('priority-assets', 'disruption');

  assert.equal(forward.leftMission, 'locate-and-deny');
  assert.equal(forward.rightMission, 'extract-relic');
  assert.equal(reverse.leftMission, 'extract-relic');
  assert.equal(reverse.rightMission, 'locate-and-deny');
  assert.equal(forward.image('C'), reverse.image('C'));
});

test('rejects an unknown disposition or layout', () => {
  assert.throws(() => resolveMatchup('unknown', 'disruption'), /Unknown matchup/);
  assert.throws(() => resolveMatchup('disruption', 'priority-assets').image('D'), /Unknown layout/);
});
