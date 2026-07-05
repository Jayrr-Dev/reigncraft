import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint';

const RESOLVING_WORLD_PLAZA_CAMPFIRE_BLOCK_FROM_POINTER_ENABLED_DEFINITION_IDS =
  new Set([DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE]);

/**
 * Resolves the nearest campfire block under a forgiving pointer hit test.
 *
 * @deprecated Prefer {@link resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint}.
 */
export function resolvingWorldPlazaCampfireBlockFromPointerGridPoint(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  playerPosition: DefiningWorldPlazaWorldPoint,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): DefiningWorldBuildingPlacedBlock | null {
  const match = resolvingWorldPlazaInteractablePlacedBlockFromPointerGridPoint(
    pointerGridPoint,
    playerPosition,
    placedBlocks,
    null,
    RESOLVING_WORLD_PLAZA_CAMPFIRE_BLOCK_FROM_POINTER_ENABLED_DEFINITION_IDS
  );

  return match?.block ?? null;
}
