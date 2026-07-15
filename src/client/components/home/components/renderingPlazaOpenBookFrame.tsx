'use client';

/**
 * Shared pixel open-book shell: header, open-book art, left/right page boxes.
 *
 * @module components/home/components/renderingPlazaOpenBookFrame
 */

import {
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  definingPlazaButtonSfxDataAttributes,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import {
  DEFINING_PLAZA_OPEN_BOOK_ASPECT_RATIO,
  DEFINING_PLAZA_OPEN_BOOK_CLOSE_BUTTON_CLASS_NAME,
  DEFINING_PLAZA_OPEN_BOOK_URL,
} from '@/components/home/domains/definingPlazaOpenBookUiConstants';
import { resolvingPlazaOpenBookPageBoxStyle } from '@/components/home/domains/resolvingPlazaOpenBookPageBoxStyle';
import { Icon } from '@/components/ui/icon';
import type { ReactNode } from 'react';

/** Props for {@link RenderingPlazaOpenBookFrame}. */
export type RenderingPlazaOpenBookFrameProps = {
  readonly title: string;
  readonly subtitle: string;
  readonly headerLeading?: ReactNode;
  readonly onClose?: () => void;
  readonly leftPage: ReactNode;
  readonly rightPage: ReactNode;
  readonly leftPageKey?: string;
  readonly rightPageKey?: string;
  readonly footer?: ReactNode;
  readonly className?: string;
};

/**
 * Pixel open-book dialog chrome used by cookbooks and the lore Corpus.
 */
export function RenderingPlazaOpenBookFrame({
  title,
  subtitle,
  headerLeading,
  onClose,
  leftPage,
  rightPage,
  leftPageKey,
  rightPageKey,
  footer,
  className = '',
}: RenderingPlazaOpenBookFrameProps): React.JSX.Element {
  return (
    <div
      className={`plaza-pop-in relative flex max-h-[calc(100dvh-3rem)] w-full max-w-[min(94vw,52rem)] flex-col items-center gap-3 overflow-y-auto font-body sm:gap-4 ${className}`.trim()}
    >
      <header className="flex w-full items-center gap-3 px-2 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {headerLeading}
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold uppercase leading-tight tracking-wide text-parchment sm:text-lg md:text-xl">
              {title}
            </h2>
            <p className="mt-1 text-xs font-medium italic leading-snug text-parchment/70 sm:text-sm">
              {subtitle}
            </p>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            {...definingPlazaButtonSfxDataAttributes(
              DEFINING_PLAZA_BUTTON_SFX_KIND.none
            )}
            className={DEFINING_PLAZA_OPEN_BOOK_CLOSE_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-4 sm:size-5" aria-hidden />
          </button>
        ) : null}
      </header>

      <div
        className="relative w-full"
        style={{
          aspectRatio: String(DEFINING_PLAZA_OPEN_BOOK_ASPECT_RATIO),
        }}
      >
        <img
          src={DEFINING_PLAZA_OPEN_BOOK_URL}
          alt=""
          draggable={false}
          className="pointer-events-none absolute inset-0 size-full select-none object-contain [image-rendering:pixelated]"
          aria-hidden
        />

        <div
          key={leftPageKey}
          className="scrollbar-none absolute flex flex-col overflow-y-auto overscroll-contain p-2 sm:p-3"
          style={resolvingPlazaOpenBookPageBoxStyle('left')}
        >
          {leftPage}
        </div>

        <div
          key={rightPageKey}
          className="scrollbar-none absolute flex flex-col overflow-y-auto overscroll-contain p-2 sm:p-3"
          style={resolvingPlazaOpenBookPageBoxStyle('right')}
        >
          {rightPage}
        </div>
      </div>

      {footer}
    </div>
  );
}
