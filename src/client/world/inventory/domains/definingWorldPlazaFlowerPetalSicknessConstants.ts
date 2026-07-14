/**
 * Tunables for Petal Sickness from eating too many raw flowers.
 *
 * @module components/world/inventory/domains/definingWorldPlazaFlowerPetalSicknessConstants
 */

import { computingWorldPlazaInGameDaysToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';

/** Visible HUD / confusion buff id. */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DEBUFF_ID =
  'petal-sickness-debuff' as const;

/** Hidden stamina companion debuff id. */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_STAMINA_DEBUFF_ID =
  'petal-sickness-stamina-debuff' as const;

/** Duration added per successful Petal Sickness proc (stacks by extending). */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DURATION_MS = 60_000;

/** Confusion intensity while Petal Sickness is active. */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_CONFUSION_INTENSITY = 40;

/**
 * Raw petals that must be eaten in the window before Petal Sickness can roll.
 * The 10th chew is the first eligible roll.
 */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_MIN_PETALS = 10;

/**
 * Rolling window for raw-flower eats that escalate Petal Sickness chance.
 * Also used as post-clear lockout after the debuff ends.
 */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_COOLDOWN_MS =
  computingWorldPlazaInGameDaysToRealMs(1);

/** Chance on the first eligible petal (at the min-petal threshold). */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_BASE_CHANCE = 0.08;

/** Extra chance per additional raw flower past the min-petal threshold. */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_CHANCE_PER_EXTRA_PETAL = 0.07;

/** Hard cap on Petal Sickness proc chance. */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_CHANCE_CAP = 0.55;

/** Toxic poison pool applied with each Petal Sickness proc (fraction of max HP). */
export const DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_POISON_OF_MAX = 0.03;
