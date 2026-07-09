/**
 * Builds optional metadata for meat dropped from hostile deer kills.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeAggroDeerMeatDropMetadata
 */

import { checkingWildlifeInstanceQualifiesAsAggroDeerKill } from '@/components/world/wildlife/domains/checkingWildlifeInstanceQualifiesAsAggroDeerKill';
import { DEFINING_WILDLIFE_AGGRO_DEER_MEAT_METADATA_KEY } from '@/components/world/wildlife/domains/definingWildlifeAggroDeerMeatConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeAggroDeerMeatDropMetadataParams = {
  readonly instance: Pick<
    DefiningWildlifeInstance,
    'speciesId' | 'aggressionLevel' | 'aggroState'
  >;
  readonly species: DefiningWildlifeSpeciesDefinition;
  readonly killerTargetId: string | null | undefined;
  readonly playerUserId: string | null;
  readonly nowMs: number;
};

/** Metadata stamped on raw (and later cooked) meat from qualifying deer kills. */
export function resolvingWildlifeAggroDeerMeatDropMetadata({
  instance,
  species,
  killerTargetId,
  playerUserId,
  nowMs,
}: ResolvingWildlifeAggroDeerMeatDropMetadataParams):
  | Readonly<Record<string, unknown>>
  | undefined {
  if (!killerTargetId) {
    return undefined;
  }

  if (
    !checkingWildlifeInstanceQualifiesAsAggroDeerKill({
      instance,
      species,
      killerTargetId,
      playerUserId,
      nowMs,
    })
  ) {
    return undefined;
  }

  return {
    [DEFINING_WILDLIFE_AGGRO_DEER_MEAT_METADATA_KEY]: true,
  };
}
