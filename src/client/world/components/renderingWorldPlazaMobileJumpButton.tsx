'use client';

/**
 * Mobile-only on-screen jump control for the plaza avatar.
 *
 * @module components/world/components/renderingWorldPlazaMobileJumpButton
 */

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ICON,
  LABELING_WORLD_PLAZA_MOBILE_JUMP_BUTTON,
  STYLING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ICON_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaMobileJumpButtonConstants';
import { resolvingWorldPlazaMobileJumpButtonViewportStyles } from '@/components/world/domains/resolvingWorldPlazaMobileJumpButtonViewportStyles';
import { cn } from '@/lib/utils';
import { useCallback, useMemo } from 'react';

export interface RenderingWorldPlazaMobileJumpButtonProps {
  /** Set to true when the avatar should attempt a jump on the next tick. */
  jumpRequestedRef: React.RefObject<boolean>;
  /** True while a jump animation is in progress. */
  isJumpingRef: React.RefObject<boolean>;
  /** When true, jump input is blocked for chat typing. */
  isChatOpen: boolean;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
}

/**
 * Bottom-right thumb reach jump button shown on mobile viewports.
 */
export function RenderingWorldPlazaMobileJumpButton({
  jumpRequestedRef,
  isJumpingRef,
  isChatOpen,
  viewportHudScale = 1,
}: RenderingWorldPlazaMobileJumpButtonProps): React.JSX.Element {
  const viewportStyles = useMemo(
    () => resolvingWorldPlazaMobileJumpButtonViewportStyles(viewportHudScale),
    [viewportHudScale]
  );

  const requestingJump = useCallback((): void => {
    if (isChatOpen || isJumpingRef.current) {
      return;
    }

    jumpRequestedRef.current = true;
  }, [isChatOpen, isJumpingRef, jumpRequestedRef]);

  const handlingPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      requestingJump();
    },
    [requestingJump]
  );

  const handlingPointerUp = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>): void => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    []
  );

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={STYLING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ANCHOR_CLASS_NAME}
      style={viewportStyles.anchorStyle}
    >
      <button
        type="button"
        aria-label={LABELING_WORLD_PLAZA_MOBILE_JUMP_BUTTON}
        disabled={isChatOpen}
        className={cn(
          STYLING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_CLASS_NAME,
          isChatOpen && 'opacity-45'
        )}
        style={viewportStyles.buttonStyle}
        onPointerDown={handlingPointerDown}
        onPointerUp={handlingPointerUp}
        onPointerCancel={handlingPointerUp}
        onContextMenu={(event) => {
          event.preventDefault();
        }}
      >
        <Icon
          icon={DEFINING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ICON}
          className={STYLING_WORLD_PLAZA_MOBILE_JUMP_BUTTON_ICON_CLASS_NAME}
          style={viewportStyles.iconStyle}
          aria-hidden
        />
      </button>
    </div>
  );
}
