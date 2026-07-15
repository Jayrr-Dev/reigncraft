/**
 * Module-level store for purchased Spritcore stat upgrades.
 *
 * Bonuses are scoped per avatar form so transform characters keep their own
 * Spiritcore investment.
 *
 * @module components/world/spritcore/domains/managingWorldPlazaSpritcoreUpgradeStore
 */

import { computingWorldPlazaSpritcoreDeathCommittedPenalty } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreDeathCommittedPenalty';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_ATTACK_SPEED_UPGRADE_STEP,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DAMAGE_UPGRADE_STEP,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_HEALTH_UPGRADE_STEP,
  DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_ATTACK_SPEED,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreLevelingConstants';
import {
  WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES,
  type WorldPlazaSpritcoreUpgradeBonuses,
  type WorldPlazaSpritcoreUpgradeLaneId,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';
import { readingWorldPlazaSpritcoreUpgradeFromStorage } from '@/components/world/spritcore/domains/readingWorldPlazaSpritcoreUpgradeFromStorage';
import { writingWorldPlazaSpritcoreUpgradeToStorage } from '@/components/world/spritcore/domains/writingWorldPlazaSpritcoreUpgradeToStorage';

const managingWorldPlazaSpritcoreUpgradeSubscribers = new Set<() => void>();

let managingWorldPlazaSpritcoreUpgradeStorageOwnerId: string | null = null;
let managingWorldPlazaSpritcoreUpgradeAvatarSkinId: string | null = null;
let managingWorldPlazaSpritcoreUpgradeSnapshot: WorldPlazaSpritcoreUpgradeBonuses =
  WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;

function notifyingWorldPlazaSpritcoreUpgradeSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaSpritcoreUpgradeSubscribers) {
    onStoreChange();
  }
}

function persistingWorldPlazaSpritcoreUpgrade(): void {
  writingWorldPlazaSpritcoreUpgradeToStorage(
    managingWorldPlazaSpritcoreUpgradeStorageOwnerId,
    managingWorldPlazaSpritcoreUpgradeSnapshot,
    managingWorldPlazaSpritcoreUpgradeAvatarSkinId
  );
}

/**
 * Hydrates Spritcore upgrade bonuses from localStorage for one owner + form.
 */
export function initializingWorldPlazaSpritcoreUpgradeStore(
  storageOwnerId: string | null,
  avatarSkinId: string | null = null
): void {
  if (
    managingWorldPlazaSpritcoreUpgradeStorageOwnerId === storageOwnerId &&
    managingWorldPlazaSpritcoreUpgradeAvatarSkinId === avatarSkinId
  ) {
    return;
  }

  managingWorldPlazaSpritcoreUpgradeStorageOwnerId = storageOwnerId;
  managingWorldPlazaSpritcoreUpgradeAvatarSkinId = avatarSkinId;
  managingWorldPlazaSpritcoreUpgradeSnapshot =
    readingWorldPlazaSpritcoreUpgradeFromStorage(storageOwnerId, avatarSkinId);
  notifyingWorldPlazaSpritcoreUpgradeSubscribers();
}

export function gettingWorldPlazaSpritcoreUpgradeSnapshot(): WorldPlazaSpritcoreUpgradeBonuses {
  return managingWorldPlazaSpritcoreUpgradeSnapshot;
}

export function subscribingWorldPlazaSpritcoreUpgrade(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaSpritcoreUpgradeSubscribers.add(onStoreChange);

  return () => {
    managingWorldPlazaSpritcoreUpgradeSubscribers.delete(onStoreChange);
  };
}

export type ApplyingWorldPlazaSpritcoreUpgradePurchaseResult =
  | 'applied'
  | 'capped'
  | 'invalid';

/**
 * Applies one purchased upgrade lane and records Spiritcore spent.
 */
export function applyingWorldPlazaSpritcoreUpgradePurchase(
  laneId: WorldPlazaSpritcoreUpgradeLaneId,
  price: number,
  currentNominalAttackSpeed: number
): ApplyingWorldPlazaSpritcoreUpgradePurchaseResult {
  if (!Number.isFinite(price) || price <= 0) {
    return 'invalid';
  }

  const current = managingWorldPlazaSpritcoreUpgradeSnapshot;

  if (laneId === 'attackSpeed') {
    const nextAttackSpeed =
      currentNominalAttackSpeed +
      DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_ATTACK_SPEED_UPGRADE_STEP;

    if (
      nextAttackSpeed > DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_MAX_ATTACK_SPEED
    ) {
      return 'capped';
    }
  }

  const nextBonuses: WorldPlazaSpritcoreUpgradeBonuses = {
    bonusMaxHealth:
      laneId === 'health'
        ? current.bonusMaxHealth +
          DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_HEALTH_UPGRADE_STEP
        : current.bonusMaxHealth,
    bonusAttackPower:
      laneId === 'damage'
        ? current.bonusAttackPower +
          DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_DAMAGE_UPGRADE_STEP
        : current.bonusAttackPower,
    bonusAttackSpeed:
      laneId === 'attackSpeed'
        ? current.bonusAttackSpeed +
          DEFINING_WORLD_PLAZA_SPRITCORE_LEVELING_ATTACK_SPEED_UPGRADE_STEP
        : current.bonusAttackSpeed,
    bonusDefense: current.bonusDefense,
    bonusMoveSpeed: current.bonusMoveSpeed,
    totalSpritcoreInvested: current.totalSpritcoreInvested + price,
  };

  managingWorldPlazaSpritcoreUpgradeSnapshot = nextBonuses;
  persistingWorldPlazaSpritcoreUpgrade();
  notifyingWorldPlazaSpritcoreUpgradeSubscribers();

  return 'applied';
}

/**
 * Applies the death committed-Spritcore spill: scales bonuses down and returns
 * how much invested SC spilled to the ground.
 */
export function applyingWorldPlazaSpritcoreDeathCommittedPenalty(): number {
  const penalty = computingWorldPlazaSpritcoreDeathCommittedPenalty(
    managingWorldPlazaSpritcoreUpgradeSnapshot
  );

  if (penalty.droppedQuantity <= 0) {
    return 0;
  }

  managingWorldPlazaSpritcoreUpgradeSnapshot = penalty.nextBonuses;
  persistingWorldPlazaSpritcoreUpgrade();
  notifyingWorldPlazaSpritcoreUpgradeSubscribers();

  return penalty.droppedQuantity;
}

/** Test-only reset helper. */
export function resettingWorldPlazaSpritcoreUpgradeStoreForTests(): void {
  managingWorldPlazaSpritcoreUpgradeStorageOwnerId = null;
  managingWorldPlazaSpritcoreUpgradeAvatarSkinId = null;
  managingWorldPlazaSpritcoreUpgradeSnapshot =
    WORLD_PLAZA_SPRITCORE_UPGRADE_EMPTY_BONUSES;
  notifyingWorldPlazaSpritcoreUpgradeSubscribers();
}
