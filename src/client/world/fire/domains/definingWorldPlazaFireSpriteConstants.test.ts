import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import { WORLD_CAMPFIRE_BURN_TIER_FLAME_SCALE_MULTIPLIER } from '../../../../shared/worldCampfireFuel';
import {
  DEFINING_WORLD_PLAZA_FIRE_FLAME_NATIVE_FRAME_HEIGHT_PX_BY_TIER,
  resolvingWorldPlazaFireFlameDisplayScaleForTier,
} from './definingWorldPlazaFireSpriteConstants';

describe('resolvingWorldPlazaFireFlameDisplayScaleForTier', () => {
  it('grows effective campfire flame height as wood tier increases', () => {
    const burnMultipliers = [
      WORLD_CAMPFIRE_BURN_TIER_FLAME_SCALE_MULTIPLIER.weak,
      WORLD_CAMPFIRE_BURN_TIER_FLAME_SCALE_MULTIPLIER.small,
      WORLD_CAMPFIRE_BURN_TIER_FLAME_SCALE_MULTIPLIER.small,
      WORLD_CAMPFIRE_BURN_TIER_FLAME_SCALE_MULTIPLIER.mid,
      WORLD_CAMPFIRE_BURN_TIER_FLAME_SCALE_MULTIPLIER.big,
      WORLD_CAMPFIRE_BURN_TIER_FLAME_SCALE_MULTIPLIER.big,
    ] as const;

    const effectiveHeights = ([1, 2, 3, 4, 5] as const).map((tier) => {
      const burnMultiplier = burnMultipliers[tier];
      const displayScale =
        resolvingWorldPlazaFireFlameDisplayScaleForTier(tier) * burnMultiplier;
      const nativeHeight =
        DEFINING_WORLD_PLAZA_FIRE_FLAME_NATIVE_FRAME_HEIGHT_PX_BY_TIER[tier];

      return nativeHeight * displayScale;
    });

    for (let index = 1; index < effectiveHeights.length; index += 1) {
      assert.ok(
        effectiveHeights[index]! > effectiveHeights[index - 1]!,
        `tier ${index + 1} height ${effectiveHeights[index]} should exceed tier ${index} height ${effectiveHeights[index - 1]}`
      );
    }
  });
});
