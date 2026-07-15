/**
 * Resolves transform on-hit / passive trait rows for the character profile panel.
 *
 * @module components/world/domains/resolvingWorldPlazaProfilePanelPassiveEntries
 */

import { resolvingWorldPlazaAnimalPlayableAvatarUnlockWildlifeSpeciesId } from '@/components/world/domains/checkingWorldPlazaAnimalPlayableAvatarSkinStudyUnlocked';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { resolvingWorldPlazaEntityBleedSeverityDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { resolvingWorldPlazaEntityPoisonPotencyDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import { resolvingWorldPlazaEntityBuffHudIcon } from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';
import {
  resolvingWildlifePassiveTraitDefinition,
  type DefiningWildlifePassiveTraitId,
} from '@/components/world/wildlife/domains/definingWildlifePassiveTraitRegistry';
import { listingWildlifeSpeciesOnHitEffects } from '@/components/world/wildlife/domains/definingWildlifeSpeciesOnHitEffectRegistry';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export type ResolvingWorldPlazaProfilePanelPassiveEntry = {
  readonly id: string;
  readonly label: string;
  readonly iconName: string;
  readonly valueText: string;
};

function formattingProcChancePercent(procChance: number): string {
  return `${Math.round(procChance * 100)}%`;
}

/**
 * Lists inherited wildlife on-hit procs and passive traits for one avatar skin.
 */
export function resolvingWorldPlazaProfilePanelPassiveEntries(
  skinId: DefiningWorldPlazaAvatarSkinId
): readonly ResolvingWorldPlazaProfilePanelPassiveEntry[] {
  const speciesId =
    resolvingWorldPlazaAnimalPlayableAvatarUnlockWildlifeSpeciesId(skinId);

  if (!speciesId) {
    return [];
  }

  const entries: ResolvingWorldPlazaProfilePanelPassiveEntry[] = [];

  for (const effect of listingWildlifeSpeciesOnHitEffects(speciesId)) {
    if (effect.kind === 'bleed') {
      const descriptor = resolvingWorldPlazaEntityBleedSeverityDescriptor(
        effect.severity
      );
      entries.push({
        id: `on-hit-bleed-${effect.severity}`,
        label: descriptor.label,
        iconName: descriptor.floatIcon,
        valueText: formattingProcChancePercent(effect.procChance),
      });
      continue;
    }

    if (effect.kind === 'poison') {
      const descriptor = resolvingWorldPlazaEntityPoisonPotencyDescriptor(
        effect.potency
      );
      entries.push({
        id: `on-hit-poison-${effect.potency}`,
        label: descriptor.label,
        iconName: descriptor.floatIcon,
        valueText: formattingProcChancePercent(effect.procChance),
      });
      continue;
    }

    if (effect.kind === 'temperature') {
      const isHeat = effect.deltaCelsius > 0;
      const absDelta = Math.abs(effect.deltaCelsius);
      entries.push({
        id: `on-hit-temperature-${effect.deltaCelsius}`,
        label: isHeat ? `Heat +${absDelta}°C` : `Cold −${absDelta}°C`,
        iconName: 'mdi:thermometer',
        valueText: formattingProcChancePercent(effect.procChance),
      });
      continue;
    }

    const buffDescriptor = resolvingWorldPlazaEntityBuffDescriptor(
      effect.buffId
    );
    entries.push({
      id: `on-hit-buff-${effect.buffId}`,
      label: buffDescriptor?.label ?? effect.buffId,
      iconName: resolvingWorldPlazaEntityBuffHudIcon(effect.buffId),
      valueText: formattingProcChancePercent(effect.procChance),
    });
  }

  const species = resolvingWildlifeSpeciesDefinition(speciesId);
  for (const traitId of species?.passiveTraitIds ?? []) {
    const trait = resolvingWildlifePassiveTraitDefinition(
      traitId as DefiningWildlifePassiveTraitId
    );

    if (!trait) {
      continue;
    }

    entries.push({
      id: `passive-trait-${trait.traitId}`,
      label: trait.displayName,
      iconName: 'mdi:shield-half-full',
      valueText: 'Passive',
    });
  }

  return entries;
}
