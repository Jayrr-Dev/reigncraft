'use client';

/**
 * Centered character profile panel: avatar portrait plus live RPG vitals
 * (health, stamina, hunger) and derived attributes, opened from the action
 * bar profile button. Status / Stats tabs keep the sheet compact on mobile.
 *
 * @module components/world/components/renderingWorldPlazaProfilePanel
 */

import { Icon } from '@/components/ui/icon';
import type { ComputingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_DEFAULT_TAB_ID,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_ZOOM,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_TAB_REGISTRY,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_CLOSE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_EMPTY,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_IMMUNITY_EMPTY,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_IMMUNITY_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_EMPTY,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_TITLE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_VITALS_SECTION,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_CELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_GRID_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_CHIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_GRID_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_CLOSE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_DESCRIPTION_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_HEADER_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_IDENTITY_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_LEVEL_CHIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_NAME_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_FRAME_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_SPRITE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SKIN_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BODY_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BUTTON_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_SECTION_STACK_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TITLE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LABEL_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LIST_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_TRACK_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_VALUE_CLASS_NAME,
  type DefiningWorldPlazaProfilePanelTabId,
} from '@/components/world/domains/definingWorldPlazaProfilePanelConstants';
import { resolvingWorldPlazaAvatarSkinPortrait } from '@/components/world/domains/resolvingWorldPlazaAvatarSkinPortrait';
import type { ResolvingWorldPlazaProfilePanelImmunityEntry } from '@/components/world/domains/resolvingWorldPlazaProfilePanelImmunityEntries';
import type { ResolvingWorldPlazaProfilePanelPassiveEntry } from '@/components/world/domains/resolvingWorldPlazaProfilePanelPassiveEntries';
import {
  resolvingWorldPlazaProfilePanelSections,
  type ResolvingWorldPlazaProfilePanelAttributeEntry,
  type ResolvingWorldPlazaProfilePanelStaminaHud,
  type ResolvingWorldPlazaProfilePanelVitalRow,
} from '@/components/world/domains/resolvingWorldPlazaProfilePanelSections';
import type { DefiningWorldPlazaArmorSlotDefinition } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import { resolvingWorldPlazaArmorSlotsForAvatarSkin } from '@/components/world/equipment/domains/resolvingWorldPlazaArmorSlotsForAvatarSkin';
import { RenderingWorldPlazaEntityDiseaseIconGlyph } from '@/components/world/health/components/renderingWorldPlazaEntityDiseaseIconGlyph';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import { usingWorldPlazaSelectedAvatarSkin } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin';
import type { UsingWorldPlazaPlayerHungerHudSnapshot } from '@/components/world/hunger/hooks/usingWorldPlazaPlayerHunger';
import { useEffect, useMemo, useState } from 'react';

/** Props for {@link RenderingWorldPlazaProfilePanel}. */
export interface RenderingWorldPlazaProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Player display name (Reddit username or room alias). */
  displayName: string;
  /** Display name of the active character skin. */
  characterDisplayName: string;
  healthHudSnapshot: UsingWorldPlazaPlayerHealthHudSnapshot;
  hungerHudSnapshot: UsingWorldPlazaPlayerHungerHudSnapshot;
  staminaHud: ResolvingWorldPlazaProfilePanelStaminaHud;
  derivedStats: ComputingWorldPlazaCharacterEngineDerivedStats;
}

function RenderingWorldPlazaProfilePanelVitalRows({
  vitalRows,
}: {
  vitalRows: readonly ResolvingWorldPlazaProfilePanelVitalRow[];
}): React.JSX.Element {
  return (
    <div className={STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LIST_CLASS_NAME}>
      {vitalRows.map((row) => (
        <div
          key={row.id}
          className={STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_ROW_CLASS_NAME}
        >
          <div
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LABEL_ROW_CLASS_NAME
            }
          >
            <Icon
              icon={row.iconName}
              width={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX}
              height={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX}
              className="shrink-0 text-poster-teal-deep"
              aria-hidden
            />
            <span className="truncate">{row.label}</span>
            <span
              className={
                STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_VALUE_CLASS_NAME
              }
            >
              {row.valueText}
            </span>
          </div>
          <div
            className={STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_TRACK_CLASS_NAME}
            role="meter"
            aria-label={row.label}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(row.ratio * 100)}
          >
            <div
              className={row.fillClassName}
              style={{
                width: `${Math.max(0, Math.min(1, row.ratio)) * 100}%`,
              }}
            />
          </div>
          <p
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME
            }
          >
            {row.detailText}
          </p>
        </div>
      ))}
    </div>
  );
}

function RenderingWorldPlazaProfilePanelArmorSlots({
  slots,
}: {
  slots: readonly DefiningWorldPlazaArmorSlotDefinition[];
}): React.JSX.Element {
  return (
    <div
      className={STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_GRID_CLASS_NAME}
      style={{
        gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))`,
      }}
    >
      {slots.map((slot) => (
        <div
          key={slot.id}
          className={STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_CELL_CLASS_NAME}
          aria-label={`${slot.label} armor slot (empty)`}
        >
          <Icon
            icon={slot.iconName}
            width={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_SIZE_PX}
            height={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_SIZE_PX}
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_CLASS_NAME
            }
            aria-hidden
          />
          <span
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_LABEL_CLASS_NAME
            }
          >
            {slot.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function RenderingWorldPlazaProfilePanelAttributeGrid({
  entries,
  emptyLabel,
}: {
  entries: readonly (
    | ResolvingWorldPlazaProfilePanelAttributeEntry
    | ResolvingWorldPlazaProfilePanelPassiveEntry
    | ResolvingWorldPlazaProfilePanelImmunityEntry
  )[];
  emptyLabel?: string;
}): React.JSX.Element {
  if (entries.length === 0 && emptyLabel) {
    return (
      <p className={STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <div
      className={STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_GRID_CLASS_NAME}
    >
      {entries.map((entry) => {
        const diseaseId =
          'diseaseId' in entry
            ? (entry.diseaseId as DefiningWorldPlazaEntityDiseaseId | undefined)
            : undefined;

        return (
          <div
            key={entry.id}
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_CHIP_CLASS_NAME
            }
          >
            {diseaseId ? (
              <RenderingWorldPlazaEntityDiseaseIconGlyph
                diseaseId={diseaseId}
                className="shrink-0"
                style={{
                  width: DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX,
                  height: DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX,
                }}
              />
            ) : (
              <Icon
                icon={entry.iconName}
                width={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX}
                height={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX}
                className="shrink-0 text-poster-orange-deep"
                aria-hidden
              />
            )}
            <span
              className={
                STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_LABEL_CLASS_NAME
              }
            >
              {entry.label}
            </span>
            <span
              className={
                STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_CLASS_NAME
              }
            >
              {entry.valueText}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Minecraft-style player info sheet with the live avatar sprite and real
 * stat numbers, rendered as a centered overlay above the plaza viewport.
 */
export function RenderingWorldPlazaProfilePanel({
  isOpen,
  onClose,
  displayName,
  characterDisplayName,
  healthHudSnapshot,
  hungerHudSnapshot,
  staminaHud,
  derivedStats,
}: RenderingWorldPlazaProfilePanelProps): React.JSX.Element | null {
  const selectedAvatarSkinId = usingWorldPlazaSelectedAvatarSkin();
  const [activeTabId, setActiveTabId] =
    useState<DefiningWorldPlazaProfilePanelTabId>(
      DEFINING_WORLD_PLAZA_PROFILE_PANEL_DEFAULT_TAB_ID
    );

  const portrait = useMemo(
    () => resolvingWorldPlazaAvatarSkinPortrait(selectedAvatarSkinId),
    [selectedAvatarSkinId]
  );

  const armorSlots = useMemo(
    () => resolvingWorldPlazaArmorSlotsForAvatarSkin(selectedAvatarSkinId),
    [selectedAvatarSkinId]
  );

  useEffect(() => {
    if (isOpen) {
      setActiveTabId(DEFINING_WORLD_PLAZA_PROFILE_PANEL_DEFAULT_TAB_ID);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const sections = resolvingWorldPlazaProfilePanelSections({
    health: healthHudSnapshot,
    stamina: staminaHud,
    hunger: hungerHudSnapshot,
    derivedStats,
    skinId: selectedAvatarSkinId,
  });

  return (
    <div className={STYLING_WORLD_PLAZA_PROFILE_PANEL_ANCHOR_CLASS_NAME}>
      <button
        type="button"
        aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_CLOSE}
        className={STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME}
        onClick={onClose}
      />
      <section
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        role="dialog"
        aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_TITLE}
        className={STYLING_WORLD_PLAZA_PROFILE_PANEL_SHELL_CLASS_NAME}
      >
        <header className={STYLING_WORLD_PLAZA_PROFILE_PANEL_HEADER_CLASS_NAME}>
          <h2 className={STYLING_WORLD_PLAZA_PROFILE_PANEL_TITLE_CLASS_NAME}>
            {LABELING_WORLD_PLAZA_PROFILE_PANEL_TITLE}
          </h2>
          <button
            type="button"
            aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_CLOSE}
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_CLOSE_BUTTON_CLASS_NAME
            }
            onClick={onClose}
          >
            <Icon icon="mdi:close" width={16} height={16} aria-hidden />
          </button>
        </header>

        <div
          className={STYLING_WORLD_PLAZA_PROFILE_PANEL_IDENTITY_ROW_CLASS_NAME}
        >
          <div
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_FRAME_CLASS_NAME
            }
          >
            {portrait ? (
              <span
                className={
                  STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_SPRITE_CLASS_NAME
                }
                aria-hidden
                style={{
                  backgroundImage: `url("${portrait.sheetUrl}")`,
                  backgroundSize: portrait.backgroundSizeCss,
                  backgroundPosition: portrait.backgroundPositionCss,
                  backgroundRepeat: 'no-repeat',
                  transform: `scale(${DEFINING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_ZOOM})`,
                  filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))',
                }}
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className={STYLING_WORLD_PLAZA_PROFILE_PANEL_NAME_CLASS_NAME}>
              {displayName}
            </p>
            <p className={STYLING_WORLD_PLAZA_PROFILE_PANEL_SKIN_CLASS_NAME}>
              {characterDisplayName}
            </p>
            <span
              className={
                STYLING_WORLD_PLAZA_PROFILE_PANEL_LEVEL_CHIP_CLASS_NAME
              }
            >
              <Icon
                icon="mdi:star-four-points"
                width={10}
                height={10}
                aria-hidden
              />
              Level {derivedStats.level}
            </span>
          </div>
        </div>

        <div
          className={STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST_CLASS_NAME}
          role="tablist"
          aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST}
        >
          {DEFINING_WORLD_PLAZA_PROFILE_PANEL_TAB_REGISTRY.map((tab) => {
            const isActive = tab.id === activeTabId;

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                id={`plaza-profile-tab-${tab.id}`}
                aria-controls={`plaza-profile-tab-panel-${tab.id}`}
                className={`${STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BUTTON_CLASS_NAME} ${
                  isActive
                    ? STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BUTTON_ACTIVE_CLASS_NAME
                    : ''
                }`}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className={STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BODY_CLASS_NAME}>
          {activeTabId === 'status' ? (
            <div
              id="plaza-profile-tab-panel-status"
              role="tabpanel"
              aria-labelledby="plaza-profile-tab-status"
              className={
                STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_SECTION_STACK_CLASS_NAME
              }
            >
              <section
                aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_VITALS_SECTION}
              >
                <RenderingWorldPlazaProfilePanelVitalRows
                  vitalRows={sections.vitalRows}
                />
              </section>

              <section
                aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SECTION}
              >
                <h3
                  className={
                    STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME
                  }
                >
                  {LABELING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SECTION}
                </h3>
                <RenderingWorldPlazaProfilePanelArmorSlots slots={armorSlots} />
              </section>

              <section
                aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_SECTION}
              >
                <h3
                  className={
                    STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME
                  }
                >
                  {LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_SECTION}
                </h3>
                <div className="mt-1 flex flex-col gap-1">
                  {healthHudSnapshot.activeBuffs.length === 0 ? (
                    <p
                      className={
                        STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME
                      }
                    >
                      {LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_EMPTY}
                    </p>
                  ) : (
                    healthHudSnapshot.activeBuffs.map((buff) => (
                      <div
                        key={buff.id}
                        className={
                          STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_ROW_CLASS_NAME
                        }
                      >
                        <span
                          className={
                            STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_LABEL_CLASS_NAME
                          }
                        >
                          {buff.label}
                        </span>
                        <span
                          className={
                            STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_DESCRIPTION_CLASS_NAME
                          }
                        >
                          {buff.description}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          ) : (
            <div
              id="plaza-profile-tab-panel-stats"
              role="tabpanel"
              aria-labelledby="plaza-profile-tab-stats"
              className={
                STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_SECTION_STACK_CLASS_NAME
              }
            >
              {sections.attributeCategories.map((category) => (
                <section key={category.id} aria-label={category.label}>
                  <h3
                    className={
                      STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME
                    }
                  >
                    {category.label}
                  </h3>
                  <div className="mt-1">
                    <RenderingWorldPlazaProfilePanelAttributeGrid
                      entries={category.entries}
                    />
                  </div>
                </section>
              ))}

              <section
                aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_IMMUNITY_SECTION}
              >
                <h3
                  className={
                    STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME
                  }
                >
                  {LABELING_WORLD_PLAZA_PROFILE_PANEL_IMMUNITY_SECTION}
                </h3>
                <div className="mt-1 flex flex-col gap-1">
                  <RenderingWorldPlazaProfilePanelAttributeGrid
                    entries={[sections.immunity.factorEntry]}
                  />
                  <RenderingWorldPlazaProfilePanelAttributeGrid
                    entries={sections.immunity.diseaseEntries}
                    emptyLabel={
                      LABELING_WORLD_PLAZA_PROFILE_PANEL_IMMUNITY_EMPTY
                    }
                  />
                </div>
              </section>

              <section
                aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_SECTION}
              >
                <h3
                  className={
                    STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME
                  }
                >
                  {LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_SECTION}
                </h3>
                <div className="mt-1">
                  <RenderingWorldPlazaProfilePanelAttributeGrid
                    entries={sections.passiveEntries}
                    emptyLabel={
                      LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_EMPTY
                    }
                  />
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
