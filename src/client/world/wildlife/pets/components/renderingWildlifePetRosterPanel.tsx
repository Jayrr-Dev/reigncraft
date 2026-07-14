'use client';

/**
 * Compact parchment roster of bonded companions (alive + deceased).
 * Opened from the action-bar paw button beside Character.
 *
 * @module components/world/wildlife/pets/components/renderingWildlifePetRosterPanel
 */

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { RenderingWildlifePetSpeciesPortrait } from '@/components/world/wildlife/pets/components/renderingWildlifePetSpeciesPortrait';
import {
  DEFINING_WILDLIFE_PET_ROSTER_PANEL_DATA_ATTRIBUTE,
  DEFINING_WILDLIFE_PET_ROSTER_PANEL_PORTRAIT_ZOOM,
  LABELING_WILDLIFE_PET_ROSTER_PANEL_CLOSE,
  LABELING_WILDLIFE_PET_ROSTER_PANEL_EMPTY,
  LABELING_WILDLIFE_PET_ROSTER_PANEL_TITLE,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_BACKDROP_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_BODY_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_CLOSE_BUTTON_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_COUNT_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_DEATH_NOTE_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_EMPTY_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_HEADER_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_LIST_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_NAME_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_NAME_ROW_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_OVERLAY_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_PORTRAIT_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_ROW_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_SHELL_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_SPECIES_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_STATS_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_TITLE_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_PANEL_TITLE_ROW_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_STATUS_ALIVE_CLASS_NAME,
  STYLING_WILDLIFE_PET_ROSTER_STATUS_DECEASED_CLASS_NAME,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetRosterPanelConstants';
import {
  resolvingWildlifePetRosterPanelCountLabel,
  resolvingWildlifePetRosterPanelRows,
} from '@/components/world/wildlife/pets/domains/resolvingWildlifePetRosterPanelRows';
import { usingWildlifePetRosterPanelLivePets } from '@/components/world/wildlife/pets/hooks/usingWildlifePetRosterPanelLivePets';
import { useMemo, type RefObject, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

export type RenderingWildlifePetRosterPanelProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly wildlifeStoreRef: RefObject<ManagingWildlifeInstanceStore>;
};

/**
 * Centered companions list: portrait, Alive/Deceased, name, species, HP, loyalty.
 * While open, rows track live wildlife vitals so death flips without a reopen.
 */
export function RenderingWildlifePetRosterPanel({
  isOpen,
  onClose,
  wildlifeStoreRef,
}: RenderingWildlifePetRosterPanelProps): React.JSX.Element | null {
  const livePets = usingWildlifePetRosterPanelLivePets({
    isOpen,
    wildlifeStoreRef,
  });
  const rows = useMemo(
    () => resolvingWildlifePetRosterPanelRows(livePets),
    [livePets]
  );
  const countLabel = useMemo(
    () => resolvingWildlifePetRosterPanelCountLabel(livePets),
    [livePets]
  );

  const stoppingPlazaWalkPointerPropagation = (
    event: SyntheticEvent<HTMLElement>
  ): void => {
    event.stopPropagation();
  };

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      {...{
        [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: 'pet-roster-panel',
        [DEFINING_WILDLIFE_PET_ROSTER_PANEL_DATA_ATTRIBUTE]: true,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={LABELING_WILDLIFE_PET_ROSTER_PANEL_TITLE}
      className={STYLING_WILDLIFE_PET_ROSTER_PANEL_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
    >
      <button
        type="button"
        className={STYLING_WILDLIFE_PET_ROSTER_PANEL_BACKDROP_CLASS_NAME}
        aria-label={LABELING_WILDLIFE_PET_ROSTER_PANEL_CLOSE}
        onClick={onClose}
      />
      <div
        className={STYLING_WILDLIFE_PET_ROSTER_PANEL_SHELL_CLASS_NAME}
        onPointerDown={stoppingPlazaWalkPointerPropagation}
      >
        <header className={STYLING_WILDLIFE_PET_ROSTER_PANEL_HEADER_CLASS_NAME}>
          <div
            className={STYLING_WILDLIFE_PET_ROSTER_PANEL_TITLE_ROW_CLASS_NAME}
          >
            <h2 className={STYLING_WILDLIFE_PET_ROSTER_PANEL_TITLE_CLASS_NAME}>
              {LABELING_WILDLIFE_PET_ROSTER_PANEL_TITLE}
            </h2>
            <span
              className={STYLING_WILDLIFE_PET_ROSTER_PANEL_COUNT_CLASS_NAME}
              aria-label={`${countLabel} companions`}
            >
              {countLabel}
            </span>
          </div>
          <button
            type="button"
            className={
              STYLING_WILDLIFE_PET_ROSTER_PANEL_CLOSE_BUTTON_CLASS_NAME
            }
            aria-label={LABELING_WILDLIFE_PET_ROSTER_PANEL_CLOSE}
            onClick={onClose}
          >
            <Icon icon="mdi:close" width={16} height={16} aria-hidden />
          </button>
        </header>

        {rows.length === 0 ? (
          <p className={STYLING_WILDLIFE_PET_ROSTER_PANEL_EMPTY_CLASS_NAME}>
            {LABELING_WILDLIFE_PET_ROSTER_PANEL_EMPTY}
          </p>
        ) : (
          <div className={STYLING_WILDLIFE_PET_ROSTER_PANEL_LIST_CLASS_NAME}>
            {rows.map((row) => (
              <div
                key={row.petId}
                className={STYLING_WILDLIFE_PET_ROSTER_PANEL_ROW_CLASS_NAME}
              >
                <div
                  className={
                    STYLING_WILDLIFE_PET_ROSTER_PANEL_PORTRAIT_CLASS_NAME
                  }
                >
                  <RenderingWildlifePetSpeciesPortrait
                    speciesId={row.speciesId}
                    zoom={DEFINING_WILDLIFE_PET_ROSTER_PANEL_PORTRAIT_ZOOM}
                    className={`absolute inset-0${row.isDeceased ? ' opacity-45 grayscale' : ''}`}
                  />
                </div>
                <div
                  className={STYLING_WILDLIFE_PET_ROSTER_PANEL_BODY_CLASS_NAME}
                >
                  <div
                    className={
                      STYLING_WILDLIFE_PET_ROSTER_PANEL_NAME_ROW_CLASS_NAME
                    }
                  >
                    <p
                      className={
                        STYLING_WILDLIFE_PET_ROSTER_PANEL_NAME_CLASS_NAME
                      }
                    >
                      {row.displayName}
                    </p>
                    <span
                      className={
                        row.isDeceased
                          ? STYLING_WILDLIFE_PET_ROSTER_STATUS_DECEASED_CLASS_NAME
                          : STYLING_WILDLIFE_PET_ROSTER_STATUS_ALIVE_CLASS_NAME
                      }
                    >
                      {row.statusLabel}
                    </span>
                  </div>
                  <p
                    className={
                      STYLING_WILDLIFE_PET_ROSTER_PANEL_SPECIES_CLASS_NAME
                    }
                  >
                    {row.speciesDisplayName}
                    {row.isDeployed ? ' · Deployed' : null}
                  </p>
                  {row.deathNote ? (
                    <p
                      className={
                        STYLING_WILDLIFE_PET_ROSTER_PANEL_DEATH_NOTE_CLASS_NAME
                      }
                    >
                      {row.deathNote}
                    </p>
                  ) : null}
                  <p
                    className={
                      STYLING_WILDLIFE_PET_ROSTER_PANEL_STATS_CLASS_NAME
                    }
                  >
                    {row.healthText} · {row.loyaltyText}
                    {row.hungerText ? ` · ${row.hungerText}` : null}
                    {row.neglectedBadgeText
                      ? ` · ${row.neglectedBadgeText}`
                      : null}
                    {` · ${row.daysText}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
