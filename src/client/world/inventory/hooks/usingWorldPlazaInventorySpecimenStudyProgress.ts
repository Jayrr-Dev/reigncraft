'use client';

import type { DefiningWorldPlazaMovementDirection } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { checkingWorldPlazaInventoryFoodEatShouldContinue } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryFoodEatShouldContinue';
import { computingWorldPlazaInventorySpecimenStudyDurationMs } from '@/components/world/inventory/domains/computingWorldPlazaInventorySpecimenStudyDurationMs';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_PROGRESS_ICON,
  DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_PROGRESS_TARGET_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventorySpecimenStudyConstants';
import { useCallback, type RefObject } from 'react';
import type { WorldCloverSearchLootKind } from '../../../../shared/worldCloverSearchLoot';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';
import type { WorldShrubBerryLootKind } from '../../../../shared/worldShrubBerryLoot';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

export type DefiningWorldPlazaInventorySpecimenStudyKind =
  | 'flower'
  | 'ore'
  | 'clover'
  | 'berry'
  | 'mushroom';

export type DefiningWorldPlazaInventorySpecimenStudyProgressContext = {
  readonly slotIndex: number;
  readonly studyKind: DefiningWorldPlazaInventorySpecimenStudyKind;
  readonly flowerSpeciesId?: WorldFlowerSpeciesId;
  readonly oreSpeciesId?: WorldOreSpeciesId;
  readonly cloverKind?: WorldCloverSearchLootKind;
  readonly berryLootKind?: WorldShrubBerryLootKind;
  readonly mushroomSpeciesId?: DefiningWorldPlazaMushroomSpeciesId;
  readonly damageBaselineMs: number | null;
};

export type UsingWorldPlazaInventorySpecimenStudyProgressSnapshot =
  DefiningWorldPlazaTimedInteractionProgressSnapshot;

export type UsingWorldPlazaInventorySpecimenStudyProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly healthStateRef: RefObject<DefiningWorldPlazaEntityHealthState>;
  readonly keyboardDirectionRef: RefObject<DefiningWorldPlazaMovementDirection>;
  readonly walkTargetRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly jumpRequestedRef: RefObject<boolean>;
  readonly rollRequestedRef: RefObject<boolean>;
  readonly onStudyComplete: (
    context: DefiningWorldPlazaInventorySpecimenStudyProgressContext
  ) => void;
};

export type UsingWorldPlazaInventorySpecimenStudyProgressResult = {
  readonly snapshot: UsingWorldPlazaInventorySpecimenStudyProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly startingSpecimenStudy: (
    options: Omit<
      DefiningWorldPlazaInventorySpecimenStudyProgressContext,
      'damageBaselineMs'
    >
  ) => boolean;
  readonly cancellingSpecimenStudy: () => void;
  readonly isSpecimenStudyActive: () => boolean;
};

/**
 * Inventory specimen Study adapter over the shared timed interaction mechanic.
 *
 * Duration rolls 0–1000 ms. Cancels on damage or new locomotion intent, same
 * as the food eat channel.
 */
export function usingWorldPlazaInventorySpecimenStudyProgress({
  playerPositionRef,
  healthStateRef,
  keyboardDirectionRef,
  walkTargetRef,
  jumpRequestedRef,
  rollRequestedRef,
  onStudyComplete,
}: UsingWorldPlazaInventorySpecimenStudyProgressParams): UsingWorldPlazaInventorySpecimenStudyProgressResult {
  const {
    snapshot,
    progressRatioRef,
    startingTimedInteraction,
    cancellingTimedInteraction,
  } =
    usingWorldPlazaTimedInteractionProgress<DefiningWorldPlazaInventorySpecimenStudyProgressContext>(
      {
        onComplete: onStudyComplete,
      }
    );

  const startingSpecimenStudy = useCallback(
    (
      options: Omit<
        DefiningWorldPlazaInventorySpecimenStudyProgressContext,
        'damageBaselineMs'
      >
    ): boolean => {
      if (!playerPositionRef.current) {
        return false;
      }

      const damageBaselineMs = healthStateRef.current.lastDamagedAtMs;

      // Drop queued path so study can start; new walk intent after this cancels.
      walkTargetRef.current = null;
      jumpRequestedRef.current = false;
      rollRequestedRef.current = false;

      const context: DefiningWorldPlazaInventorySpecimenStudyProgressContext = {
        ...options,
        damageBaselineMs,
      };

      return startingTimedInteraction({
        targetKey:
          DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_PROGRESS_TARGET_KEY,
        durationMs: computingWorldPlazaInventorySpecimenStudyDurationMs(),
        context,
        progressIcon:
          DEFINING_WORLD_PLAZA_INVENTORY_SPECIMEN_STUDY_PROGRESS_ICON,
        checkingShouldContinue: () => {
          return checkingWorldPlazaInventoryFoodEatShouldContinue({
            damageBaselineMs,
            lastDamagedAtMs: healthStateRef.current.lastDamagedAtMs,
            keyboardDirection: keyboardDirectionRef.current,
            walkTarget: walkTargetRef.current,
            jumpRequested: jumpRequestedRef.current,
            rollRequested: rollRequestedRef.current,
          });
        },
      });
    },
    [
      healthStateRef,
      jumpRequestedRef,
      keyboardDirectionRef,
      playerPositionRef,
      rollRequestedRef,
      startingTimedInteraction,
      walkTargetRef,
    ]
  );

  const isSpecimenStudyActive = useCallback((): boolean => {
    return snapshot.isActive;
  }, [snapshot.isActive]);

  return {
    snapshot,
    progressRatioRef,
    startingSpecimenStudy,
    cancellingSpecimenStudy: cancellingTimedInteraction,
    isSpecimenStudyActive,
  };
}
