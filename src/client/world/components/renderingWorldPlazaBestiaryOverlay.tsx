'use client';

import { RenderingPlazaBestiaryPanel } from '@/components/home/components/renderingPlazaBestiaryPanel';
import {
  DEFINING_WORLD_PLAZA_BESTIARY_OVERLAY_CLASS_NAME,
  LABELING_WORLD_PLAZA_BESTIARY_OVERLAY_DIALOG,
} from '@/components/world/domains/definingWorldPlazaBestiaryOverlayConstants';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { useCallback, useEffect, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

export type RenderingWorldPlazaBestiaryOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Centered in-game overlay for the reusable bestiary guide panel.
 */
export function RenderingWorldPlazaBestiaryOverlay({
  isOpen,
  onClose,
}: RenderingWorldPlazaBestiaryOverlayProps): React.JSX.Element | null {
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
      aria-label={LABELING_WORLD_PLAZA_BESTIARY_OVERLAY_DIALOG}
      className={DEFINING_WORLD_PLAZA_BESTIARY_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={closingOverlayOnBackdropClick}
    >
      <RenderingPlazaBestiaryPanel onBack={onClose} onClose={onClose} />
    </div>,
    document.body
  );
}
