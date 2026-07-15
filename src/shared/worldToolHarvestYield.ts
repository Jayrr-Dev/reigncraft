/**
 * Per-tool-tier harvest yield: layers removed per swing and resource per layer.
 * Ability order for yield: wood → gold → iron → steel.
 */

export const WORLD_TOOL_HARVEST_TIERS = [
  'wood',
  'iron',
  'steel',
  'gold',
] as const;

export type WorldToolHarvestTier = (typeof WORLD_TOOL_HARVEST_TIERS)[number];

export type WorldToolHarvestYieldStats = {
  readonly layersPerSwing: number;
  readonly yieldPerLayerMin: number;
  readonly yieldPerLayerMax: number;
};

/** Declarative yield by held-item material tier. */
export const WORLD_TOOL_HARVEST_YIELD_BY_TIER: Record<
  WorldToolHarvestTier,
  WorldToolHarvestYieldStats
> = {
  wood: {
    layersPerSwing: 1,
    yieldPerLayerMin: 1,
    yieldPerLayerMax: 1,
  },
  gold: {
    layersPerSwing: 2,
    yieldPerLayerMin: 1,
    yieldPerLayerMax: 5,
  },
  iron: {
    layersPerSwing: 2,
    yieldPerLayerMin: 2,
    yieldPerLayerMax: 2,
  },
  steel: {
    layersPerSwing: 3,
    yieldPerLayerMin: 3,
    yieldPerLayerMax: 3,
  },
};

/**
 * Whether a string is a known harvest tool tier.
 */
export function checkingWorldToolHarvestTier(
  value: string
): value is WorldToolHarvestTier {
  return (WORLD_TOOL_HARVEST_TIERS as readonly string[]).includes(value);
}

/**
 * Resolves yield stats for a tool tier. Missing/unknown → wood baseline.
 */
export function resolvingWorldToolHarvestYieldStats(
  toolTier: string | null | undefined
): WorldToolHarvestYieldStats {
  if (toolTier && checkingWorldToolHarvestTier(toolTier)) {
    return WORLD_TOOL_HARVEST_YIELD_BY_TIER[toolTier];
  }

  return WORLD_TOOL_HARVEST_YIELD_BY_TIER.wood;
}

/**
 * Rolls resource granted per layer for one successful harvest swing.
 */
export function computingWorldToolHarvestYieldPerLayer(
  stats: WorldToolHarvestYieldStats,
  random: () => number = Math.random
): number {
  const min = Math.max(0, Math.floor(stats.yieldPerLayerMin));
  const max = Math.max(min, Math.floor(stats.yieldPerLayerMax));

  if (min === max) {
    return min;
  }

  const span = max - min + 1;
  const roll = Math.min(0.999999, Math.max(0, random()));

  return min + Math.floor(roll * span);
}

/**
 * Resolves layers-per-swing + rolled resource-per-layer for a tool tier.
 */
export function resolvingWorldToolHarvestSwingYield(
  toolTier: string | null | undefined,
  random: () => number = Math.random
): {
  readonly layersPerSwing: number;
  readonly resourcePerLayer: number;
} {
  const stats = resolvingWorldToolHarvestYieldStats(toolTier);

  return {
    layersPerSwing: Math.max(1, Math.floor(stats.layersPerSwing)),
    resourcePerLayer: computingWorldToolHarvestYieldPerLayer(stats, random),
  };
}
