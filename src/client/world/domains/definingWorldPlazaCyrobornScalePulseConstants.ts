/**
 * Declarative scale-pulse tuning for the playable Cyroborn avatar.
 *
 * Jump: slight shrink toward apex. Attack: grow then shrink (cast pulse).
 * Death: ease-in implode to nothing.
 *
 * @module components/world/domains/definingWorldPlazaCyrobornScalePulseConstants
 */

import { DEFINING_WILDLIFE_CYROBORN_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';

/** Skin that uses the crystal scale pulse. */
export const DEFINING_WORLD_PLAZA_CYROBORN_SCALE_PULSE_SKIN_ID =
  DEFINING_WILDLIFE_CYROBORN_SPECIES_ID;

/**
 * Max shrink on jump (relative to rest scale).
 * 0.12 → scale dips to 0.88 at apex.
 */
export const DEFINING_WORLD_PLAZA_CYROBORN_JUMP_SHRINK_AMOUNT = 0.12;

/**
 * Max grow on attack peak (relative to rest scale).
 * 0.22 → scale reaches 1.22 mid-cast, then eases back.
 */
export const DEFINING_WORLD_PLAZA_CYROBORN_ATTACK_GROW_AMOUNT = 0.22;

/**
 * Extra shrink past rest on the attack settle half of the pulse.
 * Brief squeeze after the grow so the cast reads as crystal flex.
 */
export const DEFINING_WORLD_PLAZA_CYROBORN_ATTACK_SETTLE_SHRINK_AMOUNT = 0.06;

/**
 * Death implode duration (ms). Scale eases from 1 → 0 over this window,
 * then stays collapsed while the corpse/death state remains.
 */
export const DEFINING_WORLD_PLAZA_CYROBORN_DEATH_IMPLODE_DURATION_MS = 900;

/**
 * Hide the sprite once scale drops below this (avoids a 1px speck).
 */
export const DEFINING_WORLD_PLAZA_CYROBORN_DEATH_IMPLODE_HIDE_SCALE = 0.02;
