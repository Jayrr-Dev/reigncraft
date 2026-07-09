import {
  DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS,
  DEFINING_WILDLIFE_CORPSE_LIFETIME_MS,
} from '@/components/world/wildlife/domains/definingWildlifeDeathConstants';

/**
 * Returns corpse sprite opacity while the corpse lifetime is active.
 * Fully opaque until the final fade window, then linear fade to zero.
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

  if (elapsedMs >= DEFINING_WILDLIFE_CORPSE_LIFETIME_MS) {
    return 0;
  }

  const fadeStartMs =
    DEFINING_WILDLIFE_CORPSE_LIFETIME_MS -
    DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS;

  if (elapsedMs <= fadeStartMs) {
    return 1;
  }

  const fadeElapsedMs = elapsedMs - fadeStartMs;

  return 1 - fadeElapsedMs / DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS;
}
