'use client';

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY,
  listingWorldPlazaProjectileArchetypeIds,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry';
import { DEFINING_WORLD_PLAZA_PROJECTILE_DEV_SPAWN_OFFSET_GRID } from '@/components/world/projectile/domains/definingWorldPlazaProjectileConstants';
import type { SpawningWorldPlazaProjectileRequest } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

const RENDERING_WORLD_PLAZA_DEV_PROJECTILE_BUTTON_CLASS_NAME =
  'rounded border border-white/20 bg-black/50 px-2 py-1 text-left text-[11px] font-medium text-white/90 hover:bg-white/10' as const;

export type RenderingWorldPlazaDevProjectileSpawnerControlsProps = {
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly onSpawnProjectile: (
    request: SpawningWorldPlazaProjectileRequest
  ) => void;
  readonly localUserId: string | null;
};

function buildingWorldPlazaDevProjectileSpawnRequest(
  archetypeId: string,
  playerPosition: DefiningWorldPlazaWorldPoint,
  localUserId: string | null
): SpawningWorldPlazaProjectileRequest {
  const origin = {
    x: playerPosition.x + DEFINING_WORLD_PLAZA_PROJECTILE_DEV_SPAWN_OFFSET_GRID,
    y: playerPosition.y - DEFINING_WORLD_PLAZA_PROJECTILE_DEV_SPAWN_OFFSET_GRID,
    layer: playerPosition.layer,
  };

  return {
    archetypeId,
    origin,
    targetPoint: {
      x: playerPosition.x,
      y: playerPosition.y,
      layer: playerPosition.layer,
    },
    spawnerUserId: localUserId,
    seed: Math.floor(Math.random() * 1_000_000),
  };
}

/**
 * Dev-mode buttons that spawn one projectile archetype each.
 */
export function RenderingWorldPlazaDevProjectileSpawnerControls({
  playerPositionRef,
  onSpawnProjectile,
  localUserId,
}: RenderingWorldPlazaDevProjectileSpawnerControlsProps): React.JSX.Element {
  const archetypeIds = listingWorldPlazaProjectileArchetypeIds();

  const handlingSpawnProjectile = (archetypeId: string): void => {
    const playerPosition = playerPositionRef.current;
    if (!playerPosition) {
      return;
    }

    onSpawnProjectile(
      buildingWorldPlazaDevProjectileSpawnRequest(
        archetypeId,
        playerPosition,
        localUserId
      )
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Projectile spawner
      </span>
      <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[9px] leading-snug text-white/60">
        Spawns each archetype from an offset aimed at your current position.
        Jump to dodge low arrows; homing and AoE ignore jump dodge.
      </div>
      {archetypeIds.length === 0 ? (
        <div className="text-[10px] text-white/60">
          No projectile archetypes registered.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1">
          {archetypeIds.map((archetypeId) => {
            const archetype =
              DEFINING_WORLD_PLAZA_PROJECTILE_ARCHETYPE_REGISTRY[archetypeId];
            return (
              <button
                key={archetypeId}
                type="button"
                className={
                  RENDERING_WORLD_PLAZA_DEV_PROJECTILE_BUTTON_CLASS_NAME
                }
                onClick={() => handlingSpawnProjectile(archetypeId)}
              >
                {archetype?.archetypeId ?? archetypeId}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
