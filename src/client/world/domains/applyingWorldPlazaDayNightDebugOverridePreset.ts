import { invalidatingWorldPlazaDayNightSunStateCache } from "@/components/world/domains/computingWorldPlazaDayNightSunState";
import type { DefiningWorldPlazaDayNightDebugPreset } from "@/components/world/domains/definingWorldPlazaDayNightDebugOverrideConstants";
import { settingWorldPlazaDayNightDebugOverridePreset } from "@/components/world/domains/managingWorldPlazaDayNightDebugOverrideStore";

/**
 * Applies a debug time-of-day preset and refreshes cached sun state.
 *
 * @param preset - Preset to activate (`live` resumes wall-clock time).
 */
export function applyingWorldPlazaDayNightDebugOverridePreset(
  preset: DefiningWorldPlazaDayNightDebugPreset,
): void {
  settingWorldPlazaDayNightDebugOverridePreset(preset);
  invalidatingWorldPlazaDayNightSunStateCache();
}
