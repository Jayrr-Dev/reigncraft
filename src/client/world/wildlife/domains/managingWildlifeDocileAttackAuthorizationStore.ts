/**
 * Session store of docile wildlife instances the player confirmed attacking.
 *
 * @module components/world/wildlife/domains/managingWildlifeDocileAttackAuthorizationStore
 */

const authorizedInstanceIds = new Set<string>();

/**
 * Returns true when the player already confirmed attacking this instance.
 */
export function checkingWildlifeDocileAttackIsAuthorized(
  instanceId: string
): boolean {
  return authorizedInstanceIds.has(instanceId);
}

/**
 * Marks one instance as fair game for the rest of the session.
 */
export function authorizingWildlifeDocileAttack(instanceId: string): void {
  authorizedInstanceIds.add(instanceId);
}

/**
 * Clears all confirmations (e.g. on world unload).
 */
export function clearingWildlifeDocileAttackAuthorizations(): void {
  authorizedInstanceIds.clear();
}
