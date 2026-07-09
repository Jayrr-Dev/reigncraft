/**
 * Per-species wolf combo, howl, and clip-hold tuning.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeWolfComboTuning
 */

import {
  DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK2_CLIP_HOLD_MS,
  DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK2_DAMAGE_MULTIPLIER,
  DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK3_CLIP_HOLD_MS,
  DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK3_DAMAGE_MULTIPLIER,
  DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_COMBO_RESET_MS,
  DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_COOLDOWN_MS,
  DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_DURATION_MS,
  checkingWildlifeOmegaWolfSpecies,
} from '@/components/world/wildlife/domains/definingWildlifeOmegaWolfConstants';
import {
  DEFINING_WILDLIFE_WOLF_ATTACK2_CLIP_HOLD_MS,
  DEFINING_WILDLIFE_WOLF_ATTACK2_DAMAGE_MULTIPLIER,
  DEFINING_WILDLIFE_WOLF_ATTACK3_CLIP_HOLD_MS,
  DEFINING_WILDLIFE_WOLF_ATTACK3_DAMAGE_MULTIPLIER,
  DEFINING_WILDLIFE_WOLF_ATTACK_COMBO_RESET_MS,
  DEFINING_WILDLIFE_WOLF_HOWL_COOLDOWN_MS,
  DEFINING_WILDLIFE_WOLF_HOWL_DURATION_MS,
} from '@/components/world/wildlife/domains/definingWildlifeWolfVocalizationConstants';

export type ResolvingWildlifeWolfComboTuning = {
  comboResetMs: number;
  attack2DamageMultiplier: number;
  attack3DamageMultiplier: number;
  attack2ClipHoldMs: number;
  attack3ClipHoldMs: number;
  howlDurationMs: number;
  howlCooldownMs: number;
};

const DEFINING_WILDLIFE_GREY_WOLF_COMBO_TUNING: ResolvingWildlifeWolfComboTuning =
  {
    comboResetMs: DEFINING_WILDLIFE_WOLF_ATTACK_COMBO_RESET_MS,
    attack2DamageMultiplier: DEFINING_WILDLIFE_WOLF_ATTACK2_DAMAGE_MULTIPLIER,
    attack3DamageMultiplier: DEFINING_WILDLIFE_WOLF_ATTACK3_DAMAGE_MULTIPLIER,
    attack2ClipHoldMs: DEFINING_WILDLIFE_WOLF_ATTACK2_CLIP_HOLD_MS,
    attack3ClipHoldMs: DEFINING_WILDLIFE_WOLF_ATTACK3_CLIP_HOLD_MS,
    howlDurationMs: DEFINING_WILDLIFE_WOLF_HOWL_DURATION_MS,
    howlCooldownMs: DEFINING_WILDLIFE_WOLF_HOWL_COOLDOWN_MS,
  };

const DEFINING_WILDLIFE_OMEGA_WOLF_COMBO_TUNING: ResolvingWildlifeWolfComboTuning =
  {
    comboResetMs: DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_COMBO_RESET_MS,
    attack2DamageMultiplier:
      DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK2_DAMAGE_MULTIPLIER,
    attack3DamageMultiplier:
      DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK3_DAMAGE_MULTIPLIER,
    attack2ClipHoldMs: DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK2_CLIP_HOLD_MS,
    attack3ClipHoldMs: DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK3_CLIP_HOLD_MS,
    howlDurationMs: DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_DURATION_MS,
    howlCooldownMs: DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_COOLDOWN_MS,
  };

/** Resolves wolf combo / howl timing for a species (grey defaults). */
export function resolvingWildlifeWolfComboTuning(
  speciesId: string
): ResolvingWildlifeWolfComboTuning {
  if (checkingWildlifeOmegaWolfSpecies(speciesId)) {
    return DEFINING_WILDLIFE_OMEGA_WOLF_COMBO_TUNING;
  }

  return DEFINING_WILDLIFE_GREY_WOLF_COMBO_TUNING;
}
