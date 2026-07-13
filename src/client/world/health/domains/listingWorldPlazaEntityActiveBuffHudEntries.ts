import { checkingWorldPlazaEntityDiseaseIsSymptomaticEntry } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { checkingWorldPlazaEntityBuffShouldHideFromHud } from '@/components/world/health/domains/checkingWorldPlazaEntityActionLocked';
import { checkingWorldPlazaEntityBuffIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityBuffIsActive';
import {
  listingWorldPlazaEntityBuffDescriptors,
  type DefiningWorldPlazaEntityBuffDescriptor,
  type DefiningWorldPlazaEntityBuffPolarity,
} from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { resolvingWorldPlazaEntityDiseaseDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import {
  resolvingWorldPlazaEntityBuffHudIcon,
  type MappingWorldPlazaEntityBuffHudIconName,
} from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';
import { resolvingWorldPlazaEntityBuffHudBonusDetailLines } from '@/components/world/health/domains/resolvingWorldPlazaEntityBuffHudBonusDetailLines';
import { resolvingWorldPlazaEntityDiseaseHudDetailLines } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseHudDetailLines';
import { resolvingWorldPlazaEntityDiseaseWorldEpochMs } from '@/components/world/health/domains/resolvingWorldPlazaEntityDiseaseWorldEpochMs';

const DEFINING_WORLD_PLAZA_ENTITY_WELL_FED_BUFF_ID_PREFIX = 'well-fed-';

export type DefiningWorldPlazaEntityActiveBuffHudEntry = {
  id: string;
  label: string;
  description: string;
  polarity: DefiningWorldPlazaEntityBuffPolarity;
  icon: MappingWorldPlazaEntityBuffHudIconName;
  /** When set, the HUD shows a seconds countdown until this timestamp. */
  expiresAtMs: number | null;
  isDisease?: boolean;
  severityLabel?: string;
  detailLines?: readonly string[];
  hudIconColorClassName?: string;
  hudIconBorderClassName?: string;
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

  if (effect.kind === 'incapacitate_stun') {
    const stunEffect = state.stunEffects.find(
      (entry) => entry.id === descriptor.id
    );

    return stunEffect?.expiresAtMs ?? null;
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

  if (effect.kind === 'heal_block') {
    const modifier = state.healBlockModifiers.find(
      (entry) => entry.id === descriptor.id
    );

    if (!modifier) {
      return null;
    }

    return modifier.expiresAtMs;
  }

  return null;
}

/**
 * Lists active buff/debuff HUD entries for the local player health bar row.
 */
export function listingWorldPlazaEntityActiveBuffHudEntries({
  state,
  nowMs,
  worldEpochMs = resolvingWorldPlazaEntityDiseaseWorldEpochMs(),
  defenderModifierIds,
  attackerModifierIds,
}: {
  state: DefiningWorldPlazaEntityHealthState;
  nowMs: number;
  worldEpochMs?: number;
  defenderModifierIds: readonly string[];
  attackerModifierIds: readonly string[];
}): DefiningWorldPlazaEntityActiveBuffHudEntry[] {
  const buffEntries = listingWorldPlazaEntityBuffDescriptors()
    .filter(
      (descriptor) =>
        !descriptor.hideFromHud &&
        !checkingWorldPlazaEntityBuffShouldHideFromHud(descriptor.id)
    )
    .filter((descriptor) =>
      checkingWorldPlazaEntityBuffIsActive({
        buffId: descriptor.id,
        state,
        nowMs,
        defenderModifierIds,
        attackerModifierIds,
      })
    )
    .map((descriptor) => {
      const detailLines = descriptor.id.startsWith(
        DEFINING_WORLD_PLAZA_ENTITY_WELL_FED_BUFF_ID_PREFIX
      )
        ? resolvingWorldPlazaEntityBuffHudBonusDetailLines(descriptor.effect)
        : undefined;

      return {
        id: descriptor.id,
        label: descriptor.label,
        description: descriptor.description,
        polarity: descriptor.polarity,
        icon: resolvingWorldPlazaEntityBuffHudIcon(descriptor.id),
        expiresAtMs: resolvingWorldPlazaEntityBuffExpiresAtMs(descriptor, state),
        detailLines,
      };
    });

  const diseaseEntries = state.diseaseEffects
    .filter((diseaseEffect) =>
      checkingWorldPlazaEntityDiseaseIsSymptomaticEntry(
        diseaseEffect,
        worldEpochMs
      )
    )
    .map((diseaseEffect) => {
      const descriptor = resolvingWorldPlazaEntityDiseaseDescriptor(
        diseaseEffect.diseaseId as DefiningWorldPlazaEntityDiseaseId
      );
      const detail = resolvingWorldPlazaEntityDiseaseHudDetailLines({
        descriptor,
        diseaseEffect,
        worldEpochMs,
      });

      return {
        id: `disease-${diseaseEffect.id}`,
        label: descriptor.label,
        description: descriptor.description,
        polarity: 'debuff' as const,
        icon: descriptor.icon,
        expiresAtMs: diseaseEffect.expiresAtMs,
        isDisease: true,
        severityLabel: detail.severityLabel,
        detailLines: detail.effectLines,
        hudIconColorClassName: descriptor.hudIconColorClassName,
        hudIconBorderClassName: descriptor.hudIconBorderClassName,
      };
    });

  return [...buffEntries, ...diseaseEntries];
}

/**
 * Computes whole seconds remaining for a timed buff HUD entry.
 * Disease badges expire on world epoch (`Date.now()`); combat buffs use
 * simulation/`performance.now()` timestamps from the health tick.
 */
export function computingWorldPlazaEntityBuffHudRemainingSeconds(
  expiresAtMs: number | null,
  nowMs: number,
  options: { isDisease?: boolean } = {}
): number | null {
  if (expiresAtMs === null) {
    return null;
  }

  const countdownNowMs = options.isDisease
    ? resolvingWorldPlazaEntityDiseaseWorldEpochMs()
    : nowMs;

  return Math.max(0, Math.ceil((expiresAtMs - countdownNowMs) / 1000));
}
