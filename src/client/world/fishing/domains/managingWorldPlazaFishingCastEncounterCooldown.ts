/**
 * Wall-clock cooldown between fishing cast wildlife encounters.
 *
 * @module components/world/fishing/domains/managingWorldPlazaFishingCastEncounterCooldown
 */

import { DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_COOLDOWN_MS } from '@/components/world/fishing/domains/definingWorldPlazaFishingCastEncounterConstants';

let managingWorldPlazaFishingCastEncounterLastAtMs: number | null = null;

/** Last successful cast encounter spawn time, or null when none yet. */
export function readingWorldPlazaFishingCastEncounterLastAtMs(): number | null {
  return managingWorldPlazaFishingCastEncounterLastAtMs;
}

/** Records a successful cast encounter for cooldown gating. */
export function recordingWorldPlazaFishingCastEncounterAtMs(
  nowMs: number
): void {
  managingWorldPlazaFishingCastEncounterLastAtMs = nowMs;
}

/** True when another encounter is still inside the cooldown window. */
export function checkingWorldPlazaFishingCastEncounterOnCooldown(
  nowMs: number,
  lastEncounterAtMs: number | null = managingWorldPlazaFishingCastEncounterLastAtMs
): boolean {
  if (lastEncounterAtMs == null) {
    return false;
  }

  return (
    nowMs - lastEncounterAtMs <
    DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_COOLDOWN_MS
  );
}

/** Test helper: reset module cooldown state. */
export function resettingWorldPlazaFishingCastEncounterCooldownForTests(): void {
  managingWorldPlazaFishingCastEncounterLastAtMs = null;
}
