export const dispositions = [
  'take-and-hold',
  'purge-the-foe',
  'disruption',
  'reconnaissance',
  'priority-assets',
];

export const labels = {
  'take-and-hold': 'Take and Hold',
  'purge-the-foe': 'Purge the Foe',
  disruption: 'Disruption',
  reconnaissance: 'Reconnaissance',
  'priority-assets': 'Priority Assets',
};

export const matchups = [
  ['take-and-hold', 'take-and-hold', 'Battlefield Dominance', 'Battlefield Dominance'],
  ['take-and-hold', 'purge-the-foe', 'Immovable Object', 'Unstoppable Force'],
  ['take-and-hold', 'disruption', 'Determined Acquisition', 'Death Trap'],
  ['take-and-hold', 'reconnaissance', 'Purge and Secure', 'Reconnaissance Sweep'],
  ['take-and-hold', 'priority-assets', 'Inescapable Dominion', 'Secure Asset'],
  ['purge-the-foe', 'purge-the-foe', 'Meatgrinder', 'Meatgrinder'],
  ['purge-the-foe', 'disruption', 'Punishment', 'Delaying Action'],
  ['purge-the-foe', 'reconnaissance', 'Consecrate', 'Triangulation'],
  ['purge-the-foe', 'priority-assets', "Destroyer's Wrath", 'Vital Link'],
  ['disruption', 'disruption', 'Outmanoeuvre', 'Outmanoeuvre'],
  ['disruption', 'reconnaissance', 'Smoke and Mirrors', 'Surveil the Foe'],
  ['disruption', 'priority-assets', 'Locate and Deny', 'Extract Relic'],
  ['reconnaissance', 'reconnaissance', 'Gather Intel', 'Gather Intel'],
  ['reconnaissance', 'priority-assets', 'Search and Scour', 'Vanguard Operation'],
  ['priority-assets', 'priority-assets', 'Sabotage', 'Sabotage'],
].map(([left, right, leftMission, rightMission]) => ({
  left,
  right,
  leftMission,
  rightMission,
  slug: `${left}--${right}`,
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
      return `assets/layouts/${item.slug}-${layout.toLowerCase()}.png`;
    },
  };
}
