'use client';

/**
 * Bottom HUD Cancel control while a craft / build placeable ghost is armed.
 *
 * @module components/world/building/components/renderingWorldPlazaBuildPlacementCancelButton
 */

import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_ICONIFY_ICON,
  LABELING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL,
  LABELING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_ARIA,
  STYLING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_LABEL_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldPlazaBuildPlacementCancelConstants';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { useCallback, type SyntheticEvent } from 'react';

export type RenderingWorldPlazaBuildPlacementCancelButtonProps = {
  readonly onCancel: () => void;
};

/**
 * Single Cancel action that replaces Items / Craft / Claim during placement.
 */
export function RenderingWorldPlazaBuildPlacementCancelButton({
  onCancel,
}: RenderingWorldPlazaBuildPlacementCancelButtonProps): React.JSX.Element {
  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  return (
    <button
      type="button"
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      aria-label={LABELING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_ARIA}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={(event) => {
        stoppingPlazaWalkPointerPropagation(event);
        onCancel();
      }}
      className={STYLING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_BUTTON_CLASS_NAME}
    >
      <Icon
        icon={DEFINING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_ICONIFY_ICON}
        className={STYLING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_ICON_CLASS_NAME}
        aria-hidden
      />
      <span
        className={STYLING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL_LABEL_CLASS_NAME}
      >
        {LABELING_WORLD_PLAZA_BUILD_PLACEMENT_CANCEL}
      </span>
    </button>
  );
}
