/**
 * Meat loot quantity for obese large wildlife.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeLargeSizeFrameMeatDropQuantity
 */

import {
  mappingWorldPlazaGrassSeededUnitToIntegerRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_OBESE_MEAT_DROP_QUANTITY_PICK_SALT,
  checkingWildlifeSizeTierHasLargeSizeFrame,
  type DefiningWildlifeLargeSizeFrame,
} from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';

/** Resolves how many raw-meat stacks drop from one kill. */
export function resolvingWildlifeMeatDropQuantity(
  instance: Pick<
    DefiningWildlifeInstance,
    'largeSizeFrame' | 'sizeScaleSample' | 'spawnAnchor'
  >,
  species: Pick<DefiningWildlifeSpeciesDefinition, 'loot' | 'sizeSpawn'>
): number {
  const baseQuantity = species.loot.quantity;

  if (baseQuantity <= 0) {
    return 0;
  }

  const sizeTier = resolvingWildlifeInstanceSizeTierFromSample(
    instance.sizeScaleSample,
    species
  );

  if (
    instance.largeSizeFrame !== 'obese' ||
    !checkingWildlifeSizeTierHasLargeSizeFrame(sizeTier)
  ) {
    return baseQuantity;
  }

  const roll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    Math.floor(instance.spawnAnchor.x),
    Math.floor(instance.spawnAnchor.y),
    DEFINING_WILDLIFE_OBESE_MEAT_DROP_QUANTITY_PICK_SALT + sizeTier
  );

  if (sizeTier === 1) {
    return mappingWorldPlazaGrassSeededUnitToIntegerRange(roll, 2, 3);
  }

  if (sizeTier === 2) {
    return mappingWorldPlazaGrassSeededUnitToIntegerRange(roll, 3, 5);
  }

  return mappingWorldPlazaGrassSeededUnitToIntegerRange(roll, 4, 5);
}

export function checkingWildlifeLargeSizeFrameIsObese(
  largeSizeFrame: DefiningWildlifeLargeSizeFrame | null | undefined
): boolean {
  return largeSizeFrame === 'obese';
}
