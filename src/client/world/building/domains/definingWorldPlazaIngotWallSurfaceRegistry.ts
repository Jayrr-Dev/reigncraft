/**
 * Declarative polished wall surfaces for refined (ingot) metal blocks.
 *
 * @module components/world/building/domains/definingWorldPlazaIngotWallSurfaceRegistry
 */

import type { DefiningWorldBuildingBlockPaletteSurface } from '@/components/world/building/domains/definingWorldBuildingBlockPaletteSurface';
import { creatingWorldBuildingBlockCssPaletteSurface } from '@/components/world/building/domains/definingWorldBuildingBlockPaletteSurface';

/** Placeable refined metal ids (mercury stays liquid, not a wall). */
export type DefiningWorldPlazaIngotWallMetalId =
  | 'iron'
  | 'copper'
  | 'silver'
  | 'gold'
  | 'lead'
  | 'steel';

export type DefiningWorldPlazaIngotWallSurfaceEntry = {
  readonly metalId: DefiningWorldPlazaIngotWallMetalId;
  /** Compatible with ore-wall metal fleck draw (polished highlights). */
  readonly pattern: 'metalFlecks';
  readonly fillColor: number;
  readonly accentColor: number;
  readonly secondaryAccentColor: number;
  readonly paletteSurface: DefiningWorldBuildingBlockPaletteSurface;
};

/**
 * Cleaner, brighter fills than raw ore walls (smelted metal look).
 */
export const DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_REGISTRY: readonly DefiningWorldPlazaIngotWallSurfaceEntry[] =
  [
    {
      metalId: 'iron',
      pattern: 'metalFlecks',
      fillColor: 0x8a9098,
      accentColor: 0xd8dce2,
      secondaryAccentColor: 0x5a6068,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'linear-gradient(135deg, #d8dce2 0 18%, #8a9098 18% 55%, #5a6068 55% 72%, #a8b0b8 72% 100%)'
      ),
    },
    {
      metalId: 'copper',
      pattern: 'metalFlecks',
      fillColor: 0xc87840,
      accentColor: 0xf0b070,
      secondaryAccentColor: 0x8a4820,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'linear-gradient(135deg, #f0b070 0 16%, #c87840 16% 52%, #8a4820 52% 70%, #e09858 70% 100%)'
      ),
    },
    {
      metalId: 'silver',
      pattern: 'metalFlecks',
      fillColor: 0xc8d0d8,
      accentColor: 0xffffff,
      secondaryAccentColor: 0x8898a8,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'linear-gradient(135deg, #ffffff 0 14%, #c8d0d8 14% 50%, #8898a8 50% 68%, #e8eef4 68% 100%)'
      ),
    },
    {
      metalId: 'gold',
      pattern: 'metalFlecks',
      fillColor: 0xe0b028,
      accentColor: 0xffe878,
      secondaryAccentColor: 0xa87810,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'linear-gradient(135deg, #ffe878 0 16%, #e0b028 16% 52%, #a87810 52% 70%, #f0c848 70% 100%)'
      ),
    },
    {
      metalId: 'lead',
      pattern: 'metalFlecks',
      fillColor: 0x6a727c,
      accentColor: 0xb0bcc8,
      secondaryAccentColor: 0x3a424c,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'linear-gradient(135deg, #b0bcc8 0 14%, #6a727c 14% 55%, #3a424c 55% 72%, #8a949e 72% 100%)'
      ),
    },
    {
      metalId: 'steel',
      pattern: 'metalFlecks',
      fillColor: 0x708090,
      accentColor: 0xe0e8f0,
      secondaryAccentColor: 0x3a4858,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'linear-gradient(135deg, #e0e8f0 0 12%, #708090 12% 48%, #3a4858 48% 65%, #98a8b8 65% 100%)'
      ),
    },
  ];

const DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_BY_METAL_ID = new Map<
  DefiningWorldPlazaIngotWallMetalId,
  DefiningWorldPlazaIngotWallSurfaceEntry
>(
  DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_REGISTRY.map((entry) => [
    entry.metalId,
    entry,
  ])
);

/**
 * Resolves polished wall visuals for one refined metal.
 */
export function resolvingWorldPlazaIngotWallSurfaceEntry(
  metalId: DefiningWorldPlazaIngotWallMetalId
): DefiningWorldPlazaIngotWallSurfaceEntry {
  const entry = DEFINING_WORLD_PLAZA_INGOT_WALL_SURFACE_BY_METAL_ID.get(metalId);

  return (
    entry ?? {
      metalId: 'iron',
      pattern: 'metalFlecks',
      fillColor: 0x8a9098,
      accentColor: 0xd8dce2,
      secondaryAccentColor: 0x5a6068,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface('#8a9098'),
    }
  );
}
