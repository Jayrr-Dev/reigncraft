/**
 * Wildlife simulation events that can trigger species vocal SFX.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesSfxEventKind
 */

/** Behavior-aligned vocal event kinds for farm and predator species. */
export type DefiningWildlifeSpeciesSfxEventKind =
  | 'idle_ambient'
  | 'idle_eating'
  | 'wake'
  | 'sleep'
  | 'friendly'
  | 'flee_start'
  | 'flee_mid'
  | 'warn'
  | 'stalk'
  | 'howl'
  | 'chase_call'
  | 'attack'
  | 'hit_taken'
  | 'death';
