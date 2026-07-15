import type { PlazaSaveSlotIndex } from './plazaGameSession';
import type { WorldInventoryDevvitPersistedState } from './worldInventoryDevvit';

export const PLAZA_SINGLE_PLAYER_SAVES_API_BASE_PATH =
  '/api/plaza-saves' as const;

/** Last plaza position stored in a single-player save slot. */
export type PlazaSinglePlayerSaveLastPosition = {
  x: number;
  y: number;
  layer: number;
  updatedAtMs: number;
};

/** Persisted active disease scheduler entry for save slots. */
export type PlazaSinglePlayerSavePersistedDiseaseEffect = {
  id: string;
  diseaseId: string;
  contractedAtMs: number;
  symptomsStartAtMs: number;
  expiresAtMs: number;
  symptomStrengthMultiplier?: number;
  durationMultiplier?: number;
  /** Whole infection hours already credited to Pathology for this instance. */
  pathologyStudyHoursCredited?: number;
  pendingGrants: readonly {
    grantIndex: number;
    fireAtMs: number;
  }[];
};

/** Persisted player illness state for one save slot. */
export type PlazaSinglePlayerSavePlayerConditions = {
  diseaseEffects: readonly PlazaSinglePlayerSavePersistedDiseaseEffect[];
  immuneSystemFactor?: number;
  diseaseImmunityIds?: readonly string[];
  /** Live HP at last save; restores across page reload. */
  currentHealth?: number;
  /** Live hunger ratio (0..1) at last save; restores across page reload. */
  hungerRatio?: number;
};

/** Persisted bestiary Guide progress for one save slot. */
export type PlazaSinglePlayerSaveBestiaryDiscovery = {
  sightedSpeciesIds: readonly string[];
  studyCountsBySpeciesId: Readonly<Record<string, number>>;
};

/** One equipped weapon/armor item on a persisted pet record. */
export type PlazaSinglePlayerSavePetInventoryItem = {
  id: string;
  itemTypeId: string;
  quantity: number;
  slotIndex: number;
  metadata?: Readonly<Record<string, unknown>>;
};

/** Permanent Spritcore power-up bonuses invested into one companion. */
export type PlazaSinglePlayerSavePetSpritcoreUpgrades = {
  bonusMaxHealth: number;
  bonusAttackPower: number;
  bonusAttackSpeed: number;
  bonusDefense: number;
  bonusMoveSpeed: number;
  totalSpritcoreInvested: number;
};

/** Persisted pet record shape for save slots / multiplayer roster. */
export type PlazaSinglePlayerSavePetRecord = {
  petId: string;
  speciesId: string;
  displayName: string | null;
  loyalty: number;
  isActive: boolean;
  command: 'follow' | 'stay' | 'attack' | 'defend';
  healthCurrent: number | null;
  hungerRatio: number | null;
  staminaRatio: number | null;
  sizeScaleSample: number;
  aggressionLevel: 'tame' | 'normal' | 'aggressive';
  weaponItem: PlazaSinglePlayerSavePetInventoryItem | null;
  armorItem: PlazaSinglePlayerSavePetInventoryItem | null;
  learnedSkillIds: readonly string[];
  equippedSkillId: string | null;
  soulsaveConsumed: boolean;
  /** Lasting stigma after prolonged hunger abandon; halves gains, worsens losses. */
  hasNeglectedBadge: boolean;
  /** True while the companion left the owner trail to forage after neglect. */
  isNeglectHunting: boolean;
  /** Permanent Spritcore power-up bonuses invested into this companion. */
  spritcoreUpgrades: PlazaSinglePlayerSavePetSpritcoreUpgrades;
  lastKnownX: number | null;
  lastKnownY: number | null;
  lastKnownLayer: number | null;
  /** Last damage kind that killed this companion; null while alive or unknown. */
  deathCauseKind: string | null;
  acquiredAtMs: number;
  updatedAtMs: number;
};

/** Saved roster of bonded companions for one player. */
export type PlazaSinglePlayerSavePetRoster = {
  activePetId: string | null;
  pets: readonly PlazaSinglePlayerSavePetRecord[];
};

/** Full persisted payload for one single-player save slot. */
export type PlazaSinglePlayerSaveSlotPersistedData = {
  lastPosition: PlazaSinglePlayerSaveLastPosition | null;
  inventory: WorldInventoryDevvitPersistedState | null;
  playerConditions: PlazaSinglePlayerSavePlayerConditions | null;
  /** Cookbook recipe page ids the player has attached (Guide unlock). */
  attachedRecipeIds: readonly string[] | null;
  /** Bestiary sighted / studied progress. */
  bestiaryDiscovery: PlazaSinglePlayerSaveBestiaryDiscovery | null;
  /** Biome kinds entered at least once. */
  exploredBiomeKinds: readonly string[] | null;
  /** Named realm ids entered at least once (`latticeX:latticeY`). */
  discoveredNamedRealmIds: readonly string[] | null;
  /** Bonded companion roster. */
  petRoster: PlazaSinglePlayerSavePetRoster | null;
  updatedAtMs: number;
};

/** Partial update body for one save slot. */
export type PlazaSinglePlayerSaveSlotUpdateRequest = {
  lastPosition?: PlazaSinglePlayerSaveLastPosition | null;
  inventory?: WorldInventoryDevvitPersistedState | null;
  playerConditions?: PlazaSinglePlayerSavePlayerConditions | null;
  attachedRecipeIds?: readonly string[] | null;
  bestiaryDiscovery?: PlazaSinglePlayerSaveBestiaryDiscovery | null;
  exploredBiomeKinds?: readonly string[] | null;
  discoveredNamedRealmIds?: readonly string[] | null;
  petRoster?: PlazaSinglePlayerSavePetRoster | null;
};

/** Summary shown on the home screen for one save slot. */
export type PlazaSinglePlayerSaveSlotSummary = {
  saveSlotIndex: PlazaSaveSlotIndex;
  hasSaveData: boolean;
  lastPlayedAtMs: number | null;
};

export type PlazaSinglePlayerSavesListResponse =
  | {
      type: 'saves';
      slots: PlazaSinglePlayerSaveSlotSummary[];
    }
  | {
      type: 'error';
      message: string;
    };

export type PlazaSinglePlayerSaveSlotResponse =
  | {
      type: 'save-slot';
      saveSlotIndex: PlazaSaveSlotIndex;
      data: PlazaSinglePlayerSaveSlotPersistedData | null;
    }
  | {
      type: 'error';
      message: string;
    };

export type PlazaSinglePlayerSaveSlotSaveResponse =
  | {
      type: 'saved';
      saveSlotIndex: PlazaSaveSlotIndex;
      updatedAtMs: number;
    }
  | {
      type: 'error';
      message: string;
    };
