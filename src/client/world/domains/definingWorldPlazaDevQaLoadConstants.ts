/**
 * Declarative layout for the single-player "This a dev load" QA world.
 *
 * Blank-slate perf base: flat plains, every generation feature off. Re-enable
 * layers from Features debug controls while profiling.
 *
 * @module components/world/domains/definingWorldPlazaDevQaLoadConstants
 */

import {
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY,
  type DefiningWorldPlazaGenerationFeatureId,
} from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';

/** Home-screen label for the QA load option. */
export const LABELING_WORLD_PLAZA_DEV_QA_LOAD_BUTTON = 'This a dev load';

/** Short subtitle under the QA load button. */
export const LABELING_WORLD_PLAZA_DEV_QA_LOAD_SUBTITLE =
  'Blank slate: no floor, no DOM overlays, no gen. Toggle Features to profile.';

/** Local persistence owner id for the ephemeral QA session. */
export const DEFINING_WORLD_PLAZA_DEV_QA_LOAD_OWNER_ID = 'single-player:dev-qa';

/**
 * Session override applied when Dev QA load starts: every generation layer off.
 *
 * Features debug controls can turn layers back on without writing localStorage.
 */
export const DEFINING_WORLD_PLAZA_DEV_QA_GENERATION_FEATURE_BLANK_SLATE: Readonly<
  Record<DefiningWorldPlazaGenerationFeatureId, boolean>
> = Object.fromEntries(
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY.map((definition) => [
    definition.featureId,
    false,
  ])
) as Record<DefiningWorldPlazaGenerationFeatureId, boolean>;
