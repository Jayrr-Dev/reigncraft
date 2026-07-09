/**
 * Obese vs apex rolls and tuning for +1σ / +2σ / +3σ wildlife spawns.
 *
 * @module components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants
 */

import type { DefiningWildlifeSizeTier } from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';

/** Large-size body frame rolled at spawn for tier +1, +2, and +3 animals. */
export type DefiningWildlifeLargeSizeFrame = 'obese' | 'apex';

/** Salt for the obese/apex coin flip at each spawn anchor. */
export const DEFINING_WILDLIFE_LARGE_SIZE_FRAME_PICK_SALT = 6643;

/** Salt for obese meat-drop quantity rolls. */
export const DEFINING_WILDLIFE_OBESE_MEAT_DROP_QUANTITY_PICK_SALT = 6647;

/** Obese animals walk and run 30% slower than apex peers at the same σ tier. */
export const DEFINING_WILDLIFE_OBESE_SPEED_MULTIPLIER = 0.7;

/** Obese stamina regen is 15% lower than apex peers. */
export const DEFINING_WILDLIFE_OBESE_STAMINA_REGEN_MULTIPLIER = 0.85;

/** Apex animals can hold 30% more run stamina than the default 0–1 cap. */
export const DEFINING_WILDLIFE_APEX_MAX_STAMINA_RATIO = 1.3;

/** Apex stamina regen is 15% higher than apex-sized peers. */
export const DEFINING_WILDLIFE_APEX_STAMINA_REGEN_MULTIPLIER = 1.15;

/** Extra max-health multiplier for obese +1σ animals over same-tier apex. */
export const DEFINING_WILDLIFE_OBESE_HEALTH_MULTIPLIER_TIER_1 = 1.56;

/** Extra max-health multiplier for obese +2σ animals over same-tier apex. */
export const DEFINING_WILDLIFE_OBESE_HEALTH_MULTIPLIER_TIER_2 = 1.84;

/** Extra max-health multiplier for obese +3σ animals over same-tier apex. */
export const DEFINING_WILDLIFE_OBESE_HEALTH_MULTIPLIER_TIER_3 = 2.12;

/** Hidden defender roll skew: obese animals soften or block slightly more often. */
export const DEFINING_WILDLIFE_OBESE_INCOMING_BLOCK_BIAS = 0.35;

/** Hidden attacker roll skew for obese jump-landing strikes. */
export const DEFINING_WILDLIFE_OBESE_JUMP_ATTACK_CRITICAL_BIAS = 0.35;

/** Melee swings shortly after a jump landing count as jump attacks. */
export const DEFINING_WILDLIFE_JUMP_ATTACK_WINDOW_MS = 700;

export const DEFINING_WILDLIFE_OBESE_NAME_TAG_PREFIXES_TIER_1 = [
  'Fat',
  'Chubby',
  'Plump',
  'Chunky',
  'Tubby',
  'Pudgy',
  'Round',
  'Dumpy',
] as const;

export const DEFINING_WILDLIFE_OBESE_NAME_TAG_PREFIXES_TIER_2 = [
  'Thick',
  'Tanky',
  'Stout',
  'Overweight',
  'Heavy',
  'Bulky',
  'Beefy',
  'Robust',
  'Sturdy',
  'Solid',
] as const;

export const DEFINING_WILDLIFE_OBESE_NAME_TAG_PREFIXES_TIER_3 = [
  'Colossal',
  'Mammoth',
  'Titanic',
  'Monolithic',
  'Immovable',
  'Crushing',
  'Vast',
  'Massive',
] as const;

export const DEFINING_WILDLIFE_APEX_NAME_TAG_PREFIXES_TIER_1 = [
  'Buff',
  'Muscular',
  'Ripped',
  'Husky',
  'Tough',
  'Strong',
  'Fit',
  'Capable',
  'Burly',
] as const;

export const DEFINING_WILDLIFE_APEX_NAME_TAG_PREFIXES_TIER_2 = [
  'Leading',
  'Apex',
  'Alpha',
  'Beastly',
  'Powerful',
  'Mighty',
  'Jacked',
  'Scary',
  'Formidable',
  'Fearless',
  'Grim',
] as const;

export const DEFINING_WILDLIFE_APEX_NAME_TAG_PREFIXES_TIER_3 = [
  'Legendary',
  'Gody',
  'Hellish',
  'Demon',
  'Mythical',
] as const;

export const DEFINING_WILDLIFE_LARGE_SIZE_FRAME_NAME_TAG_PREFIX_PICK_SALT = 6653;

export function checkingWildlifeSizeTierHasLargeSizeFrame(
  sizeTier: DefiningWildlifeSizeTier
): boolean {
  return sizeTier === 1 || sizeTier === 2 || sizeTier === 3;
}

export function mappingWildlifeLargeSizeFrameObeseHealthMultiplier(
  sizeTier: DefiningWildlifeSizeTier
): number {
  if (sizeTier === 3) {
    return DEFINING_WILDLIFE_OBESE_HEALTH_MULTIPLIER_TIER_3;
  }

  if (sizeTier === 2) {
    return DEFINING_WILDLIFE_OBESE_HEALTH_MULTIPLIER_TIER_2;
  }

  return DEFINING_WILDLIFE_OBESE_HEALTH_MULTIPLIER_TIER_1;
}

export function resolvingWildlifeLargeSizeFrameNameTagPrefixPool(
  largeSizeFrame: DefiningWildlifeLargeSizeFrame,
  sizeTier: DefiningWildlifeSizeTier
): readonly string[] {
  if (largeSizeFrame === 'obese') {
    if (sizeTier === 3) {
      return DEFINING_WILDLIFE_OBESE_NAME_TAG_PREFIXES_TIER_3;
    }

    if (sizeTier === 2) {
      return DEFINING_WILDLIFE_OBESE_NAME_TAG_PREFIXES_TIER_2;
    }

    return DEFINING_WILDLIFE_OBESE_NAME_TAG_PREFIXES_TIER_1;
  }

  if (sizeTier === 3) {
    return DEFINING_WILDLIFE_APEX_NAME_TAG_PREFIXES_TIER_3;
  }

  if (sizeTier === 2) {
    return DEFINING_WILDLIFE_APEX_NAME_TAG_PREFIXES_TIER_2;
  }

  return DEFINING_WILDLIFE_APEX_NAME_TAG_PREFIXES_TIER_1;
}
