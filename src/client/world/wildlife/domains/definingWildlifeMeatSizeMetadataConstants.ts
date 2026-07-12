/**
 * Inventory / ground-item metadata keys for kill size stamped on wildlife meat.
 *
 * @module components/world/wildlife/domains/definingWildlifeMeatSizeMetadataConstants
 */

/** Discrete size σ tier of the animal that dropped this meat stack. */
export const DEFINING_WILDLIFE_MEAT_SIZE_TIER_METADATA_KEY =
  'sizeTier' as const;

/** Large-frame roll (`obese` | `apex`) when the kill had one; else omitted. */
export const DEFINING_WILDLIFE_MEAT_LARGE_SIZE_FRAME_METADATA_KEY =
  'largeSizeFrame' as const;
