/** Metadata key on flammable blocks after fire fuel is exhausted. */
export const WORLD_BURN_STAGE_METADATA_KEY = 'burnStage' as const;

/** Persisted burn stage when a block has finished burning. */
export const WORLD_BURN_STAGE_BURNT = 'burnt' as const;

export type WorldBurnPersistedStage = typeof WORLD_BURN_STAGE_BURNT;

/**
 * Returns true when block metadata marks the tile as burnt out.
 */
export function checkingWorldBurnStageMetadataIsBurnt(
  metadata: Record<string, string | number | boolean | null> | null | undefined
): boolean {
  return metadata?.[WORLD_BURN_STAGE_METADATA_KEY] === WORLD_BURN_STAGE_BURNT;
}
