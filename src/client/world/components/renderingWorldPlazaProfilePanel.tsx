'use client';

/**
 * Centered character profile panel: avatar portrait plus live RPG vitals
 * (health, stamina, hunger) and derived attributes, opened from the action
 * bar profile button. Sized for mobile and desktop.
 *
 * @module components/world/components/renderingWorldPlazaProfilePanel
 */

import { Icon } from '@/components/ui/icon';
import type { ComputingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_ZOOM,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTES_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_CLOSE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_EMPTY,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_EMPTY,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_TITLE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_VITALS_SECTION,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ANCHOR_CLASS_NAME,
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
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TITLE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LABEL_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_TRACK_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_VALUE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaProfilePanelConstants';
import { resolvingWorldPlazaAvatarSkinPortrait } from '@/components/world/domains/resolvingWorldPlazaAvatarSkinPortrait';
import {
  resolvingWorldPlazaProfilePanelSections,
  type ResolvingWorldPlazaProfilePanelStaminaHud,
} from '@/components/world/domains/resolvingWorldPlazaProfilePanelSections';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import { usingWorldPlazaSelectedAvatarSkin } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin';
import type { UsingWorldPlazaPlayerHungerHudSnapshot } from '@/components/world/hunger/hooks/usingWorldPlazaPlayerHunger';
import { useMemo } from 'react';

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

  const portrait = useMemo(
    () => resolvingWorldPlazaAvatarSkinPortrait(selectedAvatarSkinId),
    [selectedAvatarSkinId]
  );

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

        <section aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_VITALS_SECTION}>
          <h3
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_PROFILE_PANEL_VITALS_SECTION}
          </h3>
          <div className="mt-1.5 flex flex-col gap-2">
            {sections.vitalRows.map((row) => (
              <div
                key={row.id}
                className={
                  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_ROW_CLASS_NAME
                }
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
                  className={
                    STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_TRACK_CLASS_NAME
                  }
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
        </section>

        <section
          aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTES_SECTION}
        >
          <h3
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTES_SECTION}
          </h3>
          <div
            className={`mt-1.5 ${STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_GRID_CLASS_NAME}`}
          >
            {sections.attributeEntries.map((entry) => (
              <div
                key={entry.id}
                className={
                  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_CHIP_CLASS_NAME
                }
              >
                <Icon
                  icon={entry.iconName}
                  width={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX}
                  height={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX}
                  className="shrink-0 text-poster-orange-deep"
                  aria-hidden
                />
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
            ))}
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
          <div
            className={`mt-1.5 ${STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_GRID_CLASS_NAME}`}
          >
            {sections.passiveEntries.length === 0 ? (
              <p
                className={
                  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME
                }
              >
                {LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_EMPTY}
              </p>
            ) : (
              sections.passiveEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={
                    STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_CHIP_CLASS_NAME
                  }
                >
                  <Icon
                    icon={entry.iconName}
                    width={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX}
                    height={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX}
                    className="shrink-0 text-poster-orange-deep"
                    aria-hidden
                  />
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
              ))
            )}
          </div>
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
          <div className="mt-1.5 flex flex-col gap-1">
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
      </section>
    </div>
  );
}
