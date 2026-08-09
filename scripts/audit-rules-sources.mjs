#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const PACK_ID = '4f285f2e-3c40-40fb-8b2f-bfccd173f1fd';
const DATA_VERSION = 925;
const GDM_VERSION = '4.9';
const INSPECTION_DATE = '2026-08-09';
const BASE_URL = 'https://game-datamissions.com/11th/primary-missions';

export const routes = [
  ['take-and-hold', 'battlefield-dominance'],
  ['take-and-hold', 'determined-acquisition'],
  ['take-and-hold', 'immovable-object'],
  ['take-and-hold', 'inescapable-dominion'],
  ['take-and-hold', 'purge-and-secure'],
  ['purge-the-foe', 'unstoppable-force'],
  ['purge-the-foe', 'meatgrinder'],
  ['purge-the-foe', 'punishment'],
  ['purge-the-foe', 'consecrate'],
  ['purge-the-foe', 'destroyers-wrath'],
  ['disruption', 'death-trap'],
  ['disruption', 'delaying-action'],
  ['disruption', 'outmanoeuvre'],
  ['disruption', 'smoke-and-mirrors'],
  ['disruption', 'locate-and-deny'],
  ['reconnaissance', 'reconnaissance-sweep'],
  ['reconnaissance', 'triangulation'],
  ['reconnaissance', 'surveil-the-foe'],
  ['reconnaissance', 'gather-intel'],
  ['reconnaissance', 'search-and-scour'],
  ['priority-assets', 'secure-asset'],
  ['priority-assets', 'vital-link'],
  ['priority-assets', 'extract-relic'],
  ['priority-assets', 'vanguard-operation'],
  ['priority-assets', 'sabotage'],
];

const twistNames = [
  'Martial Pride', 'Mirrored World', 'Night Fighting', 'Nowhere to Hide',
  'Ruinscape', 'Scrambled Communications',
];

export function normalizeText(value) {
  return value == null ? null : String(value)
    .normalize('NFC')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, sortKeys(value[key])]));
}

export function canonicalJson(value) {
  return `${JSON.stringify(sortKeys(value))}\n`;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function flightValues(html) {
  return [...html.matchAll(/<script>self\.__next_f\.push\(([\s\S]*?)\)<\/script>/g)]
    .map(match => {
      try { return JSON.parse(match[1])[1]; } catch { return null; }
    })
    .filter(value => typeof value === 'string');
}

function objectAfter(text, marker) {
  const markerAt = text.indexOf(marker);
  if (markerAt < 0) return undefined;
  let start = markerAt + marker.length;
  while (/\s/.test(text[start])) start += 1;
  if (text.startsWith('"$undefined"', start)) return null;
  if (text[start] !== '{') throw new Error(`GDM schema error: ${marker} is not an object`);
  let depth = 0;
  let quoted = false;
  let escaped = false;
  for (let index = start; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') quoted = false;
    } else if (character === '"') quoted = true;
    else if (character === '{') depth += 1;
    else if (character === '}' && --depth === 0) {
      return JSON.parse(text.slice(start, index + 1), (_, value) => value === '$undefined' ? null : value);
    }
  }
  throw new Error(`GDM schema error: unterminated ${marker} object`);
}

export function parseGdmHtml(html) {
  for (const value of flightValues(html)) {
    const primary = objectAfter(value, '"primary":');
    if (primary !== undefined) return { primary, primaryBack: objectAfter(value, '"primaryBack":') };
  }
  throw new Error('GDM schema error: embedded Primary data was not found');
}

function perType(tier) {
  if (!tier.perUnit) return null;
  if (/^For each (?:enemy|friendly) unit\b/i.test(tier.text)) return 'unit';
  if (/^For each \*\*terrain area trapped\*\*/i.test(tier.text)) return 'terrain-area';
  return 'objective';
}

function missionFromGdm(deck, primary, primaryBack) {
  if (typeof primary?.name !== 'string' || !Array.isArray(primary.sections)) {
    throw new Error('GDM schema error: Primary name/sections are missing');
  }
  if (primaryBack && !Array.isArray(primaryBack.rows)) {
    throw new Error('GDM schema error: Primary reverse rows are missing');
  }
  const actionRows = new Map((primaryBack?.rows ?? []).map(row => [row.k.toLowerCase(), normalizeText(row.v)]));
  const restriction = actionRows.get('restriction') ?? actionRows.get('restrictions') ?? null;
  return {
    deck,
    name: normalizeText(primary.name),
    overview: normalizeText(primary.rule),
    sections: primary.sections.map(section => ({
      when: normalizeText(section.when),
      timing: normalizeText(section.trigger),
      headerKind: section.headerKind ?? null,
      conditions: section.tiers.map(tier => ({
        text: normalizeText(tier.text),
        vp: tier.vp,
        cumulative: Boolean(tier.cumulative),
        alternative: Boolean(tier.or),
        per: perType(tier),
        limit: tier.limit ?? null,
        kind: tier.kind ?? null,
      })),
    })),
    action: primaryBack ? {
      title: normalizeText(primaryBack.title),
      starts: actionRows.get('starts') ?? null,
      units: actionRows.get('units') ?? null,
      useLimit: actionRows.get('use limit') ?? null,
      completes: actionRows.get('completes') ?? null,
      effect: actionRows.get('effect') ?? null,
      restriction,
    } : null,
  };
}

export function semanticText(value) {
  return normalizeText(value)
    ?.replace(/<b>/gi, '**').replace(/<\/b>/gi, '**').replace(/<[^>]+>/g, '')
    .replace(/\*\*/g, '').replace(/\(see reverse\)/gi, '')
    .replace(/&/g, ' and ').replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim().toLowerCase()
    .replace(/^end of the battle$/, 'end of battle') ?? null;
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) throw new Error(`Mismatch at ${label}: ${JSON.stringify(actual)} != ${JSON.stringify(expected)}`);
}

function compareWithApp(dump, gdmMissions) {
  assertEqual(dump.metadata?.data_version, DATA_VERSION, 'metadata.data_version');
  const data = dump.data;
  if (!data || typeof data !== 'object') throw new Error('dump.json schema error: data object is missing');
  for (const table of [
    'mission_pack', 'primary_mission', 'primary_mission_objective',
    'primary_mission_objective_scoring', 'primary_mission_action', 'mission_twist',
  ]) if (!Array.isArray(data[table])) throw new Error(`dump.json schema error: data.${table} array is missing`);
  const pack = data.mission_pack?.find(row => row.id === PACK_ID);
  if (!pack) throw new Error(`dump.json schema error: mission pack ${PACK_ID} is missing`);

  const missions = data.primary_mission.filter(row => row.missionPackId === PACK_ID);
  const missionIds = new Set(missions.map(row => row.id));
  const objectives = data.primary_mission_objective.filter(row => missionIds.has(row.primaryMissionId));
  const objectiveIds = new Set(objectives.map(row => row.id));
  const scorings = data.primary_mission_objective_scoring.filter(row => objectiveIds.has(row.primaryMissionObjectiveId));
  const actions = data.primary_mission_action.filter(row => missionIds.has(row.primaryMissionId));
  const twists = data.mission_twist.filter(row => row.missionPackId === PACK_ID);

  assertEqual(missions.length, 25, 'official mission count');
  assertEqual(objectives.length, 74, 'official objective count');
  assertEqual(actions.length, 11, 'official action count');
  assertEqual(twists.length, 6, 'official twist count');
  assertEqual(twists.map(row => row.localisations.en.name).sort().join('|'), [...twistNames].sort().join('|'), 'official twist names');

  for (const [slug, gdm] of Object.entries(gdmMissions)) {
    const app = missions.find(row => semanticText(row.localisations.en.name) === semanticText(gdm.name));
    if (!app) throw new Error(`Mismatch at ${slug}: official mission was not found by name ${gdm.name}`);
    assertEqual(semanticText(app.localisations.en.description), semanticText(gdm.overview), `${slug}.overview`);
    const appObjectives = objectives.filter(row => row.primaryMissionId === app.id).sort((a, b) => a.displayOrder - b.displayOrder);
    assertEqual(appObjectives.length, gdm.sections.length, `${slug}.section count`);
    appObjectives.forEach((objective, sectionIndex) => {
      const section = gdm.sections[sectionIndex];
      assertEqual(semanticText(objective.localisations.en.name), semanticText(section.when), `${slug}.sections[${sectionIndex}].when`);
      assertEqual(semanticText(objective.localisations.en.whenText), semanticText(section.timing), `${slug}.sections[${sectionIndex}].timing`);
      const appScorings = scorings.filter(row => row.primaryMissionObjectiveId === objective.id).sort((a, b) => a.displayOrder - b.displayOrder);
      assertEqual(appScorings.length, section.conditions.length, `${slug}.sections[${sectionIndex}].condition count`);
      appScorings.forEach((scoring, conditionIndex) => {
        const condition = section.conditions[conditionIndex];
        const label = `${slug}.sections[${sectionIndex}].conditions[${conditionIndex}]`;
        assertEqual(semanticText(scoring.localisations.en.scoringCriteria), semanticText(condition.text), `${label}.text`);
        assertEqual(scoring.victoryPoints, condition.vp, `${label}.vp`);
        assertEqual(scoring.isCumulative, condition.cumulative, `${label}.cumulative`);
        assertEqual(scoring.isMutuallyExclusive, condition.alternative, `${label}.alternative`);
      });
    });

    const appActions = actions.filter(row => row.primaryMissionId === app.id);
    assertEqual(appActions.length, gdm.action ? 1 : 0, `${slug}.action count`);
    if (gdm.action) {
      const action = appActions[0].localisations.en;
      for (const [gdmKey, appKey] of Object.entries({
        title: 'name', starts: 'startsText', units: 'unitsText', useLimit: 'useLimitText',
        completes: 'completesText', effect: 'effectText', restriction: 'restrictionText',
      })) assertEqual(semanticText(action[appKey]), semanticText(gdm.action[gdmKey]), `${slug}.action.${gdmKey}`);
    }
  }
  return { missions: missions.length, objectives: objectives.length, actions: actions.length };
}

function canonicalPayload(gdmMissions) {
  const missions = Object.fromEntries(Object.entries(gdmMissions).map(([slug, mission]) => [slug, {
    action: mission.action ? {
      title: mission.action.title,
      startsHash: sha256(mission.action.starts),
      unitsHash: sha256(mission.action.units),
      useLimitHash: sha256(mission.action.useLimit),
      completesHash: sha256(mission.action.completes),
      effectHash: sha256(mission.action.effect),
      restrictionHash: mission.action.restriction == null ? null : sha256(mission.action.restriction),
    } : null,
    deck: mission.deck,
    name: mission.name,
    overviewHash: mission.overview == null ? null : sha256(mission.overview),
    sections: mission.sections.map(section => ({
      conditions: section.conditions.map(condition => ({
        alternative: condition.alternative,
        cumulative: condition.cumulative,
        kind: condition.kind,
        limit: condition.limit,
        per: condition.per,
        textHash: sha256(condition.text),
        vp: condition.vp,
      })),
      headerKind: section.headerKind,
      timing: section.timing,
      when: section.when,
    })),
  }]));
  return { gdmVersion: GDM_VERSION, inspectionDate: INSPECTION_DATE, missions, schema: 1 };
}

const help = `Usage: node scripts/audit-rules-sources.mjs --dump <dump.json> --output <file>

Options:
  -d, --dump <path>    Extracted official app dump.json (or W40K_DUMP_JSON)
  -o, --output <path>  Canonical comparison JSON (or W40K_AUDIT_OUTPUT)
  -h, --help           Show this help
`;

function options(argv) {
  const result = { dump: process.env.W40K_DUMP_JSON, output: process.env.W40K_AUDIT_OUTPUT };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '-h' || argument === '--help') return { help: true };
    if (argument === '-d' || argument === '--dump') result.dump = argv[++index];
    else if (argument === '-o' || argument === '--output') result.output = argv[++index];
    else throw new Error(`Unknown argument: ${argument}\n${help}`);
  }
  if (!result.dump) throw new Error(`Missing --dump path (or W40K_DUMP_JSON)\n${help}`);
  if (!result.output) throw new Error(`Missing --output path (or W40K_AUDIT_OUTPUT)\n${help}`);
  return result;
}

async function main() {
  const parsed = options(process.argv.slice(2));
  if (parsed.help) return process.stdout.write(help);
  let dump;
  try { dump = JSON.parse((await readFile(parsed.dump, 'utf8')).replace(/^\uFEFF/, '')); }
  catch (error) { throw new Error(`Cannot read dump.json at ${parsed.dump}: ${error.message}`); }

  const entries = await Promise.all(routes.map(async ([deck, slug]) => {
    const url = `${BASE_URL}/${deck}/${slug}`;
    let response;
    try { response = await fetch(url, { signal: AbortSignal.timeout(30_000) }); }
    catch (error) { throw new Error(`Network error fetching ${url}: ${error.message}`); }
    if (!response.ok) throw new Error(`HTTP ${response.status} fetching ${url}`);
    try {
      const { primary, primaryBack } = parseGdmHtml(await response.text());
      assertEqual(primary.deck, deck, `${slug}.deck`);
      return [slug, missionFromGdm(deck, primary, primaryBack)];
    } catch (error) { throw new Error(`${url}: ${error.message}`); }
  }));
  const gdmMissions = Object.fromEntries(entries);
  const counts = compareWithApp(dump, gdmMissions);
  const output = canonicalJson(canonicalPayload(gdmMissions));
  try { await writeFile(parsed.output, output, 'utf8'); }
  catch (error) { throw new Error(`Cannot write output at ${parsed.output}: ${error.message}`); }
  console.log(`SHA-256 ${sha256(output).toUpperCase()}`);
  console.log(`missions=${counts.missions} objectives=${counts.objectives} actions=${counts.actions}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch(error => { console.error(`audit-rules-sources: ${error.message}`); process.exitCode = 1; });
}
