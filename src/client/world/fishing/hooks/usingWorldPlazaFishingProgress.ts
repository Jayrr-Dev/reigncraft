'use client';

import type { DefiningWorldPlazaAvatarToolAction } from '@/components/world/animation/domains/definingWorldPlazaAvatarToolActionAnimationRegistry';
import type { DefiningWorldPlazaMovementDirection } from '@/components/world/domains/definingWorldPlazaMovementDirection';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { checkingWorldPlazaFishingCastEligibility } from '@/components/world/fishing/domains/checkingWorldPlazaFishingCastEligibility';
import { checkingWorldPlazaFishingCastShouldContinue } from '@/components/world/fishing/domains/checkingWorldPlazaFishingCastShouldContinue';
import type { DefiningWorldPlazaFishingCastSessionContext } from '@/components/world/fishing/domains/definingWorldPlazaFishingCastSessionContext';
import { DEFINING_WORLD_PLAZA_FISHING_TIMED_INTERACTION_PROGRESS_ICON } from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';
import { formattingWorldPlazaFishingTileSelectionKey } from '@/components/world/fishing/domains/formattingWorldPlazaFishingTileSelectionKey';
import type { ListingWorldPlazaFishingTilesInInteractionRangeEntry } from '@/components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange';
import {
  applyingWorldPlazaFishingReelEscapeReduction,
  beginningWorldPlazaFishingReelCastState,
  gettingWorldPlazaFishingReelCastElapsedBonusMs,
  gettingWorldPlazaFishingReelOpportunityActive,
  resettingWorldPlazaFishingReelCastState,
  settingWorldPlazaFishingReelHold,
  tickingWorldPlazaFishingReelCastFrame,
} from '@/components/world/fishing/domains/managingWorldPlazaFishingReelCastState';
import { playingWorldPlazaFishingSfx } from '@/components/world/fishing/domains/playingWorldPlazaFishingSfx';
import type { PreparingWorldPlazaFishingCastSessionResult } from '@/components/world/fishing/domains/preparingWorldPlazaFishingCastSession';
import { checkingWorldPlazaTimedInteractionProgressMatchesTarget } from '@/components/world/interaction/domains/checkingWorldPlazaTimedInteractionProgressMatchesTarget';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { usingWorldPlazaTimedInteractionProgress } from '@/components/world/interaction/hooks/usingWorldPlazaTimedInteractionProgress';
import { useCallback, useEffect, useRef, type RefObject } from 'react';

export type UsingWorldPlazaFishingProgressParams = {
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly selectedInteractableBlockKeysRef: RefObject<ReadonlySet<string>>;
  readonly keyboardDirectionRef: RefObject<DefiningWorldPlazaMovementDirection>;
  readonly walkTargetRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly jumpRequestedRef: RefObject<boolean>;
  readonly rollRequestedRef: RefObject<boolean>;
  readonly avatarToolActionRef?: RefObject<DefiningWorldPlazaAvatarToolAction | null>;
  readonly preparingFishingCastSession: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => PreparingWorldPlazaFishingCastSessionResult | null;
  readonly onCastComplete: (
    session: DefiningWorldPlazaFishingCastSessionContext
  ) => void;
};

export type StartingWorldPlazaFishingCastOutcome =
  | 'started'
  | 'queued'
  | 'already-fishing'
  | 'nothing-bites'
  | 'failed';

export type ReelingWorldPlazaFishingCastOutcome =
  | 'reeled'
  | 'cooldown'
  | 'capped'
  | 'inactive'
  | 'not-ready';

export type UsingWorldPlazaFishingProgressResult = {
  readonly snapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly reelOpportunityActiveRef: RefObject<boolean>;
  readonly startingFishingCast: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => StartingWorldPlazaFishingCastOutcome;
  readonly reelingFishingCast: (
    entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
  ) => ReelingWorldPlazaFishingCastOutcome;
  readonly startingFishingReelHold: () => void;
  readonly stoppingFishingReelHold: () => void;
};

/**
 * Timed fishing cast adapter over the shared interaction progress mechanic.
 *
 * Cancels when the player walks, keys a direction, jumps, or rolls.
 */
export function usingWorldPlazaFishingProgress({
  playerPositionRef,
  selectedInteractableBlockKeysRef,
  keyboardDirectionRef,
  walkTargetRef,
  jumpRequestedRef,
  rollRequestedRef,
  avatarToolActionRef,
  preparingFishingCastSession,
  onCastComplete,
}: UsingWorldPlazaFishingProgressParams): UsingWorldPlazaFishingProgressResult {
  const reelOpportunityActiveRef = useRef(false);
  const onCastCompleteRef = useRef(onCastComplete);

  onCastCompleteRef.current = onCastComplete;

  const handlingFishingCastComplete = useCallback(
    (session: DefiningWorldPlazaFishingCastSessionContext): void => {
      resettingWorldPlazaFishingReelCastState();
      reelOpportunityActiveRef.current = false;
      onCastCompleteRef.current(session);
    },
    []
  );

  const { snapshot, progressRatioRef, startingTimedInteraction } =
    usingWorldPlazaTimedInteractionProgress({
      onComplete: handlingFishingCastComplete,
      avatarToolActionRef,
      resolvingExtraElapsedMs: gettingWorldPlazaFishingReelCastElapsedBonusMs,
    });

  useEffect(() => {
    if (!snapshot.isActive) {
      reelOpportunityActiveRef.current = false;
      return;
    }

    const unsubscribeDomOverlayFrame = subscribingWorldPlazaDomOverlayFrame(
      (deltaMs, frameTimeMs) => {
        tickingWorldPlazaFishingReelCastFrame(deltaMs, frameTimeMs);
        reelOpportunityActiveRef.current =
          gettingWorldPlazaFishingReelOpportunityActive();
      }
    );

    return () => {
      unsubscribeDomOverlayFrame();
    };
  }, [snapshot.isActive]);

  const startingFishingCast = useCallback(
    (
      entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
    ): StartingWorldPlazaFishingCastOutcome => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return 'failed';
      }

      const eligibility = checkingWorldPlazaFishingCastEligibility(
        playerPosition,
        entry.tileX,
        entry.tileY
      );

      if (!eligibility.isEligible) {
        return 'failed';
      }

      const preparedSession = preparingFishingCastSession(entry);

      if (!preparedSession) {
        return 'nothing-bites';
      }

      const targetKey = formattingWorldPlazaFishingTileSelectionKey(
        entry.tileX,
        entry.tileY
      );

      // Drop pending path so cast can start; new walk / key / jump / roll cancels.
      walkTargetRef.current = null;
      jumpRequestedRef.current = false;
      rollRequestedRef.current = false;

      const didStart = startingTimedInteraction({
        targetKey,
        context: preparedSession.session,
        durationMs: preparedSession.durationMs,
        progressIcon:
          DEFINING_WORLD_PLAZA_FISHING_TIMED_INTERACTION_PROGRESS_ICON,
        checkingShouldContinue: () => {
          return checkingWorldPlazaFishingCastShouldContinue({
            playerPosition: playerPositionRef.current,
            tileX: entry.tileX,
            tileY: entry.tileY,
            targetKey,
            selectedInteractableBlockKeys:
              selectedInteractableBlockKeysRef.current,
            keyboardDirection: keyboardDirectionRef.current,
            walkTarget: walkTargetRef.current,
            jumpRequested: jumpRequestedRef.current,
            rollRequested: rollRequestedRef.current,
          });
        },
        avatarToolAction: {
          toolActionId: 'tree-chop',
          targetGridX: entry.tileX + 0.5,
          targetGridY: entry.tileY + 0.5,
        },
      });

      if (!didStart) {
        return 'already-fishing';
      }

      const castStartedAtMs = performance.now();
      beginningWorldPlazaFishingReelCastState(
        castStartedAtMs,
        preparedSession.durationMs
      );
      reelOpportunityActiveRef.current = false;
      playingWorldPlazaFishingSfx({ actionId: 'cast_start' });

      return 'started';
    },
    [
      jumpRequestedRef,
      keyboardDirectionRef,
      playerPositionRef,
      preparingFishingCastSession,
      rollRequestedRef,
      selectedInteractableBlockKeysRef,
      startingTimedInteraction,
      walkTargetRef,
    ]
  );

  const reelingFishingCast = useCallback(
    (
      entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry
    ): ReelingWorldPlazaFishingCastOutcome => {
      const targetKey = formattingWorldPlazaFishingTileSelectionKey(
        entry.tileX,
        entry.tileY
      );

      if (
        !snapshot.isActive ||
        !checkingWorldPlazaTimedInteractionProgressMatchesTarget(
          snapshot,
          targetKey
        )
      ) {
        return 'inactive';
      }

      const reelResult = applyingWorldPlazaFishingReelEscapeReduction();

      if (reelResult === 'not-ready') {
        return 'not-ready';
      }

      if (reelResult === 'cooldown') {
        return 'cooldown';
      }

      playingWorldPlazaFishingSfx({ actionId: 'reel' });

      return reelResult === 'capped' ? 'capped' : 'reeled';
    },
    [snapshot]
  );

  const startingFishingReelHold = useCallback((): void => {
    settingWorldPlazaFishingReelHold(true);
  }, []);

  const stoppingFishingReelHold = useCallback((): void => {
    settingWorldPlazaFishingReelHold(false);
  }, []);

  return {
    snapshot,
    progressRatioRef,
    reelOpportunityActiveRef,
    startingFishingCast,
    reelingFishingCast,
    startingFishingReelHold,
    stoppingFishingReelHold,
  };
}
