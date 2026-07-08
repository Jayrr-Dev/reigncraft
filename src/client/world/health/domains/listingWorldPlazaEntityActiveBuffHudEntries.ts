import { checkingWorldPlazaEntityBuffIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityBuffIsActive';
import {
  listingWorldPlazaEntityBuffDescriptors,
  type DefiningWorldPlazaEntityBuffDescriptor,
  type DefiningWorldPlazaEntityBuffPolarity,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  resolvingWorldPlazaEntityBuffHudIcon,
  type MappingWorldPlazaEntityBuffHudIconName,
} from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';

export type DefiningWorldPlazaEntityActiveBuffHudEntry = {
  id: string;
  label: string;
  description: string;
  polarity: DefiningWorldPlazaEntityBuffPolarity;
  icon: MappingWorldPlazaEntityBuffHudIconName;
  /** When set, the HUD shows a seconds countdown until this timestamp. */
  expiresAtMs: number | null;
};

function resolvingWorldPlazaEntityBuffExpiresAtMs(
  descriptor: DefiningWorldPlazaEntityBuffDescriptor,
  state: DefiningWorldPlazaEntityHealthState
): number | null {
  const { effect } = descriptor;

  if (effect.kind === 'incoming_damage_multiplier') {
    const modifier = state.incomingDamageModifiers.find(
      (entry) => entry.id === descriptor.id
    );

    return modifier?.expiresAtMs ?? null;
  }

  if (effect.kind === 'physical_damage_lifesteal') {
    const modifier = state.physicalDamageLifestealModifiers.find(
      (entry) => entry.id === descriptor.id
    );

    return modifier?.expiresAtMs ?? null;
  }

  if (effect.kind === 'incoming_physical_damage_heal') {
    const modifier = state.incomingDamageHealModifiers.find(
      (entry) => entry.id === descriptor.id
    );

    return modifier?.expiresAtMs ?? null;
  }

  if (effect.kind === 'incoming_heal_amplifier') {
    const modifier = state.incomingHealAmplifiers.find(
      (entry) => entry.id === descriptor.id
    );

    return modifier?.expiresAtMs ?? null;
  }

  if (effect.kind === 'outgoing_heal_amplifier') {
    const modifier = state.outgoingHealAmplifiers.find(
      (entry) => entry.id === descriptor.id
    );

    return modifier?.expiresAtMs ?? null;
  }

  if (effect.kind === 'temporary_max_health') {
    const bonus = state.temporaryMaxHealthBonuses.find(
      (entry) => entry.id === descriptor.id
    );

    return bonus?.expiresAtMs ?? null;
  }

  if (effect.kind === 'movement_modifier') {
    const modifier = state.movementModifiers.find(
      (entry) => entry.id === descriptor.id
    );

    return modifier?.expiresAtMs ?? null;
  }

  if (effect.kind === 'movement_confusion') {
    const confusionEffect = state.confusionEffects.find(
      (entry) => entry.id === descriptor.id
    );

    return confusionEffect?.expiresAtMs ?? null;
  }

  if (effect.kind === 'incapacitate_sleep') {
    const sleepEffect = state.sleepEffects.find(
      (entry) => entry.id === descriptor.id
    );

    return sleepEffect?.expiresAtMs ?? null;
  }

  if (effect.kind === 'invincibility_toggle') {
    if (
      state.invincibleUntilMs === null ||
      !Number.isFinite(state.invincibleUntilMs)
    ) {
      return null;
    }

    return state.invincibleUntilMs;
  }

  return null;
}

/**
 * Lists active buff/debuff HUD entries for the local player health bar row.
 */
export function listingWorldPlazaEntityActiveBuffHudEntries({
  state,
  nowMs,
  defenderModifierIds,
  attackerModifierIds,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  defenderModifierIds: readonly string[];
  attackerModifierIds: readonly string[];
}): DefiningWorldPlazaEntityActiveBuffHudEntry[] {
  return listingWorldPlazaEntityBuffDescriptors()
    .filter((descriptor) =>
      checkingWorldPlazaEntityBuffIsActive({
        buffId: descriptor.id,
        state,
        nowMs,
        defenderModifierIds,
        attackerModifierIds,
      })
    )
    .map((descriptor) => ({
      id: descriptor.id,
      label: descriptor.label,
      description: descriptor.description,
      polarity: descriptor.polarity,
      icon: resolvingWorldPlazaEntityBuffHudIcon(descriptor.id),
      expiresAtMs: resolvingWorldPlazaEntityBuffExpiresAtMs(descriptor, state),
    }));
}

/**
 * Computes whole seconds remaining for a timed buff HUD entry.
 */
export function computingWorldPlazaEntityBuffHudRemainingSeconds(
  expiresAtMs: number | null,
  nowMs: number
): number | null {
  if (expiresAtMs === null) {
    return null;
  }

  return Math.max(0, Math.ceil((expiresAtMs - nowMs) / 1000));
}
