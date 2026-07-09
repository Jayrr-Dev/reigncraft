/**
 * Declarative avatar animations for timed tool actions (chopping, mining, ...).
 *
 * Each tool action maps to an existing registered motion clip per skin, so new
 * actions reuse sprite strips without new loaders. Assign a dedicated clip per
 * skin later by adding a `bySkinId` override (or pointing at a new clip suffix
 * once dedicated strips exist).
 *
 * @module components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry
 */

import type { DefiningWorldPlazaAvatarMotionClipSuffix } from '@/components/world/animation/domains/formattingWorldPlazaAnimationClipIds';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';

/** Known tool action ids driving avatar animations. */
export type DefiningWorldPlazaAvatarToolActionId =
  | 'tree-chop'
  | 'rock-mine'
  | 'pebble-pick'
  | 'eat';

/** Live tool action the local avatar is performing (null when none). */
export type DefiningWorldPlazaAvatarToolAction = {
  readonly toolActionId: DefiningWorldPlazaAvatarToolActionId;
  /** Grid-space point the avatar faces while performing the action. */
  readonly targetGridX: number;
  readonly targetGridY: number;
};

/** Which registered clip plays for one tool action, and how fast. */
export type DefiningWorldPlazaAvatarToolActionClipAssignment = {
  readonly clipSuffix: DefiningWorldPlazaAvatarMotionClipSuffix;
  readonly animationFps: number;
};

/** Animation config for one tool action with optional per-skin overrides. */
export type DefiningWorldPlazaAvatarToolActionAnimationDefinition = {
  readonly defaultAssignment: DefiningWorldPlazaAvatarToolActionClipAssignment;
  readonly bySkinId?: Partial<
    Record<
      DefiningWorldPlazaAvatarSkinId,
      DefiningWorldPlazaAvatarToolActionClipAssignment
    >
  >;
};

/**
 * Tool action animation registry.
 *
 * The girl (`girl-sample`) reuses her ReadyIdle strip sped up so chopping reads
 * as active work; swap the assignment here once a dedicated chop strip exists.
 */
export const DEFINING_WORLD_PLAZA_AVATAR_TOOL_ACTION_ANIMATION_REGISTRY: Record<
  DefiningWorldPlazaAvatarToolActionId,
  DefiningWorldPlazaAvatarToolActionAnimationDefinition
> = {
  'tree-chop': {
    defaultAssignment: {
      clipSuffix: 'idle',
      animationFps: 12,
    },
    bySkinId: {
      'girl-sample': {
        clipSuffix: 'idle',
        animationFps: 12,
      },
    },
  },
  'rock-mine': {
    defaultAssignment: {
      clipSuffix: 'idle',
      animationFps: 12,
    },
    bySkinId: {
      'girl-sample': {
        clipSuffix: 'idle',
        animationFps: 12,
      },
    },
  },
  'pebble-pick': {
    defaultAssignment: {
      clipSuffix: 'idle',
      animationFps: 10,
    },
    bySkinId: {
      'girl-sample': {
        clipSuffix: 'idle',
        animationFps: 10,
      },
    },
  },
  eat: {
    defaultAssignment: {
      clipSuffix: 'idle',
      animationFps: 8,
    },
    bySkinId: {
      'girl-sample': {
        clipSuffix: 'idle',
        animationFps: 8,
      },
    },
  },
};

/**
 * Resolves the clip assignment for a tool action on one skin.
 */
export function resolvingWorldPlazaAvatarToolActionClipAssignment(
  toolActionId: DefiningWorldPlazaAvatarToolActionId,
  skinId: DefiningWorldPlazaAvatarSkinId
): DefiningWorldPlazaAvatarToolActionClipAssignment {
  const definition =
    DEFINING_WORLD_PLAZA_AVATAR_TOOL_ACTION_ANIMATION_REGISTRY[toolActionId];

  return definition.bySkinId?.[skinId] ?? definition.defaultAssignment;
}
