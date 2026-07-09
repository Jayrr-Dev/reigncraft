/**
 * Mass-biased stalk prey pick weights: smaller prey are more likely.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPreyPickWeight
 */

import {
  DEFINING_WILDLIFE_STALK_PREY_PICK_FAVORITE_WEIGHT_MULTIPLIER,
  DEFINING_WILDLIFE_STALK_PREY_PICK_MASS_FLOOR_KG,
  DEFINING_WILDLIFE_STALK_PREY_PICK_MASS_WEIGHT_EXPONENT,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

export type ResolvingWildlifeStalkPreyPickWeightParams = {
  massKg: number;
  isFavoritePrey?: boolean;
};

/**
 * Returns a positive pick weight. Lower mass yields higher weight; favorites
 * get an extra multiplier on top of the mass bias.
 */
export function resolvingWildlifeStalkPreyPickWeight({
  massKg,
  isFavoritePrey = false,
}: ResolvingWildlifeStalkPreyPickWeightParams): number {
  const clampedMassKg = Math.max(
    DEFINING_WILDLIFE_STALK_PREY_PICK_MASS_FLOOR_KG,
    massKg
  );
  const massWeight =
    1 /
    Math.pow(
      clampedMassKg,
      DEFINING_WILDLIFE_STALK_PREY_PICK_MASS_WEIGHT_EXPONENT
    );
  const favoriteMultiplier = isFavoritePrey
    ? DEFINING_WILDLIFE_STALK_PREY_PICK_FAVORITE_WEIGHT_MULTIPLIER
    : 1;

  return massWeight * favoriteMultiplier;
}
