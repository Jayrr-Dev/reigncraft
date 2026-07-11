/**
 * Cuts wildlife vocals when an instance dies.
 *
 * Death cry clips are not shipped yet; this only silences in-flight vocals so
 * idle/combat calls do not keep playing over a corpse.
 *
 * @module components/world/wildlife/domains/notifyingWildlifeVocalSfxOnDeath
 */

import { notifyingWildlifeInstanceVocalSfxSilence } from '@/components/world/wildlife/domains/notifyingWildlifeInstanceVocalSfxSilence';

export type NotifyingWildlifeVocalSfxOnDeathParams = {
  instanceId: string;
  wasDead: boolean;
  isDead: boolean;
};

/**
 * Silences active vocals on the live→dead edge.
 */
export function notifyingWildlifeVocalSfxOnDeath({
  instanceId,
  wasDead,
  isDead,
}: NotifyingWildlifeVocalSfxOnDeathParams): void {
  if (wasDead || !isDead) {
    return;
  }

  notifyingWildlifeInstanceVocalSfxSilence({ instanceId });
}
