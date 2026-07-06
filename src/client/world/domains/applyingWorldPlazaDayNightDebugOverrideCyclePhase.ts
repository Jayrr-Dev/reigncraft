import { invalidatingWorldPlazaDayNightSunStateCache } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { settingWorldPlazaDayNightDebugOverrideCyclePhase } from '@/components/world/domains/managingWorldPlazaDayNightDebugOverrideStore';

/**
 * Applies a custom cycle phase and refreshes cached sun state.
 *
 * @param cyclePhase - Cycle phase to force (0 = midnight, 0.5 = noon).
 */
export function applyingWorldPlazaDayNightDebugOverrideCyclePhase(
  cyclePhase: number
): void {
  settingWorldPlazaDayNightDebugOverrideCyclePhase(cyclePhase);
  invalidatingWorldPlazaDayNightSunStateCache();
}
