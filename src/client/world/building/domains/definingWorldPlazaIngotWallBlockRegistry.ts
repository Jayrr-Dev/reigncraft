/**
 * Declarative placeable walls for refined (ingot) metals.
 * Solid tile collision; Materials palette under Refined.
 *
 * @module components/world/building/domains/definingWorldPlazaIngotWallBlockRegistry
 */

import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_REFINED } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_REGISTRY,
  type DefiningWorldPlazaIngotWallMetalId,
  resolvingWorldPlazaIngotWallSurfaceEntry,
} from '@/components/world/building/domains/definingWorldPlazaIngotWallSurfaceRegistry';

/** Player-facing refined wall names. */
const DEFINING_WORLD_PLAZA_INGOT_WALL_NAME_BY_METAL_ID: Record<
  DefiningWorldPlazaIngotWallMetalId,
  string
> = {
  iron: 'Iron',
  copper: 'Copper',
  silver: 'Silver',
  gold: 'Gold',
  lead: 'Lead',
  steel: 'Steel',
};

const DEFINING_WORLD_PLAZA_INGOT_METAL_ID_SET = new Set<string>(
  DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_REGISTRY.map((entry) => entry.metalId)
);

/**
 * Builds the persisted block definition id for one refined metal wall.
 */
export function formattingWorldPlazaIngotWallBlockDefinitionId(
  metalId: DefiningWorldPlazaIngotWallMetalId
): `basic:wall:ingot-${DefiningWorldPlazaIngotWallMetalId}` {
  return `basic:wall:ingot-${metalId}`;
}

/**
 * True when a block definition id is a refined ingot wall.
 */
export function checkingWorldBuildingBlockDefinitionIdIsIngotWall(
  definitionId: string
): boolean {
  return definitionId.startsWith('basic:wall:ingot-');
}

/**
 * Parses metal id from an ingot wall block definition id.
 */
export function resolvingWorldPlazaIngotMetalIdFromWallBlockDefinitionId(
  definitionId: string
): DefiningWorldPlazaIngotWallMetalId | null {
  if (!checkingWorldBuildingBlockDefinitionIdIsIngotWall(definitionId)) {
    return null;
  }

  const metalId = definitionId.slice('basic:wall:ingot-'.length);

  if (!DEFINING_WORLD_PLAZA_INGOT_METAL_ID_SET.has(metalId)) {
    return null;
  }

  return metalId as DefiningWorldPlazaIngotWallMetalId;
}

function darkeningWorldPlazaIngotWallStrokeColor(fillColor: number): number {
  const red = Math.floor(((fillColor >> 16) & 0xff) * 0.42);
  const green = Math.floor(((fillColor >> 8) & 0xff) * 0.42);
  const blue = Math.floor((fillColor & 0xff) * 0.42);

  return (red << 16) | (green << 8) | blue;
}

/** Exported block id constants. */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_IRON =
  formattingWorldPlazaIngotWallBlockDefinitionId('iron');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_COPPER =
  formattingWorldPlazaIngotWallBlockDefinitionId('copper');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_SILVER =
  formattingWorldPlazaIngotWallBlockDefinitionId('silver');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_GOLD =
  formattingWorldPlazaIngotWallBlockDefinitionId('gold');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_LEAD =
  formattingWorldPlazaIngotWallBlockDefinitionId('lead');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_INGOT_STEEL =
  formattingWorldPlazaIngotWallBlockDefinitionId('steel');

/**
 * Builds solid wall definitions for every refined metal.
 */
export function registeringWorldPlazaIngotWallBlockDefinitions(): Record<
  string,
  DefiningWorldBuildingBlockDefinition
> {
  const definitions: Record<string, DefiningWorldBuildingBlockDefinition> = {};

  for (const surfaceSeed of DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_REGISTRY) {
    const surface = resolvingWorldPlazaIngotWallSurfaceEntry(
      surfaceSeed.metalId
    );
    const definitionId = formattingWorldPlazaIngotWallBlockDefinitionId(
      surface.metalId
    );

    definitions[definitionId] = {
      id: definitionId,
      name: DEFINING_WORLD_PLAZA_INGOT_WALL_NAME_BY_METAL_ID[surface.metalId],
      category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_REFINED,
      collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK,
      isInteractive: false,
      visualConfig: {
        label: 'Metal',
        fillColor: surface.fillColor,
        strokeColor: darkeningWorldPlazaIngotWallStrokeColor(surface.fillColor),
        paletteSurface: surface.paletteSurface,
      },
    };
  }

  return definitions;
}
