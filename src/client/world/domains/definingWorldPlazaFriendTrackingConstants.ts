/**
 * UI and tuning constants for tracking friends in the world plaza.
 *
 * @module components/world/domains/definingWorldPlazaFriendTrackingConstants
 */

import {
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARRIVAL_THRESHOLD_PX,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_ORBIT_RADIUS_PX,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaSavedCoordsConstants";

/** Reuses saved-coords arrival distance so the arrow hides when you reach the friend. */
export const DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARRIVAL_THRESHOLD_PX =
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARRIVAL_THRESHOLD_PX;

/** Orbit radius around the player for the friend-tracking direction arrow (pixels). */
export const DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARROW_ORBIT_RADIUS_PX =
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_ORBIT_RADIUS_PX;

/** Rendered width of the friend-tracking direction arrow (pixels). */
export const DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARROW_WIDTH_PX =
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_WIDTH_PX;

/** Rendered height of the friend-tracking direction arrow (pixels). */
export const DEFINING_WORLD_PLAZA_FRIEND_TRACK_ARROW_HEIGHT_PX =
  DEFINING_WORLD_PLAZA_SAVED_COORDS_TRACK_ARROW_HEIGHT_PX;

/** Wrapper classes for the friend-tracking direction arrow overlay. */
export const DEFINING_WORLD_PLAZA_FRIEND_TRACK_DIRECTION_ARROW_WRAPPER_CLASS_NAME =
  "pointer-events-none absolute left-0 top-0 z-40 will-change-transform" as const;

/** Friend-tracking direction arrow SVG fill color (sky). */
export const DEFINING_WORLD_PLAZA_FRIEND_TRACK_DIRECTION_ARROW_FILL_COLOR =
  "#38bdf8" as const;
