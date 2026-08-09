const headings = {
  'ANY BATTLE ROUND': 'ЛЮБОЙ БОЕВОЙ РАУНД',
  'FIRST BATTLE ROUND': 'ПЕРВЫЙ БОЕВОЙ РАУНД',
  'FIRST & SECOND BATTLE ROUND': 'ПЕРВЫЙ И ВТОРОЙ БОЕВЫЕ РАУНДЫ',
  'SECOND BATTLE ROUND ONWARDS': 'СО ВТОРОГО БОЕВОГО РАУНДА',
  'SECOND TO FOURTH BATTLE ROUND': 'СО ВТОРОГО ПО ЧЕТВЁРТЫЙ БОЕВОЙ РАУНД',
  'SECOND & THIRD BATTLE ROUND': 'ВТОРОЙ И ТРЕТИЙ БОЕВЫЕ РАУНДЫ',
  'FOURTH BATTLE ROUND ONWARDS': 'С ЧЕТВЁРТОГО БОЕВОГО РАУНДА',
  'FIFTH BATTLE ROUND': 'ПЯТЫЙ БОЕВОЙ РАУНД',
  'END OF BATTLE': 'КОНЕЦ БОЯ',
};

const timings = {
  'End of your turn': 'В конце вашего хода',
  'End of a turn': 'В конце хода',
  'End of your Command phase': 'В конце вашей фазы командования',
  'End of your Command phase (or the end of your turn in the fifth battle round)': 'В конце вашей фазы командования (или в конце вашего хода в пятом боевом раунде)',
  'At end of battle': 'В конце боя',
  'Reverse side': 'Обратная сторона',
  'Always': 'Постоянно',
  'Start of battle': 'В начале боя',
};

const c = (en, ru, vp, cumulative = false, extra = {}) => ({
  text: { ru, en }, vp, cumulative, ...extra,
});

const s = (heading, timing, ...conditions) => ({
  heading: { ru: headings[heading], en: heading },
  timing: { ru: timings[timing], en: timing },
  conditions,
});

const primaryLimit = {
  text: { ru: 'Лимиты основной миссии', en: 'Primary Mission limits' },
  total: 45,
  perBattleRound: 15,
  endOfBattleExempt: true,
};

const detail = (headingEn, headingRu, timing, ...conditions) => ({
  heading: { ru: headingRu, en: headingEn },
  timing: { ru: timings[timing], en: timing },
  conditions,
});

const mission = (id, overviewEn, overviewRu, scoringSections, extra = {}) => {
  const sections = scoringSections.map((section, index) => index === 0 ? { ...section, limit: primaryLimit } : section);
  for (const [kind, value] of Object.entries(extra)) {
    if (kind === 'action') sections.push(value);
    if (kind === 'status') sections.push(detail('Mission rule', 'Правило миссии', 'Always', c(value.en, value.ru, null)));
    if (kind === 'setup') sections.push(detail('Setup', 'Подготовка', 'Start of battle', c(value.en, value.ru, null)));
  }
  return { id, overview: { ru: overviewRu, en: overviewEn }, sections };
};

const commandTiming = 'End of your Command phase (or the end of your turn in the fifth battle round)';
const nonHome = c(
  'For each objective you control (excluding your home objective).',
  'За каждую контролируемую цель (кроме вашей домашней цели).',
  4,
  false,
  { per: 'objective' },
);
const holdOneNonHome = vp => c(
  'You control one or more objectives (excluding your home objective).',
  'Вы контролируете хотя бы одну цель (кроме вашей домашней цели).',
  vp,
);
const destroyedOne = vp => c(
  'One or more enemy units were destroyed this turn.',
  'В этот ход уничтожено хотя бы одно вражеское подразделение.',
  vp,
);
const enemyHome = vp => c(
  "You control your opponent's home objective.",
  'Вы контролируете домашнюю цель противника.',
  vp,
);
const endBattle = (...conditions) => s('END OF BATTLE', 'At end of battle', ...conditions);

const action = (titleEn, titleRu, startsEn, startsRu, unitsEn, unitsRu, useLimitEn, useLimitRu, completesEn, completesRu, effectEn, effectRu, restriction) => detail(
  titleEn,
  titleRu,
  'Reverse side',
  c(`Starts: ${startsEn}`, `Начало: ${startsRu}`, null),
  c(`Units: ${unitsEn}`, `Подразделения: ${unitsRu}`, null),
  c(`Use limit: ${useLimitEn}`, `Лимит: ${useLimitRu}`, null),
  c(`Completes: ${completesEn}`, `Завершение: ${completesRu}`, null),
  c(`Effect: ${effectEn}`, `Эффект: ${effectRu}`, null),
  ...(restriction ? [c(`Restriction: ${restriction[0]}`, `Ограничение: ${restriction[1]}`, null)] : []),
);

export const missionReferences = {
  'battlefield-dominance': mission('battlefield-dominance', 'Hold more objectives than the enemy and reinforce that control from your home objective.', 'Контролируйте больше целей, чем противник, усиливая контроль удержанием домашней цели.', [
    s('FIRST & SECOND BATTLE ROUND', 'End of your turn', c('You control more objectives than your opponent.', 'Вы контролируете больше целей, чем противник.', 2)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming,
      c('For each objective you control.', 'За каждую контролируемую цель.', 3, false, { per: 'objective' }),
      c('For each of those objectives (excluding your home objective), if you control your home objective.', 'Ещё за каждую из этих целей (кроме домашней), если вы контролируете домашнюю цель.', 2, true, { per: 'objective' })),
  ]),
  'immovable-object': mission('immovable-object', 'Hold central and non-home objectives through the battle.', 'Удерживайте центральные и другие не домашние цели на протяжении боя.', [
    s('ANY BATTLE ROUND', 'End of your turn', c('You control one or more central objectives.', 'Вы контролируете хотя бы одну центральную цель.', 3)),
    s('SECOND TO FOURTH BATTLE ROUND', 'End of your Command phase', c('For each objective you control (excluding your home objective).', 'За каждую контролируемую цель (кроме домашней).', 5, false, { per: 'objective' })),
    s('FIFTH BATTLE ROUND', 'End of your turn', c('For each objective you control (excluding your home objective).', 'За каждую контролируемую цель (кроме домашней).', 5, false, { per: 'objective' })),
  ]),
  'unstoppable-force': mission('unstoppable-force', 'Destroy the enemy, take new ground, and finish on central objectives.', 'Уничтожайте врага, захватывайте новые позиции и завершите бой на центральных целях.', [
    s('ANY BATTLE ROUND', 'End of your turn', destroyedOne(3)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, nonHome),
    s('SECOND BATTLE ROUND ONWARDS', 'End of your turn', c('You control one or more objectives you did not control at the start of the turn (excluding your home objective).', 'Вы контролируете хотя бы одну цель, которую не контролировали в начале хода (кроме домашней).', 3)),
    endBattle(c('You control one or more central objectives.', 'Вы контролируете хотя бы одну центральную цель.', 5)),
  ]),
  'determined-acquisition': mission('determined-acquisition', 'Acquire new objectives and press into enemy territory.', 'Захватывайте новые цели и продвигайтесь на территорию противника.', [
    s('ANY BATTLE ROUND', 'End of your turn', c('For each objective you control that you did not control at the start of the turn (excluding your home objective).', 'За каждую контролируемую цель, которую вы не контролировали в начале хода (кроме домашней).', 2, false, { per: 'objective' })),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming,
      c('For each objective you control.', 'За каждую контролируемую цель.', 3, false, { per: 'objective' }),
      c("For each of those objectives within your opponent's territory.", 'Ещё за каждую из этих целей на территории противника.', 3, true, { per: 'objective' })),
  ]),
  'death-trap': mission('death-trap', 'Trap terrain areas with operation markers, then punish enemies caught inside.', 'Минируйте зоны ландшафта маркерами операции и уничтожайте попавших туда врагов.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('For each terrain area trapped this turn.', 'За каждую заминированную в этот ход зону ландшафта.', 2, false, { per: 'terrain-area' }),
      c('For each of those terrain areas that is an objective.', 'Ещё за каждую из этих зон, являющуюся целью.', 3, true, { per: 'objective' })),
    s('ANY BATTLE ROUND', 'End of your turn', c('One or more enemy units that started the turn within a terrain area were destroyed, if that terrain area is trapped.', 'Уничтожено хотя бы одно вражеское подразделение, начавшее ход в заминированной зоне ландшафта.', 3)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(4)),
  ], { action: action('Booby Trap', 'Мина-ловушка', 'Your Shooting phase.', 'Ваша фаза стрельбы.', 'One friendly unit within range of one objective (excluding your home objective) or within one terrain area that is not within your deployment zone and that you have not yet trapped.', 'Одно дружественное подразделение в пределах одной цели (кроме вашей домашней цели) либо внутри одной зоны ландшафта вне вашей зоны развёртывания, которую вы ещё не заминировали.', 'Unlimited; each acting unit must use a different terrain area.', 'Без лимита; каждое действующее подразделение должно выбрать другую зону ландшафта.', 'Immediately.', 'Немедленно.', 'The terrain area becomes trapped; place one of your operation markers within it.', 'Зона становится заминированной; поместите в неё один из ваших маркеров операции.') }),
  'purge-and-secure': mission('purge-and-secure', 'Destroy enemies around objectives, secure new ground, and hold non-home objectives.', 'Уничтожайте врагов у целей, занимайте новые позиции и удерживайте не домашние цели.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('An enemy unit was destroyed by a friendly unit within range of an objective.', 'Вражеское подразделение уничтожено дружественным подразделением в пределах цели.', 3),
      c('Or an enemy unit that started the turn within range of an objective was destroyed.', 'Или уничтожено вражеское подразделение, начавшее ход в пределах цели.', 3, false, { alternative: true })),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, nonHome),
    s('SECOND BATTLE ROUND ONWARDS', 'End of your turn', c('You control a non-home objective you did not control at the start of the turn.', 'Вы контролируете не домашнюю цель, которую не контролировали в начале хода.', 3)),
  ]),
  'reconnaissance-sweep': mission('reconnaissance-sweep', 'Spread through table quarters, destroy enemies, and retain objective control.', 'Распределяйтесь по четвертям стола, уничтожайте врагов и удерживайте цели.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('Three or more friendly units are wholly within three different table quarters and more than 6" from the centre.', 'Не менее трёх дружественных подразделений целиком находятся в трёх разных четвертях дальше 6" от центра.', 3),
      c('Or four or more friendly units are wholly within four different table quarters and more than 6" from the centre.', 'Или не менее четырёх дружественных подразделений целиком находятся в четырёх разных четвертях дальше 6" от центра.', 6, false, { alternative: true })),
    s('ANY BATTLE ROUND', 'End of your turn', c('For each enemy unit destroyed this turn.', 'За каждое уничтоженное в этот ход вражеское подразделение.', 1, false, { per: 'unit' })),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(3)),
  ]),
  'inescapable-dominion': mission('inescapable-dominion', 'Build broad objective control and seize the enemy home objective.', 'Установите широкий контроль целей и захватите домашнюю цель противника.', [
    s('ANY BATTLE ROUND', 'End of your turn', c('You control three or more objectives.', 'Вы контролируете три или более цели.', 4)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming,
      c('You control two or more objectives.', 'Вы контролируете две или более цели.', 5),
      c('You control more objectives than your opponent.', 'Вы контролируете больше целей, чем противник.', 4)),
    endBattle(enemyHome(5)),
  ]),
  'secure-asset': mission('secure-asset', 'Secure selected objectives while eliminating enemies around the centre.', 'Обеспечивайте выбранные цели и уничтожайте врагов у центра.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('A friendly unit secured the asset this turn.', 'Дружественное подразделение в этот ход обеспечило объект.', 4),
      c('An enemy unit that started the turn within range of a central objective was destroyed.', 'Уничтожено вражеское подразделение, начавшее ход в пределах центральной цели.', 2)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming,
      holdOneNonHome(4), c('You control three or more objectives.', 'Вы контролируете три или более цели.', 4)),
  ], { action: action('Secure Asset', 'Обеспечить объект', 'Your Shooting phase.', 'Ваша фаза стрельбы.', 'One friendly unit within range of a non-home objective.', 'Одно дружественное подразделение в пределах не домашней цели.', 'Once per turn.', 'Раз за ход.', 'End of your turn, if the unit controls that objective.', 'В конце вашего хода, если подразделение контролирует эту цель.', 'The unit secures the asset.', 'Подразделение обеспечивает объект.') }),
  meatgrinder: mission('meatgrinder', 'Out-destroy the enemy while controlling objectives and their home ground.', 'Уничтожайте больше врагов, удерживая цели и их домашнюю позицию.', [
    s('ANY BATTLE ROUND', 'End of your turn', destroyedOne(3)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(4)),
    s('SECOND BATTLE ROUND ONWARDS', 'End of your turn',
      c('More enemy units were destroyed this turn than friendly units were destroyed in the previous turn.', 'В этот ход уничтожено больше вражеских подразделений, чем дружественных в предыдущем ходу.', 5),
      enemyHome(5)),
  ]),
  punishment: mission('punishment', 'Condemn selected enemy units, destroy them, and dominate objectives.', 'Осуждайте выбранные вражеские подразделения, уничтожайте их и контролируйте цели.', [
    s('ANY BATTLE ROUND', 'End of a turn', c('One or more condemned enemy units left the battlefield this turn.', 'В этот ход поле боя покинуло хотя бы одно осуждённое вражеское подразделение.', 5)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming,
      holdOneNonHome(4), c('You control more objectives than your opponent.', 'Вы контролируете больше целей, чем противник.', 5)),
    endBattle(enemyHome(8)),
  ], { status: { ru: 'В начале вашего хода выберите от одного до трёх вражеских подразделений на поле в пределах целей и/или уничтоживших дружественные подразделения в предыдущем ходу. Если это невозможно, выберите одно вражеское подразделение на поле. До начала вашего следующего хода они осуждены.', en: 'At the start of your turn, select one to three enemy units on the battlefield within range of objectives and/or that destroyed friendly units in the previous turn. If you cannot, select one enemy unit on the battlefield. They are condemned until the start of your next turn.' } }),
  'delaying-action': mission('delaying-action', 'Destroy enemy units and hold central and expansion objectives.', 'Уничтожайте врагов и удерживайте центральные цели и цели расширения.', [
    s('ANY BATTLE ROUND', 'End of your turn', c('For each enemy unit destroyed this turn.', 'За каждое уничтоженное в этот ход вражеское подразделение.', 2, false, { per: 'unit' })),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(4)),
    s('SECOND BATTLE ROUND ONWARDS', 'End of your turn', c('You control one or more central objectives and one or more expansion objectives.', 'Вы контролируете хотя бы одну центральную цель и хотя бы одну цель расширения.', 3)),
  ]),
  consecrate: mission('consecrate', 'Consecrate objectives through units that destroy enemies.', 'Освящайте цели подразделениями, уничтожившими врагов.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('One or two objectives are consecrated.', 'Освящены одна или две цели.', 3),
      c('Or three or more objectives are consecrated.', 'Или освящены три или более цели.', 6, false, { alternative: true })),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming,
      holdOneNonHome(4), c('You control more objectives than your opponent.', 'Вы контролируете больше целей, чем противник.', 4)),
    endBattle(c("Your opponent's home objective is consecrated.", 'Домашняя цель противника освящена.', 5)),
  ], { status: { ru: 'Подразделение, уничтожившее врага, становится освящающим. В конце вашего хода оно может освятить одну не домашнюю цель в пределах досягаемости: поместите рядом маркер операции; затем подразделение теряет этот статус.', en: 'A unit that destroys an enemy becomes a consecration unit. At the end of your turn it can consecrate one unconsecrated non-home objective in range: place an operation marker within range, then remove that unit status.' } }),
  triangulation: mission('triangulation', 'Triangulate an expanding set of objectives while preserving broad control.', 'Триангулируйте всё больше целей, сохраняя широкий контроль поля.', [
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(4)),
    s('SECOND BATTLE ROUND ONWARDS', 'End of your turn',
      c('One objective is triangulated.', 'Триангулирована одна цель.', 3),
      c('Or two objectives are triangulated.', 'Или триангулированы две цели.', 6, false, { alternative: true }),
      c('Or three or more objectives are triangulated.', 'Или триангулированы три или более цели.', 10, false, { alternative: true })),
    endBattle(c('You control four or more objectives.', 'Вы контролируете четыре или более цели.', 10)),
  ], { action: action('Triangulate', 'Триангулировать', 'Your Shooting phase, from the second battle round onwards.', 'Ваша фаза стрельбы, начиная со второго боевого раунда.', 'One friendly unit within range of a non-home objective.', 'Одно дружественное подразделение в пределах не домашней цели.', 'Once per turn.', 'Раз за ход.', 'End of your turn, if the unit controls that objective.', 'В конце вашего хода, если подразделение контролирует цель.', 'The objective is triangulated; place an operation marker within range. Removing the marker removes the status.', 'Цель триангулирована; поместите рядом маркер операции. Удаление маркера снимает статус.') }),
  'destroyers-wrath': mission('destroyers-wrath', 'Destroy enemy units and convert superior attrition into objective control.', 'Уничтожайте врагов и превращайте превосходство в потерях в контроль целей.', [
    s('ANY BATTLE ROUND', 'End of your turn', destroyedOne(3)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming,
      holdOneNonHome(4), c('You control more objectives than your opponent.', 'Вы контролируете больше целей, чем противник.', 6)),
    s('SECOND BATTLE ROUND ONWARDS', 'End of your turn', c('More enemy units were destroyed this turn than friendly units were destroyed in the previous turn.', 'В этот ход уничтожено больше вражеских подразделений, чем дружественных в предыдущем ходу.', 4)),
  ]),
  'vital-link': mission('vital-link', 'Maintain a marker-backed link through central objectives and seize enemy home ground.', 'Поддерживайте связь через центральные цели маркерами и захватите домашнюю позицию врага.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('You control one or more central objectives.', 'Вы контролируете хотя бы одну центральную цель.', 2),
      c('For each of your operation markers within range of one of those objectives.', 'Ещё за каждый ваш маркер операции в пределах одной из этих целей.', 1, true, { per: 'objective' })),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming,
      holdOneNonHome(4), c('One or more of those objectives is a central objective.', 'Хотя бы одна из этих целей является центральной.', 4, true)),
    endBattle(enemyHome(10)),
  ], { action: action('Maintain Control', 'Поддерживать контроль', 'Your Shooting phase.', 'Ваша фаза стрельбы.', 'One friendly unit within range of a central objective.', 'Одно дружественное подразделение в пределах центральной цели.', 'Once per turn.', 'Раз за ход.', 'End of your turn, if the unit controls that objective.', 'В конце вашего хода, если подразделение контролирует цель.', 'Place one of your operation markers within range of that objective.', 'Поместите один из ваших маркеров операции в пределах этой цели.') }),
  outmanoeuvre: mission('outmanoeuvre', 'Take non-home objectives with increasing rewards and threaten enemy home ground.', 'Захватывайте не домашние цели с растущей наградой и угрожайте домашней цели врага.', [
    s('ANY BATTLE ROUND', 'End of your turn', enemyHome(10)),
    s('FIRST BATTLE ROUND', 'End of your turn', c('For each objective you control (excluding your home objective).', 'За каждую контролируемую цель (кроме домашней).', 4, false, { per: 'objective' })),
    s('SECOND & THIRD BATTLE ROUND', 'End of your Command phase', c('For each objective you control (excluding your home objective).', 'За каждую контролируемую цель (кроме домашней).', 5, false, { per: 'objective' })),
    s('FOURTH BATTLE ROUND ONWARDS', 'End of your turn', c('For each objective you control (excluding your home objective).', 'За каждую контролируемую цель (кроме домашней).', 6, false, { per: 'objective' })),
  ]),
  'smoke-and-mirrors': mission('smoke-and-mirrors', 'Decoy objectives with operation markers, especially in enemy territory.', 'Отмечайте цели маркерами-приманками, особенно на территории противника.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('For each objective that is decoyed.', 'За каждую цель с приманкой.', 2, false, { per: 'objective' }),
      c("For each of those objectives within your opponent's territory.", 'Ещё за каждую из этих целей на территории противника.', 2, true, { per: 'objective' })),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(4)),
    endBattle(c('Four or more objectives are decoyed.', 'Четыре или более целей имеют приманки.', 10)),
  ], { action: action('Decoy', 'Приманка', 'Your Shooting phase.', 'Ваша фаза стрельбы.', 'One friendly unit within range of an undecoyed non-home objective.', 'Одно дружественное подразделение в пределах не домашней цели без приманки.', 'Unlimited; each acting unit must use a different objective.', 'Без лимита; каждое действующее подразделение должно выбрать другую цель.', 'End of your turn, if the unit controls that objective.', 'В конце вашего хода, если подразделение контролирует цель.', 'The objective is decoyed; place an operation marker within range.', 'На цели размещена приманка; поместите рядом маркер операции.') }),
  'surveil-the-foe': mission('surveil-the-foe', 'Surveil enemies and clear their operation-marker network while controlling objectives.', 'Наблюдайте за врагом и удаляйте его маркеры операции, контролируя цели.', [
    s('ANY BATTLE ROUND', 'End of your turn', c('An enemy unit was surveilled this turn, unless every such unit is within range of an objective with an operation marker.', 'В этот ход враг был под наблюдением, если не каждое такое подразделение находится у цели с маркером операции.', 4)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming,
      holdOneNonHome(4), c('You control more objectives than your opponent.', 'Вы контролируете больше целей, чем противник.', 4)),
    s('SECOND BATTLE ROUND ONWARDS', 'End of your turn', c("None of your opponent's operation markers are on the battlefield.", 'На поле нет маркеров операции противника.', 5)),
  ], { status: { ru: 'Когда дружественное подразделение заканчивает перемещение у цели с маркерами операции противника, удалите эти маркеры.', en: "When a friendly unit ends a move within range of an objective with any opponent operation markers, remove those markers." }, action: action('Surveil the Foe', 'Наблюдение за врагом', 'Your Shooting phase.', 'Ваша фаза стрельбы.', 'One friendly unit.', 'Одно дружественное подразделение.', 'Unlimited.', 'Без лимита.', 'Immediately.', 'Немедленно.', 'Select a visible enemy unit within 18" not already surveilled this turn; it is surveilled until end of turn.', 'Выберите видимое вражеское подразделение в пределах 18", ещё не находившееся под наблюдением; оно под наблюдением до конца хода.') }),
  'locate-and-deny': mission('locate-and-deny', 'Clear a pre-positioned operation-marker network while denying objectives.', 'Зачищайте заранее размещённую сеть маркеров операции, блокируя цели.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('An enemy unit that started the turn within range of an objective was destroyed.', 'Уничтожено вражеское подразделение, начавшее ход в пределах цели.', 4),
      c('Only one of your operation markers remains, with a friendly unit and no enemies in its terrain area.', 'Остался ровно один ваш маркер операции; в его зоне есть ваше подразделение и нет врагов.', 4)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(4)),
    endBattle(c('Only one of your operation markers remains, with a friendly unit and no enemies in its terrain area.', 'Остался ровно один ваш маркер операции; в его зоне есть ваше подразделение и нет врагов.', 5)),
  ], { setup: { ru: 'В начале боя выберите пять зон ландшафта вне вашей зоны развёртывания и поместите в каждую маркер операции; если пяти нет, отметьте все доступные.', en: 'At the start of battle, select five terrain areas outside your deployment zone and place an operation marker in each; if five are unavailable, mark every eligible area.' }, action: action('Sensor Sweep', 'Сканирование', 'Your Shooting phase.', 'Ваша фаза стрельбы.', 'One friendly unit within range of a central objective.', 'Одно дружественное подразделение в пределах центральной цели.', 'Once per turn.', 'Раз за ход.', 'End of your turn, if the unit controls that objective.', 'В конце вашего хода, если подразделение контролирует цель.', 'Remove one operation marker from the battlefield.', 'Удалите один маркер операции с поля.', ['A unit cannot start this action if only one operation marker remains.', 'Подразделение не может начать действие, если остался только один маркер операции.']) }),
  'extract-relic': mission('extract-relic', "Remove the opponent's marker network while controlling objectives and eliminating nearby enemies.", 'Удаляйте сеть маркеров противника, контролируя цели и уничтожая врагов рядом.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('A friendly unit performed a Sensor Sweep this turn.', 'Дружественное подразделение выполнило сканирование в этот ход.', 4),
      c('An enemy unit that started the turn within range of an objective was destroyed.', 'Уничтожено вражеское подразделение, начавшее ход в пределах цели.', 3),
      c("Only one opponent operation marker remains, with a friendly unit and no enemies in its terrain area.", 'Остался ровно один маркер операции противника; в его зоне есть ваше подразделение и нет врагов.', 4)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(4)),
    endBattle(c('Only one opponent operation marker remains, with a friendly unit and no enemies in its terrain area.', 'Остался ровно один маркер операции противника; в его зоне есть ваше подразделение и нет врагов.', 5)),
  ], { action: action('Sensor Sweep', 'Сканирование', 'Your Shooting phase.', 'Ваша фаза стрельбы.', 'One friendly unit within range of a central objective.', 'Одно дружественное подразделение в пределах центральной цели.', 'Once per turn.', 'Раз за ход.', 'End of your turn, if the unit controls that objective.', 'В конце вашего хода, если подразделение контролирует цель.', 'Remove one opponent operation marker from the battlefield.', 'Удалите один маркер операции противника с поля.', ['A unit cannot start this action if only one opponent operation marker remains.', 'Подразделение не может начать действие, если остался только один маркер операции противника.']) }),
  'gather-intel': mission('gather-intel', 'Extract intelligence from objectives and establish a deep operation-marker network.', 'Извлекайте разведданные с целей и создавайте сеть маркеров операции.', [
    s('FIRST BATTLE ROUND', 'End of your turn', c('You control one or more central objectives.', 'Вы контролируете хотя бы одну центральную цель.', 6)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(4)),
    s('SECOND BATTLE ROUND ONWARDS', 'End of your turn', c('For each friendly unit that completed Extract Intelligence this turn.', 'За каждое дружественное подразделение, завершившее извлечение разведданных в этот ход.', 7, false, { per: 'unit' })),
    endBattle(
      c('Three or more of your operation markers are on the battlefield.', 'На поле находятся три или более ваших маркера операции.', 5),
      c("One of your operation markers is within range of your opponent's home objective.", 'Один ваш маркер операции находится в пределах домашней цели противника.', 5)),
  ], { action: action('Extract Intelligence', 'Извлечь разведданные', 'Your Shooting phase, from the second battle round onwards.', 'Ваша фаза стрельбы, начиная со второго боевого раунда.', 'One unit within range of a non-home objective without one of your operation markers.', 'Одно подразделение в пределах не домашней цели без вашего маркера операции.', 'Unlimited; each acting unit must use a different objective.', 'Без лимита; каждое действующее подразделение должно выбрать другую цель.', 'End of your turn, if the unit controls that objective.', 'В конце вашего хода, если подразделение контролирует цель.', 'Place one of your operation markers within range of that objective.', 'Поместите один из ваших маркеров операции в пределах этой цели.') }),
  'search-and-scour': mission('search-and-scour', 'Control the centre, eliminate enemies in terrain, and clear your territory.', 'Контролируйте центр, уничтожайте врагов в ландшафте и очистите свою территорию.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('You control one or more central objectives.', 'Вы контролируете хотя бы одну центральную цель.', 3),
      c('An enemy unit that started the turn within a terrain area was destroyed.', 'Уничтожено вражеское подразделение, начавшее ход в зоне ландшафта.', 2)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, nonHome),
    endBattle(c('No enemy units are wholly within your territory.', 'Ни одно вражеское подразделение не находится целиком на вашей территории.', 5)),
  ]),
  'vanguard-operation': mission('vanguard-operation', 'Conduct operations in enemy territory while destroying units and threatening enemy home ground.', 'Проводите операции на территории противника, уничтожайте врагов и угрожайте его домашней цели.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('A friendly unit completed Vanguard Operation this turn.', 'Дружественное подразделение выполнило авангардную операцию в этот ход.', 4),
      destroyedOne(2)),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(4)),
    endBattle(enemyHome(10)),
  ], { action: action('Vanguard Operation', 'Авангардная операция', 'Your Shooting phase.', 'Ваша фаза стрельбы.', "One friendly unit in a terrain area within your opponent's territory.", 'Одно дружественное подразделение в зоне ландшафта на территории противника.', 'Once per turn.', 'Раз за ход.', 'End of your turn, if no enemy units are in that terrain area.', 'В конце вашего хода, если в этой зоне ландшафта нет врагов.', 'The unit completes Vanguard Operation.', 'Подразделение выполняет авангардную операцию.') }),
  sabotage: mission('sabotage', 'Commit sabotage at multiple objectives, with extra reward in enemy territory.', 'Проводите диверсии у нескольких целей с дополнительной наградой на территории противника.', [
    s('ANY BATTLE ROUND', 'End of your turn',
      c('For each friendly unit that committed sabotage this turn.', 'За каждое дружественное подразделение, совершившее диверсию в этот ход.', 3, false, { per: 'unit' }),
      c("For each of those units within range of an objective in your opponent's territory.", 'Ещё за каждое из этих подразделений в пределах цели на территории противника.', 2, true, { per: 'objective' })),
    s('SECOND BATTLE ROUND ONWARDS', commandTiming, holdOneNonHome(4)),
  ], { action: action('Sabotage', 'Диверсия', 'Your Shooting phase.', 'Ваша фаза стрельбы.', 'One unit within range of a non-home objective.', 'Одно подразделение в пределах не домашней цели.', 'Unlimited; each acting unit must use a different objective.', 'Без лимита; каждое действующее подразделение должно выбрать другую цель.', 'End of your turn, if the unit controls that objective.', 'В конце вашего хода, если подразделение контролирует цель.', 'The unit commits sabotage.', 'Подразделение совершает диверсию.') }),
};

export const twists = [
  {
    id: 'martial-pride', name: { ru: 'Воинская гордость', en: 'Martial Pride' },
    effects: {
      ru: ['Подразделение BATTLELINE может начать действие в ход, в котором оно совершило продвижение.', 'Подразделение BATTLELINE может стрелять в ход, в котором оно начало действие.'],
      en: ['A BATTLELINE unit can start an action in a turn in which it made an advance move.', 'A BATTLELINE unit can shoot in a turn in which it started an action.'],
    },
  },
  {
    id: 'mirrored-world', name: { ru: 'Зеркальный мир', en: 'Mirrored World' },
    effects: {
      ru: ['Оба игрока заменяют свои основные миссии одной и той же миссией. При согласии используют выбранную миссию; иначе бросают D6: 1 Battlefield Dominance; 2 Meatgrinder; 3 Outmanoeuvre; 4 Gather Intel; 5 Sabotage; 6 переброс.'],
      en: ['Both players replace their Primary Mission with the same mission. If they agree, use it; otherwise roll D6: 1 Battlefield Dominance; 2 Meatgrinder; 3 Outmanoeuvre; 4 Gather Intel; 5 Sabotage; 6 re-roll.'],
    },
  },
  {
    id: 'night-fighting', name: { ru: 'Ночной бой', en: 'Night Fighting' },
    effects: {
      ru: ['Подразделение не видно вражеским моделям, если те не находятся в пределах 18" от него; его нельзя выбирать целью оружия [INDIRECT FIRE], если атакующая модель не находится в пределах 18" от него.'],
      en: ['Each unit is not visible to enemy models unless they are within 18" of that unit, and cannot be targeted by [INDIRECT FIRE] weapons unless the attacking model is within 18" of that unit.'],
    },
  },
  { id: 'nowhere-to-hide', name: { ru: 'Негде спрятаться', en: 'Nowhere to Hide' }, effects: { ru: ['Элементы ландшафта не имеют правила Solid.'], en: ['Terrain features do not have the Solid rule.'] } },
  { id: 'ruinscape', name: { ru: 'Мир руин', en: 'Ruinscape' }, effects: { ru: ['Когда подразделение совершает обычное перемещение или продвижение, модели в нём получают ключевое слово MOBILE до окончания этого перемещения.'], en: ['When a unit makes a normal or advance move, models in it have the MOBILE keyword until that move ends.'] } },
  { id: 'scrambled-communications', name: { ru: 'Нарушенная связь', en: 'Scrambled Communications' }, effects: { ru: ['Игроки обмениваются своими картами основных миссий.'], en: ['The players exchange their Primary Mission cards.'] } },
];

export function pickRandomTwist(random = Math.random) {
  return twists[Math.floor(random() * twists.length)];
}

const bilingual = value => value && typeof value.ru === 'string' && value.ru.length > 0
  && typeof value.en === 'string' && value.en.length > 0;

const requiredMissionIds = [
  'battlefield-dominance', 'immovable-object', 'unstoppable-force',
  'determined-acquisition', 'death-trap', 'purge-and-secure',
  'reconnaissance-sweep', 'inescapable-dominion', 'secure-asset',
  'meatgrinder', 'punishment', 'delaying-action', 'consecrate',
  'triangulation', 'destroyers-wrath', 'vital-link', 'outmanoeuvre',
  'smoke-and-mirrors', 'surveil-the-foe', 'locate-and-deny',
  'extract-relic', 'gather-intel', 'search-and-scour',
  'vanguard-operation', 'sabotage',
];
const requiredTwistIds = [
  'martial-pride', 'mirrored-world', 'night-fighting',
  'nowhere-to-hide', 'ruinscape', 'scrambled-communications',
];
const requiredDetails = {
  'death-trap': { 'Booby Trap': 5 },
  'secure-asset': { 'Secure Asset': 5 },
  punishment: { 'Mission rule': 1 },
  consecrate: { 'Mission rule': 1 },
  triangulation: { Triangulate: 5 },
  'vital-link': { 'Maintain Control': 5 },
  'smoke-and-mirrors': { Decoy: 5 },
  'surveil-the-foe': { 'Mission rule': 1, 'Surveil the Foe': 5 },
  'locate-and-deny': { Setup: 1, 'Sensor Sweep': 6 },
  'extract-relic': { 'Sensor Sweep': 6 },
  'gather-intel': { 'Extract Intelligence': 5 },
  'vanguard-operation': { 'Vanguard Operation': 5 },
  sabotage: { Sabotage: 5 },
};

function validateMissionReference(mission) {
  if (!mission || !requiredMissionIds.includes(mission.id)
    || Object.keys(mission).sort().join() !== 'id,overview,sections'
    || !bilingual(mission.overview) || !Array.isArray(mission.sections) || !mission.sections.length) {
    throw new Error(`${mission?.id || 'Mission'} has invalid structure`);
  }
  let limitCount = 0;
  let hasScoring = false;
  for (const section of mission.sections) {
    if (!bilingual(section.heading) || !bilingual(section.timing)
      || !Array.isArray(section.conditions) || !section.conditions.length) {
      throw new Error(`${mission.id} has invalid section`);
    }
    if (section.limit) {
      limitCount += 1;
      if (!bilingual(section.limit.text) || section.limit.total !== 45
        || section.limit.perBattleRound !== 15 || section.limit.endOfBattleExempt !== true) {
        throw new Error(`${mission.id} has invalid Primary limit`);
      }
    }
    for (const condition of section.conditions) {
      if (!bilingual(condition.text) || (condition.vp !== null && !Number.isFinite(condition.vp))
        || typeof condition.cumulative !== 'boolean') {
        throw new Error(`${mission.id} has invalid condition`);
      }
      hasScoring ||= condition.vp !== null;
    }
  }
  if (limitCount !== 1 || !hasScoring) throw new Error(`${mission.id} has incomplete sections or limit`);
  for (const [heading, conditionCount] of Object.entries(requiredDetails[mission.id] || {})) {
    const section = mission.sections.find(item => item.heading.en === heading);
    if (!section || section.conditions.length !== conditionCount
      || section.conditions.some(condition => condition.vp !== null)) throw new Error(`${mission.id} has incomplete detail sections`);
  }
}

export function isCompleteMissionReference(mission) {
  try {
    validateMissionReference(mission);
    return true;
  } catch {
    return false;
  }
}

export function validateRules(references = missionReferences, twistRecords = twists) {
  const missionIds = Object.keys(references);
  if (missionIds.length !== requiredMissionIds.length
    || new Set(missionIds).size !== missionIds.length
    || requiredMissionIds.some(id => !missionIds.includes(id) || references[id]?.id !== id)) throw new Error('Expected exact mission IDs');
  for (const mission of Object.values(references)) validateMissionReference(mission);

  const twistIds = twistRecords.map(item => item?.id);
  if (twistIds.length !== requiredTwistIds.length
    || new Set(twistIds).size !== twistIds.length
    || twistIds.some((id, index) => id !== requiredTwistIds[index])) throw new Error('Expected exact twist IDs');
  for (const twist of twistRecords) {
    if (!bilingual(twist.name) || !Array.isArray(twist.effects?.ru) || !Array.isArray(twist.effects?.en)
      || !twist.effects.ru.length || !twist.effects.en.length
      || twist.effects.ru.some(item => typeof item !== 'string' || !item)
      || twist.effects.en.some(item => typeof item !== 'string' || !item)) throw new Error(`${twist.id} has invalid effects`);
  }
}
