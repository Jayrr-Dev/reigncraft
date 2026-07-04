/** Number of offline single-player save slots. */
export const PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT = 3;

/** Multiplayer rooms listed on the home screen (each holds up to 3 players). */
export const PLAZA_MULTIPLAYER_BROWSEABLE_ROOM_COUNT = 12;

/** Valid save slot indices for single-player mode. */
export type PlazaSaveSlotIndex = 1 | 2 | 3;

/** Active plaza session chosen on the home screen. */
export type PlazaGameSession =
  | {
      mode: 'single-player';
      saveSlotIndex: PlazaSaveSlotIndex;
    }
  | {
      mode: 'multiplayer';
      roomIndex: number;
    };

/**
 * Returns true when a number is a valid single-player save slot index.
 *
 * @param value - Candidate slot index.
 */
export function checkingPlazaSaveSlotIndex(
  value: number,
): value is PlazaSaveSlotIndex {
  return (
    Number.isInteger(value) &&
    value >= 1 &&
    value <= PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT
  );
}

/**
 * Returns true when a number is a valid multiplayer room index.
 *
 * @param value - Candidate room index.
 */
export function checkingPlazaMultiplayerRoomIndex(value: number): boolean {
  return (
    Number.isInteger(value) &&
    value >= 1 &&
    value <= PLAZA_MULTIPLAYER_BROWSEABLE_ROOM_COUNT
  );
}

/**
 * Resolves the local persistence owner id for one single-player save slot.
 *
 * @param saveSlotIndex - Save slot (1–3).
 */
export function resolvingPlazaSinglePlayerSessionOwnerId(
  saveSlotIndex: PlazaSaveSlotIndex,
): string {
  return `single-player:slot-${saveSlotIndex}`;
}
