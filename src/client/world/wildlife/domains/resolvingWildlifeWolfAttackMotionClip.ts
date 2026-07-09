/**
 * Wolf three-hit melee combo clip and damage selection.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeWolfAttackMotionClip
 */

import { checkingWildlifeWolfComboSpecies } from '@/components/world/wildlife/domains/checkingWildlifeWolfComboSpecies';
import type { DefiningWildlifeAiState } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeWolfComboTuning } from '@/components/world/wildlife/domains/resolvingWildlifeWolfComboTuning';

export type DefiningWildlifeWolfAttackMotionClip =
  | 'attack'
  | 'attack2'
  | 'attack3';

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
  if (!checkingWildlifeWolfComboSpecies(speciesId)) {
    return 0;
  }

  const { comboResetMs } = resolvingWildlifeWolfComboTuning(speciesId);

  if (lastAttackAtMs === null || nowMs - lastAttackAtMs > comboResetMs) {
    return 0;
  }

  return attackComboIndex % 3;
}

/** Maps a combo step to the matching motion clip id. */
export function resolvingWildlifeWolfAttackMotionClip(
  speciesId: string,
  comboIndex: number
): DefiningWildlifeWolfAttackMotionClip {
  if (!checkingWildlifeWolfComboSpecies(speciesId)) {
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
  if (!checkingWildlifeWolfComboSpecies(speciesId)) {
    return 0;
  }

  return (comboIndex + 1) % 3;
}

/** Applies bite / snap / lunge damage scaling for the attacking species. */
export function resolvingWildlifeWolfAttackDamageMultiplier(
  speciesId: string,
  motionClip: DefiningWildlifeAiState['motionClip']
): number {
  if (!checkingWildlifeWolfComboSpecies(speciesId)) {
    return 1;
  }

  const tuning = resolvingWildlifeWolfComboTuning(speciesId);

  if (motionClip === 'attack3') {
    return tuning.attack3DamageMultiplier;
  }

  if (motionClip === 'attack2') {
    return tuning.attack2DamageMultiplier;
  }

  return 1;
}
