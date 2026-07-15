/**
 * Maps a Cyroborn wildlife instance to the shared crystal scale-pulse params.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeCyrobornScalePulseFromInstance
 */

import { DEFINING_WORLD_PLAZA_CYROBORN_DEATH_IMPLODE_DURATION_MS } from '@/components/world/domains/definingWorldPlazaCyrobornScalePulseConstants';
import {
  resolvingWorldPlazaCyrobornScalePulseMultiplier,
  type ResolvingWorldPlazaCyrobornScalePulseResult,
} from '@/components/world/domains/resolvingWorldPlazaCyrobornScalePulseMultiplier';
import { DEFINING_WILDLIFE_ATTACK_CLIP_HOLD_MS } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { DEFINING_WILDLIFE_CYROBORN_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeCyrobornConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function checkingWildlifeAttackMotionClip(
  motionClip: DefiningWildlifeInstance['aiState']['motionClip']
): boolean {
  return (
    motionClip === 'attack' ||
    motionClip === 'attack2' ||
    motionClip === 'attack3'
  );
}

/**
 * Resolves jump / cast / death scale pulse for one wildlife Cyroborn instance.
 * Other species get rest scale (no pulse).
 */
export function resolvingWildlifeCyrobornScalePulseFromInstance(params: {
  readonly instance: DefiningWildlifeInstance;
  readonly nowMs: number;
}): ResolvingWorldPlazaCyrobornScalePulseResult {
  const { instance, nowMs } = params;

  if (instance.speciesId !== DEFINING_WILDLIFE_CYROBORN_SPECIES_ID) {
    return { scaleMultiplier: 1, hideBody: false };
  }

  let deathProgress: number | null = null;

  if (instance.isDead && instance.diedAtMs !== null) {
    deathProgress = Math.min(
      1,
      Math.max(
        0,
        (nowMs - instance.diedAtMs) /
          DEFINING_WORLD_PLAZA_CYROBORN_DEATH_IMPLODE_DURATION_MS
      )
    );
  }

  const jumpProgress = instance.aiState.jumpState
    ? Math.min(1, Math.max(0, instance.aiState.jumpState.progress))
    : null;

  let attackProgress: number | null = null;
  const lastAttackAtMs = instance.aiState.lastAttackAtMs;

  if (
    !instance.isDead &&
    lastAttackAtMs !== null &&
    checkingWildlifeAttackMotionClip(instance.aiState.motionClip)
  ) {
    const elapsedMs = nowMs - lastAttackAtMs;

    if (elapsedMs >= 0 && elapsedMs < DEFINING_WILDLIFE_ATTACK_CLIP_HOLD_MS) {
      attackProgress = elapsedMs / DEFINING_WILDLIFE_ATTACK_CLIP_HOLD_MS;
    }
  }

  return resolvingWorldPlazaCyrobornScalePulseMultiplier({
    skinId: DEFINING_WILDLIFE_CYROBORN_SPECIES_ID,
    jumpProgress,
    attackProgress,
    deathProgress,
  });
}
