import { DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaViewportProfileConstants';
import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT_PX =
  DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX + 1;

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`
    );
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return isMobile;
}
