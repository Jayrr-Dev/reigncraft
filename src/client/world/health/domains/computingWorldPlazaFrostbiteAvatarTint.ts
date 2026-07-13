/**
 * Avatar tint for frostbite stages.
 * Freezing+ blends toward icy blue; intensity scales with stacks up to max.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteAvatarTint
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_ICY_AVATAR_TINT,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';
import { resolvingWorldPlazaEntityFrostbiteStageDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';

/** Default Pixi white tint (no status color). */
export const COMPUTING_WORLD_PLAZA_FROSTBITE_AVATAR_TINT_NONE = 0xffffff;

const FROSTBITE_AVATAR_TINT_START_STACKS =
  resolvingWorldPlazaEntityFrostbiteStageDescriptor('freezing').minStacks;

function mixingWorldPlazaFrostbiteAvatarTintChannel(
  fromChannel: number,
  toChannel: number,
  mixRatio: number
): number {
  return Math.round(fromChannel + (toChannel - fromChannel) * mixRatio);
}

function mixingWorldPlazaFrostbiteAvatarTintRgb(
  fromTint: number,
  toTint: number,
  mixRatio: number
): number {
  const clampedRatio = Math.min(1, Math.max(0, mixRatio));
  const fromRed = (fromTint >> 16) & 0xff;
  const fromGreen = (fromTint >> 8) & 0xff;
  const fromBlue = fromTint & 0xff;
  const toRed = (toTint >> 16) & 0xff;
  const toGreen = (toTint >> 8) & 0xff;
  const toBlue = toTint & 0xff;

  return (
    (mixingWorldPlazaFrostbiteAvatarTintChannel(fromRed, toRed, clampedRatio) <<
      16) |
    (mixingWorldPlazaFrostbiteAvatarTintChannel(
      fromGreen,
      toGreen,
      clampedRatio
    ) <<
      8) |
    mixingWorldPlazaFrostbiteAvatarTintChannel(fromBlue, toBlue, clampedRatio)
  );
}

/**
 * Icy tint intensity from Freezing stacks to max stacks (0 = white, 1 = full icy).
 */
export function computingWorldPlazaFrostbiteAvatarTintIntensity(
  stackCount: number
): number {
  if (stackCount < FROSTBITE_AVATAR_TINT_START_STACKS) {
    return 0;
  }

  const clampedStacks = Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS,
    stackCount
  );

  return (
    clampedStacks / DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_MAX_STACKS
  );
}

/**
 * Returns a Pixi sprite tint for frostbite stacks, or white below Freezing.
 */
export function computingWorldPlazaFrostbiteAvatarTint(
  stackCount: number
): number {
  const intensity = computingWorldPlazaFrostbiteAvatarTintIntensity(stackCount);

  if (intensity <= 0) {
    return COMPUTING_WORLD_PLAZA_FROSTBITE_AVATAR_TINT_NONE;
  }

  return mixingWorldPlazaFrostbiteAvatarTintRgb(
    COMPUTING_WORLD_PLAZA_FROSTBITE_AVATAR_TINT_NONE,
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_ICY_AVATAR_TINT,
    intensity
  );
}
