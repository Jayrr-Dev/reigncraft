/**
 * Resolves absolute overlay boxes for open-book page content.
 *
 * @module components/home/domains/resolvingPlazaOpenBookPageBoxStyle
 */

import {
  DEFINING_PLAZA_OPEN_BOOK_PAGE_LAYOUT,
  type DefiningPlazaOpenBookPageSide,
} from '@/components/home/domains/definingPlazaOpenBookUiConstants';
import type { CSSProperties } from 'react';

/**
 * Percent-based box style for one page overlay on the open-book art.
 *
 * @param side - Left or right page
 */
export function resolvingPlazaOpenBookPageBoxStyle(
  side: DefiningPlazaOpenBookPageSide
): CSSProperties {
  const layout = DEFINING_PLAZA_OPEN_BOOK_PAGE_LAYOUT[side];

  return {
    top: `${layout.topPercent}%`,
    left: `${layout.leftPercent}%`,
    width: `${layout.widthPercent}%`,
    height: `${layout.heightPercent}%`,
  };
}
