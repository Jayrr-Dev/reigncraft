import { DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_MAX_BONUS_RATIO } from '@/components/world/health/domains/definingWorldPlazaEntityHealAmplifierConstants';
import type {
  DefiningWorldPlazaEntityHealthIncomingHealAmplifierModifier,
  DefiningWorldPlazaEntityHealthOutgoingHealAmplifierModifier,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

type DefiningWorldPlazaEntityHealthHealAmplifierModifier = {
  ratio: number;
  expiresAtMs: number | null;
};

function filteringWorldPlazaActiveHealAmplifierModifiers<
  TModifier extends DefiningWorldPlazaEntityHealthHealAmplifierModifier,
>(modifiers: readonly TModifier[], nowMs: number): TModifier[] {
  return modifiers.filter(
    (modifier) => modifier.expiresAtMs === null || modifier.expiresAtMs > nowMs
  );
}

/**
 * Sums active heal amplifier ratios, capped at {@link DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_MAX_BONUS_RATIO}.
 */
export function resolvingWorldPlazaEntityHealthHealAmplifierBonusRatio(
  modifiers: readonly DefiningWorldPlazaEntityHealthHealAmplifierModifier[],
  nowMs: number
): number {
  const activeBonus = filteringWorldPlazaActiveHealAmplifierModifiers(
    modifiers,
    nowMs
  ).reduce((sum, modifier) => sum + modifier.ratio, 0);

  return Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_HEAL_AMPLIFIER_MAX_BONUS_RATIO,
    Math.max(0, activeBonus)
  );
}

export type ComputingWorldPlazaEntityHealthAmplifiedHealAmountParams = {
  baseHealAmount: number;
  receiverIncomingHealAmplifiers: readonly DefiningWorldPlazaEntityHealthIncomingHealAmplifierModifier[];
  giverOutgoingHealAmplifiers: readonly DefiningWorldPlazaEntityHealthOutgoingHealAmplifierModifier[];
  nowMs: number;
  /** When false, skips Mending (e.g. passive regen). */
  applyOutgoingAmplifier?: boolean;
};

/**
 * Resolves final heal amount after Blessing (received) and Mending (given) bonuses.
 */
export function computingWorldPlazaEntityHealthAmplifiedHealAmount({
  baseHealAmount,
  receiverIncomingHealAmplifiers,
  giverOutgoingHealAmplifiers,
  nowMs,
  applyOutgoingAmplifier = true,
}: ComputingWorldPlazaEntityHealthAmplifiedHealAmountParams): number {
  if (baseHealAmount <= 0) {
    return 0;
  }

  const incomingMultiplier =
    1 +
    resolvingWorldPlazaEntityHealthHealAmplifierBonusRatio(
      receiverIncomingHealAmplifiers,
      nowMs
    );
  const outgoingMultiplier = applyOutgoingAmplifier
    ? 1 +
      resolvingWorldPlazaEntityHealthHealAmplifierBonusRatio(
        giverOutgoingHealAmplifiers,
        nowMs
      )
    : 1;

  return baseHealAmount * outgoingMultiplier * incomingMultiplier;
}
