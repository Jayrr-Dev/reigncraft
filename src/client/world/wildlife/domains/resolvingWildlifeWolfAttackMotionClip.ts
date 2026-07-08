/**
 * Grey wolf three-hit melee combo clip and damage selection.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeWolfAttackMotionClip
 */

import type { DefiningWildlifeAiState } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  DEFINING_WILDLIFE_WOLF_ATTACK2_DAMAGE_MULTIPLIER,
  DEFINING_WILDLIFE_WOLF_ATTACK3_DAMAGE_MULTIPLIER,
  DEFINING_WILDLIFE_WOLF_ATTACK_COMBO_RESET_MS,
} from '@/components/world/wildlife/domains/definingWildlifeWolfVocalizationConstants';

export type DefiningWildlifeWolfAttackMotionClip =
  | 'attack'
  | 'attack2'
  | 'attack3';

function checkingWildlifeWolfSpecies(speciesId: string): boolean {
  return speciesId === 'grey-wolf';
}

/**
 * Returns the combo step index for the next swing (0 = bite, 1 = snap, 2 = lunge).
 */
export function resolvingWildlifeWolfAttackComboIndexForSwing({
  speciesId,
  attackComboIndex,
  lastAttackAtMs,
  nowMs,
}: {
  speciesId: string;
  attackComboIndex: number;
  lastAttackAtMs: number | null;
  nowMs: number;
}): number {
  if (!checkingWildlifeWolfSpecies(speciesId)) {
    return 0;
  }

  if (
    lastAttackAtMs === null ||
    nowMs - lastAttackAtMs > DEFINING_WILDLIFE_WOLF_ATTACK_COMBO_RESET_MS
  ) {
    return 0;
  }

  return attackComboIndex % 3;
}

/** Maps a combo step to the matching motion clip id. */
export function resolvingWildlifeWolfAttackMotionClip(
  speciesId: string,
  comboIndex: number
): DefiningWildlifeWolfAttackMotionClip {
  if (!checkingWildlifeWolfSpecies(speciesId)) {
    return 'attack';
  }

  if (comboIndex % 3 === 1) {
    return 'attack2';
  }

  if (comboIndex % 3 === 2) {
    return 'attack3';
  }

  return 'attack';
}

/** Advances the combo counter after a landed swing. */
export function resolvingWildlifeWolfAttackComboIndexAfterSwing(
  speciesId: string,
  comboIndex: number
): number {
  if (!checkingWildlifeWolfSpecies(speciesId)) {
    return 0;
  }

  return (comboIndex + 1) % 3;
}

/** Applies bite / snap / lunge damage scaling. */
export function resolvingWildlifeWolfAttackDamageMultiplier(
  motionClip: DefiningWildlifeAiState['motionClip']
): number {
  if (motionClip === 'attack3') {
    return DEFINING_WILDLIFE_WOLF_ATTACK3_DAMAGE_MULTIPLIER;
  }

  if (motionClip === 'attack2') {
    return DEFINING_WILDLIFE_WOLF_ATTACK2_DAMAGE_MULTIPLIER;
  }

  return 1;
}
