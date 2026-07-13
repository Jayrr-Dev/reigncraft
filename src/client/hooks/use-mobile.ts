import { DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaViewportProfileConstants';
import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT_PX =
  DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX + 1;

const MOBILE_VIEWPORT_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`;

/**
 * Reads the current mobile viewport match without waiting for an effect.
 * Avoids a desktop-sized first paint on narrow screens (minimap flash).
 */
function readingIsMobileViewport(): boolean {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }

  return window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY).matches;
}

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(readingIsMobileViewport);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY);
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isMobile;
}
