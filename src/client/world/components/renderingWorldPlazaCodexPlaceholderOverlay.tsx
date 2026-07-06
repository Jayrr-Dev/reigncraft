'use client';

/**
 * Placeholder overlay for codex sections that are not yet implemented.
 *
 * @module components/world/components/renderingWorldPlazaCodexPlaceholderOverlay
 */

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_CODEX_OVERLAY_CLASS_NAME,
  LABELING_WORLD_PLAZA_CODEX_PLACEHOLDER_BODY,
  LABELING_WORLD_PLAZA_CODEX_SECTION_TITLES,
  type WorldPlazaCodexSectionId,
} from '@/components/world/domains/definingWorldPlazaCodexConstants';
import { useCallback, useEffect, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

/** Props for {@link RenderingWorldPlazaCodexPlaceholderOverlay}. */
export type RenderingWorldPlazaCodexPlaceholderOverlayProps = {
  sectionId: Exclude<WorldPlazaCodexSectionId, 'controls' | 'biomes'> | null;
  onClose: () => void;
};

/**
 * Centered overlay with a coming-soon message for Mechanics and Lore.
 */
export function RenderingWorldPlazaCodexPlaceholderOverlay({
  sectionId,
  onClose,
}: RenderingWorldPlazaCodexPlaceholderOverlayProps): React.JSX.Element | null {
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
    if (!sectionId) {
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
  }, [onClose, sectionId]);

  if (!sectionId || typeof document === 'undefined') {
    return null;
  }

  const sectionTitle = LABELING_WORLD_PLAZA_CODEX_SECTION_TITLES[sectionId];

  return createPortal(
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      role="dialog"
      aria-modal="true"
      aria-label={sectionTitle}
      className={DEFINING_WORLD_PLAZA_CODEX_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={closingOverlayOnBackdropClick}
    >
      <div className="plaza-panel plaza-pop-in flex w-full max-w-sm flex-col gap-4 rounded-md p-5 font-body sm:p-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back"
            className="plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]"
          >
            <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
          </button>
          <div className="min-w-0">
            <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
              {sectionTitle}
            </h2>
            <p className="text-sm font-medium italic text-ink-soft">
              {LABELING_WORLD_PLAZA_CODEX_PLACEHOLDER_BODY}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
