/**
 * Resolves build/claim function popover chrome from declarative style tokens.
 *
 * @module components/world/building/domains/resolvingWorldPlazaBuildModeFunctionPopoverChrome
 */

import {
  STYLING_WORLD_PLAZA_CLAIM_MODE_PLOT_POPOVER_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_CLAIM_MODE_PLOT_POPOVER_TITLE_CLASS_NAME,
  STYLING_WORLD_PLAZA_CLAIM_MODE_SAVES_POPOVER_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_CLAIM_MODE_SAVES_POPOVER_TITLE_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import {
  STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_TITLE_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldPlazaBuildModeFunctionHotbarConstants';
import {
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID,
  type DefiningWorldPlazaEditModeFunctionId,
} from '@/components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry';

/**
 * Resolves the outer popover shell class for one edit-mode function.
 *
 * @param functionId - Active build/claim function id.
 */
export function resolvingWorldPlazaBuildModeFunctionPopoverPanelClassName(
  functionId: DefiningWorldPlazaEditModeFunctionId
): string {
  if (functionId === DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLOTS) {
    return STYLING_WORLD_PLAZA_CLAIM_MODE_PLOT_POPOVER_PANEL_CLASS_NAME;
  }

  if (functionId === DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.SAVES) {
    return STYLING_WORLD_PLAZA_CLAIM_MODE_SAVES_POPOVER_PANEL_CLASS_NAME;
  }

  return STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_PANEL_CLASS_NAME;
}

/**
 * Resolves the popover title row class for one edit-mode function.
 *
 * @param functionId - Active build/claim function id.
 */
export function resolvingWorldPlazaBuildModeFunctionPopoverTitleClassName(
  functionId: DefiningWorldPlazaEditModeFunctionId
): string {
  if (functionId === DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLOTS) {
    return STYLING_WORLD_PLAZA_CLAIM_MODE_PLOT_POPOVER_TITLE_CLASS_NAME;
  }

  if (functionId === DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.SAVES) {
    return STYLING_WORLD_PLAZA_CLAIM_MODE_SAVES_POPOVER_TITLE_CLASS_NAME;
  }

  return STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_POPOVER_TITLE_CLASS_NAME;
}
