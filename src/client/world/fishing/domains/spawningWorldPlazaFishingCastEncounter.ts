/**
 * Spawns fishing cast wildlife encounter instances into the wildlife store.
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
  readingWorldPlazaFishingCastEncounterLastAtMs,
  recordingWorldPlazaFishingCastEncounterAtMs,
} from '@/components/world/fishing/domains/managingWorldPlazaFishingCastEncounterCooldown';
import {
  resolvingWorldPlazaFishingCastEncounterRoll,
  type ResolvingWorldPlazaFishingCastEncounterMemberPlan,
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
      readonly instanceIds: readonly string[];
    }
  | { readonly outcome: 'failed' };

function buildingFishingCastEncounterThinkAnchor(
  packAnchorId: string,
  position: DefiningWorldPlazaWorldPoint,
  speciesId: ResolvingWorldPlazaFishingCastEncounterMemberPlan['speciesId'],
  packIndex: number,
  packSize: number
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: packAnchorId,
    tileX: Math.floor(position.x),
    tileY: Math.floor(position.y),
    speciesId,
    packIndex,
    packSize,
    seed: 0.37 + packIndex * 0.11,
  };
}

function resolvingFishingCastEncounterPackMemberPosition(
  basePosition: DefiningWorldPlazaWorldPoint,
  packIndex: number,
  packSize: number
): DefiningWorldPlazaWorldPoint {
  if (packIndex === 0) {
    return basePosition;
  }

  const angle = (packIndex / packSize) * Math.PI * 2 + 0.5;
  const distance = 1.5 + (packIndex % 2) * 0.8;

  return {
    x: basePosition.x + Math.cos(angle) * distance,
    y: basePosition.y + Math.sin(angle) * distance,
    layer: basePosition.layer,
  };
}

function applyingDocileFollowWindow(
  instance: DefiningWildlifeInstance,
  member: ResolvingWorldPlazaFishingCastEncounterMemberPlan
): DefiningWildlifeInstance {
  const followUntilMs = member.fishingCastEncounter.expiresAtMs;
  const encounterKind = member.fishingCastEncounter.kind;

  if (
    followUntilMs == null ||
    (encounterKind !== 'pinguin' &&
      encounterKind !== 'curious' &&
      !member.isTameableBondCandidate)
  ) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      docileFollowUntilMs: followUntilMs,
    },
  };
}

function spawningFishingCastEncounterMember({
  store,
  plan,
  member,
  packIndex,
  packSize,
  leaderPosition,
  nowMs,
  isDaytime,
  placedBlocks,
  placedBlocksByTile,
}: {
  readonly store: ManagingWildlifeInstanceStore;
  readonly plan: ResolvingWorldPlazaFishingCastEncounterPlan;
  readonly member: ResolvingWorldPlazaFishingCastEncounterMemberPlan;
  readonly packIndex: number;
  readonly packSize: number;
  readonly leaderPosition: DefiningWorldPlazaWorldPoint;
  readonly nowMs: number;
  readonly isDaytime: boolean;
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
  readonly placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile;
}): string | null {
  const species = resolvingWildlifeSpeciesDefinition(member.speciesId);

  if (!species) {
    return null;
  }

  const position = resolvingFishingCastEncounterPackMemberPosition(
    leaderPosition,
    packIndex,
    packSize
  );
  const instanceId = `wildlife:${plan.packAnchorId}:${packIndex}`;
  const thinkScheduleAnchor = buildingFishingCastEncounterThinkAnchor(
    plan.packAnchorId,
    position,
    member.speciesId,
    packIndex,
    packSize
  );
  const sizeScaleSample =
    resolvingWildlifeSizeBellCurveSampleFromAnchor(thinkScheduleAnchor);
  const sizeTiers = resolvingWildlifeInstanceSizeTierFromSample(
    sizeScaleSample,
    species
  );
  const instance = creatingWildlifeInstanceAtPosition({
    instanceId,
    anchorId: plan.packAnchorId,
    species,
    position,
    spawnAnchor: position,
    aggressionLevel: member.aggressionLevel,
    sleepScheduleSample:
      resolvingWildlifeSleepBellCurveSampleFromAnchor(thinkScheduleAnchor),
    sizeScaleSample,
    largeSizeFrame: resolvingWildlifeLargeSizeFrameFromAnchor(
      thinkScheduleAnchor,
      sizeTiers
    ),
    thinkScheduleAnchor,
    nowMs,
    temperamentOverrideId: member.temperamentOverrideId,
    fishingCastEncounter: member.fishingCastEncounter,
  });

  store.instances.set(instanceId, applyingDocileFollowWindow(instance, member));

  return instanceId;
}

/**
 * Rolls and, on hit, spawns off-screen fishing cast encounter animals.
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
    lastEncounterAtMs: readingWorldPlazaFishingCastEncounterLastAtMs(),
    rollUnit,
  });

  if (!plan) {
    return { outcome: 'skipped' };
  }

  const leaderSpecies = resolvingWildlifeSpeciesDefinition(
    plan.members[0]!.speciesId
  );

  if (!leaderSpecies) {
    return { outcome: 'failed' };
  }

  const leaderPosition = resolvingWorldPlazaFishingCastEncounterSpawnPosition({
    playerCenter,
    species: leaderSpecies,
    placementSeed: Math.floor(nowMs),
    isDaytime,
    placedBlocks,
    placedBlocksByTile,
  });

  if (!leaderPosition) {
    return { outcome: 'failed' };
  }

  const instanceIds: string[] = [];

  for (let packIndex = 0; packIndex < plan.members.length; packIndex += 1) {
    const member = plan.members[packIndex]!;

    const instanceId = spawningFishingCastEncounterMember({
      store,
      plan,
      member,
      packIndex,
      packSize: plan.members.length,
      leaderPosition,
      nowMs,
      isDaytime,
      placedBlocks,
      placedBlocksByTile,
    });

    if (instanceId) {
      instanceIds.push(instanceId);
    }
  }

  if (instanceIds.length === 0) {
    return { outcome: 'failed' };
  }

  recordingWorldPlazaFishingCastEncounterAtMs(nowMs);
  showingToast?.(plan.toast);

  return { outcome: 'spawned', plan, instanceIds };
}
