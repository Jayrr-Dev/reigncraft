import {
  DEFINING_WORLD_PLAZA_VIEWPORT_SIMULATOR_FULLSCREEN_MIN_HUD_SCALE,
  type DefiningWorldPlazaViewportProfile,
} from '@/components/world/domains/definingWorldPlazaViewportProfileConstants';

export type DefiningWorldPlazaViewportProfileLayoutInputs = {
  readonly isMobile: boolean;
  readonly isFullscreen: boolean;
};

/**
 * Resolves the active Devvit UI simulator profile.
 *
 * Order: mobile → desktop → fullscreen.
 */
export function resolvingWorldPlazaViewportProfile(
  isMobile: boolean,
  isNativeFullscreen: boolean,
  isDevvitExpanded: boolean,
  viewportHudScale: number
): DefiningWorldPlazaViewportProfile {
  if (isNativeFullscreen || isDevvitExpanded) {
    return 'fullscreen';
  }

  if (
    !isMobile &&
    viewportHudScale >=
      DEFINING_WORLD_PLAZA_VIEWPORT_SIMULATOR_FULLSCREEN_MIN_HUD_SCALE
  ) {
    return 'fullscreen';
  }

  if (isMobile) {
    return 'mobile';
  }

  return 'desktop';
}

/**
 * Maps a viewport profile to the layout inputs consumed by HUD resolvers.
 */
export function resolvingWorldPlazaViewportProfileLayoutInputs(
  profile: DefiningWorldPlazaViewportProfile,
  isMobile: boolean
): DefiningWorldPlazaViewportProfileLayoutInputs {
  switch (profile) {
    case 'mobile':
      return { isMobile: true, isFullscreen: false };
    case 'desktop':
      return { isMobile: false, isFullscreen: false };
    case 'fullscreen':
      return { isMobile, isFullscreen: true };
  }
}

/**
 * Resolves HUD layout inputs for the current viewport profile.
 */
export function resolvingWorldPlazaViewportProfileLayoutInputsFromContext(
  isMobile: boolean,
  isNativeFullscreen: boolean,
  isDevvitExpanded: boolean,
  viewportHudScale: number
): DefiningWorldPlazaViewportProfileLayoutInputs {
  const profile = resolvingWorldPlazaViewportProfile(
    isMobile,
    isNativeFullscreen,
    isDevvitExpanded,
    viewportHudScale
  );

  return resolvingWorldPlazaViewportProfileLayoutInputs(profile, isMobile);
}
