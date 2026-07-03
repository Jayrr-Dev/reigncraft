import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_Y_NORMALIZED,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SPRITE_SCALE,
} from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";

/**
 * Visible hair/head line on the GirlSample frame (normalized from sprite top).
 * The sheet includes transparent padding above the character.
 */
const DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_VISIBLE_HEAD_TOP_Y_NORMALIZED = 0.2;

/** Small gap between the visible head top and the name label bottom (world-local px). */
const DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_GAP_ABOVE_HEAD_PX = 2;

/** Vertical offset above the grid anchor so the label sits on the avatar head. */
export const DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_OFFSET_ABOVE_AVATAR_PX =
  Math.ceil(
    (DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_Y_NORMALIZED -
      DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_VISIBLE_HEAD_TOP_Y_NORMALIZED) *
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_MOTION_FRAME_HEIGHT_PX *
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_SPRITE_SCALE,
  ) + DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_GAP_ABOVE_HEAD_PX;

/** Maximum width for a truncated name label row (unscaled; DOM scale handles zoom). */
export const DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_MAX_WIDTH_PX = 136;
