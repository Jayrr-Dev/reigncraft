/**
 * Mutable tick config ref for wildlife simulation inside the Pixi tree.
 *
 * @module components/world/wildlife/domains/definingWildlifeSimulationTickConfig
 */

import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaProjectileTarget } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import type { DefiningWildlifeMeatDropContext } from '@/components/world/wildlife/domains/attemptingWildlifeMeatGroundDropOnDeath';
import type { DefiningWildlifeFloatingCombatText } from '@/components/world/wildlife/domains/definingWildlifeFloatingCombatTextTypes';
import type {
  DefiningWildlifeDamageEvent,
  DefiningWildlifeNetworkSnapshot,
  DefiningWildlifePlayerMeleeHit,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeSimulationTickConfig = {
  enabled: boolean;
  localUserId: string | null;
  remoteUserIds: readonly string[];
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  isPlayerRunningRef?: React.RefObject<boolean>;
  isPlayerJumpingRef?: React.RefObject<boolean>;
  placedBlocksRef?: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
  remoteWildlifeSnapshotsRef?: React.RefObject<
    readonly DefiningWildlifeNetworkSnapshot[]
  >;
  wildlifeSnapshotsOutRef?: React.RefObject<DefiningWildlifeNetworkSnapshot[]>;
  pendingWildlifeDamageEventsRef?: React.RefObject<
    DefiningWildlifeDamageEvent[]
  >;
  /** Filled each frame with live animal hitboxes for the projectile engine. */
  projectileTargetsOutRef?: React.RefObject<
    DefiningWorldPlazaProjectileTarget[]
  >;
  wildlifeFloatingCombatTextsOutRef?: React.RefObject<
    DefiningWildlifeFloatingCombatText[]
  >;
  onPlayerHitByWildlife?: (hit: DefiningWildlifePlayerMeleeHit) => void;
  /** When set, leader sim drops raw meat on first wildlife death tick. */
  meatDropContextRef?: React.RefObject<DefiningWildlifeMeatDropContext | null>;
};
