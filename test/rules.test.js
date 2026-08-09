import test from 'node:test';
import assert from 'node:assert/strict';
import { missionReferences, twists, pickRandomTwist, validateRules } from '../app/rules.js';

const missionIds = [
  'battlefield-dominance', 'immovable-object', 'unstoppable-force',
  'determined-acquisition', 'death-trap', 'purge-and-secure',
  'reconnaissance-sweep', 'inescapable-dominion', 'secure-asset',
  'meatgrinder', 'punishment', 'delaying-action', 'consecrate',
  'triangulation', 'destroyers-wrath', 'vital-link', 'outmanoeuvre',
  'smoke-and-mirrors', 'surveil-the-foe', 'locate-and-deny',
  'extract-relic', 'gather-intel', 'search-and-scour',
  'vanguard-operation', 'sabotage',
];

const twistIds = [
  'martial-pride', 'mirrored-world', 'night-fighting',
  'nowhere-to-hide', 'ruinscape', 'scrambled-communications',
];

const twistNames = [
  ['Воинская гордость', 'Martial Pride'],
  ['Зеркальный мир', 'Mirrored World'],
  ['Ночной бой', 'Night Fighting'],
  ['Негде спрятаться', 'Nowhere to Hide'],
  ['Мир руин', 'Ruinscape'],
  ['Нарушенная связь', 'Scrambled Communications'],
];

const oracle = {
  'battlefield-dominance': [2, 'FIRST & SECOND BATTLE ROUND', 2],
  'determined-acquisition': [2, 'ANY BATTLE ROUND', 2],
  'immovable-object': [3, 'ANY BATTLE ROUND', 3],
  'inescapable-dominion': [3, 'ANY BATTLE ROUND', 4],
  'purge-and-secure': [3, 'ANY BATTLE ROUND', 3],
  'unstoppable-force': [4, 'END OF BATTLE', 5],
  meatgrinder: [3, 'SECOND BATTLE ROUND ONWARDS', 5],
  punishment: [3, 'END OF BATTLE', 8],
  consecrate: [3, 'END OF BATTLE', 5],
  'destroyers-wrath': [3, 'SECOND BATTLE ROUND ONWARDS', 4],
  'death-trap': [3, 'ANY BATTLE ROUND', 2],
  'delaying-action': [3, 'ANY BATTLE ROUND', 2],
  outmanoeuvre: [4, 'FOURTH BATTLE ROUND ONWARDS', 6],
  'smoke-and-mirrors': [3, 'END OF BATTLE', 10],
  'locate-and-deny': [3, 'END OF BATTLE', 5],
  'reconnaissance-sweep': [3, 'ANY BATTLE ROUND', 3],
  triangulation: [3, 'END OF BATTLE', 10],
  'surveil-the-foe': [3, 'SECOND BATTLE ROUND ONWARDS', 5],
  'gather-intel': [4, 'FIRST BATTLE ROUND', 6],
  'search-and-scour': [3, 'END OF BATTLE', 5],
  'secure-asset': [2, 'ANY BATTLE ROUND', 4],
  'vital-link': [3, 'END OF BATTLE', 10],
  'extract-relic': [3, 'END OF BATTLE', 5],
  'vanguard-operation': [3, 'END OF BATTLE', 10],
  sabotage: [2, 'ANY BATTLE ROUND', 3],
};

test('provides complete bilingual structured references for all primary missions', () => {
  assert.deepEqual(Object.keys(missionReferences).sort(), missionIds.toSorted());
  for (const [id, mission] of Object.entries(missionReferences)) {
    assert.equal(mission.id, id);
    assert.ok(mission.overview.ru && mission.overview.en, `${id} overview`);
    assert.ok(mission.sections.length > 0, `${id} sections`);
    for (const section of mission.sections) {
      assert.ok(section.heading.ru && section.heading.en, `${id} heading`);
      assert.ok(section.timing.ru && section.timing.en, `${id} timing`);
      assert.ok(section.conditions.length > 0, `${id} conditions`);
      for (const condition of section.conditions) {
        assert.ok(condition.text.ru && condition.text.en, `${id} condition`);
        assert.ok(condition.vp === null || Number.isFinite(condition.vp), `${id} vp`);
        assert.equal(typeof condition.cumulative, 'boolean', `${id} cumulative`);
      }
    }
  }
  assert.doesNotThrow(validateRules);
});

test('matches one audited timing and VP fact for every mission', () => {
  for (const [id, [sectionCount, heading, vp]] of Object.entries(oracle)) {
    const mission = missionReferences[id];
    assert.equal(mission.sections.length, sectionCount, `${id} section count`);
    const section = mission.sections.find(item => item.heading.en === heading
      && item.conditions.some(condition => condition.vp === vp));
    assert.ok(section, `${id} audited timing`);
  }
  assert.equal(missionReferences['battlefield-dominance'].sections[1].conditions[1].cumulative, true);
  assert.equal(missionReferences['purge-and-secure'].sections[0].conditions[1].alternative, true);
  assert.equal(missionReferences['locate-and-deny'].action.useLimit.en, 'Once per turn.');
  assert.match(missionReferences['locate-and-deny'].action.restriction.en, /only one operation marker/);
  assert.match(missionReferences.punishment.status.en, /condemned until the start of your next turn/);
  assert.match(missionReferences.consecrate.status.en, /place an operation marker/);
  assert.deepEqual(Object.values(missionReferences).filter(item => item.action).map(item => item.action.title.en), [
    'Booby Trap', 'Secure Asset', 'Triangulate', 'Maintain Control', 'Decoy',
    'Surveil the Foe', 'Sensor Sweep', 'Sensor Sweep', 'Extract Intelligence',
    'Vanguard Operation', 'Sabotage',
  ]);
  assert.equal(missionReferences['gather-intel'].maximum, 45);
});

test('provides the six current twists in official order with exact effects', () => {
  assert.deepEqual(twists.map(twist => twist.id), twistIds);
  assert.deepEqual(twists.map(twist => [twist.name.ru, twist.name.en]), twistNames);
  assert.deepEqual(twists[0].effects.en, [
    'A BATTLELINE unit can start an action in a turn in which it made an advance move.',
    'A BATTLELINE unit can shoot in a turn in which it started an action.',
  ]);
  assert.match(twists[1].effects.en[0], /roll D6: 1 Battlefield Dominance; 2 Meatgrinder; 3 Outmanoeuvre; 4 Gather Intel; 5 Sabotage; 6 re-roll\.$/);
  assert.match(twists[2].effects.en[0], /18".*\[INDIRECT FIRE\].*18"/);
  assert.deepEqual(twists.slice(3).map(twist => twist.effects.en[0]), [
    'Terrain features do not have the Solid rule.',
    'When a unit makes a normal or advance move, models in it have the MOBILE keyword until that move ends.',
    'The players exchange their Primary Mission cards.',
  ]);
  for (const twist of twists) {
    assert.ok(twist.effects.ru.length > 0 && twist.effects.en.length > 0, `${twist.id} effects`);
  }
});

test('selects a twist uniformly through an injectable random source', () => {
  assert.equal(pickRandomTwist(() => 0).id, 'martial-pride');
  assert.equal(pickRandomTwist(() => 0.5).id, 'nowhere-to-hide');
  assert.equal(pickRandomTwist(() => 0.999999).id, 'scrambled-communications');
});
