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

/** Full persisted payload for one single-player save slot. */
export type PlazaSinglePlayerSaveSlotPersistedData = {
  lastPosition: PlazaSinglePlayerSaveLastPosition | null;
  inventory: WorldInventoryDevvitPersistedState | null;
  updatedAtMs: number;
};

/** Partial update body for one save slot. */
export type PlazaSinglePlayerSaveSlotUpdateRequest = {
  lastPosition?: PlazaSinglePlayerSaveLastPosition | null;
  inventory?: WorldInventoryDevvitPersistedState | null;
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
