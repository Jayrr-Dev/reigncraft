'use client';

/**
 * Centered in-game overlay for the lore book shelf and reader, opened from
 * the codex menu.
 *
 * @module components/world/components/renderingWorldPlazaLoreBookOverlay
 */

import { LABELING_PLAZA_LORE_BOOK_DIALOG } from '@/components/home/domains/definingPlazaLoreBookConstants';
import { playingPlazaBookSfx } from '@/components/home/domains/playingPlazaBookSfx';
import { resolvingPlazaLoreBookById } from '@/components/home/domains/resolvingPlazaLoreBookDefinition';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_CODEX_OVERLAY_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { createPortal } from 'react-dom';

const RenderingPlazaLoreBookShelf = lazy(async () => {
  const loreBookShelfModule =
    await import('@/components/home/components/renderingPlazaLoreBookShelf');

  return { default: loreBookShelfModule.RenderingPlazaLoreBookShelf };
});

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
 * Modal overlay hosting the lore shelf, then the selected volume's reader.
 */
export function RenderingWorldPlazaLoreBookOverlay({
  isOpen,
  onClose,
}: RenderingWorldPlazaLoreBookOverlayProps): React.JSX.Element | null {
  const wasOpenRef = useRef(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const selectedBook = selectedBookId
    ? resolvingPlazaLoreBookById(selectedBookId)
    : null;

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

  const returningToShelf = useCallback(() => {
    playingPlazaBookSfx({ actionId: 'page_turn' });
    setSelectedBookId(null);
  }, []);

  const openingBook = useCallback((bookId: string) => {
    playingPlazaBookSfx({ actionId: 'page_turn' });
    setSelectedBookId(bookId);
  }, []);

  useEffect(() => {
    if (isOpen) {
      playingPlazaBookSfx({ actionId: 'open' });
    } else if (wasOpenRef.current) {
      playingPlazaBookSfx({ actionId: 'close' });
      setSelectedBookId(null);
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

      if (selectedBookId) {
        event.preventDefault();
        returningToShelf();
        return;
      }

      onClose();
    };

    document.addEventListener('keydown', dismissingOverlayOnEscape);

    return () => {
      document.removeEventListener('keydown', dismissingOverlayOnEscape);
    };
  }, [isOpen, onClose, returningToShelf, selectedBookId]);

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
        {selectedBook ? (
          <RenderingPlazaLoreBookPanel
            book={selectedBook}
            onClose={onClose}
            onBackToShelf={returningToShelf}
          />
        ) : (
          <RenderingPlazaLoreBookShelf
            onSelectBookId={openingBook}
            onClose={onClose}
          />
        )}
      </Suspense>
    </div>,
    document.body
  );
}
