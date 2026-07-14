/**
 * Declarative visual patterns for ore wall top faces and palette swatches.
 *
 * @module components/world/building/domains/definingWorldPlazaOreWallSurfaceRegistry
 */

import type { DefiningWorldBuildingBlockPaletteSurface } from '@/components/world/building/domains/definingWorldBuildingBlockPaletteSurface';
import { creatingWorldBuildingBlockCssPaletteSurface } from '@/components/world/building/domains/definingWorldBuildingBlockPaletteSurface';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

/** How the procedural top-face overlay is drawn. */
export type DefiningWorldPlazaOreWallSurfacePattern =
  | 'claySediment'
  | 'niterCrust'
  | 'coalFacet'
  | 'metalFlecks';

export type DefiningWorldPlazaOreWallSurfaceEntry = {
  readonly speciesId: WorldOreSpeciesId;
  readonly pattern: DefiningWorldPlazaOreWallSurfacePattern;
  /** Wall top/side base fill (more saturated than world vein rock). */
  readonly fillColor: number;
  /** Accent used by flecks / crusts / bright bands. */
  readonly accentColor: number;
  /** Secondary accent (copper teal, clay dark band, etc.). */
  readonly secondaryAccentColor: number;
  readonly paletteSurface: DefiningWorldBuildingBlockPaletteSurface;
};

/**
 * Per-ore wall look: distinct fills + pattern + Materials swatch.
 * Clay = sedimentary bands. Niter = chalk crust. Metals = flecks.
 */
export const DEFINING_WORLD_PLAZA_ORE_WALL_SURFACE_REGISTRY: readonly DefiningWorldPlazaOreWallSurfaceEntry[] =
  [
    {
      speciesId: 'clay',
      pattern: 'claySediment',
      fillColor: 0xc4895a,
      accentColor: 0xe0b07a,
      secondaryAccentColor: 0x8a5530,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'repeating-linear-gradient(180deg, #e0b07a 0 22%, #c4895a 22% 48%, #8a5530 48% 62%, #c4895a 62% 82%, #a86c42 82% 100%)'
      ),
    },
    {
      speciesId: 'iron',
      pattern: 'metalFlecks',
      fillColor: 0x6a5a52,
      accentColor: 0xc06a38,
      secondaryAccentColor: 0x8a4830,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'radial-gradient(circle at 30% 35%, #c06a38 0 12%, transparent 13%), radial-gradient(circle at 70% 60%, #8a4830 0 10%, transparent 11%), #6a5a52'
      ),
    },
    {
      speciesId: 'silver',
      pattern: 'metalFlecks',
      fillColor: 0x7a8690,
      accentColor: 0xf0f4f8,
      secondaryAccentColor: 0xc8d4e0,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'radial-gradient(circle at 28% 40%, #f0f4f8 0 10%, transparent 11%), radial-gradient(circle at 68% 55%, #c8d4e0 0 9%, transparent 10%), #7a8690'
      ),
    },
    {
      speciesId: 'gold',
      pattern: 'metalFlecks',
      fillColor: 0x7a6840,
      accentColor: 0xf0d040,
      secondaryAccentColor: 0xc89820,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'radial-gradient(circle at 35% 30%, #f0d040 0 11%, transparent 12%), radial-gradient(circle at 65% 65%, #c89820 0 10%, transparent 11%), #7a6840'
      ),
    },
    {
      speciesId: 'copper',
      pattern: 'metalFlecks',
      fillColor: 0x5a6e5e,
      accentColor: 0x40c0a0,
      secondaryAccentColor: 0xc87840,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'radial-gradient(circle at 30% 35%, #40c0a0 0 12%, transparent 13%), radial-gradient(circle at 72% 58%, #c87840 0 10%, transparent 11%), #5a6e5e'
      ),
    },
    {
      speciesId: 'coal',
      pattern: 'coalFacet',
      fillColor: 0x22262c,
      accentColor: 0x5a6068,
      secondaryAccentColor: 0x3a4048,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'linear-gradient(135deg, #3a4048 0 18%, #22262c 18% 45%, #5a6068 45% 52%, #1a1e24 52% 100%)'
      ),
    },
    {
      speciesId: 'niter',
      pattern: 'niterCrust',
      fillColor: 0x9aa090,
      accentColor: 0xf5f7ee,
      secondaryAccentColor: 0xe8ecd8,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'radial-gradient(circle at 25% 30%, #f5f7ee 0 14%, transparent 15%), radial-gradient(circle at 70% 40%, #e8ecd8 0 12%, transparent 13%), radial-gradient(circle at 45% 75%, #f5f7ee 0 10%, transparent 11%), #9aa090'
      ),
    },
    {
      speciesId: 'scarlet',
      pattern: 'metalFlecks',
      fillColor: 0x6a4048,
      accentColor: 0xe02830,
      secondaryAccentColor: 0xa01820,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'radial-gradient(circle at 32% 38%, #e02830 0 13%, transparent 14%), radial-gradient(circle at 68% 62%, #a01820 0 10%, transparent 11%), #6a4048'
      ),
    },
    {
      speciesId: 'lead',
      pattern: 'metalFlecks',
      fillColor: 0x4a5058,
      accentColor: 0xa8b4c0,
      secondaryAccentColor: 0x6a7888,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'radial-gradient(circle at 35% 35%, #a8b4c0 0 11%, transparent 12%), radial-gradient(circle at 62% 60%, #6a7888 0 12%, transparent 13%), #4a5058'
      ),
    },
    {
      speciesId: 'sulfur',
      pattern: 'metalFlecks',
      fillColor: 0x6a6238,
      accentColor: 0xf0d040,
      secondaryAccentColor: 0xc8a020,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface(
        'radial-gradient(circle at 30% 35%, #f0d040 0 14%, transparent 15%), radial-gradient(circle at 65% 60%, #c8a020 0 11%, transparent 12%), #6a6238'
      ),
    },
  ];

const DEFINING_WORLD_PLAZA_ORE_WALL_SURFACE_BY_SPECIES_ID = new Map<
  WorldOreSpeciesId,
  DefiningWorldPlazaOreWallSurfaceEntry
>(
  DEFINING_WORLD_PLAZA_ORE_WALL_SURFACE_REGISTRY.map((entry) => [
    entry.speciesId,
    entry,
  ])
);

/**
 * Resolves wall surface visuals for one ore species.
 */
export function resolvingWorldPlazaOreWallSurfaceEntry(
  speciesId: WorldOreSpeciesId
): DefiningWorldPlazaOreWallSurfaceEntry {
  const entry =
    DEFINING_WORLD_PLAZA_ORE_WALL_SURFACE_BY_SPECIES_ID.get(speciesId);

  return (
    entry ?? {
      speciesId: 'clay',
      pattern: 'claySediment',
      fillColor: 0xc4895a,
      accentColor: 0xe0b07a,
      secondaryAccentColor: 0x8a5530,
      paletteSurface: creatingWorldBuildingBlockCssPaletteSurface('#c4895a'),
    }
  );
}
