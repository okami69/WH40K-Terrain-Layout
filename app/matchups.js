export const languages = ['ru', 'en'];

export const dispositions = [
  'take-and-hold',
  'purge-the-foe',
  'disruption',
  'reconnaissance',
  'priority-assets',
];

export const labels = {
  'take-and-hold': {
    ru: 'Удержание',
    en: 'Take and Hold',
    icon: 'assets/dispositions/take-and-hold.webp',
  },
  'purge-the-foe': {
    ru: 'Уничтожение врага',
    en: 'Purge the Foe',
    icon: 'assets/dispositions/purge-the-foe.webp',
  },
  disruption: {
    ru: 'Дезорганизация',
    en: 'Disruption',
    icon: 'assets/dispositions/disruption.webp',
  },
  reconnaissance: {
    ru: 'Разведка',
    en: 'Reconnaissance',
    icon: 'assets/dispositions/reconnaissance.webp',
  },
  'priority-assets': {
    ru: 'Приоритетные активы',
    en: 'Priority Assets',
    icon: 'assets/dispositions/priority-assets.webp',
  },
};

const exactScoring = {
  ru: 'Физическая карта миссии или официальное приложение задает точный подсчет очков.',
  en: 'Use the physical mission card or official app for exact scoring.',
};

const missionRows = [
  ['battlefield-dominance', 'Battlefield Dominance', 'Господство на поле боя', 'Score by holding objectives, with extra pressure to keep your home objective secured while expanding.', 'Получайте очки за удержание целей, особенно если домашняя цель защищена, а контроль расширяется.'],
  ['immovable-object', 'Immovable Object', 'Неподвижный объект', 'Dig in on selected ground and make the opponent shift you off key objectives.', 'Закрепитесь на выбранной позиции и заставьте противника выбивать вас с ключевых целей.'],
  ['unstoppable-force', 'Unstoppable Force', 'Неудержимая сила', 'Drive forward into enemy-held ground and reward aggressive control changes.', 'Продвигайтесь на занятые врагом позиции и получайте выгоду за агрессивный перехват контроля.'],
  ['determined-acquisition', 'Determined Acquisition', 'Решительное приобретение', 'Commit units to contested objectives and keep claiming ground through pressure.', 'Направляйте отряды на спорные цели и забирайте территорию постоянным давлением.'],
  ['death-trap', 'Death Trap', 'Смертельная ловушка', 'Punish enemy units that overextend into dangerous areas and exposed objectives.', 'Наказывайте вражеские отряды, которые заходят слишком далеко в опасные зоны и к открытым целям.'],
  ['purge-and-secure', 'Purge and Secure', 'Зачистить и удержать', 'Clear enemy presence from important objectives, then keep those positions under control.', 'Выбивайте врага с важных целей, а затем удерживайте эти позиции под контролем.'],
  ['reconnaissance-sweep', 'Reconnaissance Sweep', 'Разведывательный рейд', 'Spread mobile units across the table to gather information and contest space.', 'Рассредоточьте мобильные отряды по столу, чтобы собрать данные и оспорить пространство.'],
  ['inescapable-dominion', 'Inescapable Dominion', 'Неизбежное господство', 'Build a control network that makes it difficult for the opponent to escape your scoring plan.', 'Создайте сеть контроля, из которой противнику трудно выбить ваш план набора очков.'],
  ['secure-asset', 'Secure Asset', 'Защитить актив', 'Protect the priority asset area while denying the opponent easy access to it.', 'Защищайте область приоритетного актива и не давайте противнику легко к ней подойти.'],
  ['meatgrinder', 'Meatgrinder', 'Мясорубка', 'Trade units efficiently and score from sustained destruction across the battle.', 'Разменивайте отряды выгодно и набирайте очки за постоянное уничтожение врага.'],
  ['punishment', 'Punishment', 'Наказание', 'Identify exposed enemy forces and convert their losses into primary progress.', 'Находите уязвимые силы противника и превращайте их потери в продвижение по основной миссии.'],
  ['delaying-action', 'Delaying Action', 'Сдерживающее действие', 'Slow the opponent down by disrupting their timing and denying clean advances.', 'Замедляйте противника, ломая его темп и не давая продвигаться без помех.'],
  ['consecrate', 'Consecrate', 'Освящение', 'Send units to mark important ground and keep the opponent from undoing that work.', 'Отправляйте отряды отмечать важные участки и не давайте противнику отменить эту работу.'],
  ['triangulation', 'Triangulation', 'Триангуляция', 'Position units across multiple points to establish a scoring pattern on the battlefield.', 'Расставляйте отряды в нескольких точках, чтобы создать на поле устойчивый рисунок набора очков.'],
  ['destroyers-wrath', "Destroyer's Wrath", 'Гнев разрушителя', 'Reward decisive attacks that remove important enemy assets at the right moment.', 'Получайте выгоду от решительных атак, которые вовремя убирают важные активы врага.'],
  ['vital-link', 'Vital Link', 'Жизненно важная связь', 'Hold connected positions so your force maintains an active link across the table.', 'Удерживайте связанные позиции, чтобы армия сохраняла активную линию связи через стол.'],
  ['outmanoeuvre', 'Outmanoeuvre', 'Переиграть маневром', 'Win by moving around the opponent and taking space they cannot efficiently answer.', 'Побеждайте маневром, занимая пространство, на которое противник не успевает ответить.'],
  ['smoke-and-mirrors', 'Smoke and Mirrors', 'Дым и зеркала', 'Use positioning tricks to threaten several areas and keep the opponent guessing.', 'Используйте позиционные уловки, чтобы угрожать нескольким зонам и сбивать противника с плана.'],
  ['surveil-the-foe', 'Surveil the Foe', 'Наблюдать за врагом', 'Keep eyes on enemy movement and score by maintaining useful observation positions.', 'Следите за перемещениями врага и набирайте очки, сохраняя выгодные позиции наблюдения.'],
  ['locate-and-deny', 'Locate and Deny', 'Найти и запретить', 'Find the critical area, then prevent the opponent from profiting from it.', 'Найдите критическую область и не дайте противнику получить с нее выгоду.'],
  ['extract-relic', 'Extract Relic', 'Извлечь реликвию', 'Reach the relic, secure it, and manage the risk of carrying or protecting it.', 'Доберитесь до реликвии, заберите ее и управляйте риском переноса или защиты.'],
  ['gather-intel', 'Gather Intel', 'Сбор разведданных', 'Use units to collect battlefield information while staying alive long enough to benefit.', 'Собирайте разведданные отрядами и сохраняйте их достаточно долго, чтобы получить пользу.'],
  ['search-and-scour', 'Search and Scour', 'Обыск и зачистка', 'Sweep through key areas, searching them while denying enemy interference.', 'Прочесывайте ключевые зоны, исследуя их и мешая вмешательству противника.'],
  ['vanguard-operation', 'Vanguard Operation', 'Авангардная операция', 'Push forward with leading units to seize early board presence and sustain it.', 'Выдвигайте передовые отряды вперед, чтобы рано занять стол и удержать преимущество.'],
  ['sabotage', 'Sabotage', 'Саботаж', 'Send units into dangerous positions to damage enemy assets or plans.', 'Отправляйте отряды в рискованные позиции, чтобы разрушать активы или планы врага.'],
];

export const missions = Object.fromEntries(
  missionRows.map(([id, en, ru, summaryEn, summaryRu]) => [
    id,
    {
      id,
      name: { ru, en },
      summary: {
        ru: `${summaryRu} ${exactScoring.ru}`,
        en: `${summaryEn} ${exactScoring.en}`,
      },
    },
  ]),
);

export const matchups = [
  ['take-and-hold', 'take-and-hold', 'battlefield-dominance', 'battlefield-dominance'],
  ['take-and-hold', 'purge-the-foe', 'immovable-object', 'unstoppable-force'],
  ['take-and-hold', 'disruption', 'determined-acquisition', 'death-trap'],
  ['take-and-hold', 'reconnaissance', 'purge-and-secure', 'reconnaissance-sweep'],
  ['take-and-hold', 'priority-assets', 'inescapable-dominion', 'secure-asset'],
  ['purge-the-foe', 'purge-the-foe', 'meatgrinder', 'meatgrinder'],
  ['purge-the-foe', 'disruption', 'punishment', 'delaying-action'],
  ['purge-the-foe', 'reconnaissance', 'consecrate', 'triangulation'],
  ['purge-the-foe', 'priority-assets', 'destroyers-wrath', 'vital-link'],
  ['disruption', 'disruption', 'outmanoeuvre', 'outmanoeuvre'],
  ['disruption', 'reconnaissance', 'smoke-and-mirrors', 'surveil-the-foe'],
  ['disruption', 'priority-assets', 'locate-and-deny', 'extract-relic'],
  ['reconnaissance', 'reconnaissance', 'gather-intel', 'gather-intel'],
  ['reconnaissance', 'priority-assets', 'search-and-scour', 'vanguard-operation'],
  ['priority-assets', 'priority-assets', 'sabotage', 'sabotage'],
].map(([left, right, leftMission, rightMission]) => ({
  left,
  right,
  leftMission,
  rightMission,
  slug: `${left}--${right}`,
}));

export const deployments = [
  'crucible-of-battle',
  'dawn-of-war',
  'hammer-and-anvil',
  'search-and-destroy',
  'sweeping-engagement',
  'tipping-point',
];

const deploymentByLayout = Object.fromEntries([
  ['disruption--disruption-a', 'crucible-of-battle'],
  ['priority-assets--priority-assets-b', 'crucible-of-battle'],
  ['purge-the-foe--reconnaissance-c', 'crucible-of-battle'],
  ['reconnaissance--priority-assets-a', 'crucible-of-battle'],
  ['reconnaissance--reconnaissance-b', 'crucible-of-battle'],
  ['take-and-hold--disruption-b', 'crucible-of-battle'],
  ['take-and-hold--priority-assets-a', 'crucible-of-battle'],
  ['disruption--reconnaissance-b', 'dawn-of-war'],
  ['purge-the-foe--priority-assets-a', 'dawn-of-war'],
  ['purge-the-foe--reconnaissance-b', 'dawn-of-war'],
  ['take-and-hold--priority-assets-c', 'dawn-of-war'],
  ['take-and-hold--reconnaissance-b', 'dawn-of-war'],
  ['take-and-hold--take-and-hold-b', 'dawn-of-war'],
  ['purge-the-foe--priority-assets-c', 'hammer-and-anvil'],
  ['purge-the-foe--reconnaissance-a', 'hammer-and-anvil'],
  ['take-and-hold--disruption-c', 'hammer-and-anvil'],
  ['take-and-hold--priority-assets-b', 'hammer-and-anvil'],
  ['take-and-hold--purge-the-foe-c', 'hammer-and-anvil'],
  ['disruption--priority-assets-c', 'search-and-destroy'],
  ['disruption--reconnaissance-c', 'search-and-destroy'],
  ['purge-the-foe--disruption-a', 'search-and-destroy'],
  ['purge-the-foe--priority-assets-b', 'search-and-destroy'],
  ['purge-the-foe--purge-the-foe-a', 'search-and-destroy'],
  ['take-and-hold--purge-the-foe-b', 'search-and-destroy'],
  ['take-and-hold--reconnaissance-c', 'search-and-destroy'],
  ['take-and-hold--take-and-hold-c', 'search-and-destroy'],
  ['disruption--disruption-c', 'sweeping-engagement'],
  ['disruption--priority-assets-a', 'sweeping-engagement'],
  ['priority-assets--priority-assets-a', 'sweeping-engagement'],
  ['purge-the-foe--disruption-c', 'sweeping-engagement'],
  ['purge-the-foe--purge-the-foe-c', 'sweeping-engagement'],
  ['reconnaissance--priority-assets-c', 'sweeping-engagement'],
  ['reconnaissance--reconnaissance-a', 'sweeping-engagement'],
  ['take-and-hold--disruption-a', 'sweeping-engagement'],
  ['take-and-hold--purge-the-foe-a', 'sweeping-engagement'],
  ['disruption--disruption-b', 'tipping-point'],
  ['disruption--priority-assets-b', 'tipping-point'],
  ['disruption--reconnaissance-a', 'tipping-point'],
  ['priority-assets--priority-assets-c', 'tipping-point'],
  ['purge-the-foe--disruption-b', 'tipping-point'],
  ['purge-the-foe--purge-the-foe-b', 'tipping-point'],
  ['reconnaissance--priority-assets-b', 'tipping-point'],
  ['reconnaissance--reconnaissance-c', 'tipping-point'],
  ['take-and-hold--reconnaissance-a', 'tipping-point'],
  ['take-and-hold--take-and-hold-a', 'tipping-point'],
]);

export const layoutCatalog = matchups.flatMap(({ slug, left, right }) => ['A', 'B', 'C'].map(layout => {
  const id = `${slug}-${layout.toLowerCase()}`;
  const deployment = deploymentByLayout[id];
  if (!deployment) throw new Error(`Missing deployment metadata: ${id}`);
  return { id, slug, left, right, layout, deployment, image: `assets/layouts/${id}.webp` };
}));

export function resolveMatchup(left, right) {
  const match = matchups.find(item => item.left === left && item.right === right);
  const reverse = matchups.find(item => item.left === right && item.right === left);
  const item = match || reverse;
  if (!item) throw new Error(`Unknown matchup: ${left} vs ${right}`);

  return {
    leftMission: match ? item.leftMission : item.rightMission,
    rightMission: match ? item.rightMission : item.leftMission,
    image(layout) {
      if (!['A', 'B', 'C'].includes(layout)) throw new Error(`Unknown layout: ${layout}`);
      return `assets/layouts/${item.slug}-${layout.toLowerCase()}.webp`;
    },
  };
}
