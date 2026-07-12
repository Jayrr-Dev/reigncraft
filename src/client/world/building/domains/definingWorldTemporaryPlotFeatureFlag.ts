import { WORLD_BUILDING_DEVVIT_TEMPORARY_PLOT_FEATURE_ENABLED } from '../../../../shared/worldBuildingDevvit';

/**
 * Feature flag for the temporary plot ("Temp Claim") system.
 *
 * @module components/world/building/domains/definingWorldTemporaryPlotFeatureFlag
 */

/**
 * Off: hides all Temp Claim UI and blocks temporary claims on the client.
 * Existing temporary tiles stay removable until they expire or are purged.
 * Shared with the server so both sides gate identically.
 */
export const DEFINING_WORLD_TEMPORARY_PLOT_FEATURE_ENABLED =
  WORLD_BUILDING_DEVVIT_TEMPORARY_PLOT_FEATURE_ENABLED;
