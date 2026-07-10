'use client';

import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaGirlSampleRollDodgeDamageOptions } from '@/components/world/domains/resolvingWorldPlazaGirlSampleRollDodgeDamageOptions';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { applyingWorldPlazaProjectilePayload } from '@/components/world/projectile/domains/applyingWorldPlazaProjectilePayload';
import { computingWorldPlazaProjectileStep } from '@/components/world/projectile/domains/computingWorldPlazaProjectileStep';
import { resolvingWorldPlazaProjectileArchetype } from '@/components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry';
import type {
  DefiningWorldPlazaPlayerProjectileDodgeState,
  DefiningWorldPlazaProjectileTarget,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import {
  replacingWorldPlazaProjectileStoreInstances,
  spawningWorldPlazaProjectile,
  type ManagingWorldPlazaProjectileStore,
} from '@/components/world/projectile/domains/managingWorldPlazaProjectileStore';
import { useTick } from '@pixi/react';
import { useRef } from 'react';

export type RenderingWorldPlazaProjectileSimulationProps = {
  readonly projectileStoreRef: React.RefObject<ManagingWorldPlazaProjectileStore>;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly localPlayerDodgeStateRef: React.RefObject<DefiningWorldPlazaPlayerProjectileDodgeState>;
  readonly localPlayerTargetId: string;
  readonly healthStateRef: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  readonly placedBlocksRef: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
  readonly isEnabled: boolean;
  /** Extra hit-testable targets (e.g. wildlife), refreshed by their owner each frame. */
  readonly extraTargetsRef?: React.RefObject<
    readonly DefiningWorldPlazaProjectileTarget[]
  >;
  /** Called when a projectile hits one of the extra targets. */
  readonly onExtraTargetHit?: (targetId: string, archetypeId: string) => void;
  /** Gray Miss float when the local player jump-dodges a projectile. */
  readonly onLocalPlayerJumpDodgeMiss?: () => void;
  /** Roll animation progress synced each frame; 0 outside the dodge window. */
  readonly rollDodgeProgressRef?: React.RefObject<number>;
};

/**
 * Advances projectile simulation once per Pixi tick (shared by all visual layers).
 */
export function RenderingWorldPlazaProjectileSimulation({
  projectileStoreRef,
  playerPositionRef,
  localPlayerDodgeStateRef,
  localPlayerTargetId,
  healthStateRef,
  placedBlocksRef,
  isEnabled,
  extraTargetsRef,
  onExtraTargetHit,
  onLocalPlayerJumpDodgeMiss,
  rollDodgeProgressRef,
}: RenderingWorldPlazaProjectileSimulationProps): null {
  const lastTickMsRef = useRef(0);

  useTick(() => {
    const store = projectileStoreRef.current;
    if (!store || !isEnabled) {
      lastTickMsRef.current = 0;
      return;
    }

    const nowMs = performance.now();
    const deltaSeconds =
      lastTickMsRef.current > 0
        ? Math.min(0.1, (nowMs - lastTickMsRef.current) / 1000)
        : 0;
    lastTickMsRef.current = nowMs;

    if (deltaSeconds <= 0) {
      return;
    }

    const playerPosition = playerPositionRef.current;
    const dodgeState = localPlayerDodgeStateRef.current;
    const targets: DefiningWorldPlazaProjectileTarget[] = [];

    if (playerPosition) {
      targets.push({
        targetId: localPlayerTargetId,
        point: playerPosition,
        collisionRadiusGrid:
          dodgeState?.collisionRadiusGrid ??
          DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
        jumpArcOffsetPx: dodgeState?.jumpArcOffsetPx ?? 0,
      });
    }

    if (extraTargetsRef?.current) {
      targets.push(...extraTargetsRef.current);
    }

    const stepResult = computingWorldPlazaProjectileStep({
      instances: store.instances,
      deltaSeconds,
      nowMs,
      targets,
      collisionContext: {
        placedBlocks: placedBlocksRef.current?.blocks ?? [],
        playerRadiusGrid:
          dodgeState?.collisionRadiusGrid ??
          DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
      },
    });

    for (const spawnRequest of stepResult.spawnRequests) {
      spawningWorldPlazaProjectile(store, spawnRequest);
    }

    for (const hitEvent of stepResult.hitEvents) {
      const archetype = resolvingWorldPlazaProjectileArchetype(
        hitEvent.archetypeId
      );

      if (!archetype) {
        continue;
      }

      if (hitEvent.targetId !== localPlayerTargetId) {
        if (onExtraTargetHit) {
          onExtraTargetHit(hitEvent.targetId, hitEvent.archetypeId);
        }

        continue;
      }

      const healthState = healthStateRef.current;
      if (!healthState) {
        continue;
      }

      healthStateRef.current = applyingWorldPlazaProjectilePayload({
        state: healthState,
        archetype,
        nowMs,
        damageOptions: resolvingWorldPlazaGirlSampleRollDodgeDamageOptions({
          rollDodgeProgress: rollDodgeProgressRef?.current ?? 0,
          damageKind: archetype.payload.damageKind ?? 'physical',
        }),
      });
    }

    for (const missEvent of stepResult.missEvents) {
      if (
        missEvent.reason === 'jump_dodge' &&
        missEvent.targetId === localPlayerTargetId
      ) {
        onLocalPlayerJumpDodgeMiss?.();
      }
    }

    replacingWorldPlazaProjectileStoreInstances(store, stepResult.instances);
  });

  return null;
}
