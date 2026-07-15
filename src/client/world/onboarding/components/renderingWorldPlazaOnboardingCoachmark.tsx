'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { WorldPlazaOnboardingCoachmarkDefinition } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import {
  DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE,
  STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_DISMISS_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_GLOW_CLASS_NAME,
  STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_ACTIONS_CLASS_NAME,
  STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_BODY_CLASS_NAME,
  STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_TITLE_CLASS_NAME,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import { useLayoutEffect, useState } from 'react';

export type RenderingWorldPlazaOnboardingCoachmarkProps = {
  readonly definition: WorldPlazaOnboardingCoachmarkDefinition;
  readonly isMobile: boolean;
  readonly onDismiss: () => void;
};

type CoachmarkTipPosition = {
  readonly top: number;
  readonly left: number;
};

const RENDERING_WORLD_PLAZA_ONBOARDING_COACHMARK_LAYER_CLASS_NAME =
  'pointer-events-none fixed inset-0 z-[70]' as const;

const RENDERING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_OFFSET_PX = 12;

function resolvingWorldPlazaOnboardingCoachmarkAnchorElement(
  targetAnchorId: WorldPlazaOnboardingCoachmarkDefinition['targetAnchorId']
): HTMLElement | null {
  if (targetAnchorId === null) {
    return null;
  }

  return document.querySelector(
    `[${DEFINING_WORLD_PLAZA_ONBOARDING_ANCHOR_ATTRIBUTE}="${targetAnchorId}"]`
  );
}

function computingWorldPlazaOnboardingCoachmarkTipPosition(
  definition: WorldPlazaOnboardingCoachmarkDefinition
): CoachmarkTipPosition {
  const anchorElement =
    resolvingWorldPlazaOnboardingCoachmarkAnchorElement(
      definition.targetAnchorId
    );

  if (!anchorElement) {
    if (definition.tipPlacement === 'center') {
      return {
        top: Math.max(96, window.innerHeight * 0.58),
        left: window.innerWidth / 2,
      };
    }

    return {
      top: window.innerHeight - 120,
      left: window.innerWidth / 2,
    };
  }

  const anchorRect = anchorElement.getBoundingClientRect();

  if (definition.tipPlacement === 'below') {
    return {
      top: anchorRect.bottom + RENDERING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_OFFSET_PX,
      left: anchorRect.left + anchorRect.width / 2,
    };
  }

  if (definition.tipPlacement === 'center') {
    return {
      top: anchorRect.top + anchorRect.height / 2,
      left: anchorRect.left + anchorRect.width / 2,
    };
  }

  return {
    top: anchorRect.top - RENDERING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_OFFSET_PX,
    left: anchorRect.left + anchorRect.width / 2,
  };
}

/**
 * Soft coachmark tip + anchor glow. Does not block gameplay outside the tip card.
 */
export function RenderingWorldPlazaOnboardingCoachmark({
  definition,
  isMobile,
  onDismiss,
}: RenderingWorldPlazaOnboardingCoachmarkProps): React.JSX.Element {
  const [tipPosition, setTipPosition] = useState<CoachmarkTipPosition>(() =>
    computingWorldPlazaOnboardingCoachmarkTipPosition(definition)
  );

  useLayoutEffect(() => {
    const anchorElement = resolvingWorldPlazaOnboardingCoachmarkAnchorElement(
      definition.targetAnchorId
    );

    if (anchorElement) {
      anchorElement.classList.add(
        STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_GLOW_CLASS_NAME
      );
    }

    const updatingTipPosition = (): void => {
      setTipPosition(
        computingWorldPlazaOnboardingCoachmarkTipPosition(definition)
      );
    };

    updatingTipPosition();
    window.addEventListener('resize', updatingTipPosition);
    const animationFrameId = window.requestAnimationFrame(updatingTipPosition);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updatingTipPosition);

      if (anchorElement) {
        anchorElement.classList.remove(
          STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_GLOW_CLASS_NAME
        );
      }
    };
  }, [definition]);

  const description = isMobile
    ? definition.descriptionMobile
    : definition.descriptionDesktop;

  const tipTransform =
    definition.tipPlacement === 'below'
      ? 'translate(-50%, 0)'
      : definition.tipPlacement === 'center' && definition.targetAnchorId === null
        ? 'translate(-50%, -100%)'
        : 'translate(-50%, -100%)';

  return (
    <div
      className={RENDERING_WORLD_PLAZA_ONBOARDING_COACHMARK_LAYER_CLASS_NAME}
      aria-live="polite"
    >
      <div
        role="dialog"
        aria-label={definition.title}
        className={STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_CLASS_NAME}
        style={{
          position: 'fixed',
          top: `${tipPosition.top}px`,
          left: `${tipPosition.left}px`,
          transform: tipTransform,
        }}
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      >
        <p className={STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_TITLE_CLASS_NAME}>
          {definition.title}
        </p>
        <p className={STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_BODY_CLASS_NAME}>
          {description}
        </p>
        <div
          className={STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_TIP_ACTIONS_CLASS_NAME}
        >
          <button
            type="button"
            className={STYLING_WORLD_PLAZA_ONBOARDING_COACHMARK_DISMISS_BUTTON_CLASS_NAME}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDismiss();
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
