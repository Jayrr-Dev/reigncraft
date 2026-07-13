/**
 * Builds the declarative vital and attribute rows shown in the character
 * profile panel from live HUD snapshots and derived character stats.
 *
 * @module components/world/domains/resolvingWorldPlazaProfilePanelSections
 */

import type { ComputingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import {
  DEFINING_WORLD_PLAZA_CHARACTER_HEIGHT_ATTRIBUTE_ICON,
  LABELING_WORLD_PLAZA_CHARACTER_HEIGHT_ATTRIBUTE,
} from '@/components/world/character/domains/definingWorldPlazaCharacterHeightDisplayConstants';
import { resolvingWorldPlazaCharacterHeightDisplayText } from '@/components/world/character/domains/resolvingWorldPlazaCharacterHeightDisplayText';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import {
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_COLD_THRESHOLD_ATTRIBUTE_ICON,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_HEAT_THRESHOLD_ATTRIBUTE_ICON,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_COLD_THRESHOLD_ATTRIBUTE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_HEAT_THRESHOLD_ATTRIBUTE,
} from '@/components/world/domains/definingWorldPlazaProfilePanelConstants';
import { DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND } from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import { formattingWorldPlazaTemperature } from '@/components/world/health/domains/convertingWorldPlazaTemperatureUnits';
import { resolvingWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureComfortBand';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import type { UsingWorldPlazaPlayerHungerHudSnapshot } from '@/components/world/hunger/hooks/usingWorldPlazaPlayerHunger';

/** Live stamina HUD values consumed by the profile panel. */
export type ResolvingWorldPlazaProfilePanelStaminaHud = {
  staminaRatio: number;
  isRunning: boolean;
  isDepleted: boolean;
};

/** One vital bar row (health, stamina, hunger). */
export type ResolvingWorldPlazaProfilePanelVitalRow = {
  id: string;
  label: string;
  iconName: string;
  /** Real numbers shown at the end of the label line. */
  valueText: string;
  /** Short live-state caption under the bar. */
  detailText: string;
  /** 0..1 fill for the bar track. */
  ratio: number;
  fillClassName: string;
};

/** One attribute chip (attack, defense, ...). */
export type ResolvingWorldPlazaProfilePanelAttributeEntry = {
  id: string;
  label: string;
  iconName: string;
  valueText: string;
};

/** Resolved profile panel content. */
export type ResolvingWorldPlazaProfilePanelSections = {
  vitalRows: readonly ResolvingWorldPlazaProfilePanelVitalRow[];
  attributeEntries: readonly ResolvingWorldPlazaProfilePanelAttributeEntry[];
};

const DEFINING_PROFILE_PANEL_HUNGER_TIER_LABELS: Record<
  DefiningWorldPlazaHungerTier,
  string
> = {
  well_fed: 'Well fed',
  content: 'Content',
  peckish: 'Peckish',
  hungry: 'Hungry',
  starving: 'Starving',
};

function resolvingVitalFillClassName(ratio: number): string {
  const { meter } = DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE;

  if (ratio <= 0.2) {
    return `${meter.fillBase} ${meter.fillDepleted}`;
  }

  if (ratio <= 0.5) {
    return `${meter.fillBase} ${meter.fillLow}`;
  }

  return `${meter.fillBase} ${meter.fillReady}`;
}

function resolvingStaminaDetailText(
  stamina: ResolvingWorldPlazaProfilePanelStaminaHud
): string {
  const regenPercentPerSecond = Math.round(
    DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND * 100
  );

  if (stamina.isDepleted) {
    return 'Exhausted, catching breath';
  }

  if (stamina.isRunning) {
    return 'Draining while sprinting';
  }

  if (stamina.staminaRatio < 1) {
    return `Recovering +${regenPercentPerSecond}%/s`;
  }

  return 'Full';
}

function resolvingHealthDetailText(
  health: UsingWorldPlazaPlayerHealthHudSnapshot,
  healthRegenPerSecond: number
): string {
  const regenText = `Regenerates +${healthRegenPerSecond}/s while fed`;

  if (health.shieldPoints > 0) {
    return `${Math.round(health.shieldPoints)} shield · ${regenText}`;
  }

  return regenText;
}

function resolvingHungerDetailText(
  hunger: UsingWorldPlazaPlayerHungerHudSnapshot
): string {
  if (hunger.isStarving) {
    return 'Starving, health draining';
  }

  return DEFINING_PROFILE_PANEL_HUNGER_TIER_LABELS[hunger.tier];
}

/**
 * Resolves the profile panel vital bars and attribute chips from live data.
 */
export function resolvingWorldPlazaProfilePanelSections(input: {
  health: UsingWorldPlazaPlayerHealthHudSnapshot;
  stamina: ResolvingWorldPlazaProfilePanelStaminaHud;
  hunger: UsingWorldPlazaPlayerHungerHudSnapshot;
  derivedStats: ComputingWorldPlazaCharacterEngineDerivedStats;
}): ResolvingWorldPlazaProfilePanelSections {
  const { health, stamina, hunger, derivedStats } = input;
  const comfortBand = resolvingWorldPlazaEntityTemperatureComfortBand(
    health.temperatureResistance
  );

  const vitalRows: ResolvingWorldPlazaProfilePanelVitalRow[] = [
    {
      id: 'health',
      label: 'Health',
      iconName: 'solar:heart-pulse-bold',
      valueText: `${Math.round(health.currentHealth)} / ${Math.round(health.effectiveMaxHealth)}`,
      detailText: resolvingHealthDetailText(
        health,
        derivedStats.healthRegenPerSecond
      ),
      ratio: health.healthRatio,
      fillClassName: resolvingVitalFillClassName(health.healthRatio),
    },
    {
      id: 'stamina',
      label: 'Stamina',
      iconName: 'ph:person-simple-run',
      valueText: `${Math.round(stamina.staminaRatio * 100)}%`,
      detailText: resolvingStaminaDetailText(stamina),
      ratio: stamina.staminaRatio,
      fillClassName: resolvingVitalFillClassName(stamina.staminaRatio),
    },
    {
      id: 'hunger',
      label: 'Hunger',
      iconName: 'mdi:food-drumstick',
      valueText: `${Math.round(hunger.hungerRatio * 100)}%`,
      detailText: resolvingHungerDetailText(hunger),
      ratio: hunger.hungerRatio,
      fillClassName: resolvingVitalFillClassName(hunger.hungerRatio),
    },
  ];

  const attributeEntries: ResolvingWorldPlazaProfilePanelAttributeEntry[] = [
    {
      id: 'attack',
      label: 'Attack',
      iconName: 'boxicons:sword-filled',
      valueText: `${Math.round(derivedStats.attackPower)}`,
    },
    {
      id: 'defense',
      label: 'Defense',
      iconName: 'mdi:shield-half-full',
      valueText: `${Math.round(derivedStats.defense)}`,
    },
    {
      id: 'attack-speed',
      label: 'Attack speed',
      iconName: 'mdi:flash',
      valueText: `${derivedStats.attackSpeed.toFixed(1)}/s`,
    },
    {
      id: 'move-speed',
      label: 'Speed',
      iconName: 'mdi:run-fast',
      valueText: `${derivedStats.walkSpeedGridPerSecond.toFixed(1)} / ${derivedStats.runSpeedGridPerSecond.toFixed(1)}`,
    },
    {
      id: 'height',
      label: LABELING_WORLD_PLAZA_CHARACTER_HEIGHT_ATTRIBUTE,
      iconName: DEFINING_WORLD_PLAZA_CHARACTER_HEIGHT_ATTRIBUTE_ICON,
      valueText: resolvingWorldPlazaCharacterHeightDisplayText(
        derivedStats.heightWorldLayers
      ),
    },
    {
      id: 'cold-threshold',
      label: LABELING_WORLD_PLAZA_PROFILE_PANEL_COLD_THRESHOLD_ATTRIBUTE,
      iconName:
        DEFINING_WORLD_PLAZA_PROFILE_PANEL_COLD_THRESHOLD_ATTRIBUTE_ICON,
      valueText: formattingWorldPlazaTemperature(
        comfortBand.comfortLowCelsius,
        health.temperatureDisplayUnit
      ),
    },
    {
      id: 'heat-threshold',
      label: LABELING_WORLD_PLAZA_PROFILE_PANEL_HEAT_THRESHOLD_ATTRIBUTE,
      iconName:
        DEFINING_WORLD_PLAZA_PROFILE_PANEL_HEAT_THRESHOLD_ATTRIBUTE_ICON,
      valueText: formattingWorldPlazaTemperature(
        comfortBand.comfortHighCelsius,
        health.temperatureDisplayUnit
      ),
    },
  ];

  return { vitalRows, attributeEntries };
}
