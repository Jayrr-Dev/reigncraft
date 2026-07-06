import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT } from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';
import { DEFINING_WORLD_PLAZA_GAME_AREA_SELECT_NONE_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaViewportFullscreenConstants';

/**
 * Resolves the DOM overlay root class for all fixed plaza gameplay HUD chrome.
 */
export function resolvingWorldPlazaGameplayHudOverlayLayerClassName(): string {
  return `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.overlayLayerClassName} ${DEFINING_WORLD_PLAZA_GAME_AREA_SELECT_NONE_CLASS_NAME}`;
}
