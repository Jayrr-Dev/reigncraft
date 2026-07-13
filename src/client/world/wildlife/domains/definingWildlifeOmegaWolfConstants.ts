/**
 * Omega Wolf elite pack hunter: ids, pack composition, and combat skews.
 *
 * @module components/world/wildlife/domains/definingWildlifeOmegaWolfConstants
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Species id for the night-only elite pack leader. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_SPECIES_ID =
  'omega-wolf' as const satisfies DefiningWildlifeSpeciesId;

/** Grey wolves that always escort an Omega spawn. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_ESCORT_SPECIES_ID =
  'grey-wolf' as const satisfies DefiningWildlifeSpeciesId;

/** Fixed pack: 1 Omega + 4 grey wolves. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_PACK_COMPOSITION = [
  { speciesId: DEFINING_WILDLIFE_OMEGA_WOLF_SPECIES_ID, count: 1 },
  { speciesId: DEFINING_WILDLIFE_OMEGA_WOLF_ESCORT_SPECIES_ID, count: 4 },
] as const;

/** Species that share an Omega spawn pack for alpha / stalk join. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_PACK_ALLY_SPECIES_IDS = [
  DEFINING_WILDLIFE_OMEGA_WOLF_SPECIES_ID,
  DEFINING_WILDLIFE_OMEGA_WOLF_ESCORT_SPECIES_ID,
] as const;

/** Dark red name-tag fill for Omega Wolf. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_NAME_TAG_COLOR = '#8b0000';

/** Outgoing melee critical bias (lean toward crit tiers). */
export const DEFINING_WILDLIFE_OMEGA_WOLF_OUTGOING_CRITICAL_BIAS = 0.55;

/** Modifier id for Omega outgoing crit lean. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_OUTGOING_CRITICAL_BIAS_MODIFIER_ID =
  'wildlife-omega-wolf-outgoing-critical-bias';

/** Attack2 damage multiplier (unique moveset vs grey wolf 1.15). */
export const DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK2_DAMAGE_MULTIPLIER = 1.35;

/** Attack3 damage multiplier (unique moveset vs grey wolf 1.4). */
export const DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK3_DAMAGE_MULTIPLIER = 1.75;

/** Attack2 clip hold (ms). */
export const DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK2_CLIP_HOLD_MS = 520;

/** Attack3 clip hold (ms). */
export const DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK3_CLIP_HOLD_MS = 720;

/** Combo reset window (ms). */
export const DEFINING_WILDLIFE_OMEGA_WOLF_ATTACK_COMBO_RESET_MS = 3_600;

/** Howl lock duration (ms). */
export const DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_DURATION_MS = 2_200;

/** Howl cooldown (ms). */
export const DEFINING_WILDLIFE_OMEGA_WOLF_HOWL_COOLDOWN_MS = 11_000;

/**
 * Ideal shadowing distance for the Omega (grid). Farther than a normal pack
 * alpha so the elite hangs back while grey escorts press closer.
 */
export const DEFINING_WILDLIFE_OMEGA_WOLF_STALK_FOLLOW_DISTANCE_GRID = 13.5;

/** Back-off threshold while the Omega shadows the player. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_STALK_FOLLOW_MIN_DISTANCE_GRID = 11;

/** Catch-up threshold while the Omega shadows the player. */
export const DEFINING_WILDLIFE_OMEGA_WOLF_STALK_FOLLOW_MAX_DISTANCE_GRID = 16;

/** True when species is Omega Wolf. */
export function checkingWildlifeOmegaWolfSpecies(speciesId: string): boolean {
  return speciesId === DEFINING_WILDLIFE_OMEGA_WOLF_SPECIES_ID;
}

/** True when species participates in Omega / grey mixed packs. */
export function checkingWildlifeOmegaWolfPackAllySpecies(
  speciesId: string
): boolean {
  return (
    speciesId === DEFINING_WILDLIFE_OMEGA_WOLF_SPECIES_ID ||
    speciesId === DEFINING_WILDLIFE_OMEGA_WOLF_ESCORT_SPECIES_ID
  );
}

/**
 * True when two species ids hunt as one stalk pack: same species, or the
 * Omega Wolf with its grey wolf escorts.
 */
export function checkingWildlifeSameStalkPackSpecies(
  leftSpeciesId: string,
  rightSpeciesId: string
): boolean {
  return (
    leftSpeciesId === rightSpeciesId ||
    (checkingWildlifeOmegaWolfPackAllySpecies(leftSpeciesId) &&
      checkingWildlifeOmegaWolfPackAllySpecies(rightSpeciesId))
  );
}
