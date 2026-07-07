/**
 * Sprite anchor and offset overrides for GirlSample combat strips.
 *
 * Locomotion strips are drawn upright with feet near the bottom of each cell.
 * Roll uses the same ground line as walk so the dodge reads at normal height.
 */

import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_X_NORMALIZED,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_Y_NORMALIZED,
} from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';

export type DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout = {
  readonly anchorXNormalized: number;
  readonly anchorYNormalized: number;
  /** Extra screen-local Y offset applied after jump/fall/lava offsets. */
  readonly offsetBelowGridAnchorPx: number;
};

const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEFAULT_COMBAT_SPRITE_PRESENTATION_LAYOUT: DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout =
  {
    anchorXNormalized:
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_X_NORMALIZED,
    anchorYNormalized:
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_Y_NORMALIZED,
    offsetBelowGridAnchorPx: 0,
  };

const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_SPRITE_PRESENTATION_LAYOUT: DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout =
  {
    anchorXNormalized:
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_X_NORMALIZED,
    anchorYNormalized:
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_WALK_ANCHOR_Y_NORMALIZED,
    offsetBelowGridAnchorPx: 0,
  };

/** Damaged hit-react: stagger pose hugging the same ground line as walk. */
const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_SPRITE_PRESENTATION_LAYOUT: DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout =
  {
    anchorXNormalized: 0.5,
    anchorYNormalized: 0.75,
    offsetBelowGridAnchorPx: 20,
  };

/** Push strips paint a deep crouch; anchor near the foot line and nudge down to match ground. */
const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_SPRITE_PRESENTATION_LAYOUT: DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout =
  {
    anchorXNormalized: 0.5,
    anchorYNormalized: 0.75,
    offsetBelowGridAnchorPx: 22,
  };

/** Death upright phase before the collapse toward the floor. */
const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_STANDING_LAYOUT: DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout =
  {
    anchorXNormalized: 0.5,
    anchorYNormalized: 0.75,
    offsetBelowGridAnchorPx: 20,
  };

/** Death floor pose when the strip shows the character lying flat. */
const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_COLLAPSED_LAYOUT: DefiningWorldPlazaGirlSampleCombatSpritePresentationLayout =
  {
    anchorXNormalized: 0.5,
    anchorYNormalized: 0.88,
    offsetBelowGridAnchorPx: 36,
  };

/** Frame index where death presentation begins lerping toward the collapsed layout. */
const DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_COLLAPSE_START_FRAME_INDEX = 17;

export {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DAMAGED_SPRITE_PRESENTATION_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_COLLAPSE_START_FRAME_INDEX,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_COLLAPSED_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_STANDING_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEFAULT_COMBAT_SPRITE_PRESENTATION_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_PUSH_SPRITE_PRESENTATION_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_ROLL_SPRITE_PRESENTATION_LAYOUT,
};
