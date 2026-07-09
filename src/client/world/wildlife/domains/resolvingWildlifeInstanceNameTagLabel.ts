/**
 * Resolves the display label and color for one wildlife name tag.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeInstanceNameTagLabel
 */

import {
  mappingWorldPlazaGrassSeededUnitToIntegerRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import { checkingWildlifeIsAggressiveChicken } from '@/components/world/wildlife/domains/checkingWildlifeIsAggressiveChicken';
import {
  DEFINING_WILDLIFE_AGGRESSION_NAME_TAG_AGGRESSIVE_PREFIXES,
  DEFINING_WILDLIFE_AGGRESSION_NAME_TAG_PREFIX_PICK_SALT,
  DEFINING_WILDLIFE_AGGRESSION_NAME_TAG_TAME_PREFIXES,
} from '@/components/world/wildlife/domains/definingWildlifeAggressionNameTagConstants';
import { DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_DISPLAY_NAME } from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import {
  DEFINING_WILDLIFE_LARGE_SIZE_FRAME_NAME_TAG_PREFIX_PICK_SALT,
  checkingWildlifeSizeTierHasLargeSizeFrame,
  resolvingWildlifeLargeSizeFrameNameTagPrefixPool,
  type DefiningWildlifeLargeSizeFrame,
} from '@/components/world/wildlife/domains/definingWildlifeLargeSizeFrameConstants';
import type {
  DefiningWildlifeNameTagPartValue,
  DefiningWildlifeSizeTier,
} from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import {
  DEFINING_WILDLIFE_NAME_TAG_PREFIX_PICK_SALT,
  DEFINING_WILDLIFE_NAME_TAG_SUFFIX_PICK_SALT,
  DEFINING_WILDLIFE_NAME_TAG_TIER_CONFIG,
} from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';

export type ResolvingWildlifeInstanceNameTagLabelResult = {
  displayLabel: string;
  textColor: string;
};

type ResolvingWildlifeNameTagTierParts = {
  namePrefix: DefiningWildlifeNameTagPartValue;
  nameSuffix: DefiningWildlifeNameTagPartValue;
  color: string;
};

function pickingWildlifeNameTagPartFromPool(
  spawnAnchorX: number,
  spawnAnchorY: number,
  sizeTier: number,
  pickSalt: number,
  options: readonly string[]
): string {
  const tileX = Math.floor(spawnAnchorX);
  const tileY = Math.floor(spawnAnchorY);
  const pickRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    pickSalt + sizeTier
  );
  const optionIndex = mappingWorldPlazaGrassSeededUnitToIntegerRange(
    pickRoll,
    0,
    options.length - 1
  );

  return options[optionIndex] ?? options[0] ?? '';
}

function resolvingWildlifeNameTagPart(
  partValue: DefiningWildlifeNameTagPartValue,
  spawnAnchorX: number,
  spawnAnchorY: number,
  sizeTier: number,
  pickSalt: number
): string | null {
  if (partValue == null) {
    return null;
  }

  if (typeof partValue === 'string') {
    const trimmedPart = partValue.trim();

    return trimmedPart.length > 0 ? trimmedPart : null;
  }

  if (partValue.length === 0) {
    return null;
  }

  const pickedPart = pickingWildlifeNameTagPartFromPool(
    spawnAnchorX,
    spawnAnchorY,
    sizeTier,
    pickSalt,
    partValue
  );
  const trimmedPart = pickedPart.trim();

  return trimmedPart.length > 0 ? trimmedPart : null;
}

function resolvingWildlifeNameTagTierParts(
  sizeTier: DefiningWildlifeSizeTier,
  species?: Pick<DefiningWildlifeSpeciesDefinition, 'nameTag'>
): ResolvingWildlifeNameTagTierParts {
  const tierConfig = DEFINING_WILDLIFE_NAME_TAG_TIER_CONFIG[sizeTier];
  const tierOverride = species?.nameTag?.tiers?.[sizeTier];

  return {
    namePrefix:
      tierOverride && 'namePrefix' in tierOverride
        ? (tierOverride.namePrefix ?? null)
        : tierConfig.namePrefix,
    nameSuffix:
      tierOverride && 'nameSuffix' in tierOverride
        ? (tierOverride.nameSuffix ?? null)
        : tierConfig.nameSuffix,
    color: tierConfig.color,
  };
}

function resolvingWildlifeSpeciesNameTagBaseName(
  species: Pick<DefiningWildlifeSpeciesDefinition, 'displayName' | 'nameTag'>
): string {
  const configuredName = species.nameTag?.name?.trim();

  return configuredName && configuredName.length > 0
    ? configuredName
    : species.displayName;
}

/** Joins prefix, base name, and suffix into one name-tag label. */
export function buildingWildlifeNameTagDisplayLabel(
  name: string,
  namePrefix: string | null,
  nameSuffix: string | null
): string {
  return [namePrefix, name, nameSuffix].filter(Boolean).join(' ');
}

function joiningWildlifeNameTagPrefixes(
  ...prefixes: readonly (string | null)[]
): string | null {
  const joinedPrefix = prefixes.filter(Boolean).join(' ');

  return joinedPrefix.length > 0 ? joinedPrefix : null;
}

function resolvingWildlifeLargeSizeFrameNameTagPrefix(
  largeSizeFrame: DefiningWildlifeLargeSizeFrame,
  sizeTier: DefiningWildlifeSizeTier,
  spawnAnchorX: number,
  spawnAnchorY: number
): string | null {
  return resolvingWildlifeNameTagPart(
    resolvingWildlifeLargeSizeFrameNameTagPrefixPool(largeSizeFrame, sizeTier),
    spawnAnchorX,
    spawnAnchorY,
    sizeTier,
    DEFINING_WILDLIFE_LARGE_SIZE_FRAME_NAME_TAG_PREFIX_PICK_SALT
  );
}

function resolvingWildlifeAggressionNameTagPrefix(
  aggressionLevel: DefiningWildlifeAggressionLevel,
  spawnAnchorX: number,
  spawnAnchorY: number,
  sizeTier: number
): string | null {
  if (aggressionLevel === 'normal') {
    return null;
  }

  const prefixPool =
    aggressionLevel === 'aggressive'
      ? DEFINING_WILDLIFE_AGGRESSION_NAME_TAG_AGGRESSIVE_PREFIXES
      : DEFINING_WILDLIFE_AGGRESSION_NAME_TAG_TAME_PREFIXES;

  return resolvingWildlifeNameTagPart(
    prefixPool,
    spawnAnchorX,
    spawnAnchorY,
    sizeTier,
    DEFINING_WILDLIFE_AGGRESSION_NAME_TAG_PREFIX_PICK_SALT
  );
}

/** Builds the generated name-tag label from size tier and species name parts. */
export function resolvingWildlifeGeneratedNameTagLabel(
  instance: Pick<
    DefiningWildlifeInstance,
    | 'aggressionLevel'
    | 'largeSizeFrame'
    | 'sizeScaleSample'
    | 'spawnAnchor'
    | 'speciesId'
  >,
  species: Pick<
    DefiningWildlifeSpeciesDefinition,
    'displayName' | 'sizeSpawn' | 'nameTag'
  >
): ResolvingWildlifeInstanceNameTagLabelResult {
  const sizeTier = resolvingWildlifeInstanceSizeTierFromSample(
    instance.sizeScaleSample,
    species
  );
  const tierParts = resolvingWildlifeNameTagTierParts(sizeTier, species);

  if (checkingWildlifeIsAggressiveChicken(instance)) {
    return {
      displayLabel: DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_DISPLAY_NAME,
      textColor: tierParts.color,
    };
  }

  const speciesName = resolvingWildlifeSpeciesNameTagBaseName(species);
  const aggressionPrefix = resolvingWildlifeAggressionNameTagPrefix(
    instance.aggressionLevel,
    instance.spawnAnchor.x,
    instance.spawnAnchor.y,
    sizeTier
  );
  const sizePrefix =
    instance.largeSizeFrame &&
    checkingWildlifeSizeTierHasLargeSizeFrame(sizeTier)
      ? resolvingWildlifeLargeSizeFrameNameTagPrefix(
          instance.largeSizeFrame,
          sizeTier,
          instance.spawnAnchor.x,
          instance.spawnAnchor.y
        )
      : resolvingWildlifeNameTagPart(
          tierParts.namePrefix,
          instance.spawnAnchor.x,
          instance.spawnAnchor.y,
          sizeTier,
          DEFINING_WILDLIFE_NAME_TAG_PREFIX_PICK_SALT
        );
  const nameSuffix = resolvingWildlifeNameTagPart(
    tierParts.nameSuffix,
    instance.spawnAnchor.x,
    instance.spawnAnchor.y,
    sizeTier,
    DEFINING_WILDLIFE_NAME_TAG_SUFFIX_PICK_SALT
  );

  return {
    displayLabel: buildingWildlifeNameTagDisplayLabel(
      speciesName,
      joiningWildlifeNameTagPrefixes(aggressionPrefix, sizePrefix),
      nameSuffix
    ),
    textColor: tierParts.color,
  };
}

/**
 * Resolves the label shown above a wildlife sprite.
 * Player renames override the generated text but keep tier color.
 */
export function resolvingWildlifeInstanceNameTagLabel(
  instance: Pick<
    DefiningWildlifeInstance,
    | 'aggressionLevel'
    | 'customDisplayName'
    | 'largeSizeFrame'
    | 'sizeScaleSample'
    | 'spawnAnchor'
    | 'speciesId'
  >,
  species: Pick<
    DefiningWildlifeSpeciesDefinition,
    'displayName' | 'sizeSpawn' | 'nameTag'
  >
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
