import {
  WORLD_BUILDING_DEVVIT_SESSION_BLOCK_METADATA_IS_SESSION_KEY,
  WORLD_BUILDING_DEVVIT_SESSION_PLOT_ID_SENTINEL,
} from '../../../../shared/worldBuildingDevvit';

/**
 * Session-only building constants shared by placement and persistence.
 *
 * @module components/world/building/domains/definingWorldBuildingSessionBlockConstants
 */

export {
  WORLD_BUILDING_DEVVIT_SESSION_BLOCK_METADATA_IS_SESSION_KEY,
  WORLD_BUILDING_DEVVIT_SESSION_PLOT_ID_SENTINEL,
};

/** Plot id used for session blocks in local aggregates. */
export const DEFINING_WORLD_BUILDING_SESSION_PLOT_ID =
  WORLD_BUILDING_DEVVIT_SESSION_PLOT_ID_SENTINEL;
