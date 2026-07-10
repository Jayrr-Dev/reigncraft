import type { DefiningWildlifeFarmAnimalSfxClipId } from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import {
  DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_CLIP_IDS_BY_EVENT,
  type DefiningWildlifeFarmAnimalSfxPoolId,
} from '@/components/world/wildlife/domains/definingWildlifeFarmAnimalSfxConstants';
import type { DefiningWildlifeSpeciesSfxEventKind } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind';
import { resolvingWildlifeSpeciesSfxProfile } from '@/components/world/wildlife/domains/definingWildlifeSpeciesSfxProfileRegistry';

function resolvingWildlifeSpeciesSfxPoolIdForEvent(
  speciesId: string,
  eventKind: DefiningWildlifeSpeciesSfxEventKind,
  rotationIndex: number
): DefiningWildlifeFarmAnimalSfxPoolId | null {
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
  poolId: DefiningWildlifeFarmAnimalSfxPoolId,
  eventKind: DefiningWildlifeSpeciesSfxEventKind
): readonly DefiningWildlifeFarmAnimalSfxClipId[] {
  const poolEventClips =
    DEFINING_WILDLIFE_FARM_ANIMAL_SFX_POOL_CLIP_IDS_BY_EVENT[poolId];
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
): DefiningWildlifeFarmAnimalSfxClipId | null {
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
