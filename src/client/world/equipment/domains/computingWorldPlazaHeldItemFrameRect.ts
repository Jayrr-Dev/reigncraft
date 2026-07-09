/**
 * Pure frame rectangle for one held-item cell on a tool sheet.
 *
 * @module components/world/equipment/domains/computingWorldPlazaHeldItemFrameRect
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import {
  DEFINING_WORLD_PLAZA_HELD_ITEM_DIRECTION_ROW_INDEX,
  DEFINING_WORLD_PLAZA_HELD_ITEM_FRAME_SIZE_PX,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemPresentationRegistry';
import {
  DEFINING_WORLD_PLAZA_HELD_ITEM_TIER_COLUMN_INDEX,
  type DefiningWorldPlazaHeldItemTier,
} from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import { Rectangle } from 'pixi.js';

/**
 * Returns the source rectangle for one static held pose (direction × tier).
 */
export function computingWorldPlazaHeldItemFrameRect(
  direction: DefiningWorldPlazaGirlSampleWalkDirection,
  tier: DefiningWorldPlazaHeldItemTier
): Rectangle {
  const columnIndex = DEFINING_WORLD_PLAZA_HELD_ITEM_TIER_COLUMN_INDEX[tier];
  const rowIndex =
    DEFINING_WORLD_PLAZA_HELD_ITEM_DIRECTION_ROW_INDEX[direction];

  return new Rectangle(
    columnIndex * DEFINING_WORLD_PLAZA_HELD_ITEM_FRAME_SIZE_PX,
    rowIndex * DEFINING_WORLD_PLAZA_HELD_ITEM_FRAME_SIZE_PX,
    DEFINING_WORLD_PLAZA_HELD_ITEM_FRAME_SIZE_PX,
    DEFINING_WORLD_PLAZA_HELD_ITEM_FRAME_SIZE_PX
  );
}
