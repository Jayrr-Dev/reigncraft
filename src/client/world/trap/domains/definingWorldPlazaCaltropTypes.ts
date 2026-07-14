/**
 * Declarative types for player-placed caltrop traps.
 *
 * @module components/world/trap/domains/definingWorldPlazaCaltropTypes
 */

export type DefiningWorldPlazaCaltropId = string;

/** Always-armed one-shot spike cluster. Removed when stepped on. */
export type DefiningWorldPlazaCaltropInstance = {
  readonly trapId: DefiningWorldPlazaCaltropId;
  readonly position: { readonly x: number; readonly y: number };
  readonly ownerId: string | null;
};

export type DefiningWorldPlazaCaltropPlacement = {
  readonly trapId: DefiningWorldPlazaCaltropId;
  readonly worldX: number;
  readonly worldY: number;
  readonly ownerId: string | null;
};
