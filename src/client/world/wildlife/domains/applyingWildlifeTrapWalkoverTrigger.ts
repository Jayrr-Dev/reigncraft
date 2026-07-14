/**
 * Springs player-placed traps when wildlife walks over them.
 *
 * @module components/world/wildlife/domains/applyingWildlifeTrapWalkoverTrigger
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { applyingWorldPlazaBearTrapTrigger } from '@/components/world/trap/domains/applyingWorldPlazaBearTrapTrigger';
import { applyingWorldPlazaCaltropTrigger } from '@/components/world/trap/domains/applyingWorldPlazaCaltropTrigger';
import { checkingWorldPlazaBearTrapTriggerAtPoint } from '@/components/world/trap/domains/checkingWorldPlazaBearTrapTriggerAtPoint';
import { checkingWorldPlazaCaltropTriggerAtPoint } from '@/components/world/trap/domains/checkingWorldPlazaCaltropTriggerAtPoint';
import { persistingWorldPlazaLocalBearTraps } from '@/components/world/trap/domains/managingWorldPlazaLocalBearTraps';
import { persistingWorldPlazaLocalCaltrops } from '@/components/world/trap/domains/managingWorldPlazaLocalCaltrops';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ApplyingWildlifeTrapWalkoverTriggerParams = {
  readonly instance: DefiningWildlifeInstance;
  readonly nowMs: number;
  /** localStorage owner for trap persistence after spring / expend. */
  readonly persistOwnerId?: string | null;
};

function persistingTrapOwner(
  trapOwnerId: string | null,
  persistOwnerId: string | null | undefined,
  kind: 'bear-trap' | 'caltrop'
): void {
  const ownerId = trapOwnerId ?? persistOwnerId ?? null;

  if (!ownerId) {
    return;
  }

  if (kind === 'bear-trap') {
    persistingWorldPlazaLocalBearTraps(ownerId);
    return;
  }

  persistingWorldPlazaLocalCaltrops(ownerId);
}

/**
 * If the instance stands on an armed bear trap or caltrop, spring/expend it and
 * apply immobilize/slow + bleed to the animal. Returns the (possibly) updated
 * instance.
 */
export function applyingWildlifeTrapWalkoverTrigger({
  instance,
  nowMs,
  persistOwnerId = null,
}: ApplyingWildlifeTrapWalkoverTriggerParams): DefiningWildlifeInstance {
  if (
    instance.isDead ||
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TRAPS
    )
  ) {
    return instance;
  }

  const armedBearTrap = checkingWorldPlazaBearTrapTriggerAtPoint(
    instance.position.x,
    instance.position.y
  );

  if (armedBearTrap) {
    const result = applyingWorldPlazaBearTrapTrigger(
      armedBearTrap.trapId,
      nowMs
    );

    if (result.outcome !== 'sprung') {
      return instance;
    }

    let healthState = applyingWorldPlazaEntityBuff(
      instance.healthState,
      result.effects.immobilizeBuffId,
      nowMs
    );
    healthState = applyingWorldPlazaEntityHealthBleedStack(
      healthState,
      result.effects.bleedSeverity,
      result.effects.wildlifeBleedFlatDamage,
      nowMs
    );

    persistingTrapOwner(armedBearTrap.ownerId, persistOwnerId, 'bear-trap');

    return {
      ...instance,
      healthState,
    };
  }

  const caltrop = checkingWorldPlazaCaltropTriggerAtPoint(
    instance.position.x,
    instance.position.y
  );

  if (!caltrop) {
    return instance;
  }

  const result = applyingWorldPlazaCaltropTrigger(caltrop.trapId);

  if (result.outcome !== 'expended') {
    return instance;
  }

  let healthState = applyingWorldPlazaEntityBuff(
    instance.healthState,
    result.effects.slowBuffId,
    nowMs
  );
  healthState = applyingWorldPlazaEntityHealthBleedStack(
    healthState,
    result.effects.bleedSeverity,
    result.effects.wildlifeBleedFlatDamage,
    nowMs
  );

  persistingTrapOwner(caltrop.ownerId, persistOwnerId, 'caltrop');

  return {
    ...instance,
    healthState,
  };
}
