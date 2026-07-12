'use client';

import { Badge } from '@/components/ui/badge';
import { DEFINING_WORLD_BUILDING_CLAIM_MODE_SECTION_LABEL_CLASS_NAME } from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaSavedCoords } from '@/components/world/domains/definingWorldPlazaSavedCoords';
import {
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_BADGE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_ICON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_MESSAGE,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_TEXT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_ROW_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_SECTION_LABEL,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_LABEL,
  LABELING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON,
} from '@/components/world/domains/definingWorldPlazaSavedCoordsListUiConstants';
import { formattingWorldPlazaSavedCoordsLabel } from '@/components/world/domains/formattingWorldPlazaSavedCoordsLabel';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export type RenderingWorldPlazaClaimModeSavedCoordsListProps = {
  readonly savedCoordsList: readonly DefiningWorldPlazaSavedCoords[];
  readonly trackedSavedCoordsId: string | null;
  readonly onToggleSavedCoordsTracking: (savedCoordsId: string) => void;
  readonly onDeleteSavedCoords: (savedCoordsId: string) => void;
  readonly isDeletingSavedCoords?: boolean;
};

/**
 * Saved coordinate bookmarks for claim mode.
 */
export function RenderingWorldPlazaClaimModeSavedCoordsList({
  savedCoordsList,
  trackedSavedCoordsId,
  onToggleSavedCoordsTracking,
  onDeleteSavedCoords,
  isDeletingSavedCoords = false,
}: RenderingWorldPlazaClaimModeSavedCoordsListProps): React.JSX.Element {
  const savedCoordsCount = savedCoordsList.length;

  return (
    <div className="flex flex-col gap-1.5">
      <p className={DEFINING_WORLD_BUILDING_CLAIM_MODE_SECTION_LABEL_CLASS_NAME}>
        {DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_SECTION_LABEL} ({savedCoordsCount})
      </p>
      {!savedCoordsCount ? (
        <p className={DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_TEXT_CLASS_NAME}>
          {DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_EMPTY_MESSAGE}
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          {savedCoordsList.map((savedCoords) => {
            const savedCoordsLabel =
              formattingWorldPlazaSavedCoordsLabel(savedCoords);
            const isTrackingSavedCoords =
              trackedSavedCoordsId === savedCoords.savedCoordsId;

            return (
              <div
                key={savedCoords.savedCoordsId}
                className={DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_ROW_CLASS_NAME}
              >
                <button
                  type="button"
                  {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                  aria-label={`${LABELING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON} ${savedCoordsLabel}`}
                  title={`${LABELING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON} ${savedCoordsLabel}`}
                  disabled={isDeletingSavedCoords}
                  onClick={() => {
                    onDeleteSavedCoords(savedCoords.savedCoordsId);
                  }}
                  className={
                    DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_BUTTON_CLASS_NAME
                  }
                >
                  <X
                    className={
                      DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_DELETE_ICON_CLASS_NAME
                    }
                    aria-hidden
                  />
                </button>
                <Badge
                  variant="outline"
                  title={savedCoordsLabel}
                  className={cn(
                    DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_BADGE_CLASS_NAME,
                    'flex-1'
                  )}
                >
                  {savedCoordsLabel}
                </Badge>
                <button
                  type="button"
                  {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                  aria-label={`Track saved coordinates ${savedCoordsLabel}`}
                  aria-pressed={isTrackingSavedCoords}
                  title={`Track saved coordinates ${savedCoordsLabel}`}
                  onClick={() => {
                    onToggleSavedCoordsTracking(savedCoords.savedCoordsId);
                  }}
                  className={
                    isTrackingSavedCoords
                      ? DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_ACTIVE_CLASS_NAME
                      : DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_CLASS_NAME
                  }
                >
                  {DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_LABEL}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
