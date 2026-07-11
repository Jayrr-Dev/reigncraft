/**
 * Feature toggle for procedural (Graphics-baked) trees and rocks.
 *
 * When disabled, open-world tree and stone/column-rock resolvers return null so
 * terrain sync skips baking those Graphics. Placed player trees/blocks stay.
 *
 * @module components/world/domains/definingWorldPlazaProceduralTreesAndRocksFeatureConstants
 */

/** localStorage key for the procedural trees and rocks feature toggle. */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_STORAGE_KEY =
  'world-plaza-procedural-trees-and-rocks-enabled' as const;

/**
 * Default when no saved preference exists.
 * On by default so existing worlds keep forests and rocks.
 */
export const DEFINING_WORLD_PLAZA_PROCEDURAL_TREES_AND_ROCKS_FEATURE_DEFAULT_ENABLED = true;
