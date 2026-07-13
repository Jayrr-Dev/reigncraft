/**
 * Resolves tier-gated bestiary stat payloads from wildlife registries.
 *
 * @module components/home/domains/resolvingPlazaBestiaryGuideTieredStats
 */

import { checkingPlazaBestiaryStudyTierUnlocked } from '@/components/home/domains/resolvingPlazaBestiaryStudyTier';
import { resolvingWorldPlazaScaledAttackIntervalMs } from '@/components/world/domains/resolvingWorldPlazaGlobalAttackSpeedScale';
import { resolvingWorldPlazaEntityBleedSeverityDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBleedSeverityRegistry';
import { resolvingWorldPlazaEntityBuffDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityBuffRegistry';
import { resolvingWorldPlazaEntityDiseaseDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { resolvingWorldPlazaEntityPoisonPotencyDescriptor } from '@/components/world/health/domains/definingWorldPlazaEntityPoisonPotencyRegistry';
import { resolvingWorldPlazaEntityBuffHudIcon } from '@/components/world/health/domains/mappingWorldPlazaEntityBuffHudIcon';
import { resolvingWildlifeMeatCatalogEntry } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_CONFIG } from '@/components/world/wildlife/domains/definingWildlifeStaminaFatigueConstants';
import { listingWildlifeSpeciesOnHitEffects } from '@/components/world/wildlife/domains/definingWildlifeSpeciesOnHitEffectRegistry';
import {
  resolvingWildlifeSpeciesDefinition,
  type DefiningWildlifeSpeciesDefinition,
} from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type PlazaBestiaryGuideCombatStats = {
  maxHealth: number;
  attackPower: number;
  defense: number;
  attackIntervalMs: number;
  walkSpeedGridPerSecond: number;
  runSpeedGridPerSecond: number;
};

export type PlazaBestiaryGuideOnHitProcRow = {
  icon: string;
  label: string;
  procChancePercent: number;
};

export type PlazaBestiaryGuideEcologyStats = {
  favoritePreyLabels: readonly string[];
  preyAllowLabels: readonly string[];
  aggroRadiusGrid: number;
  packShareRadiusGrid: number;
  staminaDrainMultiplier: number;
  staminaRegenMultiplier: number;
  staminaExhaustedRecoveryRatio: number | null;
  massKg: number;
  trophicTier: number;
};

export type PlazaBestiaryGuideLootStats = {
  rawMeatLabel: string;
  lootQuantity: number;
  rawDiseaseLabel: string | null;
  rawDiseaseIcon: string | null;
  rawDiseaseChancePercent: number | null;
  cookedWellFedLabel: string | null;
  cookedWellFedIcon: string | null;
  cookedWellFedChancePercent: number | null;
  hazardLabels: readonly string[];
};

function formattingPlazaBestiaryProcChancePercent(procChance: number): number {
  return Math.round(procChance * 100);
}

function resolvingPlazaBestiarySpeciesDisplayName(
  speciesId: DefiningWildlifeSpeciesId
): string {
  return (
    resolvingWildlifeSpeciesDefinition(speciesId)?.displayName ?? speciesId
  );
}

function listingPlazaBestiaryOnHitProcRows(
  speciesId: DefiningWildlifeSpeciesId
): readonly PlazaBestiaryGuideOnHitProcRow[] {
  return listingWildlifeSpeciesOnHitEffects(speciesId).map((effect) => {
    if (effect.kind === 'bleed') {
      const descriptor = resolvingWorldPlazaEntityBleedSeverityDescriptor(
        effect.severity
      );

      return {
        icon: descriptor.floatIcon,
        label: descriptor.label,
        procChancePercent: formattingPlazaBestiaryProcChancePercent(
          effect.procChance
        ),
      };
    }

    if (effect.kind === 'poison') {
      const descriptor = resolvingWorldPlazaEntityPoisonPotencyDescriptor(
        effect.potency
      );

      return {
        icon: descriptor.floatIcon,
        label: descriptor.label,
        procChancePercent: formattingPlazaBestiaryProcChancePercent(
          effect.procChance
        ),
      };
    }

    const buffDescriptor = resolvingWorldPlazaEntityBuffDescriptor(
      effect.buffId
    );

    return {
      icon: resolvingWorldPlazaEntityBuffHudIcon(effect.buffId),
      label: buffDescriptor?.label ?? effect.buffId,
      procChancePercent: formattingPlazaBestiaryProcChancePercent(
        effect.procChance
      ),
    };
  });
}

function listingPlazaBestiaryHazardLabels(
  speciesDefinition: DefiningWildlifeSpeciesDefinition
): readonly string[] {
  const labels: string[] = [];

  if (speciesDefinition.hazards.isHeatImmune) {
    labels.push('Heat immune');
  }

  if (speciesDefinition.hazards.isColdImmune) {
    labels.push('Cold immune');
  }

  if (speciesDefinition.hazards.treatsSwampWaterAsSafe) {
    labels.push('Swamp-safe');
  }

  if (speciesDefinition.hazards.treatsLavaAsLethal) {
    labels.push('Lava lethal');
  }

  return labels;
}

/** Combat vitals unlocked at 10 studies. */
export function resolvingPlazaBestiaryGuideCombatStats(
  speciesId: DefiningWildlifeSpeciesId,
  killCount: number
): PlazaBestiaryGuideCombatStats | null {
  if (!checkingPlazaBestiaryStudyTierUnlocked('combat', killCount)) {
    return null;
  }

  const speciesDefinition = resolvingWildlifeSpeciesDefinition(speciesId);

  if (!speciesDefinition) {
    return null;
  }

  return {
    maxHealth: speciesDefinition.vitals.baseMaxHealth,
    attackPower: speciesDefinition.vitals.attackPower,
    defense: speciesDefinition.vitals.defense,
    attackIntervalMs: resolvingWorldPlazaScaledAttackIntervalMs(
      speciesDefinition.vitals.attackIntervalMs
    ),
    walkSpeedGridPerSecond: speciesDefinition.vitals.walkSpeedGridPerSecond,
    runSpeedGridPerSecond: speciesDefinition.vitals.runSpeedGridPerSecond,
  };
}

/** On-hit proc rows unlocked at the procs study tier. */
export function resolvingPlazaBestiaryGuideOnHitProcRows(
  speciesId: DefiningWildlifeSpeciesId,
  killCount: number
): readonly PlazaBestiaryGuideOnHitProcRow[] | null {
  if (!checkingPlazaBestiaryStudyTierUnlocked('procs', killCount)) {
    return null;
  }

  const rows = listingPlazaBestiaryOnHitProcRows(speciesId);

  return rows.length > 0 ? rows : [];
}

/** Ecology and hunting stats unlocked at the ecology study tier. */
export function resolvingPlazaBestiaryGuideEcologyStats(
  speciesId: DefiningWildlifeSpeciesId,
  killCount: number
): PlazaBestiaryGuideEcologyStats | null {
  if (!checkingPlazaBestiaryStudyTierUnlocked('ecology', killCount)) {
    return null;
  }

  const speciesDefinition = resolvingWildlifeSpeciesDefinition(speciesId);

  if (!speciesDefinition) {
    return null;
  }

  return {
    favoritePreyLabels: (speciesDefinition.favoritePreySpeciesIds ?? []).map(
      resolvingPlazaBestiarySpeciesDisplayName
    ),
    preyAllowLabels: (speciesDefinition.preyAllowSpeciesIds ?? []).map(
      resolvingPlazaBestiarySpeciesDisplayName
    ),
    aggroRadiusGrid: speciesDefinition.aggro.aggroRadiusGrid,
    packShareRadiusGrid: speciesDefinition.aggro.packShareRadiusGrid,
    staminaDrainMultiplier: speciesDefinition.stamina.drainMultiplier,
    staminaRegenMultiplier: speciesDefinition.stamina.regenMultiplier,
    staminaExhaustedRecoveryRatio:
      DEFINING_WILDLIFE_STAMINA_FATIGUE_TIER_CONFIG.winded.useUnlockRatio,
    massKg: speciesDefinition.massKg,
    trophicTier: speciesDefinition.trophicTier,
  };
}

/** Loot and disease risk unlocked at the full study tier. */
export function resolvingPlazaBestiaryGuideLootStats(
  speciesId: DefiningWildlifeSpeciesId,
  killCount: number
): PlazaBestiaryGuideLootStats | null {
  if (!checkingPlazaBestiaryStudyTierUnlocked('full', killCount)) {
    return null;
  }

  const speciesDefinition = resolvingWildlifeSpeciesDefinition(speciesId);
  const meatEntry = resolvingWildlifeMeatCatalogEntry(speciesId);

  if (!speciesDefinition) {
    return null;
  }

  const diseaseDescriptor = meatEntry
    ? resolvingWorldPlazaEntityDiseaseDescriptor(meatEntry.rawDiseaseId)
    : null;
  const cookedBuffDescriptor = meatEntry
    ? resolvingWorldPlazaEntityBuffDescriptor(meatEntry.cookedWellFedBuffId)
    : null;

  return {
    rawMeatLabel:
      meatEntry?.rawDisplayName ??
      speciesDefinition.loot.rawMeatItemTypeId ??
      'None',
    lootQuantity: meatEntry?.lootQuantity ?? speciesDefinition.loot.quantity,
    rawDiseaseLabel: diseaseDescriptor?.label ?? null,
    rawDiseaseIcon: diseaseDescriptor?.icon ?? null,
    rawDiseaseChancePercent: meatEntry
      ? formattingPlazaBestiaryProcChancePercent(meatEntry.rawDiseaseChance)
      : null,
    cookedWellFedLabel: cookedBuffDescriptor?.label ?? null,
    cookedWellFedIcon: meatEntry
      ? resolvingWorldPlazaEntityBuffHudIcon(meatEntry.cookedWellFedBuffId)
      : null,
    cookedWellFedChancePercent: meatEntry
      ? formattingPlazaBestiaryProcChancePercent(meatEntry.cookedWellFedChance)
      : null,
    hazardLabels: listingPlazaBestiaryHazardLabels(speciesDefinition),
  };
}
