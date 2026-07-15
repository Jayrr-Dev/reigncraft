/**
 * Builds live forage / graze eat overlay entries above wildlife.
 *
 * @module components/world/wildlife/domains/updatingWildlifeForageEatOverlaysRef
 */

import { computingWildlifeForageEatProgressRatio } from '@/components/world/wildlife/domains/computingWildlifeForageEatProgressRatio';
import { DEFINING_WILDLIFE_GRAZE_OVERLAY_PROGRESS_RATIO } from '@/components/world/wildlife/domains/definingWildlifeForageEatOverlayConstants';
import type { DefiningWildlifeForageEatOverlay } from '@/components/world/wildlife/domains/definingWildlifeForageEatOverlayTypes';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeScale } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceCombatPresentation';
import { computingWildlifeJumpArcLiftPx } from '@/components/world/wildlife/domains/resolvingWildlifeJumpPlan';
import { resolvingWildlifeForageEatOverlayIcon } from '@/components/world/wildlife/domains/resolvingWildlifeForageEatOverlayIcon';
import { resolvingWildlifeSpeciesSpritePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesSpritePresentation';

export type UpdatingWildlifeForageEatOverlaysRefParams = {
  outRef: DefiningWildlifeForageEatOverlay[];
  instances: readonly DefiningWildlifeInstance[];
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

/**
 * Rewrites `outRef` with one eat overlay per foraging / grazing animal.
 */
export function updatingWildlifeForageEatOverlaysRef({
  outRef,
  instances,
  nowMs,
  resolveSpecies,
}: UpdatingWildlifeForageEatOverlaysRefParams): void {
  outRef.length = 0;

  for (const instance of instances) {
    if (instance.isDead) {
      continue;
    }

    const progressIcon = resolvingWildlifeForageEatOverlayIcon(
      instance.aiState.intent
    );

    if (!progressIcon) {
      continue;
    }

    const species = resolveSpecies(instance.speciesId);

    if (!species) {
      continue;
    }

    const sizeScale = resolvingWildlifeInstanceSizeScale(species, instance);
    const frameHeightPx =
      resolvingWildlifeSpeciesSpritePresentation(species).frameHeightPx;
    const jumpArcOffsetPx = instance.aiState.jumpState
      ? computingWildlifeJumpArcLiftPx(
          species.jump.jumpArcPeakPx,
          instance.aiState.jumpState.progress
        )
      : 0;
    const progressRatio =
      instance.aiState.intent.mode === 'graze'
        ? DEFINING_WILDLIFE_GRAZE_OVERLAY_PROGRESS_RATIO
        : computingWildlifeForageEatProgressRatio(instance, nowMs);

    outRef.push({
      instanceId: instance.instanceId,
      gridX: instance.position.x,
      gridY: instance.position.y,
      layer: instance.position.layer ?? 1,
      sizeScale,
      frameHeightPx,
      jumpArcOffsetPx,
      progressRatio,
      progressIcon,
    });
  }
}
