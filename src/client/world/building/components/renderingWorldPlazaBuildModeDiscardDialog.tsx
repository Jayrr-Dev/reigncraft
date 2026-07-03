"use client";

import {
  DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_CONFIRM_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_CONFIRM_LABEL,
  DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_KEEP_BUILDING_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_KEEP_BUILDING_LABEL,
  DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_MESSAGE,
  DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_PANEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_TITLE,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";

/** Discard dialog title classes. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_DISCARD_DIALOG_TITLE_CLASS_NAME =
  "text-sm font-semibold text-white" as const;

/** Discard dialog message classes. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_DISCARD_DIALOG_MESSAGE_CLASS_NAME =
  "text-[11px] leading-snug text-white/75" as const;

/** Accessible label for the discard dialog region. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_DISCARD_DIALOG_LABEL =
  "Discard unsaved build changes" as const;

export interface RenderingWorldPlazaBuildModeDiscardDialogProps {
  isOpen: boolean;
  onKeepBuilding: () => void;
  onConfirmDiscard: () => void;
}

/**
 * In-game confirmation when exiting build mode with unsaved local edits.
 */
export function RenderingWorldPlazaBuildModeDiscardDialog({
  isOpen,
  onKeepBuilding,
  onConfirmDiscard,
}: RenderingWorldPlazaBuildModeDiscardDialogProps): React.JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      role="dialog"
      aria-modal="true"
      aria-label={RENDERING_WORLD_PLAZA_BUILD_MODE_DISCARD_DIALOG_LABEL}
      className={DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_OVERLAY_CLASS_NAME}
    >
      <div className={DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_PANEL_CLASS_NAME}>
        <div className="space-y-2">
          <p className={RENDERING_WORLD_PLAZA_BUILD_MODE_DISCARD_DIALOG_TITLE_CLASS_NAME}>
            {DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_TITLE}
          </p>
          <p className={RENDERING_WORLD_PLAZA_BUILD_MODE_DISCARD_DIALOG_MESSAGE_CLASS_NAME}>
            {DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_MESSAGE}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            autoFocus
            onClick={onKeepBuilding}
            className={
              DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_KEEP_BUILDING_BUTTON_CLASS_NAME
            }
          >
            {DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_KEEP_BUILDING_LABEL}
          </button>
          <button
            type="button"
            onClick={onConfirmDiscard}
            className={
              DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_CONFIRM_BUTTON_CLASS_NAME
            }
          >
            {DEFINING_WORLD_BUILDING_DISCARD_DRAFT_DIALOG_CONFIRM_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
