'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_MECHANICS_OVERLAY_CLASS_NAME,
  LABELING_WORLD_PLAZA_MECHANICS_OVERLAY_DIALOG,
} from '@/components/world/domains/definingWorldPlazaMechanicsOverlayConstants';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  type SyntheticEvent,
} from 'react';
import { createPortal } from 'react-dom';

const RenderingPlazaMechanicsPanel = lazy(async () => {
  const mechanicsPanelModule =
    await import('@/components/home/components/renderingPlazaMechanicsPanel');

  return { default: mechanicsPanelModule.RenderingPlazaMechanicsPanel };
});

export type RenderingWorldPlazaMechanicsOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Centered in-game overlay for the reusable mechanics guide panel.
 */
export function RenderingWorldPlazaMechanicsOverlay({
  isOpen,
  onClose,
}: RenderingWorldPlazaMechanicsOverlayProps): React.JSX.Element | null {
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
      aria-label={LABELING_WORLD_PLAZA_MECHANICS_OVERLAY_DIALOG}
      className={DEFINING_WORLD_PLAZA_MECHANICS_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={closingOverlayOnBackdropClick}
    >
      <Suspense
        fallback={
          <div className="flex min-h-[12rem] items-center justify-center text-sm font-semibold text-parchment">
            Loading mechanics guide…
          </div>
        }
      >
        <RenderingPlazaMechanicsPanel onBack={onClose} onClose={onClose} />
      </Suspense>
    </div>,
    document.body
  );
}
