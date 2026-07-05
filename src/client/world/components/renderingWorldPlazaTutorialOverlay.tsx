'use client';

import { RenderingPlazaHowToPlayPanel } from '@/components/home/components/renderingPlazaHowToPlayPanel';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_TUTORIAL_OVERLAY_CLASS_NAME,
  LABELING_WORLD_PLAZA_TUTORIAL_OVERLAY_DIALOG,
} from '@/components/world/domains/definingWorldPlazaTutorialOverlayConstants';
import { useCallback, useEffect, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

export type RenderingWorldPlazaTutorialOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  /** When set, uses in-game mobile detection instead of the viewport hook. */
  isMobile?: boolean;
};

/**
 * Centered in-game overlay for the reusable how-to-play tutorial panel.
 */
export function RenderingWorldPlazaTutorialOverlay({
  isOpen,
  onClose,
  isMobile,
}: RenderingWorldPlazaTutorialOverlayProps): React.JSX.Element | null {
  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  const closingOverlayOnBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (event.target !== event.currentTarget) {
        return;
      }

      onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dismissingOverlayOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return;
      }

      onClose();
    };

    document.addEventListener('keydown', dismissingOverlayOnEscape);

    return () => {
      document.removeEventListener('keydown', dismissingOverlayOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      role="dialog"
      aria-modal="true"
      aria-label={LABELING_WORLD_PLAZA_TUTORIAL_OVERLAY_DIALOG}
      className={DEFINING_WORLD_PLAZA_TUTORIAL_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={closingOverlayOnBackdropClick}
    >
      <RenderingPlazaHowToPlayPanel onBack={onClose} isMobile={isMobile} />
    </div>,
    document.body
  );
}
