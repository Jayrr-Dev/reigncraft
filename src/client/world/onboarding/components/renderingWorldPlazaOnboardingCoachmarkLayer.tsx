'use client';

import { RenderingWorldPlazaOnboardingCoachmark } from '@/components/world/onboarding/components/renderingWorldPlazaOnboardingCoachmark';
import type { UsingWorldPlazaOnboardingCoachmarksParams } from '@/components/world/onboarding/hooks/usingWorldPlazaOnboardingCoachmarks';
import { usingWorldPlazaOnboardingCoachmarks } from '@/components/world/onboarding/hooks/usingWorldPlazaOnboardingCoachmarks';

export type RenderingWorldPlazaOnboardingCoachmarkLayerProps =
  UsingWorldPlazaOnboardingCoachmarksParams & {
    readonly isMobile: boolean;
    /** Hide tips over the death screen (bleed etc. still count while dead). */
    readonly isPlayerDead: boolean;
  };

/**
 * Mount point for soft onboarding coachmarks inside the plaza gameplay HUD.
 */
export function RenderingWorldPlazaOnboardingCoachmarkLayer({
  isMobile,
  isPlayerDead,
  ...coachmarkParams
}: RenderingWorldPlazaOnboardingCoachmarkLayerProps): React.JSX.Element | null {
  const { activeCoachmark, dismissingActiveCoachmark } =
    usingWorldPlazaOnboardingCoachmarks(coachmarkParams);

  if (!coachmarkParams.isEnabled || isPlayerDead || activeCoachmark === null) {
    return null;
  }

  return (
    <RenderingWorldPlazaOnboardingCoachmark
      definition={activeCoachmark}
      isMobile={isMobile}
      onDismiss={dismissingActiveCoachmark}
    />
  );
}
