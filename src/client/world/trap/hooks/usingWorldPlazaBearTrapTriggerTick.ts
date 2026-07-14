/**
 * Walk-over trigger tick for armed bear traps under the local player.
 *
 * @module components/world/trap/hooks/usingWorldPlazaBearTrapTriggerTick
 */

'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import { applyingWorldPlazaBearTrapTrigger } from '@/components/world/trap/domains/applyingWorldPlazaBearTrapTrigger';
import { checkingWorldPlazaBearTrapTriggerAtPoint } from '@/components/world/trap/domains/checkingWorldPlazaBearTrapTriggerAtPoint';
import { persistingWorldPlazaLocalBearTraps } from '@/components/world/trap/domains/managingWorldPlazaLocalBearTraps';
import { useEffect, useRef } from 'react';

export type UsingWorldPlazaBearTrapTriggerTickParams = {
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly localPersistenceOwnerId: string | null;
  readonly applyBleedRef: React.RefObject<
    (
      severity: DefiningWorldPlazaEntityBleedSeverity,
      flatExpectedDamage?: number
    ) => void
  >;
  readonly toggleBuffRef: React.RefObject<(buffId: string) => void>;
};

/**
 * Each animation frame: if the player stands on an armed trap, spring it and
 * apply immobilize + bleed.
 */
export function usingWorldPlazaBearTrapTriggerTick({
  playerPositionRef,
  localPersistenceOwnerId,
  applyBleedRef,
  toggleBuffRef,
}: UsingWorldPlazaBearTrapTriggerTickParams): void {
  const lastTriggeredTrapIdRef = useRef<string | null>(null);

  useEffect(() => {
    let frameId = 0;

    const ticking = (nowMs: number): void => {
      frameId = requestAnimationFrame(ticking);

      if (
        !checkingWorldPlazaGenerationFeatureEnabled(
          DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TRAPS
        )
      ) {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const armedTrap = checkingWorldPlazaBearTrapTriggerAtPoint(
        playerPosition.x,
        playerPosition.y
      );

      if (!armedTrap) {
        lastTriggeredTrapIdRef.current = null;
        return;
      }

      if (lastTriggeredTrapIdRef.current === armedTrap.trapId) {
        return;
      }

      const result = applyingWorldPlazaBearTrapTrigger(armedTrap.trapId, nowMs);

      if (result.outcome !== 'sprung') {
        return;
      }

      lastTriggeredTrapIdRef.current = result.trapId;
      toggleBuffRef.current?.(result.effects.immobilizeBuffId);
      applyBleedRef.current?.(
        result.effects.bleedSeverity,
        result.effects.playerBleedFlatDamage
      );

      if (localPersistenceOwnerId) {
        persistingWorldPlazaLocalBearTraps(localPersistenceOwnerId);
      }
    };

    frameId = requestAnimationFrame(ticking);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [
    applyBleedRef,
    localPersistenceOwnerId,
    playerPositionRef,
    toggleBuffRef,
  ]);
}
