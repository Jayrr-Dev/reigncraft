import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';

/**
 * Whether a progress snapshot belongs to the given interaction target key.
 */
export function checkingWorldPlazaTimedInteractionProgressMatchesTarget(
  snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot,
  targetKey: string
): boolean {
  return snapshot.activeTargetKey === targetKey;
}

/**
 * Whether the inline progress ring should render for a target key.
 */
export function checkingWorldPlazaTimedInteractionProgressRingVisible(
  snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot,
  targetKey: string
): boolean {
  if (!checkingWorldPlazaTimedInteractionProgressMatchesTarget(snapshot, targetKey)) {
    return false;
  }

  return (
    snapshot.isActive || snapshot.isCancelling || snapshot.progressRatio > 0
  );
}
