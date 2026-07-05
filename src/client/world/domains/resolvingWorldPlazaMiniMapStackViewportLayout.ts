import {
  DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT,
  type DefiningWorldPlazaMiniMapStackViewportLayout,
} from '@/components/world/domains/definingWorldPlazaMiniMapStackConstants';

/**
 * Resolves the declarative minimap stack layout for the active viewport.
 *
 * @param isMobile - True on viewports under 768px wide.
 * @param isFullscreen - True while the plaza host is in native fullscreen.
 */
export function resolvingWorldPlazaMiniMapStackViewportLayout(
  isMobile: boolean,
  isFullscreen: boolean
): DefiningWorldPlazaMiniMapStackViewportLayout {
  const viewportMode = isFullscreen ? 'fullscreen' : 'embedded';
  const platform = isMobile ? 'mobile' : 'desktop';

  return DEFINING_WORLD_PLAZA_MINI_MAP_STACK_LAYOUT.viewportLayouts[
    viewportMode
  ][platform];
}
