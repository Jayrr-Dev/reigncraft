"use client";

import { RenderingWorldPlazaPlayerProfilePopoverCard } from "@/components/world/components/renderingWorldPlazaPlayerProfilePopoverCard";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import {
  DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_CLOSE_BUTTON_ARIA_LABEL,
  DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_CLOSE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_DATA_ATTRIBUTE,
  DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_PANEL_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_PANEL_WIDTH_CSS_VALUE,
} from "@/components/world/domains/definingWorldPlazaPlayerProfileModalConstants";
import { XIcon } from "lucide-react";
import { useCallback, useEffect, type CSSProperties, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";

export interface RenderingWorldPlazaPlayerProfileModalProps {
  /** Whether the modal is visible. */
  isOpen: boolean;
  /** Remote player auth user id. */
  userId: string;
  /** Label used for the modal aria label. */
  displayName: string;
  /** Closes the modal. */
  onClose: () => void;
}

/** Inline width for the modal panel so it hugs the profile card. */
const RENDERING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_PANEL_STYLE = {
  "--plaza-profile-modal-width":
    DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_PANEL_WIDTH_CSS_VALUE,
} as CSSProperties;

/**
 * Centered in-game profile modal for remote plaza players.
 */
export function RenderingWorldPlazaPlayerProfileModal({
  isOpen,
  userId,
  displayName,
  onClose,
}: RenderingWorldPlazaPlayerProfileModalProps): React.JSX.Element | null {
  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    [],
  );

  const closingModalOnOverlayClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (event.target !== event.currentTarget) {
        return;
      }

      onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dismissingModalOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") {
        return;
      }

      onClose();
    };

    document.addEventListener("keydown", dismissingModalOnEscape);

    return () => {
      document.removeEventListener("keydown", dismissingModalOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      {...{
        [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: "profile-modal",
        [DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_DATA_ATTRIBUTE]: "",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`${displayName}'s profile`}
      className={DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={closingModalOnOverlayClick}
    >
      <div
        className={DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_PANEL_CLASS_NAME}
        style={RENDERING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_PANEL_STYLE}
        onPointerDown={stoppingPlazaWalkPointerPropagation}
        onClick={stoppingPlazaWalkPointerPropagation}
      >
        <button
          type="button"
          className={DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_CLOSE_BUTTON_CLASS_NAME}
          aria-label={DEFINING_WORLD_PLAZA_PLAYER_PROFILE_MODAL_CLOSE_BUTTON_ARIA_LABEL}
          onClick={onClose}
        >
          <XIcon className="size-4" aria-hidden />
        </button>
        <RenderingWorldPlazaPlayerProfilePopoverCard
          userId={userId}
          isOpen={isOpen}
          layoutVariant="modal"
        />
      </div>
    </div>,
    document.body,
  );
}
