/**
 * Deterministic spread roll for fire simulation (0..1).
 *
 * @param roomScope - Room scope string.
 * @param tickIndex - Simulation tick index.
 * @param fromTileX - Source fire tile X.
 * @param fromTileY - Source fire tile Y.
 * @param toTileX - Candidate neighbor tile X.
 * @param toTileY - Candidate neighbor tile Y.
 * @param worldLayer - World layer index.
 */
export function seedingWorldFireSpreadRoll(
  roomScope: string,
  tickIndex: number,
  fromTileX: number,
  fromTileY: number,
  toTileX: number,
  toTileY: number,
  worldLayer: number,
): number {
  const seedString = `${roomScope}:${tickIndex}:${fromTileX}:${fromTileY}:${toTileX}:${toTileY}:${worldLayer}`;
  let hash = 2166136261;

  for (let index = 0; index < seedString.length; index += 1) {
    hash ^= seedString.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) / 4294967296;
}
