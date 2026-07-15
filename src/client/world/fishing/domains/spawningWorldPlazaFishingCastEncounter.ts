/**
 * Spawns one fishing cast wildlife encounter instance into the wildlife store.
 *
 * @module components/world/fishing/domains/spawningWorldPlazaFishingCastEncounter
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import {
  LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_TOAST,
  LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_TOAST,
  LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PREDATOR_TOAST,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingCastEncounterConstants';
import {
  resolvingWorldPlazaFishingCastEncounterRoll,
  type ResolvingWorldPlazaFishingCastEncounterPlan,
} from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCastEncounterRoll';
import { resolvingWorldPlazaFishingCastEncounterSpawnPosition } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCastEncounterSpawnPosition';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpawnAnchor,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  creatingWildlifeInstanceAtPosition,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';
import { resolvingWildlifeLargeSizeFrameFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameFromAnchor';
import { resolvingWildlifeSizeBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSizeBellCurveSampleFromAnchor';
import { resolvingWildlifeSleepBellCurveSampleFromAnchor } from '@/components/world/wildlife/domains/resolvingWildlifeSleepBellCurveSampleFromAnchor';

export type SpawningWorldPlazaFishingCastEncounterParams = {
  readonly store: ManagingWildlifeInstanceStore;
  readonly playerCenter: DefiningWorldPlazaWorldPoint;
  readonly biomeKind: DefiningWorldPlazaBiomeKind;
  readonly nowMs: number;
  readonly isDaytime: boolean;
  readonly placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
  readonly showingToast?: (message: string) => void;
  readonly rollUnit?: () => number;
};

export type SpawningWorldPlazaFishingCastEncounterResult =
  | { readonly outcome: 'skipped' }
  | {
      readonly outcome: 'spawned';
      readonly plan: ResolvingWorldPlazaFishingCastEncounterPlan;
      readonly instanceId: string;
    }
  | { readonly outcome: 'failed' };

function buildingFishingCastEncounterThinkAnchor(
  instanceId: string,
  position: DefiningWorldPlazaWorldPoint,
  speciesId: ResolvingWorldPlazaFishingCastEncounterPlan['speciesId']
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: instanceId,
    tileX: Math.floor(position.x),
    tileY: Math.floor(position.y),
    speciesId,
    packIndex: 0,
    packSize: 1,
    seed: 0.37,
  };
}

function resolvingFishingCastEncounterToast(
  plan: ResolvingWorldPlazaFishingCastEncounterPlan
): string {
  if (plan.fishingCastEncounter.kind === 'predator') {
    return LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PREDATOR_TOAST;
  }

  if (plan.fishingCastEncounter.kind === 'pinguin') {
    return LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_TOAST;
  }

  return LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_TOAST;
}

/**
 * Rolls and, on hit, spawns one off-screen fishing cast encounter animal.
 */
export function spawningWorldPlazaFishingCastEncounter({
  store,
  playerCenter,
  biomeKind,
  nowMs,
  isDaytime,
  placedBlocks = [],
  placedBlocksByTile,
  showingToast,
  rollUnit,
}: SpawningWorldPlazaFishingCastEncounterParams): SpawningWorldPlazaFishingCastEncounterResult {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.WILDLIFE
    )
  ) {
    return { outcome: 'skipped' };
  }

  const plan = resolvingWorldPlazaFishingCastEncounterRoll({
    biomeKind,
    nowMs,
    rollUnit,
  });

  if (!plan) {
    return { outcome: 'skipped' };
  }

  const species = resolvingWildlifeSpeciesDefinition(plan.speciesId);

  if (!species) {
    return { outcome: 'failed' };
  }

  const position = resolvingWorldPlazaFishingCastEncounterSpawnPosition({
    playerCenter,
    species,
    placementSeed: Math.floor(nowMs),
    isDaytime,
    placedBlocks,
    placedBlocksByTile,
  });

  if (!position) {
    return { outcome: 'failed' };
  }

  const instanceId = `wildlife:fishing-cast:${plan.speciesId}:${nowMs}`;
  const thinkScheduleAnchor = buildingFishingCastEncounterThinkAnchor(
    instanceId,
    position,
    plan.speciesId
  );
  const sizeScaleSample =
    resolvingWildlifeSizeBellCurveSampleFromAnchor(thinkScheduleAnchor);
  const sizeTiers = resolvingWildlifeInstanceSizeTierFromSample(
    sizeScaleSample,
    species
  );
  const followUntilMs = plan.fishingCastEncounter.expiresAtMs;
  const instance = creatingWildlifeInstanceAtPosition({
    instanceId,
    anchorId: instanceId,
    species,
    position,
    spawnAnchor: position,
    aggressionLevel: plan.aggressionLevel,
    sleepScheduleSample:
      resolvingWildlifeSleepBellCurveSampleFromAnchor(thinkScheduleAnchor),
    sizeScaleSample,
    largeSizeFrame: resolvingWildlifeLargeSizeFrameFromAnchor(
      thinkScheduleAnchor,
      sizeTiers
    ),
    thinkScheduleAnchor,
    nowMs,
    temperamentOverrideId: plan.temperamentOverrideId,
    fishingCastEncounter: plan.fishingCastEncounter,
  });

  const withFollow: DefiningWildlifeInstance =
    plan.fishingCastEncounter.kind === 'pinguin' && followUntilMs != null
      ? {
          ...instance,
          aiState: {
            ...instance.aiState,
            docileFollowUntilMs: followUntilMs,
          },
        }
      : instance;

  store.instances.set(instanceId, withFollow);
  showingToast?.(resolvingFishingCastEncounterToast(plan));

  return { outcome: 'spawned', plan, instanceId };
}
