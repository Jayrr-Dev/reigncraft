'use client';

import {
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_FIT_AVAILABLE_WIDTH_RATIO,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_FIT_LETTER_SPACING_EM,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_MAX_FONT_SIZE_PX,
  DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_MIN_FONT_SIZE_PX,
} from '@/components/world/health/domains/definingWorldPlazaEntityDeathScreenConstants';
import { computingWorldPlazaEntityDeathScreenTitleFontSizePx } from '@/components/world/health/domains/computingWorldPlazaEntityDeathScreenTitleFontSizePx';
import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * Keeps the death-screen title on one line by shrinking font size to the overlay width.
 * Measures at the widest enter letter-spacing so the zoom-in animation never wraps.
 */
export function usingWorldPlazaEntityDeathScreenTitleFit(
  titleRef: RefObject<HTMLElement | null>,
  overlayRef: RefObject<HTMLElement | null>,
  titleText: string,
  isVisible: boolean
): number {
  const [fontSizePx, setFontSizePx] = useState(
    DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_MAX_FONT_SIZE_PX
  );

  useLayoutEffect(() => {
    if (!isVisible) {
      return;
    }

    const titleElement = titleRef.current;
    const overlayElement = overlayRef.current;

    if (!titleElement || !overlayElement) {
      return;
    }

    const updatingTitleFontSize = (): void => {
      const previousFontSize = titleElement.style.fontSize;
      const previousLetterSpacing = titleElement.style.letterSpacing;

      titleElement.style.fontSize = `${DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_MAX_FONT_SIZE_PX}px`;
      titleElement.style.letterSpacing = `${DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_FIT_LETTER_SPACING_EM}em`;

      const availableWidthPx =
        overlayElement.clientWidth *
        DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_FIT_AVAILABLE_WIDTH_RATIO;
      const naturalWidthPx = titleElement.scrollWidth;
      const nextFontSizePx = computingWorldPlazaEntityDeathScreenTitleFontSizePx({
        availableWidthPx,
        naturalWidthPx,
        maxFontSizePx:
          DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_MAX_FONT_SIZE_PX,
        minFontSizePx:
          DEFINING_WORLD_PLAZA_ENTITY_DEATH_SCREEN_TITLE_MIN_FONT_SIZE_PX,
      });

      titleElement.style.fontSize = previousFontSize;
      titleElement.style.letterSpacing = previousLetterSpacing;
      setFontSizePx(nextFontSizePx);
    };

    updatingTitleFontSize();

    const resizeObserver = new ResizeObserver(updatingTitleFontSize);
    resizeObserver.observe(overlayElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [isVisible, overlayRef, titleRef, titleText]);

  return fontSizePx;
}
