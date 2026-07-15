import {
  DEFINING_WORLD_PLAZA_SURVIVAL_ARMOR_TEMPERATURE_MODIFIER_ID_PREFIX,
  DEFINING_WORLD_PLAZA_SURVIVAL_WEAR_CATALOG,
  formattingWorldPlazaSurvivalArmorTemperatureModifierId,
  resolvingWorldPlazaSurvivalWearCatalogEntry,
} from '@/components/world/equipment/domains/definingWorldPlazaSurvivalWearBuffRegistry';
import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import { addingWorldPlazaEntityHealthTimedTemperatureModifier } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { creatingWorldPlazaEntityHealthTimedTemperatureModifier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance';

const DEFINING_WORLD_PLAZA_SURVIVAL_ARMOR_MODIFIER_DURATION_MS = 100 * 365 * 24 * 60 * 60 * 1000;

function clearingWorldPlazaSurvivalArmorTemperatureModifiers(
  state: DefiningWorldPlazaEntityHealthState
): DefiningWorldPlazaEntityHealthState {
  return {
    ...state,
    timedTemperatureModifiers: state.timedTemperatureModifiers.filter(
      (modifier) =>
        !modifier.id.startsWith(
          DEFINING_WORLD_PLAZA_SURVIVAL_ARMOR_TEMPERATURE_MODIFIER_ID_PREFIX
        )
    ),
  };
}

function listingWorldPlazaEquippedSurvivalWearEntries(
  loadout: DefiningWorldPlazaArmorLoadoutState
) {
  const entries: {
    slotId: DefiningWorldPlazaArmorSlotId;
    itemTypeId: string;
  }[] = [];

  for (const slotId of Object.keys(loadout) as DefiningWorldPlazaArmorSlotId[]) {
    const equipped = loadout[slotId];

    if (!equipped) {
      continue;
    }

    const wearEntry = resolvingWorldPlazaSurvivalWearCatalogEntry(
      equipped.itemTypeId
    );

    if (!wearEntry) {
      continue;
    }

    entries.push({ slotId, itemTypeId: equipped.itemTypeId });
  }

  return entries;
}

/**
 * Rebuilds survival-armor timed temperature modifiers from the current loadout.
 */
export function syncingWorldPlazaArmorWornTemperatureModifiers(
  state: DefiningWorldPlazaEntityHealthState,
  loadout: DefiningWorldPlazaArmorLoadoutState,
  nowMs: number
): DefiningWorldPlazaEntityHealthState {
  let nextState = clearingWorldPlazaSurvivalArmorTemperatureModifiers(state);

  for (const equipped of listingWorldPlazaEquippedSurvivalWearEntries(loadout)) {
    const wearEntry = DEFINING_WORLD_PLAZA_SURVIVAL_WEAR_CATALOG.find(
      (entry) => entry.itemTypeId === equipped.itemTypeId
    );

    if (!wearEntry) {
      continue;
    }

    const bonus = wearEntry.temperatureBonus;
    const hasBonus =
      bonus.heatComfortBonusCelsius > 0 ||
      bonus.coldComfortBonusCelsius > 0 ||
      bonus.heatResistance > 0 ||
      bonus.coldResistance > 0;

    if (!hasBonus) {
      continue;
    }

    nextState = addingWorldPlazaEntityHealthTimedTemperatureModifier(
      nextState,
      creatingWorldPlazaEntityHealthTimedTemperatureModifier(
        formattingWorldPlazaSurvivalArmorTemperatureModifierId(equipped.slotId),
        {
          heatComfortBonusCelsius: bonus.heatComfortBonusCelsius,
          coldComfortBonusCelsius: bonus.coldComfortBonusCelsius,
          heatResistance: bonus.heatResistance,
          coldResistance: bonus.coldResistance,
          diseaseContractionChanceMultiplier: 1,
          expiresAtMs:
            nowMs + DEFINING_WORLD_PLAZA_SURVIVAL_ARMOR_MODIFIER_DURATION_MS,
        }
      )
    );
  }

  return nextState;
}
