/**
 * Walk-over trigger tick for caltrops under the local player.
 *
 * @module components/world/trap/hooks/usingWorldPlazaCaltropTriggerTick
 */

'use client';

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import { applyingWorldPlazaCaltropTrigger } from '@/components/world/trap/domains/applyingWorldPlazaCaltropTrigger';
import { checkingWorldPlazaCaltropTriggerAtPoint } from '@/components/world/trap/domains/checkingWorldPlazaCaltropTriggerAtPoint';
import { persistingWorldPlazaLocalCaltrops } from '@/components/world/trap/domains/managingWorldPlazaLocalCaltrops';
import { useEffect, useRef } from 'react';

export type UsingWorldPlazaCaltropTriggerTickParams = {
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
 * Each animation frame: if the player stands on a caltrop, expend it and
 * apply slow + bleed.
 */
export function usingWorldPlazaCaltropTriggerTick({
  playerPositionRef,
  localPersistenceOwnerId,
  applyBleedRef,
  toggleBuffRef,
}: UsingWorldPlazaCaltropTriggerTickParams): void {
  const lastTriggeredTrapIdRef = useRef<string | null>(null);

  useEffect(() => {
    let frameId = 0;

    const ticking = (): void => {
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

      const caltrop = checkingWorldPlazaCaltropTriggerAtPoint(
        playerPosition.x,
        playerPosition.y
      );

      if (!caltrop) {
        lastTriggeredTrapIdRef.current = null;
        return;
      }

      if (lastTriggeredTrapIdRef.current === caltrop.trapId) {
        return;
      }

      const result = applyingWorldPlazaCaltropTrigger(caltrop.trapId);

      if (result.outcome !== 'expended') {
        return;
      }

      lastTriggeredTrapIdRef.current = result.trapId;
      toggleBuffRef.current?.(result.effects.slowBuffId);
      applyBleedRef.current?.(
        result.effects.bleedSeverity,
        result.effects.playerBleedFlatDamage
      );

      if (localPersistenceOwnerId) {
        persistingWorldPlazaLocalCaltrops(localPersistenceOwnerId);
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
