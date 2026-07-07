/**
 * Mutable tick config ref for wildlife simulation inside the Pixi tree.
 *
 * @module components/world/wildlife/domains/definingWildlifeSimulationTickConfig
 */

import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaRunStaminaState } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaProjectileTarget } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import type { DefiningWildlifeMeatDropContext } from '@/components/world/wildlife/domains/attemptingWildlifeMeatGroundDropOnDeath';
import type { DefiningWildlifeFloatingCombatText } from '@/components/world/wildlife/domains/definingWildlifeFloatingCombatTextTypes';
import type { DefiningWildlifeNameTagOverlay } from '@/components/world/wildlife/domains/definingWildlifeNameTagTypes';
import type { DefiningWildlifeSpeechBubbleOverlay } from '@/components/world/wildlife/domains/definingWildlifeSpeechBubbleTypes';
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
  playerHealthStateRef?: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  playerRunStaminaStateRef?: React.RefObject<DefiningWorldPlazaRunStaminaState>;
  isPlayerRunningRef?: React.RefObject<boolean>;
  isPlayerWalkingRef?: React.RefObject<boolean>;
  isPlayerJumpingRef?: React.RefObject<boolean>;
  playerStillDurationMsRef?: React.RefObject<number>;
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
  wildlifeSpeechBubblesOutRef?: React.RefObject<
    DefiningWildlifeSpeechBubbleOverlay[]
  >;
  wildlifeNameTagsOutRef?: React.RefObject<DefiningWildlifeNameTagOverlay[]>;
  onPlayerHitByWildlife?: (hit: DefiningWildlifePlayerMeleeHit) => void;
  /** When set, leader sim drops raw meat on first wildlife death tick. */
  meatDropContextRef?: React.RefObject<DefiningWildlifeMeatDropContext | null>;
};
