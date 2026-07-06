import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT,
  type DefiningWorldPlazaGameplayHudViewportInsets,
} from '@/components/world/domains/definingWorldPlazaGameplayHudLayoutConstants';

/**
 * Resolves shared corner insets for the active plaza viewport mode.
 *
 * @param isMobile - True on viewports under 768px wide.
 * @param isFullscreen - True while the plaza host is in native fullscreen.
 */
export function resolvingWorldPlazaGameplayHudViewportInsets(
  isMobile: boolean,
  isFullscreen: boolean
): DefiningWorldPlazaGameplayHudViewportInsets {
  const viewportMode = isFullscreen ? 'fullscreen' : 'embedded';
  const platform = isMobile ? 'mobile' : 'desktop';

  return DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_LAYOUT.viewportInsets[viewportMode][
    platform
  ];
}
