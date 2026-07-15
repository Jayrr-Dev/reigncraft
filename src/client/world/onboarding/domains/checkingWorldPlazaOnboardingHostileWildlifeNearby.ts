import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWorldPlazaDangerSenseHudThreatBearings } from '@/components/world/domains/computingWorldPlazaDangerSenseHudThreatBearings';
import { listingWildlifeInstances } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

const CHECKING_WORLD_PLAZA_ONBOARDING_HOSTILE_WILDLIFE_DANGER_INTENSITY_THRESHOLD =
  0.08;

/**
 * Returns true when danger sense would show a red hostile wildlife threat nearby.
 */
export function checkingWorldPlazaOnboardingHostileWildlifeNearby(
  wildlifeStore: ManagingWildlifeInstanceStore,
  playerPosition: DefiningWorldPlazaWorldPoint,
  playerUserId: string | null
): boolean {
  const threats = computingWorldPlazaDangerSenseHudThreatBearings({
    instances: listingWildlifeInstances(wildlifeStore),
    playerPosition,
    playerUserId,
  });

  for (const threat of threats) {
    if (
      threat.tint === 'danger' &&
      threat.intensity >=
        CHECKING_WORLD_PLAZA_ONBOARDING_HOSTILE_WILDLIFE_DANGER_INTENSITY_THRESHOLD
    ) {
      return true;
    }
  }

  return false;
}
