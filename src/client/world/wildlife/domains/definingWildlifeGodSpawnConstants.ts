/**
 * Distance-scaled "god spawn" elite wildlife: gold tint, forced aggro,
 * random aggressive temperament override, stacked combat buffs, human taunts.
 *
 * @module components/world/wildlife/domains/definingWildlifeGodSpawnConstants
 */

import type { DefiningWildlifeTemperamentId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { DefiningWildlifeSpeechLine } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';

/** Deterministic salt for the god-spawn chance roll. */
export const DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_SALT = 9401;

/** Deterministic salt for picking the forced aggressive temperament. */
export const DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_SALT = 9407;

/**
 * Chance to promote a spawn to a god spawn, per distance-danger band
 * (every 1000 tiles from origin). Band 0 = 0%.
 */
export const DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_PER_DANGER_BAND = 0.025;

/** Hard cap so far-out rings stay rare. */
export const DEFINING_WILDLIFE_GOD_SPAWN_CHANCE_MAX = 0.25;

/** Stamina endurance multiplier (drain ÷, regen ×) on top of other bonuses. */
export const DEFINING_WILDLIFE_GOD_SPAWN_STAMINA_MULTIPLIER = 2;

/** Max-health multiplier on top of size / distance / other bonuses. */
export const DEFINING_WILDLIFE_GOD_SPAWN_HEALTH_MULTIPLIER = 5;

/** Melee damage multiplier on top of size / distance / other bonuses. */
export const DEFINING_WILDLIFE_GOD_SPAWN_ATTACK_POWER_MULTIPLIER = 5;

/** Pixi sprite tint for god-spawn bodies (warm gold). */
export const DEFINING_WILDLIFE_GOD_SPAWN_SPRITE_TINT = 0xffd24a;

/** Name-tag fill color matching the gold body tint. */
export const DEFINING_WILDLIFE_GOD_SPAWN_NAME_TAG_COLOR = '#ffd24a';

/** Prefix shown on god-spawn name tags. */
export const DEFINING_WILDLIFE_GOD_SPAWN_NAME_TAG_PREFIX = 'Godspawn';

/**
 * Aggressive temperaments a god spawn may forcibly use, regardless of species.
 * A chicken can roll stalker or pack_hunter.
 */
export const DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_POOL = [
  'predator',
  'ambusher',
  'pack_hunter',
  'stalker',
  'retaliator',
] as const satisfies readonly DefiningWildlifeTemperamentId[];

export type DefiningWildlifeGodSpawnTemperamentId =
  (typeof DEFINING_WILDLIFE_GOD_SPAWN_TEMPERAMENT_POOL)[number];

/**
 * Cliché villain human lines used instead of animal vocalizations.
 * Shared across all speech contexts so combat always reads as taunting English.
 */
export const DEFINING_WILDLIFE_GOD_SPAWN_SPEECH_LINES = [
  { text: 'FOOLISH!', style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'shake' } },
  {
    text: 'DARE TO COME TO THESE LANDS!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'shake' },
  },
  { text: 'DIE!', style: { font: 'display', fontSizePx: 13, bubbleAnimation: 'bounce' } },
  {
    text: 'YOU SHALL PERISH!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'shake' },
  },
  {
    text: 'LEAVE THESE LANDS!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'pulse' },
  },
  {
    text: 'MORTAL FOOL!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'shake' },
  },
  {
    text: 'YOUR END IS NEAR!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'pulse' },
  },
  {
    text: 'NONE SHALL PASS!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'shake' },
  },
  {
    text: 'TREMBLE BEFORE ME!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'bounce' },
  },
  {
    text: 'I AM ETERNAL!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'pulse' },
  },
  {
    text: 'BEGONE, WORM!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'shake' },
  },
  {
    text: 'THIS REALM REJECTS YOU!',
    style: { font: 'display', fontSizePx: 10, bubbleAnimation: 'shake' },
  },
] as const satisfies readonly DefiningWildlifeSpeechLine[];
