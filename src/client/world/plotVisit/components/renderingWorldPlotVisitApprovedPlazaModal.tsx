"use client";

/**
 * Plaza dialog when a friend approved a plot visit request.
 *
 * @module components/world/plotVisit/components/renderingWorldPlotVisitApprovedPlazaModal
 */

import {
  LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_ARIA_LABEL,
  LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_GO_BUTTON,
  LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_LATER_BUTTON,
  LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_TITLE,
  labelingWorldPlotVisitApprovedModalMessage,
  type WorldPlotVisitRequestOutgoingListMember,
} from "@/components/world/plotVisit/domains/definingWorldPlotVisitRequest";
import { formattingWorldBuildingPlotRegistryBoundsLabel } from "@/components/world/building/domains/groupingWorldBuildingPlotRegistryEntriesByOwner";
import { resolvingUserProfileOAuthImages } from "@/components/dashboard/profile/utils/resolvingUserProfileOAuthImages";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { useCallback, useEffect, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";

/** Modal overlay classes. */
const STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_OVERLAY =
  "pointer-events-auto fixed inset-0 z-[61] flex items-center justify-center bg-black/70 px-4 py-6" as const;

/** Modal panel classes. */
const STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_PANEL =
  "w-full max-w-sm rounded-xl border border-white/20 bg-[#0d1b2a] p-5 text-white shadow-2xl" as const;

/** Modal title classes. */
const STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_TITLE =
  "text-base font-semibold text-white" as const;

/** Modal message classes. */
const STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_MESSAGE =
  "text-sm leading-relaxed text-white/75" as const;

/** Primary action button classes. */
const STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_PRIMARY_BUTTON =
  "w-full rounded-md bg-sky-500/90 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" as const;

/** Tertiary action button classes. */
const STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_TERTIARY_BUTTON =
  "w-full rounded-md px-3 py-2 text-sm font-medium text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50" as const;

/** Props for {@link RenderingWorldPlotVisitApprovedPlazaModal}. */
export interface RenderingWorldPlotVisitApprovedPlazaModalProps {
  isOpen: boolean;
  request: WorldPlotVisitRequestOutgoingListMember | null;
  onGoNow: () => void;
  onLater: () => void;
  isTeleporting?: boolean;
}

/**
 * Resolves avatar initials for the host profile.
 *
 * @param displayName - Resolved display name
 */
function labelingWorldPlotVisitApprovedPlazaModalAvatarFallback(
  displayName: string,
): string {
  const trimmed = displayName.trim();
  if (!trimmed) {
    return "?";
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
  }

  return trimmed.slice(0, 2).toUpperCase();
}

/**
 * Approved visit dialog for the requester with an optional immediate teleport.
 */
export function RenderingWorldPlotVisitApprovedPlazaModal({
  isOpen,
  request,
  onGoNow,
  onLater,
  isTeleporting = false,
}: RenderingWorldPlotVisitApprovedPlazaModalProps): React.JSX.Element | null {
  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    [],
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dismissingModalOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== "Escape" || isTeleporting) {
        return;
      }

      onLater();
    };

    document.addEventListener("keydown", dismissingModalOnEscape);

    return () => {
      document.removeEventListener("keydown", dismissingModalOnEscape);
    };
  }, [isOpen, isTeleporting, onLater]);

  if (!isOpen || !request || typeof document === "undefined") {
    return null;
  }

  const { avatarUrl } = resolvingUserProfileOAuthImages(
    { avatar_img: request.avatarUrl, cover_img: null },
    request.oauthAvatarUrl,
  );
  const boundsLabel = formattingWorldBuildingPlotRegistryBoundsLabel(
    request.bounds,
  );

  return createPortal(
    <div
      {...{
        [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: "plot-visit-approved-modal",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_ARIA_LABEL}
      className={STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_OVERLAY}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={stoppingPlazaWalkPointerPropagation}
    >
      <div
        className={STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_PANEL}
        onPointerDown={stoppingPlazaWalkPointerPropagation}
        onClick={stoppingPlazaWalkPointerPropagation}
      >
        <div className="flex items-center gap-3">
          <Avatar className="size-12 shrink-0">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={request.displayName} />
            ) : null}
            <AvatarFallback>
              {labelingWorldPlotVisitApprovedPlazaModalAvatarFallback(
                request.displayName,
              )}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 space-y-1">
            <p className={STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_TITLE}>
              {LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_TITLE}
            </p>
            <p
              className={STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_MESSAGE}
            >
              {labelingWorldPlotVisitApprovedModalMessage(
                request.displayName,
                boundsLabel,
              )}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            autoFocus
            disabled={isTeleporting}
            className={STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_PRIMARY_BUTTON}
            onClick={onGoNow}
          >
            {LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_GO_BUTTON}
          </button>
          <button
            type="button"
            disabled={isTeleporting}
            className={STYLING_WORLD_PLOT_VISIT_APPROVED_PLAZA_MODAL_TERTIARY_BUTTON}
            onClick={onLater}
          >
            {LABELING_WORLD_PLOT_VISIT_APPROVED_MODAL_LATER_BUTTON}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
