'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME } from '@/components/world/fire/domains/definingWorldPlazaCampfireInteractionLabelUiConstants';
import { RenderingWorldPlazaTimedInteractionProgressRing } from '@/components/world/interaction/components/renderingWorldPlazaTimedInteractionProgressRing';
import { checkingWorldPlazaTimedInteractionProgressRingVisible } from '@/components/world/interaction/domains/checkingWorldPlazaTimedInteractionProgressMatchesTarget';
import {
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_LABEL_RING_SLOT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_TIMED_INTERACTION_LABEL_ROW_CLASS_NAME,
} from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionLabelUiConstants';
import { DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_LABEL_GAP_PX } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressConstants';
import type { DefiningWorldPlazaTimedInteractionProgressSnapshot } from '@/components/world/interaction/domains/definingWorldPlazaTimedInteractionProgressSnapshot';
import { memo, type RefObject } from 'react';

export type RenderingWorldPlazaTimedInteractionLabelRowProps = {
  readonly label: string;
  readonly targetKey: string;
  readonly progressSnapshot: DefiningWorldPlazaTimedInteractionProgressSnapshot;
  readonly progressRatioRef: RefObject<number>;
  readonly rowRef?: React.Ref<HTMLDivElement>;
  readonly onActivate: () => void;
};

/**
 * Outlined action label with an optional timed progress ring on the right.
 */
export const RenderingWorldPlazaTimedInteractionLabelRow = memo(
  function RenderingWorldPlazaTimedInteractionLabelRow({
    label,
    targetKey,
    progressSnapshot,
    progressRatioRef,
    rowRef,
    onActivate,
  }: RenderingWorldPlazaTimedInteractionLabelRowProps): React.JSX.Element {
    const isProgressRingVisible =
      checkingWorldPlazaTimedInteractionProgressRingVisible(
        progressSnapshot,
        targetKey
      );

    return (
      <div
        ref={rowRef}
        className={DEFINING_WORLD_PLAZA_TIMED_INTERACTION_LABEL_ROW_CLASS_NAME}
      >
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          className={
            DEFINING_WORLD_PLAZA_CAMPFIRE_INTERACTION_LABEL_BUTTON_CLASS_NAME
          }
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onActivate();
          }}
        >
          {label}
        </button>
        {isProgressRingVisible ? (
          <div
            className={
              DEFINING_WORLD_PLAZA_TIMED_INTERACTION_LABEL_RING_SLOT_CLASS_NAME
            }
            style={{
              marginLeft: `${DEFINING_WORLD_PLAZA_TIMED_INTERACTION_PROGRESS_LABEL_GAP_PX}px`,
            }}
          >
            <RenderingWorldPlazaTimedInteractionProgressRing
              snapshot={progressSnapshot}
              progressRatioRef={progressRatioRef}
            />
          </div>
        ) : null}
      </div>
    );
  }
);
