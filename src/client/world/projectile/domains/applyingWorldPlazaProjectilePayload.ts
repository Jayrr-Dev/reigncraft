import { applyingWorldPlazaEntityHealthPayload } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPayload';
import type {
  DefiningWorldPlazaEntityHealthDamageOptions,
  DefiningWorldPlazaEntityHealthState,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaProjectileArchetype } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

/**
 * Maps declarative projectile payloads onto the entity health engine.
 *
 * @module components/world/projectile/domains/applyingWorldPlazaProjectilePayload
 */

export type ApplyingWorldPlazaProjectilePayloadParams = {
  readonly state: DefiningWorldPlazaEntityHealthState;
  readonly archetype: DefiningWorldPlazaProjectileArchetype;
  readonly nowMs: number;
  readonly damageOptions?: Pick<
    DefiningWorldPlazaEntityHealthDamageOptions,
    | 'skipDamageRoll'
    | 'attackerDamageRollModifiers'
    | 'forcedDeviationScore'
    | 'forcedRollMode'
    | 'random'
    | 'ephemeralDefenderDamageRollModifiers'
    | 'ephemeralIncomingDamageMultiplier'
  >;
};

/**
 * Applies a projectile archetype payload to an entity health state.
 */
export function applyingWorldPlazaProjectilePayload({
  state,
  archetype,
  nowMs,
  damageOptions,
}: ApplyingWorldPlazaProjectilePayloadParams): DefiningWorldPlazaEntityHealthState {
  return applyingWorldPlazaEntityHealthPayload({
    state,
    payload: archetype.payload,
    nowMs,
    damageOptions,
  });
}
