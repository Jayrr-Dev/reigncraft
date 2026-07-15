import {
  resolvingWorldPlazaOnboardingCoachmarksStorageKey,
  type WorldPlazaOnboardingCoachmarkStepId,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import { readingWorldPlazaOnboardingCoachmarksFromStorage } from '@/components/world/onboarding/domains/readingWorldPlazaOnboardingCoachmarksFromStorage';
import { writingWorldPlazaOnboardingCoachmarksToStorage } from '@/components/world/onboarding/domains/writingWorldPlazaOnboardingCoachmarksToStorage';

export type WorldPlazaOnboardingCoachmarkSessionSignals = {
  readonly hasMoved: boolean;
  readonly hasHotbarClicked: boolean;
  readonly hasActionBarClicked: boolean;
  readonly hasChopStarted: boolean;
  readonly hasForagePicked: boolean;
  readonly hasMineStarted: boolean;
  readonly hasLootPickup: boolean;
  readonly hasMeleeSwung: boolean;
  readonly hasHungerClicked: boolean;
  readonly hasTemperatureClicked: boolean;
  readonly hasSprinted: boolean;
  readonly hasStaminaDepleted: boolean;
  readonly hasStatusEffectClicked: boolean;
  readonly hasCraftModeSelected: boolean;
  readonly hasCookStarted: boolean;
  readonly hasCodexOpened: boolean;
  readonly hasHerbariumCodexOpened: boolean;
  readonly hasStudyStarted: boolean;
  readonly hasMinimapOpened: boolean;
  readonly hasBuildModeSelected: boolean;
  readonly hasClaimModeSelected: boolean;
  readonly hasProfileOpened: boolean;
  readonly hasPetsOpened: boolean;
};

export type WorldPlazaOnboardingCoachmarkSnapshot = {
  readonly storageOwnerId: string | null;
  readonly completedStepIds: ReadonlySet<WorldPlazaOnboardingCoachmarkStepId>;
  readonly sessionSignals: WorldPlazaOnboardingCoachmarkSessionSignals;
};

const MANAGING_WORLD_PLAZA_ONBOARDING_COACHMARK_EMPTY_SESSION_SIGNALS: WorldPlazaOnboardingCoachmarkSessionSignals =
  {
    hasMoved: false,
    hasHotbarClicked: false,
    hasActionBarClicked: false,
    hasChopStarted: false,
    hasForagePicked: false,
    hasMineStarted: false,
    hasLootPickup: false,
    hasMeleeSwung: false,
    hasHungerClicked: false,
    hasTemperatureClicked: false,
    hasSprinted: false,
    hasStaminaDepleted: false,
    hasStatusEffectClicked: false,
    hasCraftModeSelected: false,
    hasCookStarted: false,
    hasCodexOpened: false,
    hasHerbariumCodexOpened: false,
    hasStudyStarted: false,
    hasMinimapOpened: false,
    hasBuildModeSelected: false,
    hasClaimModeSelected: false,
    hasProfileOpened: false,
    hasPetsOpened: false,
  };

const managingWorldPlazaOnboardingCoachmarkSubscribers = new Set<() => void>();

let managingWorldPlazaOnboardingCoachmarkStorageOwnerId: string | null = null;
let managingWorldPlazaOnboardingCoachmarkCompletedStepIds =
  new Set<WorldPlazaOnboardingCoachmarkStepId>();
let managingWorldPlazaOnboardingCoachmarkSessionSignals: WorldPlazaOnboardingCoachmarkSessionSignals =
  MANAGING_WORLD_PLAZA_ONBOARDING_COACHMARK_EMPTY_SESSION_SIGNALS;

let managingWorldPlazaOnboardingCoachmarkSnapshotCache: WorldPlazaOnboardingCoachmarkSnapshot =
  {
    storageOwnerId: null,
    completedStepIds: new Set(),
    sessionSignals:
      MANAGING_WORLD_PLAZA_ONBOARDING_COACHMARK_EMPTY_SESSION_SIGNALS,
  };

function refreshingWorldPlazaOnboardingCoachmarkSnapshotCache(): void {
  managingWorldPlazaOnboardingCoachmarkSnapshotCache = {
    storageOwnerId: managingWorldPlazaOnboardingCoachmarkStorageOwnerId,
    completedStepIds: managingWorldPlazaOnboardingCoachmarkCompletedStepIds,
    sessionSignals: managingWorldPlazaOnboardingCoachmarkSessionSignals,
  };
}

function notifyingWorldPlazaOnboardingCoachmarkSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaOnboardingCoachmarkSubscribers) {
    onStoreChange();
  }
}

function persistingWorldPlazaOnboardingCoachmarkCompletedSteps(): void {
  writingWorldPlazaOnboardingCoachmarksToStorage(
    managingWorldPlazaOnboardingCoachmarkStorageOwnerId,
    managingWorldPlazaOnboardingCoachmarkCompletedStepIds
  );
}

/**
 * Hydrates onboarding coachmark progress from localStorage for one session owner.
 *
 * @param storageOwnerId - Session owner id, or null for guest sessions.
 */
export function initializingWorldPlazaOnboardingCoachmarkStore(
  storageOwnerId: string | null
): void {
  if (managingWorldPlazaOnboardingCoachmarkStorageOwnerId === storageOwnerId) {
    return;
  }

  managingWorldPlazaOnboardingCoachmarkStorageOwnerId = storageOwnerId;
  managingWorldPlazaOnboardingCoachmarkCompletedStepIds = new Set(
    readingWorldPlazaOnboardingCoachmarksFromStorage(storageOwnerId)
  );
  managingWorldPlazaOnboardingCoachmarkSessionSignals =
    MANAGING_WORLD_PLAZA_ONBOARDING_COACHMARK_EMPTY_SESSION_SIGNALS;
  refreshingWorldPlazaOnboardingCoachmarkSnapshotCache();
  notifyingWorldPlazaOnboardingCoachmarkSubscribers();
}

/** Subscribes to onboarding coachmark store changes. */
export function subscribingWorldPlazaOnboardingCoachmarks(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaOnboardingCoachmarkSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaOnboardingCoachmarkSubscribers.delete(onStoreChange);
  };
}

/** Returns the latest onboarding coachmark snapshot. */
export function gettingWorldPlazaOnboardingCoachmarkSnapshot(): WorldPlazaOnboardingCoachmarkSnapshot {
  return managingWorldPlazaOnboardingCoachmarkSnapshotCache;
}

/**
 * Marks one coachmark step complete and persists when newly completed.
 */
export function completingWorldPlazaOnboardingCoachmarkStep(
  stepId: WorldPlazaOnboardingCoachmarkStepId
): void {
  if (managingWorldPlazaOnboardingCoachmarkCompletedStepIds.has(stepId)) {
    return;
  }

  managingWorldPlazaOnboardingCoachmarkCompletedStepIds = new Set([
    ...managingWorldPlazaOnboardingCoachmarkCompletedStepIds,
    stepId,
  ]);
  persistingWorldPlazaOnboardingCoachmarkCompletedSteps();
  refreshingWorldPlazaOnboardingCoachmarkSnapshotCache();
  notifyingWorldPlazaOnboardingCoachmarkSubscribers();
}

function patchingWorldPlazaOnboardingCoachmarkSessionSignals(
  patch: Partial<WorldPlazaOnboardingCoachmarkSessionSignals>
): void {
  const nextSignals = {
    ...managingWorldPlazaOnboardingCoachmarkSessionSignals,
    ...patch,
  };

  const didChange = (
    Object.keys(patch) as (keyof WorldPlazaOnboardingCoachmarkSessionSignals)[]
  ).some(
    (key) =>
      nextSignals[key] !==
      managingWorldPlazaOnboardingCoachmarkSessionSignals[key]
  );

  if (!didChange) {
    return;
  }

  managingWorldPlazaOnboardingCoachmarkSessionSignals = nextSignals;
  refreshingWorldPlazaOnboardingCoachmarkSnapshotCache();
  notifyingWorldPlazaOnboardingCoachmarkSubscribers();
}

/** Records that the player moved during this session. */
export function notifyingWorldPlazaOnboardingPlayerMoved(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({ hasMoved: true });
}

/** Records a hotbar interaction during this session. */
export function notifyingWorldPlazaOnboardingHotbarClicked(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasHotbarClicked: true,
  });
}

/** Records an action-bar interaction during this session. */
export function notifyingWorldPlazaOnboardingActionBarClicked(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasActionBarClicked: true,
  });
}

/** Records that a tree chop interaction started during this session. */
export function notifyingWorldPlazaOnboardingChopStarted(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasChopStarted: true,
  });
}

/** Records that a forage pick interaction started during this session. */
export function notifyingWorldPlazaOnboardingForagePicked(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasForagePicked: true,
  });
}

/** Records that a rock mine interaction started during this session. */
export function notifyingWorldPlazaOnboardingMineStarted(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasMineStarted: true,
  });
}

/** Records the first loot pickup during this session. */
export function notifyingWorldPlazaOnboardingLootPickup(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasLootPickup: true,
  });
}

/** Records that the player swung at wildlife during this session. */
export function notifyingWorldPlazaOnboardingMeleeSwung(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasMeleeSwung: true,
  });
}

/** Records a hunger orb interaction during this session. */
export function notifyingWorldPlazaOnboardingHungerClicked(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasHungerClicked: true,
  });
}

/** Records a temperature orb interaction during this session. */
export function notifyingWorldPlazaOnboardingTemperatureClicked(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasTemperatureClicked: true,
  });
}

/** Records that the player sprinted during this session. */
export function notifyingWorldPlazaOnboardingSprinted(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasSprinted: true,
  });
}

/** Records that run stamina fully depleted during this session. */
export function notifyingWorldPlazaOnboardingStaminaDepleted(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasStaminaDepleted: true,
  });
}

/** Records a status effect stack interaction during this session. */
export function notifyingWorldPlazaOnboardingStatusEffectClicked(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasStatusEffectClicked: true,
  });
}

/** Records that Craft mode was selected during this session. */
export function notifyingWorldPlazaOnboardingCraftModeSelected(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasCraftModeSelected: true,
  });
}

/** Records that the Codex menu was opened during this session. */
export function notifyingWorldPlazaOnboardingCodexOpened(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasCodexOpened: true,
  });
}

/** Records that the Herbarium codex section was opened during this session. */
export function notifyingWorldPlazaOnboardingHerbariumCodexOpened(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasHerbariumCodexOpened: true,
  });
}

/** Records that a corpse Study interaction started during this session. */
export function notifyingWorldPlazaOnboardingStudyStarted(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasStudyStarted: true,
  });
}

/** Records that the minimap was opened during this session. */
export function notifyingWorldPlazaOnboardingMinimapOpened(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasMinimapOpened: true,
  });
}

/** Records that a campfire cook interaction started during this session. */
export function notifyingWorldPlazaOnboardingCookStarted(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasCookStarted: true,
  });
}

/** Records that Build mode was selected during this session. */
export function notifyingWorldPlazaOnboardingBuildModeSelected(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasBuildModeSelected: true,
  });
}

/** Records that Claim mode was selected during this session. */
export function notifyingWorldPlazaOnboardingClaimModeSelected(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasClaimModeSelected: true,
  });
}

/** Records that the profile panel was opened during this session. */
export function notifyingWorldPlazaOnboardingProfileOpened(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasProfileOpened: true,
  });
}

/** Records that the pet roster was opened during this session. */
export function notifyingWorldPlazaOnboardingPetsOpened(): void {
  patchingWorldPlazaOnboardingCoachmarkSessionSignals({
    hasPetsOpened: true,
  });
}

/** Clears onboarding coachmark progress for one persistence owner. */
export function clearingWorldPlazaOnboardingCoachmarkStoreForOwner(
  storageOwnerId: string
): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(
      resolvingWorldPlazaOnboardingCoachmarksStorageKey(storageOwnerId)
    );
  }

  if (managingWorldPlazaOnboardingCoachmarkStorageOwnerId === storageOwnerId) {
    managingWorldPlazaOnboardingCoachmarkCompletedStepIds = new Set();
    managingWorldPlazaOnboardingCoachmarkSessionSignals =
      MANAGING_WORLD_PLAZA_ONBOARDING_COACHMARK_EMPTY_SESSION_SIGNALS;
    refreshingWorldPlazaOnboardingCoachmarkSnapshotCache();
    notifyingWorldPlazaOnboardingCoachmarkSubscribers();
  }
}
