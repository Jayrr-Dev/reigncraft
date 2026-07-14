/**
 * Public pet domain API.
 *
 * @module components/world/wildlife/pets
 */

export { applyingWildlifePetBondAfterDocileFollow } from '@/components/world/wildlife/pets/domains/applyingWildlifePetBondAfterDocileFollow';

export {
  applyingWildlifePetCommandTick,
  type ApplyingWildlifePetCommandTickParams,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetCommandTick';

export { applyingWildlifePetCuriousFollowGrant } from '@/components/world/wildlife/pets/domains/applyingWildlifePetCuriousFollowGrant';

export {
  applyingWildlifePetLoyaltyGrant,
  type ApplyingWildlifePetLoyaltyGrantResult,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetLoyaltyGrant';

export { enqueueingWildlifePetLoyaltyFloatFeedback } from '@/components/world/wildlife/pets/domains/enqueueingWildlifePetLoyaltyFloatFeedback';

export {
  applyingWildlifePetDevLoyaltyGrant,
  type ApplyingWildlifePetDevLoyaltyGrantKind,
  type ApplyingWildlifePetDevLoyaltyGrantParams,
  type ApplyingWildlifePetDevLoyaltyGrantResult,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetDevLoyaltyGrant';

export {
  applyingWildlifePetOwnerFeed,
  type ApplyingWildlifePetOwnerFeedResult,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetOwnerFeed';

export {
  applyingWildlifePetOwnerHeal,
  type ApplyingWildlifePetOwnerHealResult,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetOwnerHeal';

export {
  applyingWildlifePetPettingLoyalty,
  type ApplyingWildlifePetPettingLoyaltyResult,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetPettingLoyalty';

export {
  applyingWildlifePetSoulsave,
  type ApplyingWildlifePetSoulsaveResult,
} from '@/components/world/wildlife/pets/domains/applyingWildlifePetSoulsave';

export { checkingWildlifePetAllied } from '@/components/world/wildlife/pets/domains/checkingWildlifePetAllied';

export { checkingWildlifePetNeedsOwnerFeed } from '@/components/world/wildlife/pets/domains/checkingWildlifePetNeedsOwnerFeed';

export {
  checkingWildlifePetItemIsEquippableWeapon,
  checkingWildlifePetItemTypeIdIsEquippableWeapon,
} from '@/components/world/wildlife/pets/domains/checkingWildlifePetItemIsEquippableWeapon';

export {
  checkingWildlifePetMayAcceptCommand,
  listingWildlifePetAvailableCommands,
} from '@/components/world/wildlife/pets/domains/checkingWildlifePetMayAcceptCommand';

export { computingWildlifePetLoyaltyFromRestoredPoints } from '@/components/world/wildlife/pets/domains/computingWildlifePetLoyaltyFromRestoredPoints';

export {
  creatingWildlifePetBondStateFromPersistedRecord,
  creatingWildlifePetPersistedRecord,
  type CreatingWildlifePetPersistedRecordParams,
} from '@/components/world/wildlife/pets/domains/creatingWildlifePetPersistedRecord';

export {
  checkingWildlifePetRosterHasLivingActiveRoom,
  checkingWildlifePetRosterRecordIsLivingActive,
  countingWildlifePetRosterLivingActive,
  resolvingWildlifePetRosterPrimaryActivePetId,
} from '@/components/world/wildlife/pets/domains/checkingWildlifePetRosterDeployable';

export {
  DEFINING_WILDLIFE_PET_CURIOUS_FOLLOW_LOYALTY_GRANT,
  DEFINING_WILDLIFE_PET_LOYALTY_TIER_REGISTRY,
  DEFINING_WILDLIFE_PET_MAX_ACTIVE,
  DEFINING_WILDLIFE_PET_MAX_LOYALTY,
  DEFINING_WILDLIFE_PET_NAME_PROMPT_LABEL,
  DEFINING_WILDLIFE_PET_PETTING_LOYALTY_GRANT,
  type DefiningWildlifePetLoyaltyTierDefinition,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';

export {
  DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_LARGE,
  DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_MEDIUM,
  DEFINING_WILDLIFE_PET_DEV_LOYALTY_GRANT_PETTING,
  LABELING_WILDLIFE_PET_DEV_HINT,
  LABELING_WILDLIFE_PET_DEV_LOYALTY_OVERLAY_TOGGLE,
  LABELING_WILDLIFE_PET_DEV_SECTION,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetDevLoyaltyConstants';

export {
  appendingWildlifePetLoyaltyDebugToNameTagLabel,
  formattingWildlifePetLoyaltyDebugLabel,
} from '@/components/world/wildlife/pets/domains/formattingWildlifePetLoyaltyDebugLabel';

export { findingWildlifeNearestPettableInstance } from '@/components/world/wildlife/pets/domains/findingWildlifeNearestPettableInstance';

export {
  checkingWildlifePetLoyaltyDebugVisible,
  settingWildlifePetLoyaltyDebugVisible,
  subscribingWildlifePetLoyaltyDebugVisible,
  togglingWildlifePetLoyaltyDebugVisible,
} from '@/components/world/wildlife/pets/domains/managingWildlifePetLoyaltyDebugVisibilityStore';

export {
  DEFINING_WILDLIFE_PET_ROSTER_STORAGE_KEY_PREFIX,
  resolvingWildlifePetRosterStorageKey,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetRosterConstants';

export type {
  DefiningWildlifePetBondState,
  DefiningWildlifePetCapabilityId,
  DefiningWildlifePetCommandId,
  DefiningWildlifePetLoyaltyTierId,
  DefiningWildlifePetPersistedRecord,
  DefiningWildlifePetRoster,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';

export {
  initializingWildlifePetRosterStore,
  readingWildlifePetRosterSnapshot,
  removingWildlifePetRecord,
  replacingWildlifePetRosterFromSnapshot,
  resettingWildlifePetRosterStoreForTests,
  settingWildlifePetActivePetId,
  settingWildlifePetRosterMultiplayerMirrorEnabled,
  subscribingWildlifePetRoster,
  updatingWildlifePetRecord,
  upsertingWildlifePetRecord,
  type InitializingWildlifePetRosterStoreOptions,
} from '@/components/world/wildlife/pets/domains/managingWildlifePetRosterStore';

export { readingWildlifePetRosterFromStorage } from '@/components/world/wildlife/pets/domains/readingWildlifePetRosterFromStorage';

export {
  resolvingWildlifePetAdvancedStats,
  type ResolvingWildlifePetAdvancedStatEntry,
  type ResolvingWildlifePetAdvancedStatsParams,
  type ResolvingWildlifePetAdvancedStatsResult,
} from '@/components/world/wildlife/pets/domains/resolvingWildlifePetAdvancedStats';

export {
  resolvingWildlifePetCommandIntent,
  type ResolvingWildlifePetCommandIntentParams,
  type ResolvingWildlifePetCommandIntentResult,
} from '@/components/world/wildlife/pets/domains/resolvingWildlifePetCommandIntent';

export { resolvingWildlifePetIdleInteractionLabel } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetIdleInteractionLabel';

export {
  checkingWildlifePetHasCapability,
  listingWildlifePetUnlockedCapabilities,
  resolvingWildlifePetLoyaltyTier,
  resolvingWildlifePetLoyaltyTierId,
  resolvingWildlifePetLoyaltyTierOrNull,
  resolvingWildlifePetNextTier,
  type ResolvingWildlifePetNextTierResult,
} from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';

export {
  creatingEmptyWildlifePetRoster,
  parsingWildlifePetPersistedRecord,
  parsingWildlifePetRoster,
  serializingWildlifePetPersistedRecord,
  serializingWildlifePetRoster,
  type ParsingWildlifePetRosterResult,
} from '@/components/world/wildlife/pets/domains/serializingWildlifePetRoster';

export { writingWildlifePetRosterToStorage } from '@/components/world/wildlife/pets/domains/writingWildlifePetRosterToStorage';

export {
  findingWildlifeInstanceByPetId,
  formattingWildlifePetInstanceId,
  spawningWildlifeActivePetNearOwner,
} from '@/components/world/wildlife/pets/domains/spawningWildlifeActivePetNearOwner';

export {
  syncingWildlifePetBondToRoster,
  syncingWildlifePetDeathToRoster,
  syncingWildlifePetInstanceVitalsToRoster,
} from '@/components/world/wildlife/pets/domains/syncingWildlifePetBondToRoster';

export {
  resolvingWildlifePetRosterPetsWithLiveVitals,
  resolvingWildlifePetRosterPetsWithLiveVitalsFromStore,
  resolvingWildlifePetRosterRecordWithLiveVitals,
  formattingWildlifePetRosterLiveVitalsFingerprint,
} from '@/components/world/wildlife/pets/domains/resolvingWildlifePetRosterPetsWithLiveVitals';

export {
  fetchingPlazaPetsMultiplayerRoster,
  savingPlazaPetsMultiplayerRoster,
} from '@/components/world/wildlife/pets/repositories/callingPlazaPetsDevvitApi';

export { RenderingWildlifePetModal } from '@/components/world/wildlife/pets/components/renderingWildlifePetModal';

export { RenderingWildlifePetNameDialog } from '@/components/world/wildlife/pets/components/renderingWildlifePetNameDialog';

export { RenderingWildlifePetRosterPanel } from '@/components/world/wildlife/pets/components/renderingWildlifePetRosterPanel';

export { RenderingWorldPlazaDevModePetControls } from '@/components/world/wildlife/pets/components/renderingWorldPlazaDevModePetControls';

export {
  usingWildlifeActivePetSpawn,
  type UsingWildlifeActivePetSpawnParams,
  type UsingWildlifeActivePetSpawnResult,
} from '@/components/world/wildlife/pets/hooks/usingWildlifeActivePetSpawn';

export {
  usingWildlifePetLoyaltyDebugVisibleState,
  type UsingWildlifePetLoyaltyDebugVisibleStateResult,
} from '@/components/world/wildlife/pets/hooks/usingWildlifePetLoyaltyDebugVisibleState';

export {
  usingWildlifePetModalState,
  type UsingWildlifePetModalStateResult,
} from '@/components/world/wildlife/pets/hooks/usingWildlifePetModalState';

export {
  usingWildlifePetRosterPanelLivePets,
  type UsingWildlifePetRosterPanelLivePetsParams,
} from '@/components/world/wildlife/pets/hooks/usingWildlifePetRosterPanelLivePets';

export {
  usingWildlifePetRosterPanelVisibleState,
  type UsingWildlifePetRosterPanelVisibleStateResult,
} from '@/components/world/wildlife/pets/hooks/usingWildlifePetRosterPanelVisibleState';
