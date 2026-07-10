'use client';

/**
 * Centered in-game overlay for the lore book, opened from the codex menu.
 *
 * @module components/world/components/renderingWorldPlazaLoreBookOverlay
 */

import { LABELING_PLAZA_LORE_BOOK_DIALOG } from '@/components/home/domains/definingPlazaLoreBookConstants';
import { playingPlazaBookSfx } from '@/components/home/domains/playingPlazaBookSfx';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_CODEX_OVERLAY_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  type SyntheticEvent,
} from 'react';
import { createPortal } from 'react-dom';

const RenderingPlazaLoreBookPanel = lazy(async () => {
  const loreBookPanelModule =
    await import('@/components/home/components/renderingPlazaLoreBookPanel');

  return { default: loreBookPanelModule.RenderingPlazaLoreBookPanel };
});

/** Props for {@link RenderingWorldPlazaLoreBookOverlay}. */
export type RenderingWorldPlazaLoreBookOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Modal overlay hosting the lazily loaded lore book panel.
 */
export function RenderingWorldPlazaLoreBookOverlay({
  isOpen,
  onClose,
}: RenderingWorldPlazaLoreBookOverlayProps): React.JSX.Element | null {
  const wasOpenRef = useRef(false);

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
    if (isOpen) {
      playingPlazaBookSfx({ actionId: 'open' });
    } else if (wasOpenRef.current) {
      playingPlazaBookSfx({ actionId: 'close' });
    }

    wasOpenRef.current = isOpen;
  }, [isOpen]);

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
      aria-label={LABELING_PLAZA_LORE_BOOK_DIALOG}
      className={DEFINING_WORLD_PLAZA_CODEX_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={closingOverlayOnBackdropClick}
    >
      <Suspense
        fallback={
          <div className="flex min-h-48 items-center justify-center text-sm font-semibold text-parchment">
            Opening the lore book…
          </div>
        }
      >
        <RenderingPlazaLoreBookPanel onClose={onClose} />
      </Suspense>
    </div>,
    document.body
  );
}
