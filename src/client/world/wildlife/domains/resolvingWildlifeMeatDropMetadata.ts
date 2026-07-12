/**
 * Builds inventory metadata stamped on wildlife meat ground drops.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeMeatDropMetadata
 */

import {
  DEFINING_WILDLIFE_MEAT_LARGE_SIZE_FRAME_METADATA_KEY,
  DEFINING_WILDLIFE_MEAT_SIZE_TIER_METADATA_KEY,
} from '@/components/world/wildlife/domains/definingWildlifeMeatSizeMetadataConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeAggroDeerMeatDropMetadata } from '@/components/world/wildlife/domains/resolvingWildlifeAggroDeerMeatDropMetadata';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';

export type ResolvingWildlifeMeatDropMetadataParams = {
  readonly instance: Pick<
    DefiningWildlifeInstance,
    | 'speciesId'
    | 'sizeScaleSample'
    | 'largeSizeFrame'
    | 'aggressionLevel'
    | 'aggroState'
  >;
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly killerTargetId: string | null | undefined;
  readonly playerUserId: string | null;
  readonly nowMs: number;
};

/**
 * Always stamps kill size; merges aggro-deer disease tag when the kill qualifies.
 */
export function resolvingWildlifeMeatDropMetadata({
  instance,
  species,
  killerTargetId,
  playerUserId,
  nowMs,
}: ResolvingWildlifeMeatDropMetadataParams): Readonly<Record<string, unknown>> {
  const sizeTier = resolvingWildlifeInstanceSizeTierFromSample(
    instance.sizeScaleSample,
    species
  );
  const metadata: Record<string, unknown> = {
    [DEFINING_WILDLIFE_MEAT_SIZE_TIER_METADATA_KEY]: sizeTier,
  };

  if (instance.largeSizeFrame) {
    metadata[DEFINING_WILDLIFE_MEAT_LARGE_SIZE_FRAME_METADATA_KEY] =
      instance.largeSizeFrame;
  }

  const aggroDeerMetadata = resolvingWildlifeAggroDeerMeatDropMetadata({
    instance,
    species,
    killerTargetId,
    playerUserId,
    nowMs,
  });

  if (aggroDeerMetadata) {
    Object.assign(metadata, aggroDeerMetadata);
  }

  return metadata;
}
