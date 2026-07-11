export type ResolvingWildlifeVocalSfxConcurrencyAction =
  | 'play'
  | 'interrupt'
  | 'skip';

/**
 * Keeps one vocal voice per wildlife instance.
 *
 * Equal-priority repeats are skipped until the active clip ends. A more
 * important vocal may interrupt a lower-priority call.
 */
export function resolvingWildlifeVocalSfxConcurrencyAction(
  activePriority: number | null,
  nextPriority: number
): ResolvingWildlifeVocalSfxConcurrencyAction {
  if (activePriority === null) {
    return 'play';
  }

  if (nextPriority > activePriority) {
    return 'interrupt';
  }

  return 'skip';
}
