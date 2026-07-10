/**
 * Rotating clip indices for pooled species vocal SFX events.
 *
 * @module components/world/wildlife/domains/managingWildlifeSpeciesSfxRotationStore
 */

const managingWildlifeSpeciesSfxRotationIndices = new Map<string, number>();

function resolvingWildlifeSpeciesSfxRotationKey(
  speciesId: string,
  eventKind: string
): string {
  return `${speciesId}:${eventKind}`;
}

/**
 * Returns the current rotation index for one species event.
 */
export function gettingWildlifeSpeciesSfxRotationIndex(
  speciesId: string,
  eventKind: string
): number {
  return (
    managingWildlifeSpeciesSfxRotationIndices.get(
      resolvingWildlifeSpeciesSfxRotationKey(speciesId, eventKind)
    ) ?? 0
  );
}

/**
 * Advances the rotation index after one pooled clip plays.
 */
export function advancingWildlifeSpeciesSfxRotationIndex(
  speciesId: string,
  eventKind: string,
  poolLength: number
): number {
  if (poolLength <= 0) {
    return 0;
  }

  const rotationKey = resolvingWildlifeSpeciesSfxRotationKey(
    speciesId,
    eventKind
  );
  const nextIndex =
    (gettingWildlifeSpeciesSfxRotationIndex(speciesId, eventKind) + 1) %
    poolLength;
  managingWildlifeSpeciesSfxRotationIndices.set(rotationKey, nextIndex);

  return nextIndex;
}

/** Resets every rotation counter (used on hook teardown). */
export function resettingWildlifeSpeciesSfxRotationIndices(): void {
  managingWildlifeSpeciesSfxRotationIndices.clear();
}
