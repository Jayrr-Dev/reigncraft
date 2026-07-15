/**
 * Builds the declarative vital and attribute rows shown in the character
 * profile panel from live HUD snapshots and derived character stats.
 *
 * @module components/world/domains/resolvingWorldPlazaProfilePanelSections
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { ComputingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import {
  DEFINING_WORLD_PLAZA_CHARACTER_HEIGHT_ATTRIBUTE_ICON,
  LABELING_WORLD_PLAZA_CHARACTER_HEIGHT_ATTRIBUTE,
} from '@/components/world/character/domains/definingWorldPlazaCharacterHeightDisplayConstants';
import {
  DEFINING_WORLD_PLAZA_CHARACTER_WEIGHT_ATTRIBUTE_ICON,
  LABELING_WORLD_PLAZA_CHARACTER_WEIGHT_ATTRIBUTE,
} from '@/components/world/character/domains/definingWorldPlazaCharacterWeightDisplayConstants';
import { resolvingWorldPlazaCharacterHeightDisplayText } from '@/components/world/character/domains/resolvingWorldPlazaCharacterHeightDisplayText';
import { resolvingWorldPlazaCharacterWeightDisplayText } from '@/components/world/character/domains/resolvingWorldPlazaCharacterWeightDisplayText';
import type { DefiningWorldPlazaAvatarSkinId } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_FORWARD_GRID_DISTANCE,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_FORWARD_GRID_DISTANCE,
} from '@/components/world/domains/definingWorldPlazaGirlSampleJumpConstants';
import {
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ACCELERATION_ATTRIBUTE_ICON,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_COLD_THRESHOLD_ATTRIBUTE_ICON,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_HEAT_THRESHOLD_ATTRIBUTE_ICON,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_JUMP_COST_ATTRIBUTE_ICON,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_JUMP_DISTANCE_ATTRIBUTE_ICON,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_JUMP_HEIGHT_ATTRIBUTE_ICON,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ROLL_COST_ATTRIBUTE_ICON,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_STAMINA_REGEN_ATTRIBUTE_ICON,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_TOP_SPEED_ATTRIBUTE_ICON,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_ACCELERATION_ATTRIBUTE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_AGILITY_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_COLD_THRESHOLD_ATTRIBUTE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_COMBAT_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_HEAT_THRESHOLD_ATTRIBUTE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_JUMP_COST_ATTRIBUTE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_JUMP_DISTANCE_ATTRIBUTE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_JUMP_HEIGHT_ATTRIBUTE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_PHYSICALITY_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_ROLL_COST_ATTRIBUTE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_STAMINA_REGEN_ATTRIBUTE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_TOP_SPEED_ATTRIBUTE,
  type DefiningWorldPlazaProfilePanelAttributeCategoryId,
} from '@/components/world/domains/definingWorldPlazaProfilePanelConstants';
import {
  DEFINING_WORLD_PLAZA_JUMP_STAMINA_COST_RATIO,
  DEFINING_WORLD_PLAZA_ROLL_STAMINA_COST_RATIO,
  DEFINING_WORLD_PLAZA_RUN_JUMP_STAMINA_COST_RATIO,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND,
} from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import { formattingWorldPlazaProfilePanelAttackValueParts } from '@/components/world/domains/formattingWorldPlazaProfilePanelAttackValueParts';
import { resolvingWorldPlazaProfilePanelAttackBonusDetailLines } from '@/components/world/domains/resolvingWorldPlazaProfilePanelAttackBonusDetailLines';
import {
  resolvingWorldPlazaProfilePanelImmunityEntries,
  type ResolvingWorldPlazaProfilePanelImmunitySections,
} from '@/components/world/domains/resolvingWorldPlazaProfilePanelImmunityEntries';
import type { ResolvingWorldPlazaProfilePanelPassiveEntry } from '@/components/world/domains/resolvingWorldPlazaProfilePanelPassiveEntries';
import { resolvingWorldPlazaProfilePanelPassiveEntries } from '@/components/world/domains/resolvingWorldPlazaProfilePanelPassiveEntries';
import { resolvingWorldPlazaEquippedAttackEv } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedAttackEv';
import { formattingWorldPlazaTemperature } from '@/components/world/health/domains/convertingWorldPlazaTemperatureUnits';
import { resolvingWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureComfortBand';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';
import type { UsingWorldPlazaPlayerHungerHudSnapshot } from '@/components/world/hunger/hooks/usingWorldPlazaPlayerHunger';
import { DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';

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
  /** Signed bonus after valueText (e.g. `+10`); click may open detail popover. */
  valueBonusText?: string;
  valueBonusTone?: 'positive' | 'negative';
  /** Popover lines explaining valueBonusText sources. */
  valueBonusDetailLines?: readonly string[];
};

/** One labeled attribute category on the Stats tab. */
export type ResolvingWorldPlazaProfilePanelAttributeCategory = {
  id: DefiningWorldPlazaProfilePanelAttributeCategoryId;
  label: string;
  entries: readonly ResolvingWorldPlazaProfilePanelAttributeEntry[];
};

/** Resolved profile panel content. */
export type ResolvingWorldPlazaProfilePanelSections = {
  vitalRows: readonly ResolvingWorldPlazaProfilePanelVitalRow[];
  attributeCategories: readonly ResolvingWorldPlazaProfilePanelAttributeCategory[];
  /** Flat attribute list across all categories (tests / lookups). */
  attributeEntries: readonly ResolvingWorldPlazaProfilePanelAttributeEntry[];
  passiveEntries: readonly ResolvingWorldPlazaProfilePanelPassiveEntry[];
  /** Immune system factor + permanent disease immunities. */
  immunity: ResolvingWorldPlazaProfilePanelImmunitySections;
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

function formattingProfilePanelJumpDistanceGrid(distance: number): string {
  return (Math.round(distance * 10) / 10).toFixed(1);
}

function formattingProfilePanelStaminaCostPercent(ratio: number): string {
  return `${Math.round(ratio * 100)}%`;
}

function formattingProfilePanelStaminaRegenPerSecond(
  ratioPerSecond: number
): string {
  return `+${Math.round(ratioPerSecond * 100)}%/s`;
}

function formattingProfilePanelAccelerationGridPerSec2(
  walkSpeedGridPerSecond: number,
  runSpeedGridPerSecond: number,
  rampSeconds: number
): string {
  const safeRampSeconds = Math.max(rampSeconds, Number.EPSILON);
  const accelerationGridPerSec2 =
    (runSpeedGridPerSecond - walkSpeedGridPerSecond) / safeRampSeconds;

  return `${accelerationGridPerSec2.toFixed(2)}/s²`;
}

/**
 * Resolves the profile panel vital bars and attribute chips from live data.
 */
export function resolvingWorldPlazaProfilePanelSections(input: {
  health: UsingWorldPlazaPlayerHealthHudSnapshot;
  stamina: ResolvingWorldPlazaProfilePanelStaminaHud;
  hunger: UsingWorldPlazaPlayerHungerHudSnapshot;
  derivedStats: ComputingWorldPlazaCharacterEngineDerivedStats;
  skinId?: DefiningWorldPlazaAvatarSkinId;
  inventoryState?: DefiningInventoryState;
  equippedWeaponSlotIndex?: number | null;
}): ResolvingWorldPlazaProfilePanelSections {
  const {
    health,
    stamina,
    hunger,
    derivedStats,
    skinId,
    inventoryState,
    equippedWeaponSlotIndex = DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX,
  } = input;
  const comfortBand = resolvingWorldPlazaEntityTemperatureComfortBand(
    health.temperatureResistance
  );

  const equippedAttackEv = inventoryState
    ? resolvingWorldPlazaEquippedAttackEv(
        derivedStats.attackPower,
        inventoryState,
        equippedWeaponSlotIndex
      )
    : derivedStats.attackPower;

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

  const attackValueParts = formattingWorldPlazaProfilePanelAttackValueParts(
    derivedStats.attackPower,
    equippedAttackEv
  );
  const attackBonusDetailLines = inventoryState
    ? resolvingWorldPlazaProfilePanelAttackBonusDetailLines(
        derivedStats.attackPower,
        inventoryState,
        equippedWeaponSlotIndex
      )
    : [];

  const combatEntries: ResolvingWorldPlazaProfilePanelAttributeEntry[] = [
    {
      id: 'attack',
      label: 'Attack',
      iconName: 'boxicons:sword-filled',
      valueText: attackValueParts.baseText,
      ...(attackValueParts.bonusText !== null &&
      attackValueParts.bonusTone !== null
        ? {
            valueBonusText: attackValueParts.bonusText,
            valueBonusTone: attackValueParts.bonusTone,
            valueBonusDetailLines: attackBonusDetailLines,
          }
        : {}),
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
  ];

  const agilityEntries: ResolvingWorldPlazaProfilePanelAttributeEntry[] = [
    {
      id: 'move-speed',
      label: 'Speed',
      iconName: 'mdi:run-fast',
      valueText: `${derivedStats.walkSpeedGridPerSecond.toFixed(1)} / ${derivedStats.runSpeedGridPerSecond.toFixed(1)}`,
    },
    {
      id: 'acceleration',
      label: LABELING_WORLD_PLAZA_PROFILE_PANEL_ACCELERATION_ATTRIBUTE,
      iconName: DEFINING_WORLD_PLAZA_PROFILE_PANEL_ACCELERATION_ATTRIBUTE_ICON,
      valueText: formattingProfilePanelAccelerationGridPerSec2(
        derivedStats.walkSpeedGridPerSecond,
        derivedStats.runSpeedGridPerSecond,
        DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS
      ),
    },
    {
      id: 'top-speed',
      label: LABELING_WORLD_PLAZA_PROFILE_PANEL_TOP_SPEED_ATTRIBUTE,
      iconName: DEFINING_WORLD_PLAZA_PROFILE_PANEL_TOP_SPEED_ATTRIBUTE_ICON,
      valueText: derivedStats.runSpeedGridPerSecond.toFixed(1),
    },
    {
      id: 'jump-distance',
      label: LABELING_WORLD_PLAZA_PROFILE_PANEL_JUMP_DISTANCE_ATTRIBUTE,
      iconName: DEFINING_WORLD_PLAZA_PROFILE_PANEL_JUMP_DISTANCE_ATTRIBUTE_ICON,
      valueText: `${formattingProfilePanelJumpDistanceGrid(
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_JUMP_FORWARD_GRID_DISTANCE *
          derivedStats.jumpDistanceScale
      )} / ${formattingProfilePanelJumpDistanceGrid(
        DEFINING_WORLD_PLAZA_GIRL_SAMPLE_RUN_JUMP_FORWARD_GRID_DISTANCE *
          derivedStats.jumpDistanceScale
      )}`,
    },
    {
      id: 'jump-height',
      label: LABELING_WORLD_PLAZA_PROFILE_PANEL_JUMP_HEIGHT_ATTRIBUTE,
      iconName: DEFINING_WORLD_PLAZA_PROFILE_PANEL_JUMP_HEIGHT_ATTRIBUTE_ICON,
      valueText: `${derivedStats.maxJumpLayerReach}L`,
    },
    {
      id: 'jump-cost',
      label: LABELING_WORLD_PLAZA_PROFILE_PANEL_JUMP_COST_ATTRIBUTE,
      iconName: DEFINING_WORLD_PLAZA_PROFILE_PANEL_JUMP_COST_ATTRIBUTE_ICON,
      valueText: `${formattingProfilePanelStaminaCostPercent(
        DEFINING_WORLD_PLAZA_JUMP_STAMINA_COST_RATIO
      )} / ${formattingProfilePanelStaminaCostPercent(
        DEFINING_WORLD_PLAZA_RUN_JUMP_STAMINA_COST_RATIO
      )}`,
    },
    {
      id: 'roll-cost',
      label: LABELING_WORLD_PLAZA_PROFILE_PANEL_ROLL_COST_ATTRIBUTE,
      iconName: DEFINING_WORLD_PLAZA_PROFILE_PANEL_ROLL_COST_ATTRIBUTE_ICON,
      valueText: formattingProfilePanelStaminaCostPercent(
        DEFINING_WORLD_PLAZA_ROLL_STAMINA_COST_RATIO
      ),
    },
    {
      id: 'stamina-regen',
      label: LABELING_WORLD_PLAZA_PROFILE_PANEL_STAMINA_REGEN_ATTRIBUTE,
      iconName: DEFINING_WORLD_PLAZA_PROFILE_PANEL_STAMINA_REGEN_ATTRIBUTE_ICON,
      valueText: formattingProfilePanelStaminaRegenPerSecond(
        DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND
      ),
    },
  ];

  const physicalityEntries: ResolvingWorldPlazaProfilePanelAttributeEntry[] = [
    {
      id: 'height',
      label: LABELING_WORLD_PLAZA_CHARACTER_HEIGHT_ATTRIBUTE,
      iconName: DEFINING_WORLD_PLAZA_CHARACTER_HEIGHT_ATTRIBUTE_ICON,
      valueText: resolvingWorldPlazaCharacterHeightDisplayText(
        derivedStats.heightWorldLayers
      ),
    },
    {
      id: 'weight',
      label: LABELING_WORLD_PLAZA_CHARACTER_WEIGHT_ATTRIBUTE,
      iconName: DEFINING_WORLD_PLAZA_CHARACTER_WEIGHT_ATTRIBUTE_ICON,
      valueText: resolvingWorldPlazaCharacterWeightDisplayText(
        derivedStats.massKg
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

  const attributeCategories: ResolvingWorldPlazaProfilePanelAttributeCategory[] =
    [
      {
        id: 'combat',
        label: LABELING_WORLD_PLAZA_PROFILE_PANEL_COMBAT_SECTION,
        entries: combatEntries,
      },
      {
        id: 'agility',
        label: LABELING_WORLD_PLAZA_PROFILE_PANEL_AGILITY_SECTION,
        entries: agilityEntries,
      },
      {
        id: 'physicality',
        label: LABELING_WORLD_PLAZA_PROFILE_PANEL_PHYSICALITY_SECTION,
        entries: physicalityEntries,
      },
    ];

  const attributeEntries = attributeCategories.flatMap(
    (category) => category.entries
  );

  const passiveEntries = skinId
    ? resolvingWorldPlazaProfilePanelPassiveEntries(skinId)
    : [];

  const immunity = resolvingWorldPlazaProfilePanelImmunityEntries({
    immuneSystemFactor: health.immuneSystemFactor,
    diseaseImmunityIds: health.diseaseImmunityIds,
  });

  return {
    vitalRows,
    attributeCategories,
    attributeEntries,
    passiveEntries,
    immunity,
  };
}
