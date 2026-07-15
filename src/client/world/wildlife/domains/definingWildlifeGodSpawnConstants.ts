/**
 * Distance-scaled "god spawn" elite wildlife: gold tint, forced aggro,
 * random aggressive temperament override, stacked combat buffs, human taunts.
 *
 * @module components/world/wildlife/domains/definingWildlifeGodSpawnConstants
 */

import type { DefiningWildlifeSpeechLine } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';
import type { DefiningWildlifeTemperamentId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

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
 * Mix of campy taunts plus light game nods that still read as boss banter.
 * Shared across all speech contexts so combat always reads as taunting English.
 */
export const DEFINING_WILDLIFE_GOD_SPAWN_SPEECH_LINES = [
  // Classic villain
  {
    text: 'FOOLISH!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'shake' },
  },
  {
    text: 'DARE TO COME TO THESE LANDS!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'shake' },
  },
  {
    text: 'DIE!',
    style: { font: 'display', fontSizePx: 13, bubbleAnimation: 'bounce' },
  },
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
  // Fun original
  {
    text: 'NICE TRY, SNACK!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'bounce' },
  },
  {
    text: 'COME CLOSER... IF YOU DARE!',
    style: { font: 'display', fontSizePx: 10, bubbleAnimation: 'pulse' },
  },
  {
    text: 'IS THAT ALL YOU BROUGHT?!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'shake' },
  },
  {
    text: 'I ATE STRONGER HEROES FOR BREAKFAST!',
    style: { font: 'display', fontSizePx: 10, bubbleAnimation: 'bounce' },
  },
  {
    text: 'RUN. I LIKE THE CHASE.',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'pulse' },
  },
  {
    text: 'YOUR LEGEND ENDS HERE!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'shake' },
  },
  {
    text: 'TOUCH GRASS? TOUCH DIRT. FOREVER.',
    style: { font: 'display', fontSizePx: 10, bubbleAnimation: 'bounce' },
  },
  {
    text: 'SKILL ISSUE!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'shake' },
  },
  {
    text: 'PATHETIC. AGAIN!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'bounce' },
  },
  {
    text: 'BOW, OR BE BROKEN!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'shake' },
  },
  // Subtle game nods (still villain-shaped)
  {
    text: 'PREPARE TO DIE!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'shake' },
  },
  {
    text: 'YOU ARE NOT PREPARED!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'pulse' },
  },
  {
    text: 'WOULD YOU KINDLY FALL?',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'bounce' },
  },
  {
    text: "YOU'RE TOO SLOW!",
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'shake' },
  },
  {
    text: 'RIP AND TEAR!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'bounce' },
  },
  {
    text: 'GET OVER HERE!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'shake' },
  },
  {
    text: 'HEROES ALWAYS DIE!',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'pulse' },
  },
  {
    text: 'KEPT YOU WAITING?',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'bounce' },
  },
  {
    text: 'NO COST TOO GREAT.',
    style: { font: 'display', fontSizePx: 11, bubbleAnimation: 'pulse' },
  },
  {
    text: 'TARNISHED!',
    style: { font: 'display', fontSizePx: 13, bubbleAnimation: 'shake' },
  },
  {
    text: 'IT WAS DANGEROUS TO COME ALONE!',
    style: { font: 'display', fontSizePx: 10, bubbleAnimation: 'shake' },
  },
  {
    text: 'A LOSER IS YOU!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'bounce' },
  },
  {
    text: 'WASTED!',
    style: { font: 'display', fontSizePx: 13, bubbleAnimation: 'shake' },
  },
  {
    text: 'THE CAKE WAS NEVER YOURS!',
    style: { font: 'display', fontSizePx: 10, bubbleAnimation: 'pulse' },
  },
  {
    text: 'I CHOOSE VIOLENCE!',
    style: { font: 'display', fontSizePx: 12, bubbleAnimation: 'bounce' },
  },
  {
    text: 'OBJECTION: YOUR EXISTENCE!',
    style: { font: 'display', fontSizePx: 10, bubbleAnimation: 'shake' },
  },
  {
    text: 'MAY CHAOS TAKE THE WHEEL!',
    style: { font: 'display', fontSizePx: 10, bubbleAnimation: 'pulse' },
  },
  {
    text: 'I USED TO BE AN ADVENTURER...',
    style: { font: 'display', fontSizePx: 10, bubbleAnimation: 'bounce' },
  },
] as const satisfies readonly DefiningWildlifeSpeechLine[];
