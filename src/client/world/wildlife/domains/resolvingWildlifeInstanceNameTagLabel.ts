/**
 * Resolves the display label and color for one wildlife name tag.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstanceNameTagLabel
 */

import {
  mappingWorldPlazaGrassSeededUnitToIntegerRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_NAME_TAG_ADJECTIVE_PICK_SALT,
  DEFINING_WILDLIFE_NAME_TAG_TIER_CONFIG,
} from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';

export type ResolvingWildlifeInstanceNameTagLabelResult = {
  displayLabel: string;
  textColor: string;
};

function pickingWildlifeNameTagAdjective(
  spawnAnchorX: number,
  spawnAnchorY: number,
  sizeTier: number,
  adjectives: readonly string[]
): string {
  const tileX = Math.floor(spawnAnchorX);
  const tileY = Math.floor(spawnAnchorY);
  const pickRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WILDLIFE_NAME_TAG_ADJECTIVE_PICK_SALT + sizeTier
  );
  const adjectiveIndex = mappingWorldPlazaGrassSeededUnitToIntegerRange(
    pickRoll,
    0,
    adjectives.length - 1
  );

  return adjectives[adjectiveIndex] ?? adjectives[0] ?? '';
}

/** Builds the generated name-tag label from size tier and species display name. */
export function resolvingWildlifeGeneratedNameTagLabel(
  instance: Pick<
    DefiningWildlifeInstance,
    'sizeScaleSample' | 'spawnAnchor'
  >,
  species: Pick<DefiningWildlifeSpeciesDefinition, 'displayName' | 'sizeSpawn'>
): ResolvingWildlifeInstanceNameTagLabelResult {
  const sizeTier = resolvingWildlifeInstanceSizeTierFromSample(
    instance.sizeScaleSample,
    species
  );
  const tierConfig = DEFINING_WILDLIFE_NAME_TAG_TIER_CONFIG[sizeTier];
  const speciesName = species.displayName;

  if (tierConfig.prefix) {
    return {
      displayLabel: `${tierConfig.prefix} ${speciesName}`,
      textColor: tierConfig.color,
    };
  }

  if (tierConfig.adjectives && tierConfig.adjectives.length > 0) {
    const adjective = pickingWildlifeNameTagAdjective(
      instance.spawnAnchor.x,
      instance.spawnAnchor.y,
      sizeTier,
      tierConfig.adjectives
    );

    return {
      displayLabel: `${adjective} ${speciesName}`,
      textColor: tierConfig.color,
    };
  }

  return {
    displayLabel: speciesName,
    textColor: tierConfig.color,
  };
}

/**
 * Resolves the label shown above a wildlife sprite.
 * Player renames override the generated text but keep tier color.
 */
export function resolvingWildlifeInstanceNameTagLabel(
  instance: Pick<
    DefiningWildlifeInstance,
    'customDisplayName' | 'sizeScaleSample' | 'spawnAnchor'
  >,
  species: Pick<DefiningWildlifeSpeciesDefinition, 'displayName' | 'sizeSpawn'>
): ResolvingWildlifeInstanceNameTagLabelResult {
  const generated = resolvingWildlifeGeneratedNameTagLabel(instance, species);
  const trimmedCustomName = instance.customDisplayName?.trim();

  if (trimmedCustomName) {
    return {
      displayLabel: trimmedCustomName,
      textColor: generated.textColor,
    };
  }

  return generated;
}
