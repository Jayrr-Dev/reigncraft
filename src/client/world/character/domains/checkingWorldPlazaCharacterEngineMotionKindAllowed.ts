/**
 * Checks whether a motion kind is allowed for a character definition.
 *
 * @module components/world/character/domains/checkingWorldPlazaCharacterEngineMotionKindAllowed
 */

import type { DefiningWorldPlazaCharacterEngineDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import type { DefiningWorldPlazaAvatarMotionKind } from '@/components/world/domains/definingWorldPlazaAvatarMotionConstants';

/**
 * Returns true when the character may use the given motion kind.
 */
export function checkingWorldPlazaCharacterEngineMotionKindAllowed(
  definition: DefiningWorldPlazaCharacterEngineDefinition,
  motionKind: DefiningWorldPlazaAvatarMotionKind
): boolean {
  return definition.locomotion.allowedMotionKinds.includes(motionKind);
}

/**
 * Resolves whether the avatar should run for the current movement input.
 *
 * Run-only characters always run when moving; walk-only never run.
 */
export function resolvingWorldPlazaCharacterEngineShouldRun(
  definition: DefiningWorldPlazaCharacterEngineDefinition,
  isRunInputActive: boolean,
  isMoving: boolean
): boolean {
  if (!isMoving) {
    return false;
  }

  const allowsWalk = checkingWorldPlazaCharacterEngineMotionKindAllowed(
    definition,
    'walk'
  );
  const allowsRun = checkingWorldPlazaCharacterEngineMotionKindAllowed(
    definition,
    'run'
  );

  if (allowsRun && !allowsWalk) {
    return true;
  }

  if (!allowsRun) {
    return false;
  }

  return isRunInputActive;
}
