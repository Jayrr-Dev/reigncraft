import { DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS } from '@/components/world/wildlife/domains/definingWildlifeDeathConstants';

/**
 * Returns corpse sprite opacity while the fade window is active.
 */
export function computingWildlifeCorpseFadeAlpha(
  diedAtMs: number | null,
  nowMs: number
): number {
  if (diedAtMs === null || diedAtMs <= 0) {
    return 1;
  }

  const elapsedMs = nowMs - diedAtMs;

  if (elapsedMs <= 0) {
    return 1;
  }

  if (elapsedMs >= DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS) {
    return 0;
  }

  return 1 - elapsedMs / DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS;
}
