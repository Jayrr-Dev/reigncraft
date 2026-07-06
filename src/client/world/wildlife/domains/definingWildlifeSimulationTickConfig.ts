/**
 * Mutable tick config ref for wildlife simulation inside the Pixi tree.
 *
 * @module components/world/wildlife/domains/definingWildlifeSimulationTickConfig
 */

import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type {
  DefiningWildlifeDamageEvent,
  DefiningWildlifeNetworkSnapshot,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeSimulationTickConfig = {
  enabled: boolean;
  localUserId: string | null;
  remoteUserIds: readonly string[];
  playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  placedBlocksRef?: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
  remoteWildlifeSnapshotsRef?: React.RefObject<
    readonly DefiningWildlifeNetworkSnapshot[]
  >;
  wildlifeSnapshotsOutRef?: React.RefObject<DefiningWildlifeNetworkSnapshot[]>;
  pendingWildlifeDamageEventsRef?: React.RefObject<
    DefiningWildlifeDamageEvent[]
  >;
  onPlayerDamaged?: (damageAmount: number) => void;
};
