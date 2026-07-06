'use client';

import { checkingWorldPlazaDevvitExpandedViewport } from '@/components/world/domains/checkingWorldPlazaDevvitExpandedViewport';
import type { DefiningWorldPlazaViewportProfile } from '@/components/world/domains/definingWorldPlazaViewportProfileConstants';
import {
  resolvingWorldPlazaViewportProfile,
  resolvingWorldPlazaViewportProfileLayoutInputs,
  type DefiningWorldPlazaViewportProfileLayoutInputs,
} from '@/components/world/domains/resolvingWorldPlazaViewportProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useMemo, useState } from 'react';

export type UsingWorldPlazaViewportProfileLayoutInputsResult =
  DefiningWorldPlazaViewportProfileLayoutInputs & {
    readonly profile: DefiningWorldPlazaViewportProfile;
  };

/**
 * Tracks Devvit UI simulator profile (mobile → desktop → fullscreen) for HUD layout.
 */
export function usingWorldPlazaViewportProfileLayoutInputs(
  isNativeFullscreen: boolean,
  viewportHudScale: number
): UsingWorldPlazaViewportProfileLayoutInputsResult {
  const isMobile = useIsMobile();
  const [isDevvitExpanded, setIsDevvitExpanded] = useState(() =>
    checkingWorldPlazaDevvitExpandedViewport()
  );

  useEffect(() => {
    const syncingDevvitExpandedViewport = (): void => {
      setIsDevvitExpanded(checkingWorldPlazaDevvitExpandedViewport());
    };

    syncingDevvitExpandedViewport();
    window.addEventListener('focus', syncingDevvitExpandedViewport);

    return () => {
      window.removeEventListener('focus', syncingDevvitExpandedViewport);
    };
  }, []);

  return useMemo(() => {
    const profile = resolvingWorldPlazaViewportProfile(
      isMobile,
      isNativeFullscreen,
      isDevvitExpanded,
      viewportHudScale
    );

    return {
      profile,
      ...resolvingWorldPlazaViewportProfileLayoutInputs(profile, isMobile),
    };
  }, [isMobile, isNativeFullscreen, isDevvitExpanded, viewportHudScale]);
}
