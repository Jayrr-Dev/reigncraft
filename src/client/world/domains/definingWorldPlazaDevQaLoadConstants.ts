/**
 * Declarative layout for the single-player "This a dev load" QA world.
 *
 * Default unlock-all testing session: every generation feature on. Use Perf
 * Flags (All off / per-layer toggles) to bisect while profiling.
 *
 * @module components/world/domains/definingWorldPlazaDevQaLoadConstants
 */

import {
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY,
  type DefiningWorldPlazaGenerationFeatureId,
} from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';

/** Home-screen label for the QA load option. */
export const LABELING_WORLD_PLAZA_DEV_QA_LOAD_BUTTON = 'This a dev load';

/** Short subtitle under the QA load button. */
export const LABELING_WORLD_PLAZA_DEV_QA_LOAD_SUBTITLE =
  'Full unlock: all features on. Perf Flags can bisect.';

/** Local persistence owner id for the ephemeral QA session. */
export const DEFINING_WORLD_PLAZA_DEV_QA_LOAD_OWNER_ID = 'single-player:dev-qa';

/**
 * Player base / current HP while Dev QA load is active.
 * High so combat and hazard tests are not interrupted by death.
 */
export const DEFINING_WORLD_PLAZA_DEV_QA_PLAYER_BASE_MAX_HEALTH = 1_000_000;

/**
 * Stack size granted for every unique craft-recipe ingredient and every ore
 * item type on Dev QA load. Matches common inventory maxStack so one slot per
 * material is enough.
 */
export const DEFINING_WORLD_PLAZA_DEV_QA_CRAFT_INGREDIENT_SEED_QUANTITY = 99;

/**
 * Session override applied when Dev QA load starts: every generation feature
 * on for unlock-all testing. Features debug controls can still flip layers
 * without writing localStorage.
 */
export const DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_ALL_ON: Readonly<
  Record<DefiningWorldPlazaGenerationFeatureId, boolean>
> = Object.fromEntries(
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY.map((definition) => [
    definition.featureId,
    true,
  ])
) as Record<DefiningWorldPlazaGenerationFeatureId, boolean>;

/**
 * Perf-bisect blank slate: generation layers off, audio left on.
 * Kept for tests and for manual All-off profiling from Perf Flags.
 */
export const DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_BLANK_SLATE: Readonly<
  Record<DefiningWorldPlazaGenerationFeatureId, boolean>
> = {
  ...(Object.fromEntries(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY.map((definition) => [
      definition.featureId,
      false,
    ])
  ) as Record<DefiningWorldPlazaGenerationFeatureId, boolean>),
  [DEFINING_WORLD_PLAZA_GENERATION_FEATURE.AUDIO_SFX]: true,
};
