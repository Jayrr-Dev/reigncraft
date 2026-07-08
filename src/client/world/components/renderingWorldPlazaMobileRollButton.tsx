'use client';

/**
 * Mobile-only on-screen roll control for the plaza avatar.
 *
 * @module components/world/components/renderingWorldPlazaMobileRollButton
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

export interface RenderingWorldPlazaMobileRollButtonProps {
  /** Set to true when the avatar should attempt a roll on the next tick. */
  rollRequestedRef: React.RefObject<boolean>;
  /** When true, roll input is blocked for chat typing. */
  isChatOpen: boolean;
  /** When true, roll input is blocked while dead. */
  isPlayerDeadRef: React.RefObject<boolean>;
  /** When true, roll input is blocked while asleep. */
  isPlayerAsleepRef: React.RefObject<boolean>;
  /** When true, roll input is blocked while stunned. */
  isPlayerStunnedRef: React.RefObject<boolean>;
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
}

/**
 * Bottom-right thumb reach roll button shown on mobile viewports.
 */
export function RenderingWorldPlazaMobileRollButton({
  rollRequestedRef,
  isChatOpen,
  isPlayerDeadRef,
  isPlayerAsleepRef,
  isPlayerStunnedRef,
  viewportHudScale = 1,
}: RenderingWorldPlazaMobileRollButtonProps): React.JSX.Element {
  const viewportStyles = useMemo(
    () => resolvingWorldPlazaMobileJumpButtonViewportStyles(viewportHudScale),
    [viewportHudScale]
  );

  const requestingRoll = useCallback((): void => {
    if (
      isChatOpen ||
      isPlayerDeadRef.current ||
      isPlayerAsleepRef.current ||
      isPlayerStunnedRef.current
    ) {
      return;
    }

    rollRequestedRef.current = true;
  }, [isChatOpen, isPlayerAsleepRef, isPlayerStunnedRef, isPlayerDeadRef, rollRequestedRef]);

  const handlingPointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>): void => {
      event.preventDefault();
      event.stopPropagation();
      event.currentTarget.setPointerCapture(event.pointerId);
      requestingRoll();
    },
    [requestingRoll]
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
