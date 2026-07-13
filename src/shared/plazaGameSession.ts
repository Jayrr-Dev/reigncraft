/** Number of offline single-player save slots. */
export const PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT = 3;

/** Valid save slot indices for single-player mode. */
export type PlazaSaveSlotIndex = 1 | 2 | 3;

/** Single-player world load profile chosen on the home screen. */
export type PlazaSinglePlayerLoadProfile = 'standard' | 'dev-qa';

/** Active plaza session chosen on the home screen. */
export type PlazaGameSession =
  | {
      mode: 'single-player';
      saveSlotIndex: PlazaSaveSlotIndex;
      /** Defaults to standard save-slot play when omitted. */
      loadProfile?: PlazaSinglePlayerLoadProfile;
    }
  | {
      mode: 'multiplayer';
      roomId: string;
    };

/**
 * Returns true when a number is a valid single-player save slot index.
 *
 * @param value - Candidate slot index.
 */
export function checkingPlazaSaveSlotIndex(
  value: number
): value is PlazaSaveSlotIndex {
  return (
    Number.isInteger(value) &&
    value >= 1 &&
    value <= PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT
  );
}

/**
 * Resolves the local persistence owner id for one single-player save slot.
 *
 * @param saveSlotIndex - Save slot (1–3).
 */
export function resolvingPlazaSinglePlayerSessionOwnerId(
  saveSlotIndex: PlazaSaveSlotIndex
): string {
  return `single-player:slot-${saveSlotIndex}`;
}

/**
 * Resolves the local persistence owner id for the ephemeral QA load session.
 */
export function resolvingPlazaSinglePlayerDevQaSessionOwnerId(): string {
  return 'single-player:dev-qa';
}

/**
 * Returns true when the session is the compact QA / testing load.
 *
 * @param session - Active plaza session, or null.
 */
export function checkingPlazaSinglePlayerDevQaLoadSession(
  session: PlazaGameSession | null
): boolean {
  return session?.mode === 'single-player' && session.loadProfile === 'dev-qa';
}
