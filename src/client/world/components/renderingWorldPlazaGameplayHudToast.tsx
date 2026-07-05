'use client';

import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_FADE_DURATION_MS,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_ANCHOR_CLASS,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_PILL_CLASS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudToastConstants';
import type { UsingWorldPlazaGameplayHudToastSnapshot } from '@/components/world/hooks/usingWorldPlazaGameplayHudToast';

export type RenderingWorldPlazaGameplayHudToastProps = {
  readonly snapshot: UsingWorldPlazaGameplayHudToastSnapshot;
};

/**
 * Transient gameplay feedback pill shown above the hotbar.
 */
export function RenderingWorldPlazaGameplayHudToast({
  snapshot,
}: RenderingWorldPlazaGameplayHudToastProps): React.JSX.Element | null {
  if (snapshot.message === null) {
    return null;
  }

  return (
    <div
      className={STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_ANCHOR_CLASS}
      style={{
        opacity: snapshot.isVisible ? 1 : 0,
        transitionDuration: `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_FADE_DURATION_MS}ms`,
      }}
      role="status"
      aria-live="polite"
    >
      <span className={STYLING_WORLD_PLAZA_GAMEPLAY_HUD_TOAST_PILL_CLASS}>
        {snapshot.message}
      </span>
    </div>
  );
}
