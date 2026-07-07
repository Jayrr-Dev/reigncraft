import { checkingWorldPlazaGirlSampleRollDodgeMitigatesDamageKind } from '@/components/world/domains/checkingWorldPlazaGirlSampleRollDodgeMitigatesDamageKind';
import { computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier } from '@/components/world/domains/computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier';
import type {
  DefiningWorldPlazaEntityDamageKind,
  DefiningWorldPlazaEntityHealthDamageOptions,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type ResolvingWorldPlazaGirlSampleRollDodgeDamageOptionsParams = {
  /** Roll animation progress (0..1); 0 when outside the dodge window. */
  readonly rollDodgeProgress: number;
  readonly damageKind: DefiningWorldPlazaEntityDamageKind;
  readonly baseOptions?: Pick<
    DefiningWorldPlazaEntityHealthDamageOptions,
    | 'skipDamageRoll'
    | 'attackerDamageRollModifiers'
    | 'forcedDeviationScore'
    | 'forcedRollMode'
    | 'random'
    | 'ephemeralDefenderDamageRollModifiers'
    | 'ephemeralIncomingDamageMultiplier'
  >;
};

/**
 * Applies frame-scaled roll-dodge physical mitigation to one damage application.
 */
export function resolvingWorldPlazaGirlSampleRollDodgeDamageOptions({
  rollDodgeProgress,
  damageKind,
  baseOptions = {},
}: ResolvingWorldPlazaGirlSampleRollDodgeDamageOptionsParams): Pick<
  DefiningWorldPlazaEntityHealthDamageOptions,
  | 'skipDamageRoll'
  | 'attackerDamageRollModifiers'
  | 'forcedDeviationScore'
  | 'forcedRollMode'
  | 'random'
  | 'ephemeralDefenderDamageRollModifiers'
  | 'ephemeralIncomingDamageMultiplier'
> {
  if (
    rollDodgeProgress <= 0 ||
    !checkingWorldPlazaGirlSampleRollDodgeMitigatesDamageKind(damageKind)
  ) {
    return baseOptions;
  }

  const incomingDamageMultiplier =
    computingWorldPlazaGirlSampleRollDodgeIncomingDamageMultiplier(
      rollDodgeProgress
    );

  if (incomingDamageMultiplier === null) {
    return baseOptions;
  }

  return {
    ...baseOptions,
    ephemeralIncomingDamageMultiplier: incomingDamageMultiplier,
  };
}
