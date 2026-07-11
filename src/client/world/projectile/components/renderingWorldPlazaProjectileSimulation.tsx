'use client';

import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { iteratingWorldPlazaLoopBodySafely } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { resolvingWorldPlazaGirlSampleRollDodgeDamageOptions } from '@/components/world/domains/resolvingWorldPlazaGirlSampleRollDodgeDamageOptions';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { applyingWorldPlazaProjectilePayload } from '@/components/world/projectile/domains/applyingWorldPlazaProjectilePayload';
import { computingWorldPlazaProjectileStep } from '@/components/world/projectile/domains/computingWorldPlazaProjectileStep';
import { resolvingWorldPlazaProjectileArchetype } from '@/components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry';
import type {
  DefiningWorldPlazaPlayerProjectileDodgeState,
  DefiningWorldPlazaProjectileInstance,
  DefiningWorldPlazaProjectileTarget,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import {
  replacingWorldPlazaProjectileStoreInstances,
  spawningWorldPlazaProjectile,
  type ManagingWorldPlazaProjectileStore,
} from '@/components/world/projectile/domains/managingWorldPlazaProjectileStore';
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
  const projectileTargetsRef = useRef<DefiningWorldPlazaProjectileTarget[]>([]);

  usingWorldPlazaSafeTick(() => {
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
    const targets = projectileTargetsRef.current;
    targets.length = 0;

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
      for (const extraTarget of extraTargetsRef.current) {
        targets.push(extraTarget);
      }
    }

    const MAX_PROJECTILE_SUBSTEP_SECONDS = 1 / 60;
    const MAX_PROJECTILE_SUBSTEPS = 4;
    let remainingDeltaSeconds = deltaSeconds;
    let substepCount = 0;
    let workingInstances: readonly DefiningWorldPlazaProjectileInstance[] =
      store.instances;
    let combinedStepResult: ReturnType<
      typeof computingWorldPlazaProjectileStep
    > | null = null;

    while (
      remainingDeltaSeconds > 0 &&
      substepCount < MAX_PROJECTILE_SUBSTEPS
    ) {
      const substepSeconds = Math.min(
        remainingDeltaSeconds,
        MAX_PROJECTILE_SUBSTEP_SECONDS
      );
      remainingDeltaSeconds -= substepSeconds;
      substepCount += 1;

      const stepResult = computingWorldPlazaProjectileStep({
        instances: workingInstances,
        deltaSeconds: substepSeconds,
        nowMs,
        targets,
        collisionContext: {
          placedBlocks: placedBlocksRef.current?.blocks ?? [],
          playerRadiusGrid:
            dodgeState?.collisionRadiusGrid ??
            DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
        },
      });

      workingInstances = stepResult.instances;

      if (!combinedStepResult) {
        combinedStepResult = stepResult;
      } else {
        combinedStepResult = {
          instances: stepResult.instances,
          spawnRequests: [
            ...combinedStepResult.spawnRequests,
            ...stepResult.spawnRequests,
          ],
          hitEvents: [...combinedStepResult.hitEvents, ...stepResult.hitEvents],
          missEvents: [
            ...combinedStepResult.missEvents,
            ...stepResult.missEvents,
          ],
          impactEvents: [
            ...combinedStepResult.impactEvents,
            ...stepResult.impactEvents,
          ],
        };
      }
    }

    const stepResult = combinedStepResult;

    if (!stepResult) {
      return;
    }

    iteratingWorldPlazaLoopBodySafely(
      'projectile:spawn',
      stepResult.spawnRequests,
      (spawnRequest) => spawnRequest.archetypeId,
      (spawnRequest) => {
        spawningWorldPlazaProjectile(store, spawnRequest);
      }
    );

    iteratingWorldPlazaLoopBodySafely(
      'combat:projectile-hit',
      stepResult.hitEvents,
      (hitEvent) => `${hitEvent.projectileId}:${hitEvent.targetId}`,
      (hitEvent) => {
        const archetype = resolvingWorldPlazaProjectileArchetype(
          hitEvent.archetypeId
        );

        if (!archetype) {
          return;
        }

        if (hitEvent.targetId !== localPlayerTargetId) {
          if (onExtraTargetHit) {
            onExtraTargetHit(hitEvent.targetId, hitEvent.archetypeId);
          }

          return;
        }

        const healthState = healthStateRef.current;
        if (!healthState) {
          return;
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
    );

    iteratingWorldPlazaLoopBodySafely(
      'combat:projectile-miss',
      stepResult.missEvents,
      (missEvent) => `${missEvent.projectileId}:${missEvent.targetId}`,
      (missEvent) => {
        if (
          missEvent.reason === 'jump_dodge' &&
          missEvent.targetId === localPlayerTargetId
        ) {
          onLocalPlayerJumpDodgeMiss?.();
        }
      }
    );

    replacingWorldPlazaProjectileStoreInstances(store, stepResult.instances);
  }, 'tick:projectile-sim');

  return null;
}
