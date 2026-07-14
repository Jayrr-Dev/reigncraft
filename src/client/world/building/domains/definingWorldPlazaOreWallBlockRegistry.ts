/**
 * Declarative placeable wall blocks for each ore species.
 * Mirrors `basic:wall:stone`: solid tile collision, free Materials palette.
 *
 * @module components/world/building/domains/definingWorldPlazaOreWallBlockRegistry
 */

import type { DefiningWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  DEFINING_WORLD_PLAZA_ORE_WALL_SURFACE_REGISTRY,
  resolvingWorldPlazaOreWallSurfaceEntry,
} from '@/components/world/building/domains/definingWorldPlazaOreWallSurfaceRegistry';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';
import { WORLD_ORE_SPECIES_RARITY_REGISTRY } from '../../../../shared/worldOreRarity';

/** Player-facing wall names (match inventory ore labels). */
const DEFINING_WORLD_PLAZA_ORE_WALL_NAME_BY_SPECIES_ID: Record<
  WorldOreSpeciesId,
  string
> = {
  clay: 'Clay',
  iron: 'Iron ore',
  silver: 'Silver ore',
  gold: 'Gold ore',
  copper: 'Copper ore',
  coal: 'Coal ore',
  niter: 'Niter ore',
  scarlet: 'Scarlet ore',
  lead: 'Lead ore',
  sulfur: 'Sulfur ore',
};

const DEFINING_WORLD_PLAZA_ORE_SPECIES_ID_SET = new Set<string>(
  WORLD_ORE_SPECIES_RARITY_REGISTRY.map((entry) => entry.speciesId)
);

/**
 * Builds the persisted block definition id for one ore wall.
 */
export function formattingWorldPlazaOreWallBlockDefinitionId(
  speciesId: WorldOreSpeciesId
): `basic:wall:ore-${WorldOreSpeciesId}` {
  return `basic:wall:ore-${speciesId}`;
}

/**
 * True when a block definition id is an ore wall (stone-style placeable).
 */
export function checkingWorldBuildingBlockDefinitionIdIsOreWall(
  definitionId: string
): boolean {
  return definitionId.startsWith('basic:wall:ore-');
}

/**
 * Parses ore species from an ore wall block definition id.
 */
export function resolvingWorldPlazaOreSpeciesIdFromWallBlockDefinitionId(
  definitionId: string
): WorldOreSpeciesId | null {
  if (!checkingWorldBuildingBlockDefinitionIdIsOreWall(definitionId)) {
    return null;
  }

  const speciesId = definitionId.slice('basic:wall:ore-'.length);

  if (!DEFINING_WORLD_PLAZA_ORE_SPECIES_ID_SET.has(speciesId)) {
    return null;
  }

  return speciesId as WorldOreSpeciesId;
}

function darkeningWorldPlazaOreWallStrokeColor(fillColor: number): number {
  const red = Math.floor(((fillColor >> 16) & 0xff) * 0.42);
  const green = Math.floor(((fillColor >> 8) & 0xff) * 0.42);
  const blue = Math.floor((fillColor & 0xff) * 0.42);

  return (red << 16) | (green << 8) | blue;
}

/** Exported block id constants (same order as ore sprite sheet). */
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_CLAY =
  formattingWorldPlazaOreWallBlockDefinitionId('clay');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_IRON =
  formattingWorldPlazaOreWallBlockDefinitionId('iron');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_SILVER =
  formattingWorldPlazaOreWallBlockDefinitionId('silver');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_GOLD =
  formattingWorldPlazaOreWallBlockDefinitionId('gold');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_COPPER =
  formattingWorldPlazaOreWallBlockDefinitionId('copper');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_COAL =
  formattingWorldPlazaOreWallBlockDefinitionId('coal');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_NITER =
  formattingWorldPlazaOreWallBlockDefinitionId('niter');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_SCARLET =
  formattingWorldPlazaOreWallBlockDefinitionId('scarlet');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_LEAD =
  formattingWorldPlazaOreWallBlockDefinitionId('lead');
export const DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_WALL_ORE_SULFUR =
  formattingWorldPlazaOreWallBlockDefinitionId('sulfur');

/**
 * Builds stone-style wall definitions for every ore species.
 */
export function registeringWorldPlazaOreWallBlockDefinitions(): Record<
  string,
  DefiningWorldBuildingBlockDefinition
> {
  const definitions: Record<string, DefiningWorldBuildingBlockDefinition> = {};

  for (const surfaceSeed of DEFINING_WORLD_PLAZA_ORE_WALL_SURFACE_REGISTRY) {
    const surface = resolvingWorldPlazaOreWallSurfaceEntry(
      surfaceSeed.speciesId
    );
    const fillColor = surface.fillColor;
    const definitionId = formattingWorldPlazaOreWallBlockDefinitionId(
      surface.speciesId
    );

    definitions[definitionId] = {
      id: definitionId,
      name: DEFINING_WORLD_PLAZA_ORE_WALL_NAME_BY_SPECIES_ID[surface.speciesId],
      category: DEFINING_WORLD_BUILDING_BLOCK_CATEGORY_BASIC,
      collisionShape: DEFINING_WORLD_BUILDING_COLLISION_SHAPE_TILE_BLOCK,
      isInteractive: false,
      visualConfig: {
        label: 'Wall',
        fillColor,
        strokeColor: darkeningWorldPlazaOreWallStrokeColor(fillColor),
        paletteSurface: surface.paletteSurface,
      },
    };
  }

  return definitions;
}
