import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import type { DefiningWorldPlazaEntityBleedSeverity } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

const DEFINING_WORLD_PLAZA_BLEED_DOWNGRADE_ORDER: readonly DefiningWorldPlazaEntityBleedSeverity[] =
  ['exsanguinating', 'hemorrhaging', 'bleeding'];

/**
 * Downgrades the highest active bleed one tier, or clears bleeding entirely.
 */
export function downgradingWorldPlazaEntityHealthBleedOneTier(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs = 0
): DefiningWorldPlazaEntityHealthState {
  for (const severity of DEFINING_WORLD_PLAZA_BLEED_DOWNGRADE_ORDER) {
    const activeEffects = state.bleedEffects.filter(
      (effect) =>
        effect.severity === severity && effect.remainingBleedDamage > 0
    );

    if (activeEffects.length === 0) {
      continue;
    }

    const clearedState: DefiningWorldPlazaEntityHealthState = {
      ...state,
      bleedEffects: state.bleedEffects.filter(
        (effect) => effect.severity !== severity
      ),
    };

    if (severity === 'bleeding') {
      return clearedState;
    }

    const nextSeverity: DefiningWorldPlazaEntityBleedSeverity =
      severity === 'exsanguinating' ? 'hemorrhaging' : 'bleeding';
    const transferredBleedDamage = activeEffects.reduce(
      (sum, effect) => sum + effect.remainingBleedDamage,
      0
    );

    return applyingWorldPlazaEntityHealthBleedStack(
      clearedState,
      nextSeverity,
      transferredBleedDamage,
      nowMs
    );
  }

  return state;
}
