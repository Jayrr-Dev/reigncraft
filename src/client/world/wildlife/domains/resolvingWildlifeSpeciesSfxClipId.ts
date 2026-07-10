import type { DefiningWildlifeBeastSfxPoolId } from '@/components/world/wildlife/domains/definingWildlifeBeastSfxConstants';
import { DEFINING_WILDLIFE_BEAST_SFX_POOL_CLIP_IDS_BY_EVENT } from '@/components/world/wildlife/domains/definingWildlifeBeastSfxConstants';
import { DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_CLIP_IDS_BY_EVENT } from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import type { DefiningWildlifeMixkitWildSfxPoolId } from '@/components/world/wildlife/domains/definingWildlifeMixkitWildSfxConstants';
import { DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_CLIP_IDS_BY_EVENT } from '@/components/world/wildlife/domains/definingWildlifeMixkitWildSfxConstants';
import type { DefiningWildlifePixabayWildSfxPoolId } from '@/components/world/wildlife/domains/definingWildlifePixabayWildSfxConstants';
import { DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_CLIP_IDS_BY_EVENT } from '@/components/world/wildlife/domains/definingWildlifePixabayWildSfxConstants';
import type {
  DefiningWildlifeSpeciesSfxClipId,
  DefiningWildlifeSpeciesSfxPoolId,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxClipTypes';
import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';
import { resolvingWildlifeSpeciesSfxProfile } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry';

function checkingWildlifeSpeciesSfxMixkitPoolId(
  poolId: DefiningWildlifeSpeciesSfxPoolId
): poolId is DefiningWildlifeMixkitWildSfxPoolId {
  return poolId in DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_CLIP_IDS_BY_EVENT;
}

function checkingWildlifeSpeciesSfxPixabayPoolId(
  poolId: DefiningWildlifeSpeciesSfxPoolId
): poolId is DefiningWildlifePixabayWildSfxPoolId {
  return poolId in DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_CLIP_IDS_BY_EVENT;
}

function checkingWildlifeSpeciesSfxBeastPoolId(
  poolId: DefiningWildlifeSpeciesSfxPoolId
): poolId is DefiningWildlifeBeastSfxPoolId {
  return poolId in DEFINING_WILDLIFE_BEAST_SFX_POOL_CLIP_IDS_BY_EVENT;
}

/** Resolves which vocal pool plays for one event and rotation index. */
export function resolvingWildlifeSpeciesSfxPoolIdForEvent(
  speciesId: string,
  eventKind: DefiningWildlifeSpeciesSfxEventKind,
  rotationIndex: number
): DefiningWildlifeSpeciesSfxPoolId | null {
  const profile = resolvingWildlifeSpeciesSfxProfile(speciesId);

  if (!profile) {
    return null;
  }

  if (
    profile.secondaryPoolId &&
    profile.secondaryEventKinds?.includes(eventKind)
  ) {
    return rotationIndex % 2 === 0 ? profile.poolId : profile.secondaryPoolId;
  }

  return profile.poolId;
}

function resolvingWildlifeSpeciesSfxClipIdsForPoolEvent(
  poolId: DefiningWildlifeSpeciesSfxPoolId,
  eventKind: DefiningWildlifeSpeciesSfxEventKind
): readonly DefiningWildlifeSpeciesSfxClipId[] {
  const poolEventClips = checkingWildlifeSpeciesSfxMixkitPoolId(poolId)
    ? DEFINING_WILDLIFE_MIXKIT_WILD_SFX_POOL_CLIP_IDS_BY_EVENT[poolId]
    : checkingWildlifeSpeciesSfxPixabayPoolId(poolId)
      ? DEFINING_WILDLIFE_PIXABAY_WILD_SFX_POOL_CLIP_IDS_BY_EVENT[poolId]
      : checkingWildlifeSpeciesSfxBeastPoolId(poolId)
        ? DEFINING_WILDLIFE_BEAST_SFX_POOL_CLIP_IDS_BY_EVENT[poolId]
        : DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_CLIP_IDS_BY_EVENT[poolId];
  const eventClips = poolEventClips[eventKind];

  if (eventClips && eventClips.length > 0) {
    return eventClips;
  }

  const idleClips = poolEventClips.idle_ambient;

  return idleClips ?? [];
}

/**
 * Resolves the clip id for one species SFX event and rotation index.
 */
export function resolvingWildlifeSpeciesSfxClipId(
  speciesId: string,
  eventKind: DefiningWildlifeSpeciesSfxEventKind,
  rotationIndex: number
): DefiningWildlifeSpeciesSfxClipId | null {
  const poolId = resolvingWildlifeSpeciesSfxPoolIdForEvent(
    speciesId,
    eventKind,
    rotationIndex
  );

  if (!poolId) {
    return null;
  }

  const clipIds = resolvingWildlifeSpeciesSfxClipIdsForPoolEvent(
    poolId,
    eventKind
  );

  if (clipIds.length === 0) {
    return null;
  }

  return clipIds[rotationIndex % clipIds.length] ?? clipIds[0] ?? null;
}

/**
 * Returns pool length for one species event rotation.
 */
export function resolvingWildlifeSpeciesSfxClipPoolLength(
  speciesId: string,
  eventKind: DefiningWildlifeSpeciesSfxEventKind
): number {
  const poolId = resolvingWildlifeSpeciesSfxPoolIdForEvent(
    speciesId,
    eventKind,
    0
  );

  if (!poolId) {
    return 0;
  }

  return resolvingWildlifeSpeciesSfxClipIdsForPoolEvent(poolId, eventKind)
    .length;
}

function listingWildlifeSpeciesSfxPoolIdsForEvent(
  speciesId: string,
  eventKind: DefiningWildlifeSpeciesSfxEventKind
): readonly DefiningWildlifeSpeciesSfxPoolId[] {
  const profile = resolvingWildlifeSpeciesSfxProfile(speciesId);

  if (!profile) {
    return [];
  }

  if (
    profile.secondaryPoolId &&
    profile.secondaryEventKinds?.includes(eventKind)
  ) {
    return [profile.poolId, profile.secondaryPoolId];
  }

  return [profile.poolId];
}

/**
 * Lists every vocal clip id a species can play from its enabled events.
 */
export function listingWildlifeSpeciesSfxClipIdsForSpecies(
  speciesId: string
): readonly DefiningWildlifeSpeciesSfxClipId[] {
  const profile = resolvingWildlifeSpeciesSfxProfile(speciesId);

  if (!profile) {
    return [];
  }

  const clipIdSet = new Set<DefiningWildlifeSpeciesSfxClipId>();

  for (const eventKind of profile.enabledEventKinds) {
    for (const poolId of listingWildlifeSpeciesSfxPoolIdsForEvent(
      speciesId,
      eventKind
    )) {
      for (const clipId of resolvingWildlifeSpeciesSfxClipIdsForPoolEvent(
        poolId,
        eventKind
      )) {
        clipIdSet.add(clipId);
      }
    }
  }

  return [...clipIdSet];
}

/**
 * Dedupes vocal clip ids across many species (boot biome roster, etc.).
 */
export function listingWildlifeSpeciesSfxClipIdsForSpeciesIds(
  speciesIds: readonly string[]
): readonly DefiningWildlifeSpeciesSfxClipId[] {
  const clipIdSet = new Set<DefiningWildlifeSpeciesSfxClipId>();

  for (const speciesId of speciesIds) {
    for (const clipId of listingWildlifeSpeciesSfxClipIdsForSpecies(
      speciesId
    )) {
      clipIdSet.add(clipId);
    }
  }

  return [...clipIdSet];
}
