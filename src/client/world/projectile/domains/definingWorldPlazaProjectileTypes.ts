import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityDamageKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityPoisonPotency } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';

/**
 * Core projectile engine types.
 *
 * @module components/world/projectile/domains/definingWorldPlazaProjectileTypes
 */

export type DefiningWorldPlazaProjectileMovementBehaviorId =
  | 'linear'
  | 'homingSoft'
  | 'homingDirect'
  | 'lobbedArc'
  | 'skyDrop'
  | 'gravityPull';

export type DefiningWorldPlazaProjectileImpactBehaviorId =
  | 'singleTarget'
  | 'aoeExplosion'
  | 'passThrough';

export type DefiningWorldPlazaProjectileRenderPlane =
  | 'ground-sorted'
  | 'effects';

export type DefiningWorldPlazaProjectileAltitudeMode =
  | 'groundHugging'
  | 'flying'
  | 'skyDrop';

export type DefiningWorldPlazaProjectileGravityFalloff =
  | 'none'
  | 'linear'
  | 'inverseSquare';

export type DefiningWorldPlazaProjectileMovementConfig = {
  readonly behaviorId: DefiningWorldPlazaProjectileMovementBehaviorId;
  readonly speedGridPerSec: number;
  readonly maxTurnRateRadiansPerSec?: number;
  readonly homingLeadErrorRadians?: number;
  readonly lobFlightDurationMs?: number;
  readonly skyDropStartAltitudePx?: number;
  readonly skyDropFallSpeedPxPerSec?: number;
  /**
   * Gravity-pull acceleration toward `targetPoint` (grid / s²).
   * Used when `behaviorId` is `gravityPull`.
   */
  readonly gravityAccelerationGridPerSec2?: number;
  /** Gravity-pull influence radius (grid). Defaults to projectile constants. */
  readonly gravityRadiusGrid?: number;
  /** Gravity-pull falloff curve. Defaults to `linear`. */
  readonly gravityFalloff?: DefiningWorldPlazaProjectileGravityFalloff;
  /** Soft settle radius near the attractor (grid). */
  readonly gravitySettleRadiusGrid?: number;
  /** Hard cap on gravity-influenced speed (grid / s). */
  readonly gravityMaxSpeedGridPerSec?: number;
  /**
   * When true, aim at the nearest live hit-test target each tick (player chase).
   * When false/omitted, use the frozen spawn `targetPoint`.
   */
  readonly tracksLiveTarget?: boolean;
};

export type DefiningWorldPlazaProjectileAltitudeConfig = {
  readonly mode: DefiningWorldPlazaProjectileAltitudeMode;
  readonly flyingAltitudePx?: number;
};

export type DefiningWorldPlazaProjectilePayloadStatusEffect =
  | {
      readonly kind: 'poison';
      readonly potency: DefiningWorldPlazaEntityPoisonPotency;
      readonly totalDamage: number;
    }
  | {
      readonly kind: 'bleed';
      readonly severity: DefiningWorldPlazaEntityBleedSeverity;
      readonly totalDamage: number;
    }
  | {
      readonly kind: 'buff';
      readonly buffId: string;
    }
  | {
      readonly kind: 'potentialDamage';
      readonly expectedDamage: number;
      readonly resolveDelayMs: number;
    };

export type DefiningWorldPlazaProjectilePayloadConfig = {
  readonly damageAmount?: number;
  readonly damageKind?: DefiningWorldPlazaEntityDamageKind;
  readonly statusEffects?: readonly DefiningWorldPlazaProjectilePayloadStatusEffect[];
};

export type DefiningWorldPlazaProjectileTelegraphConfig = {
  readonly radiusGrid: number;
  readonly durationMs: number;
  readonly leadTimeMs: number;
};

export type DefiningWorldPlazaProjectileImpactConfig = {
  readonly behaviorId: DefiningWorldPlazaProjectileImpactBehaviorId;
  readonly aoeRadiusGrid?: number;
  readonly telegraph?: DefiningWorldPlazaProjectileTelegraphConfig;
};

export type DefiningWorldPlazaProjectileSplitSpreadPattern =
  | 'radial'
  | 'forwardFan';

export type DefiningWorldPlazaProjectileSplitConfig = {
  readonly afterMs: number;
  readonly count: number;
  readonly childArchetypeId: string;
  readonly spreadPattern: DefiningWorldPlazaProjectileSplitSpreadPattern;
  readonly spreadRadians?: number;
};

export type DefiningWorldPlazaProjectileVisualConfig = {
  readonly clipId: string;
  readonly scale: number;
  readonly tint?: number;
  readonly renderPlane: DefiningWorldPlazaProjectileRenderPlane;
  readonly spriteRadiusPx: number;
};

export type DefiningWorldPlazaProjectileArchetype = {
  readonly archetypeId: string;
  readonly movement: DefiningWorldPlazaProjectileMovementConfig;
  readonly hitbox: { readonly radiusGrid: number };
  readonly altitude: DefiningWorldPlazaProjectileAltitudeConfig;
  readonly dodge: { readonly jumpDodgeable: boolean };
  readonly payload: DefiningWorldPlazaProjectilePayloadConfig;
  readonly impact: DefiningWorldPlazaProjectileImpactConfig;
  readonly split?: DefiningWorldPlazaProjectileSplitConfig;
  readonly lifetimeMs: number;
  readonly visual: DefiningWorldPlazaProjectileVisualConfig;
  readonly blocksOnTerrain?: boolean;
};

export type DefiningWorldPlazaProjectileTarget = {
  readonly targetId: string;
  readonly point: DefiningWorldPlazaWorldPoint;
  readonly collisionRadiusGrid: number;
  readonly jumpArcOffsetPx: number;
};

export type DefiningWorldPlazaProjectileInstance = {
  readonly projectileId: string;
  readonly archetypeId: string;
  readonly spawnedAtMs: number;
  readonly seed: number;
  readonly spawnerUserId: string | null;
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly origin: DefiningWorldPlazaWorldPoint;
  readonly velocityX: number;
  readonly velocityY: number;
  readonly altitudePx: number;
  readonly altitudeVelocityPxPerSec: number;
  readonly targetPoint: DefiningWorldPlazaWorldPoint | null;
  readonly homingLeadErrorRadians: number;
  readonly lobProgress: number;
  readonly hasSplit: boolean;
  readonly hasImpacted: boolean;
  readonly hitTargetIds: readonly string[];
  readonly telegraphStartedAtMs: number | null;
};

export type SpawningWorldPlazaProjectileRequest = {
  readonly projectileId?: string;
  readonly archetypeId: string;
  readonly origin: DefiningWorldPlazaWorldPoint;
  readonly targetPoint?: DefiningWorldPlazaWorldPoint;
  readonly direction?: { readonly x: number; readonly y: number };
  readonly spawnedAtMs?: number;
  readonly seed?: number;
  readonly spawnerUserId?: string | null;
};

export type AdvancingWorldPlazaProjectileEngineStepResult = {
  readonly instances: readonly DefiningWorldPlazaProjectileInstance[];
  readonly spawnRequests: readonly SpawningWorldPlazaProjectileRequest[];
  readonly hitEvents: readonly DefiningWorldPlazaProjectileHitEvent[];
  readonly impactEvents: readonly DefiningWorldPlazaProjectileImpactEvent[];
};

export type DefiningWorldPlazaProjectileHitEvent = {
  readonly projectileId: string;
  readonly archetypeId: string;
  readonly targetId: string;
  readonly position: DefiningWorldPlazaWorldPoint;
};

export type DefiningWorldPlazaProjectileImpactEvent = {
  readonly projectileId: string;
  readonly archetypeId: string;
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly impactBehaviorId: DefiningWorldPlazaProjectileImpactBehaviorId;
  readonly aoeRadiusGrid: number | null;
};

export type DefiningWorldPlazaPlayerProjectileDodgeState = {
  readonly jumpArcOffsetPx: number;
  readonly collisionRadiusGrid: number;
};
