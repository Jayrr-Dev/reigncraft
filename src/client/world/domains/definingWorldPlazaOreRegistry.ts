/**
 * Declarative ore vein visuals for column rocks.
 *
 * @module components/world/domains/definingWorldPlazaOreRegistry
 */

import type { DefiningWorldPlazaStonePalette } from '@/components/world/domains/definingWorldPlazaStoneDecorationConstants';
import type { WorldOreSpeciesId } from '../../../shared/worldOreRarity';

export type DefiningWorldPlazaOreVeinEntry = {
  readonly speciesId: WorldOreSpeciesId;
  readonly palette: DefiningWorldPlazaStonePalette;
};

/**
 * Body/highlight fills for ore-bearing column rocks.
 * Distinct tints so veins read against grey stone at a glance.
 */
export const DEFINING_WORLD_PLAZA_ORE_VEIN_REGISTRY: readonly DefiningWorldPlazaOreVeinEntry[] =
  [
    {
      speciesId: 'clay',
      palette: { bodyColor: 0xc4895a, highlightColor: 0xe0b07a },
    },
    {
      speciesId: 'iron',
      palette: { bodyColor: 0x6e5a52, highlightColor: 0xb06a3c },
    },
    {
      speciesId: 'silver',
      palette: { bodyColor: 0x7a848e, highlightColor: 0xd0d8e0 },
    },
    {
      speciesId: 'gold',
      palette: { bodyColor: 0x7a6a48, highlightColor: 0xe0c040 },
    },
    {
      speciesId: 'copper',
      palette: { bodyColor: 0x5a6e62, highlightColor: 0x3cb090 },
    },
    {
      speciesId: 'coal',
      palette: { bodyColor: 0x2e3238, highlightColor: 0x5a6068 },
    },
    {
      speciesId: 'niter',
      palette: { bodyColor: 0x9aa090, highlightColor: 0xf5f7ee },
    },
    {
      speciesId: 'scarlet',
      palette: { bodyColor: 0x6e4850, highlightColor: 0xd03038 },
    },
    {
      speciesId: 'lead',
      palette: { bodyColor: 0x4a5058, highlightColor: 0x8a96a4 },
    },
    {
      speciesId: 'sulfur',
      palette: { bodyColor: 0x6a6238, highlightColor: 0xf0d040 },
    },
  ];

const DEFINING_WORLD_PLAZA_ORE_VEIN_BY_SPECIES_ID = new Map<
  WorldOreSpeciesId,
  DefiningWorldPlazaOreVeinEntry
>(
  DEFINING_WORLD_PLAZA_ORE_VEIN_REGISTRY.map((entry) => [
    entry.speciesId,
    entry,
  ])
);

/**
 * Resolves the stone palette for one ore species.
 */
export function resolvingWorldPlazaOreVeinPalette(
  speciesId: WorldOreSpeciesId
): DefiningWorldPlazaStonePalette {
  const entry = DEFINING_WORLD_PLAZA_ORE_VEIN_BY_SPECIES_ID.get(speciesId);

  return (
    entry?.palette ?? {
      bodyColor: 0x767d87,
      highlightColor: 0x9ea5af,
    }
  );
}
