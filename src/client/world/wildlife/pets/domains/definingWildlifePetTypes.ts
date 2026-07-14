/**
 * Core pet bond, roster, and persistence types.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetTypes
 */

import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeAggressionLevel } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Ordered loyalty tier ids from first follow through bonded. */
export type DefiningWildlifePetLoyaltyTierId =
  | 'curious'
  | 'comfortable'
  | 'familiar'
  | 'accepting'
  | 'friendly'
  | 'trusting'
  | 'attached'
  | 'loyal'
  | 'devoted'
  | 'bonded';

/** Player-issued companion command. */
export type DefiningWildlifePetCommandId =
  | 'follow'
  | 'stay'
  | 'attack'
  | 'defend';

/** Feature gate unlocked by loyalty tier thresholds. */
export type DefiningWildlifePetCapabilityId =
  | 'pettingLoyalty'
  | 'namable'
  | 'persistent'
  | 'allied'
  | 'basicUi'
  | 'commandsStayFollow'
  | 'commandsAttackDefend'
  | 'advancedStatsUi'
  | 'equipment'
  | 'teachSpells'
  | 'soulsave';

/** Persisted pet record shape for save slots / multiplayer roster. */
export type DefiningWildlifePetPersistedRecord = {
  petId: string;
  speciesId: string;
  displayName: string | null;
  loyalty: number;
  isActive: boolean;
  command: DefiningWildlifePetCommandId;
  healthCurrent: number | null;
  hungerRatio: number | null;
  staminaRatio: number | null;
  sizeScaleSample: number;
  aggressionLevel: DefiningWildlifeAggressionLevel;
  weaponItem: DefiningInventoryItem | null;
  armorItem: DefiningInventoryItem | null;
  learnedSkillIds: readonly string[];
  equippedSkillId: string | null;
  soulsaveConsumed: boolean;
  lastKnownX: number | null;
  lastKnownY: number | null;
  lastKnownLayer: number | null;
  acquiredAtMs: number;
  updatedAtMs: number;
};

/** Saved roster of bonded companions for one player. */
export type DefiningWildlifePetRoster = {
  activePetId: string | null;
  pets: readonly DefiningWildlifePetPersistedRecord[];
};

/** Runtime bond on wildlife instance (optional fields). */
export type DefiningWildlifePetBondState = {
  petId: string;
  ownerUserId: string;
  loyalty: number;
  command: DefiningWildlifePetCommandId;
  learnedSkillIds: readonly string[];
  equippedSkillId: string | null;
  soulsaveConsumed: boolean;
  weaponItem: DefiningInventoryItem | null;
  armorItem: DefiningInventoryItem | null;
  isPersistent: boolean;
  /** Anchor point for the "stay" command; null while never issued. */
  stayPoint?: DefiningWorldPlazaWorldPoint | null;
};
