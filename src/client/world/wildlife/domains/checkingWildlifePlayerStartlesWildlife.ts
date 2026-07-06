/**
 * Whether the local player's locomotion should scare nearby prey.
 *
 * Walking and standing still do not trigger proximity flee; sprinting and
 * jumping do.
 *
 * @module components/world/wildlife/domains/checkingWildlifePlayerStartlesWildlife
 */

/** Returns true when sprinting or airborne movement should scare wildlife. */
export function checkingWildlifePlayerStartlesWildlife(
  isPlayerRunning: boolean,
  isPlayerJumping: boolean
): boolean {
  return isPlayerRunning || isPlayerJumping;
}
