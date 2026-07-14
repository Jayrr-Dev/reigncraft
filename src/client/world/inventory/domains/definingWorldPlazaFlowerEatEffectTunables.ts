/**
 * Tunable numbers for biome flower eat effects.
 * Shared by apply logic and Herbarium full-dossier stats.
 *
 * @module components/world/inventory/domains/definingWorldPlazaFlowerEatEffectTunables
 */

/**
 * How the flower was prepared before eating.
 * Brewed recipes can raise proc chance later.
 */
export type DefiningWorldPlazaFlowerEatPreparationId = 'raw' | 'brewed';

/**
 * Base chance the species eat-effect fires when chewing a raw flower.
 * Brewing will raise this via preparation + bonuses.
 */
export const DEFINING_WORLD_PLAZA_FLOWER_RAW_EAT_EFFECT_PROC_CHANCE = 0.65;

/**
 * Placeholder base chance for brewed flower preparations.
 * Unused until the brew pipeline lands; keep in sync then.
 */
export const DEFINING_WORLD_PLAZA_FLOWER_BREWED_EAT_EFFECT_PROC_CHANCE = 0.75;

/** Base effect-proc chance by preparation form. */
export const DEFINING_WORLD_PLAZA_FLOWER_EAT_EFFECT_PROC_CHANCE_BY_PREPARATION: Readonly<
  Record<DefiningWorldPlazaFlowerEatPreparationId, number>
> = {
  raw: DEFINING_WORLD_PLAZA_FLOWER_RAW_EAT_EFFECT_PROC_CHANCE,
  brewed: DEFINING_WORLD_PLAZA_FLOWER_BREWED_EAT_EFFECT_PROC_CHANCE,
};

/** Yarrow heal when no bleed tier was downgraded (fraction of effective max HP). */
export const DEFINING_WORLD_PLAZA_FLOWER_YARROW_FALLBACK_HEAL_OF_MAX = 0.05;

/** Calendula heal (fraction of effective max HP). */
export const DEFINING_WORLD_PLAZA_FLOWER_CALENDULA_HEAL_OF_MAX = 0.05;

/** Calendula mending outgoing-heal buff duration. */
export const DEFINING_WORLD_PLAZA_FLOWER_CALENDULA_MENDING_DURATION_MS = 30_000;

/** Chamomile deep sleep duration (cannot wake from damage). */
export const DEFINING_WORLD_PLAZA_FLOWER_CHAMOMILE_SLEEP_MS = 10_000;

/** Chamomile passive heal over sleep (fraction of max HP total). */
export const DEFINING_WORLD_PLAZA_FLOWER_CHAMOMILE_SLEEP_HEAL_OF_MAX = 0.01;

/** Valerian deep sleep duration. */
export const DEFINING_WORLD_PLAZA_FLOWER_VALERIAN_SLEEP_MS = 8_000;

/** Valerian sleep regen multiplier while asleep. */
export const DEFINING_WORLD_PLAZA_FLOWER_VALERIAN_SLEEP_REGEN_MULTIPLIER = 3;

/** Peppermint / meadowsweet comfort-band duration. */
export const DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_MS = 60_000;

/** Comfort bonus (°C) for peppermint cold / meadowsweet heat. */
export const DEFINING_WORLD_PLAZA_FLOWER_TIMED_TOLERANCE_CELSIUS = 10;

/** Rose cold resistance duration. */
export const DEFINING_WORLD_PLAZA_FLOWER_ROSE_COLD_RESIST_MS = 30_000;

/** Rose cold resistance fraction (0–1). */
export const DEFINING_WORLD_PLAZA_FLOWER_ROSE_COLD_RESISTANCE = 0.25;

/** Echinacea infection-resist duration when no disease is active. */
export const DEFINING_WORLD_PLAZA_FLOWER_INFECTION_RESIST_MS = 60_000;

/** Echinacea infection contraction chance multiplier while resisted. */
export const DEFINING_WORLD_PLAZA_FLOWER_INFECTION_RESIST_CHANCE_MULTIPLIER = 0.5;

/** Arnica braced buff duration (forces Softened incoming rolls). */
export const DEFINING_WORLD_PLAZA_FLOWER_ARNICA_BRACED_DURATION_MS = 20_000;

/** Foxglove success chance for the heal + temp-max branch. */
export const DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_SUCCESS_CHANCE = 0.6;

/** Foxglove success heal (fraction of effective max HP). */
export const DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_HEAL_OF_MAX = 0.25;

/** Foxglove temporary max-HP roll expected value (before damage-roll modifiers). */
export const DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_TEMP_MAX_BASE_EV = 50;

/** Foxglove temporary max-HP duration. */
export const DEFINING_WORLD_PLAZA_FLOWER_FOXGLOVE_TEMP_MAX_MS = 45_000;

/** Belladonna venomous poison pool (fraction of effective max HP). */
export const DEFINING_WORLD_PLAZA_FLOWER_BELLADONNA_POISON_OF_MAX = 0.3;

/** Belladonna poison duration. */
export const DEFINING_WORLD_PLAZA_FLOWER_BELLADONNA_POISON_DURATION_MS = 30_000;
