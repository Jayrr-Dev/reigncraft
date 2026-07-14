/**
 * Core NPC instance and action types (sibling to wildlife, no AI sim).
 *
 * @module components/world/npc/domains/definingNpcTypes
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/** Stable placed NPC id (placement registry key). */
export type DefiningNpcId = string;

/** Species catalog id (sprite + vitals template). */
export type DefiningNpcSpeciesId =
  | 'villager-a'
  | 'villager-b'
  | 'villager-c';

/** Overhead / panel actions every NPC can offer. */
export type DefiningNpcActionId = 'talk' | 'shop' | 'quest';

/** Panel kind opened from an action badge. */
export type DefiningNpcPanelKind = DefiningNpcActionId;

export type DefiningNpcHealthState = {
  readonly currentHealth: number;
  readonly maxHealth: number;
};

export type DefiningNpcInstance = {
  readonly npcId: DefiningNpcId;
  readonly speciesId: DefiningNpcSpeciesId;
  readonly displayName: string;
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly facing: DefiningWorldPlazaGirlSampleWalkDirection;
  readonly actionIds: readonly DefiningNpcActionId[];
  readonly healthState: DefiningNpcHealthState;
  readonly isDead: boolean;
  readonly diedAtMs: number | null;
  readonly motionClip: 'idle' | 'walk' | 'run' | 'attack' | 'takeDamage' | 'die';
};

/** Thin prey descriptor for wildlife aggro / melee targeting. */
export type DefiningNpcPreyTarget = {
  readonly targetId: DefiningNpcId;
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly massKg: number;
  readonly trophicTier: 1 | 2 | 3;
};
