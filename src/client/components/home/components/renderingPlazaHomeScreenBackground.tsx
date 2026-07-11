'use client';

import { DEFINING_PLAZA_HOME_SCREEN_BACKGROUND_IMAGE_URL } from '@/components/home/domains/definingPlazaHomeScreenBackgroundConstants';

/**
 * Full-bleed painted forest/mountain poster background for the home screen.
 */
export function RenderingPlazaHomeScreenBackground(): React.JSX.Element {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#1c333c]"
    >
      <img
        src={DEFINING_PLAZA_HOME_SCREEN_BACKGROUND_IMAGE_URL}
        alt=""
        className="absolute inset-0 size-full select-none object-cover object-center"
        draggable={false}
        decoding="async"
      />
    </div>
  );
}
