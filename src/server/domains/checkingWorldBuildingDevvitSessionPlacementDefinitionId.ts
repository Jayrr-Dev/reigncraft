import {
  WORLD_BUILDING_DEVVIT_SESSION_PLACEMENT_DEFINITION_IDS,
} from '../../shared/worldBuildingDevvit';

/**
 * Server-side session block placement helpers.
 *
 * @module server/domains/checkingWorldBuildingDevvitSessionPlacementDefinitionId
 */

/**
 * Returns true when the definition id is allowed for session placement.
 *
 * @param definitionId - Block definition id from the client request.
 */
export function checkingWorldBuildingDevvitSessionPlacementDefinitionId(
  definitionId: string,
): boolean {
  return (
    WORLD_BUILDING_DEVVIT_SESSION_PLACEMENT_DEFINITION_IDS as readonly string[]
  ).includes(definitionId);
}
