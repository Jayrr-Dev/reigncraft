/**
 * Declarative held-item sprite presentation for 8-direction tool sheets.
 *
 * @module components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type {
  DefiningWorldPlazaHeldItemTier,
  DefiningWorldPlazaHeldItemVisualId,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';

export const DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL =
  '/tools-8dir' as const;

/** Cell size on all shipped tool sheets (64×128 or 64×144). */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_FRAME_SIZE_PX = 16;

/** Facing rows on tool sheets (Up-first, clockwise). */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_DIRECTION_ROW_INDEX: Record<
  DefiningWorldPlazaGirlSampleWalkDirection,
  number
> = {
  Up: 0,
  UpRight: 1,
  Right: 2,
  DownRight: 3,
  Down: 4,
  DownLeft: 5,
  Left: 6,
  UpLeft: 7,
};

export type DefiningWorldPlazaHeldItemPresentationEntry = {
  readonly sheetUrl: string;
  readonly anchorX: number;
  readonly anchorY: number;
  readonly offsetScreenPxX: number;
  readonly offsetScreenPxY: number;
  /** Multiplied by avatar effective sprite scale. */
  readonly scaleMultiplier: number;
  readonly zIndexOffset: number;
};

const DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS = {
  anchorX: 0.5,
  anchorY: 0.85,
  offsetScreenPxX: 6,
  offsetScreenPxY: -20,
  scaleMultiplier: 3.25,
  zIndexOffset: 1,
} as const;

/** One runtime PNG per visual id. */
export const DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_REGISTRY: Record<
  DefiningWorldPlazaHeldItemVisualId,
  DefiningWorldPlazaHeldItemPresentationEntry
> = {
  sword: {
    sheetUrl: `${DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL}/swords.png`,
    ...DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS,
    offsetScreenPxX: 8,
    offsetScreenPxY: -18,
  },
  axe: {
    sheetUrl: `${DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL}/axes.png`,
    ...DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS,
    offsetScreenPxX: 10,
    offsetScreenPxY: -16,
  },
  hoe: {
    sheetUrl: `${DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL}/hoes.png`,
    ...DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS,
    offsetScreenPxX: 8,
    offsetScreenPxY: -14,
  },
  scythe: {
    sheetUrl: `${DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL}/scythes.png`,
    ...DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS,
    offsetScreenPxX: 4,
    offsetScreenPxY: -22,
    scaleMultiplier: 3.5,
  },
  fishrod: {
    sheetUrl: `${DEFINING_WORLD_PLAZA_HELD_ITEM_ASSET_BASE_URL}/fishrods.png`,
    ...DEFINING_WORLD_PLAZA_HELD_ITEM_PRESENTATION_DEFAULTS,
    offsetScreenPxX: 12,
    offsetScreenPxY: -12,
    scaleMultiplier: 3,
  },
};

export type DefiningWorldPlazaHeldItemPresentation = {
  readonly visualId: DefiningWorldPlazaHeldItemVisualId;
  readonly tier: DefiningWorldPlazaHeldItemTier;
  readonly entry: DefiningWorldPlazaHeldItemPresentationEntry;
};
