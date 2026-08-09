import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import {
  missionReferences,
  twists,
  pickRandomTwist,
  validateRules,
  isCompleteMissionReference,
} from '../app/rules.js';

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

const markerMissionIds = [
  'consecrate', 'death-trap', 'smoke-and-mirrors', 'locate-and-deny',
  'triangulation', 'surveil-the-foe', 'gather-intel', 'vital-link', 'extract-relic',
];

const stableSerialize = value => Array.isArray(value)
  ? `[${value.map(stableSerialize).join(',')}]`
  : value && typeof value === 'object'
    ? `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableSerialize(value[key])}`).join(',')}}`
    : JSON.stringify(value);
const sha256 = value => createHash('sha256').update(stableSerialize(value)).digest('hex');

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
    assert.deepEqual(Object.keys(mission).sort(), ['id', 'overview', 'sections']);
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

test('locks every audited mission and Twist fact to canonical source-oracle hashes', () => {
  assert.equal(sha256(missionReferences), '95c1b6b0e6a3bff4a0aa7a708e4ab3c0c0cccdd52c40d7b6cdce29ce450903f9');
  assert.equal(sha256(twists), '3d19696fd59c255dd8a09f7092d4bbf64857027b3e436790099f106dce799770');
});

test('matches one audited timing and VP fact for every mission', () => {
  for (const [id, [sectionCount, heading, vp]] of Object.entries(oracle)) {
    const mission = missionReferences[id];
    assert.equal(mission.sections.filter(section => section.conditions.some(condition => condition.vp !== null)).length, sectionCount, `${id} scoring section count`);
    const section = mission.sections.find(item => item.heading.en === heading
      && item.conditions.some(condition => condition.vp === vp));
    assert.ok(section, `${id} audited timing`);
  }
  assert.equal(missionReferences['battlefield-dominance'].sections[1].conditions[1].cumulative, true);
  assert.equal(missionReferences['purge-and-secure'].sections[0].conditions[1].alternative, true);
});

test('exposes global Primary limits once through ordinary sections', () => {
  const expected = {
    text: { ru: 'Лимиты основной миссии', en: 'Primary Mission limits' },
    total: 45,
    perBattleRound: 15,
    endOfBattleExempt: true,
  };
  for (const [id, mission] of Object.entries(missionReferences)) {
    const limited = mission.sections.filter(section => section.limit);
    assert.equal(limited.length, 1, `${id} limit count`);
    assert.deepEqual(limited[0].limit, expected, `${id} limit`);
  }
});

test('keeps the shared Primary limit deeply immutable', () => {
  const first = missionReferences['battlefield-dominance'].sections.find(section => section.limit).limit;
  const second = missionReferences.sabotage.sections.find(section => section.limit).limit;
  assert.throws(() => { first.total = 999; }, TypeError);
  assert.throws(() => { first.text.en = 'changed'; }, TypeError);
  assert.equal(first.total, 45);
  assert.equal(second.total, 45);
  assert.equal(second.text.en, 'Primary Mission limits');
});

test('keeps setup, status, marker, and all reverse-side action facts in renderable sections', () => {
  const actionTitles = [
    'Booby Trap', 'Secure Asset', 'Triangulate', 'Maintain Control', 'Decoy',
    'Surveil the Foe', 'Sensor Sweep', 'Sensor Sweep', 'Extract Intelligence',
    'Vanguard Operation', 'Sabotage',
  ];
  const detailSections = Object.values(missionReferences).flatMap(mission => mission.sections
    .filter(section => section.conditions.every(condition => condition.vp === null)));
  assert.deepEqual(detailSections.filter(section => actionTitles.includes(section.heading.en)).map(section => section.heading.en), actionTitles);
  const details = detailSections.flatMap(section => section.conditions.map(condition => condition.text.en)).join('\n');
  assert.match(details, /At the start of battle, select five terrain areas/);
  assert.match(details, /condemned until the start of your next turn/);
  assert.match(details, /becomes a consecration unit/);
  assert.match(details, /Removing an operation marker also removes the status it applied/);
  assert.match(details, /When a friendly unit ends a move.*remove those markers/);
  assert.match(details, /Restriction: A unit cannot start this action if only one operation marker remains/);
  assert.match(details, /Effect: Place one of your operation markers/);
});

test('preserves operation-marker ownership and Sensor Sweep scope exactly', () => {
  const detailText = (id, heading) => missionReferences[id].sections
    .find(section => section.heading.en === heading).conditions.map(condition => condition.text.en);

  assert.ok(detailText('consecrate', 'Mission rule').some(text => /place one of your operation markers within range/.test(text)));
  assert.ok(detailText('triangulation', 'Triangulate').some(text => text === 'Effect: The objective is triangulated; place one of your operation markers within range.'));
  assert.ok(detailText('smoke-and-mirrors', 'Decoy').some(text => text === 'Effect: The objective is decoyed; place one of your operation markers within range.'));
  assert.ok(detailText('locate-and-deny', 'Setup').some(text => /place one of your operation markers in each/.test(text)));

  const extractSweep = detailText('extract-relic', 'Sensor Sweep');
  assert.ok(extractSweep.includes('Effect: Remove one operation marker from the battlefield.'));
  assert.ok(extractSweep.includes('Restriction: A unit cannot start this action if only one operation marker remains.'));
});

test('labels marker and qualifying-unit scoring by the item that awards VP', () => {
  const vitalMarker = missionReferences['vital-link'].sections[0].conditions[1];
  const sabotageBonus = missionReferences.sabotage.sections[0].conditions[1];
  assert.equal(vitalMarker.per, 'marker');
  assert.equal(sabotageBonus.per, 'unit');
});

test('preserves exact Booby Trap eligibility through its section', () => {
  const section = missionReferences['death-trap'].sections.find(item => item.heading.en === 'Booby Trap');
  assert.ok(section);
  assert.ok(section.conditions.some(condition => condition.text.en === 'Units: One friendly unit within range of one objective (excluding your home objective) or within one terrain area that is not within your deployment zone and that you have not yet trapped.'));
  assert.ok(section.conditions.some(condition => condition.text.ru === 'Подразделения: Одно дружественное подразделение в пределах одной цели (кроме вашей домашней цели) либо внутри одной зоны ландшафта вне вашей зоны развёртывания, которую вы ещё не заминировали.'));
});

test('exposes both global operation-marker rules for every affected mission', () => {
  const expected = [
    {
      text: {
        ru: 'Удаление маркера операции также снимает наложенный им статус.',
        en: 'Removing an operation marker also removes the status it applied.',
      },
      vp: null,
      cumulative: false,
    },
    {
      text: {
        ru: 'Маркер операции основной миссии нельзя удалить, если эта миссия не указывает, как и когда это сделать.',
        en: 'A Primary Mission operation marker cannot be removed unless that mission specifies how and when.',
      },
      vp: null,
      cumulative: false,
    },
  ];
  for (const id of markerMissionIds) {
    const sections = missionReferences[id].sections.filter(section => section.heading.en === 'Operation markers');
    assert.equal(sections.length, 1, `${id} operation-marker section`);
    assert.deepEqual(sections[0].conditions, expected, `${id} operation-marker rules`);
  }
});

test('rejects incomplete or unknown rules records', () => {
  assert.equal(isCompleteMissionReference(missionReferences['death-trap']), true);
  assert.equal(isCompleteMissionReference({ ...missionReferences['death-trap'], sections: [] }), false);

  const missingMission = structuredClone(missionReferences);
  delete missingMission.sabotage;
  assert.throws(() => validateRules(missingMission, twists), /mission IDs/);

  const missingSection = structuredClone(missionReferences);
  missingSection.sabotage.sections = [];
  assert.throws(() => validateRules(missingSection, twists), /sabotage/);

  const deletedScoringSection = structuredClone(missionReferences);
  deletedScoringSection['battlefield-dominance'].sections.splice(1, 1);
  assert.throws(() => validateRules(deletedScoringSection, twists), /battlefield-dominance/);

  const changedVp = structuredClone(missionReferences);
  changedVp['battlefield-dominance'].sections[0].conditions[0].vp = 999;
  assert.throws(() => validateRules(changedVp, twists), /battlefield-dominance/);

  const missingDetail = structuredClone(missionReferences);
  missingDetail['death-trap'].sections = missingDetail['death-trap'].sections.filter(section => section.heading.en !== 'Booby Trap');
  assert.throws(() => validateRules(missingDetail, twists), /death-trap/);

  const missingActionFact = structuredClone(missionReferences);
  missingActionFact['death-trap'].sections.find(section => section.heading.en === 'Booby Trap').conditions.pop();
  assert.throws(() => validateRules(missingActionFact, twists), /death-trap/);

  const missingMarkerRule = structuredClone(missionReferences);
  missingMarkerRule.consecrate.sections.find(section => section.heading.en === 'Operation markers').conditions.pop();
  assert.throws(() => validateRules(missingMarkerRule, twists), /consecrate/);

  const mismatchedMissionId = structuredClone(missionReferences);
  mismatchedMissionId['battlefield-dominance'].id = 'immovable-object';
  assert.throws(() => validateRules(mismatchedMissionId, twists), /mission IDs/);

  const missingLimit = structuredClone(missionReferences);
  delete missingLimit['battlefield-dominance'].sections[0].limit;
  assert.throws(() => validateRules(missingLimit, twists), /battlefield-dominance/);

  const missingTwistId = structuredClone(twists);
  delete missingTwistId[0].id;
  assert.throws(() => validateRules(missionReferences, missingTwistId), /twist IDs/);

  const missingEffect = structuredClone(twists);
  missingEffect[0].effects.en = [];
  assert.throws(() => validateRules(missionReferences, missingEffect), /martial-pride/);

  const missingRuEffect = structuredClone(twists);
  missingRuEffect[0].effects.ru.pop();
  assert.throws(() => validateRules(missionReferences, missingRuEffect), /martial-pride/);

  const invalidPer = structuredClone(missionReferences);
  invalidPer['battlefield-dominance'].sections[1].conditions[0].per = 'model';
  assert.throws(() => validateRules(invalidPer, twists), /battlefield-dominance.*section 2.*condition 1.*per/);

  const invalidAlternative = structuredClone(missionReferences);
  invalidAlternative['purge-and-secure'].sections[0].conditions[1].alternative = 'yes';
  assert.throws(() => validateRules(invalidAlternative, twists), /purge-and-secure.*section 1.*condition 2.*alternative/);
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

  const selectable = [twists[1], twists[4]];
  assert.equal(pickRandomTwist(() => 0, selectable), twists[1]);
  assert.equal(pickRandomTwist(() => 0.999999, selectable), twists[4]);
});

test('rejects an invalid injected random value', () => {
  for (const value of [1, -0.01, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => pickRandomTwist(() => value), RangeError);
  }
});

test('rejects an invalid or empty random Twist pool', () => {
  assert.throws(() => pickRandomTwist(() => 0, null), {
    name: 'TypeError',
    message: 'Twist pool must be an array',
  });
  assert.throws(() => pickRandomTwist(() => 0, []), {
    name: 'RangeError',
    message: 'Twist pool must contain at least one Twist',
  });
});
