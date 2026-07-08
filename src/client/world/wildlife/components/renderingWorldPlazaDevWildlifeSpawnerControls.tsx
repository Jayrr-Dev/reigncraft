'use client';

import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SINGLE_SPAWN_COUNT,
  DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SWARM_SPAWN_COUNT,
} from '@/components/world/wildlife/domains/definingWildlifeDevSpawnConstants';

const RENDERING_WORLD_PLAZA_DEV_WILDLIFE_BUTTON_CLASS_NAME =
  'rounded border border-white/20 bg-black/50 px-2 py-1 text-left text-[11px] font-medium text-white/90 hover:bg-white/10' as const;

export type RenderingWorldPlazaDevWildlifeSpawnerControlsProps = {
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly onSpawnAggressiveChickens: (count: number) => void;
  readonly onSpawnRandomGreyWolf: () => void;
};

/**
 * Dev-mode buttons that spawn aggressive chickens near the player.
 */
export function RenderingWorldPlazaDevWildlifeSpawnerControls({
  playerPositionRef,
  onSpawnAggressiveChickens,
  onSpawnRandomGreyWolf,
}: RenderingWorldPlazaDevWildlifeSpawnerControlsProps): React.JSX.Element {
  const handlingSpawn = (count: number): void => {
    if (!playerPositionRef.current) {
      return;
    }

    onSpawnAggressiveChickens(count);
  };

  const handlingSpawnRandomGreyWolf = (): void => {
    if (!playerPositionRef.current) {
      return;
    }

    onSpawnRandomGreyWolf();
  };

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Wildlife spawner
      </span>
      <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[9px] leading-snug text-white/60">
        Spawns Zelda-style aggressive chickens next to you: 2x size, 10x health,
        100x damage, 2x speed, 4x stamina.
      </div>
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_WILDLIFE_BUTTON_CLASS_NAME}
          onClick={() =>
            handlingSpawn(
              DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SINGLE_SPAWN_COUNT
            )
          }
        >
          Aggressive chicken
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_WILDLIFE_BUTTON_CLASS_NAME}
          onClick={() =>
            handlingSpawn(
              DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SWARM_SPAWN_COUNT
            )
          }
        >
          Chicken swarm (
          {DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SWARM_SPAWN_COUNT})
        </button>
      </div>
      <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[9px] leading-snug text-white/60">
        Spawns one grey wolf 4-14 tiles away with normal size, aggression, and
        sleep rolls.
      </div>
      <button
        type="button"
        className={RENDERING_WORLD_PLAZA_DEV_WILDLIFE_BUTTON_CLASS_NAME}
        onClick={handlingSpawnRandomGreyWolf}
      >
        Random grey wolf
      </button>
    </div>
  );
}
