/**
 * Picks ore-smelting popover chrome from station block definition id.
 *
 * @module components/world/crafting/domains/resolvingWorldPlazaOreSmeltingPopoverUi
 */

import {
  DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_UI_BY_STATION,
  DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_UI_FALLBACK,
  type DefiningWorldPlazaOreSmeltingPopoverUiTheme,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingPopoverUiConstants';

/**
 * Resolves input-slot label, idle hint, and panel classes for one station.
 *
 * @param stationBlockDefinitionId - Placed utility definition id.
 */
export function resolvingWorldPlazaOreSmeltingPopoverUi(
  stationBlockDefinitionId: string
): DefiningWorldPlazaOreSmeltingPopoverUiTheme {
  return (
    DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_UI_BY_STATION[
      stationBlockDefinitionId as keyof typeof DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_UI_BY_STATION
    ] ?? DEFINING_WORLD_PLAZA_ORE_SMELTING_POPOVER_UI_FALLBACK
  );
}
