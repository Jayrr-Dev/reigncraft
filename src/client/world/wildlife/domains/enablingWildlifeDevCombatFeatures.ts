/**
 * Turns on wildlife + AI generation features for Dev spawn combat tests.
 *
 * Blank-slate Dev QA defaults both off (frozen punchbags). Spawning a species
 * to test aggression needs think/aggro ticks, so enable them for the session.
 *
 * @module components/world/wildlife/domains/enablingWildlifeDevCombatFeatures
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  checkingWorldPlazaGenerationFeatureEnabled,
  settingWorldPlazaGenerationFeatureEnabled,
} from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';

/** Enables Wildlife and Wildlife AI when either is off. */
export function enablingWildlifeDevCombatFeatures(): void {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE
    )
  ) {
    settingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE,
      true
    );
  }

  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_AI
    )
  ) {
    settingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE_AI,
      true
    );
  }
}
