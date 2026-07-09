'use client';

/**
 * Betray? confirmation when the player tries to hit unauthorized docile wildlife.
 * Confirming starts a short Betraying.... windup with a backstab icon before damage.
 *
 * @module components/world/wildlife/components/renderingWildlifeDocileAttackConfirmDialog
 */

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BACKSTAB_ICON,
  DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAY_WINDUP_MS,
  DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ICON_SIZE_PX,
  LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ARIA_LABEL,
  LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ATTACK_LABEL,
  LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAYING_ARIA_LABEL,
  LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAYING_TITLE,
  LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_CANCEL_LABEL,
  LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_TITLE,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ACTIONS_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ATTACK_BUTTON_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BODY_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_CANCEL_BUTTON_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ICON_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_MESSAGE_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_OVERLAY_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_PANEL_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_PROGRESS_FILL_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_PROGRESS_TRACK_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_TITLE_CLASS_NAME,
  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_TITLE_ROW_CLASS_NAME,
  computingWildlifeDocileAttackConfirmBetrayProgressRatio,
  formattingWildlifeDocileAttackConfirmMessage,
} from '@/components/world/wildlife/domains/definingWildlifeDocileAttackConfirmConstants';
import type { ManagingWildlifeDocileAttackConfirmPending } from '@/components/world/wildlife/domains/managingWildlifeDocileAttackConfirmStore';
import { useEffect, useRef, useState } from 'react';

export type RenderingWildlifeDocileAttackConfirmDialogProps = {
  pending: ManagingWildlifeDocileAttackConfirmPending | null;
  onCancel: () => void;
  onConfirmAttack: (
    pending: ManagingWildlifeDocileAttackConfirmPending
  ) => void;
};

type RenderingWildlifeDocileAttackConfirmPhase = 'confirm' | 'betraying';

/**
 * In-game confirmation before damaging a friendly docile animal.
 */
export function RenderingWildlifeDocileAttackConfirmDialog({
  pending,
  onCancel,
  onConfirmAttack,
}: RenderingWildlifeDocileAttackConfirmDialogProps): React.JSX.Element | null {
  const [phase, setPhase] =
    useState<RenderingWildlifeDocileAttackConfirmPhase>('confirm');
  const [progressRatio, setProgressRatio] = useState(0);
  const onConfirmAttackRef = useRef(onConfirmAttack);
  const pendingRef = useRef(pending);

  onConfirmAttackRef.current = onConfirmAttack;
  pendingRef.current = pending;

  useEffect(() => {
    setPhase('confirm');
    setProgressRatio(0);
  }, [pending?.instanceId]);

  useEffect(() => {
    if (!pending || phase !== 'betraying') {
      return;
    }

    const startedAtMs = performance.now();
    let animationFrameId = 0;
    let hasCompleted = false;

    const ticking = (nowMs: number): void => {
      const nextRatio = computingWildlifeDocileAttackConfirmBetrayProgressRatio(
        nowMs - startedAtMs,
        DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAY_WINDUP_MS
      );
      setProgressRatio(nextRatio);

      if (nextRatio >= 1) {
        if (!hasCompleted) {
          hasCompleted = true;
          const currentPending = pendingRef.current;
          if (currentPending) {
            onConfirmAttackRef.current(currentPending);
          }
        }
        return;
      }

      animationFrameId = requestAnimationFrame(ticking);
    };

    animationFrameId = requestAnimationFrame(ticking);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [pending?.instanceId, phase]);

  if (!pending) {
    return null;
  }

  const isBetraying = phase === 'betraying';
  const ariaLabel = isBetraying
    ? LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAYING_ARIA_LABEL
    : LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ARIA_LABEL;
  const title = isBetraying
    ? LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAYING_TITLE
    : LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_TITLE;

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className={STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_OVERLAY_CLASS_NAME}
    >
      <div className={STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_PANEL_CLASS_NAME}>
        <div className={STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BODY_CLASS_NAME}>
          <div
            className={
              STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_TITLE_ROW_CLASS_NAME
            }
          >
            <Icon
              icon={DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BACKSTAB_ICON}
              width={DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ICON_SIZE_PX}
              height={DEFINING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ICON_SIZE_PX}
              className={STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ICON_CLASS_NAME}
              aria-hidden
            />
            <p
              className={
                STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_TITLE_CLASS_NAME
              }
            >
              {title}
            </p>
          </div>
          {isBetraying ? (
            <div
              className={
                STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_PROGRESS_TRACK_CLASS_NAME
              }
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressRatio * 100)}
              aria-label={
                LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_BETRAYING_TITLE
              }
            >
              <div
                className={
                  STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_PROGRESS_FILL_CLASS_NAME
                }
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
          ) : (
            <p
              className={
                STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_MESSAGE_CLASS_NAME
              }
            >
              {formattingWildlifeDocileAttackConfirmMessage(
                pending.displayName
              )}
            </p>
          )}
        </div>

        <div
          className={STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ACTIONS_CLASS_NAME}
        >
          <button
            type="button"
            autoFocus={!isBetraying}
            onClick={onCancel}
            className={
              STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_CANCEL_BUTTON_CLASS_NAME
            }
          >
            {LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_CANCEL_LABEL}
          </button>
          {isBetraying ? null : (
            <button
              type="button"
              onClick={() => {
                setProgressRatio(0);
                setPhase('betraying');
              }}
              className={
                STYLING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ATTACK_BUTTON_CLASS_NAME
              }
            >
              {LABELING_WILDLIFE_DOCILE_ATTACK_CONFIRM_ATTACK_LABEL}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
