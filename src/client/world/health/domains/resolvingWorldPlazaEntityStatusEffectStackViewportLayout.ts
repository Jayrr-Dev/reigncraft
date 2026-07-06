import { computingWorldPlazaActionBarOccupiedHeightPx } from '@/components/world/domains/computingWorldPlazaActionBarOccupiedHeightPx';
import {
  DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_BELOW_ACTION_BAR_GAP_BASE_PX,
  STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_ANCHOR_CLASS_NAME,
  resolvingWorldPlazaEntityStatusEffectStackTopClassName,
} from '@/components/world/health/domains/definingWorldPlazaEntityStatusEffectStackConstants';
import type { CSSProperties } from 'react';

export type DefiningWorldPlazaEntityStatusEffectStackViewportLayout = {
  anchorClassName: string;
  style: CSSProperties;
};

/**
 * Resolves anchor classes and top offset for the status effect stack.
 */
export function resolvingWorldPlazaEntityStatusEffectStackViewportLayout({
  viewportHudScale,
  hasOnlineRoomHud,
  isMobile = false,
}: {
  viewportHudScale: number;
  hasOnlineRoomHud: boolean;
  isMobile?: boolean;
}): DefiningWorldPlazaEntityStatusEffectStackViewportLayout {
  if (isMobile) {
    return {
      anchorClassName:
        STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_ANCHOR_CLASS_NAME,
      style: {
        top:
          computingWorldPlazaActionBarOccupiedHeightPx(viewportHudScale, true) +
          DEFINING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_MOBILE_BELOW_ACTION_BAR_GAP_BASE_PX,
      },
    };
  }

  return {
    anchorClassName: `${STYLING_WORLD_PLAZA_ENTITY_STATUS_EFFECT_STACK_ANCHOR_CLASS_NAME} ${resolvingWorldPlazaEntityStatusEffectStackTopClassName(hasOnlineRoomHud, false)}`,
    style: {},
  };
}
