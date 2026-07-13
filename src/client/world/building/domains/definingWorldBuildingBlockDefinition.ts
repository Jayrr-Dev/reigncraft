import type { DefiningWorldBuildingBlockPaletteSurface } from '@/components/world/building/domains/definingWorldBuildingBlockPaletteSurface';
import type { DefiningWorldBuildingCollisionShape } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import type { DefiningWorldPlazaEnvironmentalTemperatureLevel } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Block definition value objects for the building registry.
 *
 * @module components/world/building/domains/definingWorldBuildingBlockDefinition
 */

/** Natural terrain blocks (trees, rocks, water). */
export const DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL =
  'natural' as const;

/** Structural building blocks (walls, floors). */
export const DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC = 'basic' as const;

/** Interactive blocks (doors, chests, signs). */
export const DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL =
  'functional' as const;

/** Cosmetic-only blocks. */
export const DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE =
  'decorative' as const;

/** Block palette categories exposed to players. */
export type DefiningWorldBuildingBlockCategory =
  | typeof DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_NATURAL
  | typeof DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC
  | typeof DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_FUNCTIONAL
  | typeof DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_DECORATIVE;

/** Stable identifier persisted on placed blocks. */
export type DefiningWorldBuildingBlockDefinitionId = string;

/** Visual tuning for lightweight placeholder rendering. */
export interface DefiningWorldBuildingBlockVisualConfig {
  readonly label: string;
  /** Canonical fill color for Pixi world rendering and swatch fallback. */
  readonly fillColor: number;
  /** Canonical stroke color for Pixi world rendering and swatch fallback. */
  readonly strokeColor: number;
  readonly iconName?: string;
  /**
   * Optional palette swatch texture (image or CSS).
   * When set, the build palette renders this instead of the solid fill color.
   */
  readonly paletteSurface?: DefiningWorldBuildingBlockPaletteSurface;
}

/** Immutable block type definition from the registry. */
export interface DefiningWorldBuildingBlockDefinition {
  readonly id: DefiningWorldBuildingBlockDefinitionId;
  readonly name: string;
  readonly category: DefiningWorldBuildingBlockCategory;
  readonly collisionShape: DefiningWorldBuildingCollisionShape;
  readonly isInteractive: boolean;
  readonly visualConfig: DefiningWorldBuildingBlockVisualConfig;
  /**
   * When false, the block is hidden from the build palette but still resolvable
   * for placed blocks and procedural rendering. Defaults to true when omitted.
   */
  readonly isPaletteVisible?: boolean;
  /**
   * When true, the block may be placed on unclaimed land as a session-only build
   * that other players see but that is removed when the placer leaves.
   */
  readonly allowsSessionPlacementOutsideClaim?: boolean;
  /** Optional heat/cold level assigned to this block type (°C). */
  readonly environmentalTemperature?: DefiningWorldPlazaEnvironmentalTemperatureLevel;
}
