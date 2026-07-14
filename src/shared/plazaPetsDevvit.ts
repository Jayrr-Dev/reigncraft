import type { PlazaSinglePlayerSavePetRoster } from './plazaSinglePlayerSavesDevvit';

/** Multiplayer bonded companion roster, keyed by authenticated Reddit user. */
export const PLAZA_PETS_API_BASE_PATH = '/api/plaza-pets' as const;

export type PlazaPetsRosterResponse =
  | {
      type: 'pet-roster';
      roster: PlazaSinglePlayerSavePetRoster | null;
    }
  | {
      type: 'error';
      message: string;
    };

/** Full-roster replace body for the multiplayer companion roster. */
export type PlazaPetsRosterUpdateRequest = {
  roster: PlazaSinglePlayerSavePetRoster;
};

export type PlazaPetsSaveResponse =
  | {
      type: 'saved';
      updatedAtMs: number;
    }
  | {
      type: 'error';
      message: string;
    };
