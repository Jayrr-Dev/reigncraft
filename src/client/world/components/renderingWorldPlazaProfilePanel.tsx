'use client';

/**
 * Centered character profile panel: avatar portrait plus live RPG vitals
 * (health, stamina, hunger) and derived attributes, opened from the action
 * bar profile button. Status / Stats tabs keep the sheet compact on mobile.
 *
 * @module components/world/components/renderingWorldPlazaProfilePanel
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { Icon } from '@/components/ui/icon';
import type { ComputingWorldPlazaCharacterEngineDerivedStats } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineTypes';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_DEFAULT_TAB_ID,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_ZOOM,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_TAB_REGISTRY,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_ATTACK_BONUS_BUTTON,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_ATTACK_BONUS_POPOVER_TITLE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_CLOSE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_EMPTY,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_IMMUNITY_EMPTY,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_IMMUNITY_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_EMPTY,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_TITLE,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SECTION,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_VITALS_SECTION,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_CELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_GRID_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTACK_BONUS_POPOVER_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTACK_BONUS_POPOVER_LINE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTACK_BONUS_POPOVER_TITLE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_CHIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_GRID_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_BONUS_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_BONUS_NEGATIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_BONUS_POSITIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_WRAP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_CLOSE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_DESCRIPTION_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_HEADER_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_IDENTITY_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_LEVEL_CHIP_BUTTON_CLASS_NAME,
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
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaAvatarSkinPortrait } from '@/components/world/domains/resolvingWorldPlazaAvatarSkinPortrait';
import type { ResolvingWorldPlazaProfilePanelImmunityEntry } from '@/components/world/domains/resolvingWorldPlazaProfilePanelImmunityEntries';
import type { ResolvingWorldPlazaProfilePanelPassiveEntry } from '@/components/world/domains/resolvingWorldPlazaProfilePanelPassiveEntries';
import {
  resolvingWorldPlazaProfilePanelSections,
  type ResolvingWorldPlazaProfilePanelAttributeEntry,
  type ResolvingWorldPlazaProfilePanelStaminaHud,
  type ResolvingWorldPlazaProfilePanelVitalRow,
} from '@/components/world/domains/resolvingWorldPlazaProfilePanelSections';
import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import { creatingEmptyWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import type {
  DefiningWorldPlazaArmorSlotDefinition,
  DefiningWorldPlazaArmorSlotId,
} from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import { resolvingWorldPlazaArmorSlotsForAvatarSkin } from '@/components/world/equipment/domains/resolvingWorldPlazaArmorSlotsForAvatarSkin';
import { RenderingWorldPlazaEntityDiseaseIconGlyph } from '@/components/world/health/components/renderingWorldPlazaEntityDiseaseIconGlyph';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import type { UsingWorldPlazaPlayerHealthHudSnapshot } from '@/components/world/health/hooks/usingWorldPlazaPlayerHealth';
import { usingWorldPlazaSelectedAvatarSkin } from '@/components/world/hooks/usingWorldPlazaSelectedAvatarSkin';
import type { UsingWorldPlazaPlayerHungerHudSnapshot } from '@/components/world/hunger/hooks/usingWorldPlazaPlayerHunger';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { RenderingWorldPlazaSpritcoreUpgradePanel } from '@/components/world/spritcore/components/renderingWorldPlazaSpritcoreUpgradePanel';
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';

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
  /** Inventory used for Spritcore balance and spend on the Upgrade tab. */
  inventoryState?: DefiningInventoryState;
  nominalAttackSpeed?: number;
  naturalDefense?: number;
  naturalRunSpeed?: number;
  onInventoryStateChange?: (nextState: DefiningInventoryState) => void;
  onShowToast?: (message: string) => void;
  /** Equipped survival armor keyed by slot id. */
  armorLoadoutState?: DefiningWorldPlazaArmorLoadoutState;
  /** Unequips one armor slot back into inventory. */
  onUnequipArmorSlot?: (slotId: DefiningWorldPlazaArmorSlotId) => void;
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
  loadoutState,
  onUnequipArmorSlot,
}: {
  slots: readonly DefiningWorldPlazaArmorSlotDefinition[];
  loadoutState: DefiningWorldPlazaArmorLoadoutState;
  onUnequipArmorSlot?: (slotId: DefiningWorldPlazaArmorSlotId) => void;
}): React.JSX.Element {
  return (
    <div
      className={STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_GRID_CLASS_NAME}
      style={{
        gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))`,
      }}
    >
      {slots.map((slot) => {
        const equipped = loadoutState[slot.id];

        return (
          <button
            key={slot.id}
            type="button"
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_CELL_CLASS_NAME
            }
            aria-label={
              equipped
                ? `${slot.label} armor slot (${equipped.itemTypeId}), click to unequip`
                : `${slot.label} armor slot (empty)`
            }
            disabled={!equipped || !onUnequipArmorSlot}
            onClick={() => {
              if (equipped) {
                onUnequipArmorSlot?.(slot.id);
              }
            }}
          >
            {equipped ? (
              <RenderingWorldPlazaInventoryItemGlyph
                itemTypeId={equipped.itemTypeId}
                registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
                iconClassName={
                  STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_CLASS_NAME
                }
              />
            ) : (
              <Icon
                icon={slot.iconName}
                width={
                  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_SIZE_PX
                }
                height={
                  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_SIZE_PX
                }
                className={
                  STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_ICON_CLASS_NAME
                }
                aria-hidden
              />
            )}
            <span
              className={
                STYLING_WORLD_PLAZA_PROFILE_PANEL_ARMOR_SLOT_LABEL_CLASS_NAME
              }
            >
              {slot.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function RenderingWorldPlazaProfilePanelAttributeValue({
  entry,
}: {
  entry:
    | ResolvingWorldPlazaProfilePanelAttributeEntry
    | ResolvingWorldPlazaProfilePanelPassiveEntry
    | ResolvingWorldPlazaProfilePanelImmunityEntry;
}): React.JSX.Element {
  const valueBonusText =
    'valueBonusText' in entry ? entry.valueBonusText : undefined;
  const valueBonusTone =
    'valueBonusTone' in entry ? entry.valueBonusTone : undefined;
  const valueBonusDetailLines =
    'valueBonusDetailLines' in entry ? entry.valueBonusDetailLines : undefined;
  const [isBonusPopoverOpen, setIsBonusPopoverOpen] = useState(false);
  const valueWrapRef = useRef<HTMLSpanElement | null>(null);
  const hasBonusPopover =
    valueBonusText !== undefined &&
    valueBonusDetailLines !== undefined &&
    valueBonusDetailLines.length > 0;

  const closingBonusPopoverOnOutsidePointerDown = useEffectEvent(
    (event: PointerEvent): void => {
      if (!isBonusPopoverOpen) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (valueWrapRef.current?.contains(target)) {
        return;
      }

      setIsBonusPopoverOpen(false);
    }
  );

  useEffect(() => {
    if (!isBonusPopoverOpen) {
      return;
    }

    document.addEventListener(
      'pointerdown',
      closingBonusPopoverOnOutsidePointerDown
    );
    return () => {
      document.removeEventListener(
        'pointerdown',
        closingBonusPopoverOnOutsidePointerDown
      );
    };
  }, [isBonusPopoverOpen]);

  if (!valueBonusText || !valueBonusTone) {
    return (
      <span
        className={STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_CLASS_NAME}
      >
        {entry.valueText}
      </span>
    );
  }

  const bonusToneClassName =
    valueBonusTone === 'positive'
      ? STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_BONUS_POSITIVE_CLASS_NAME
      : STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_BONUS_NEGATIVE_CLASS_NAME;

  return (
    <span
      ref={valueWrapRef}
      className={
        STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_WRAP_CLASS_NAME
      }
    >
      <span
        className={STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_CLASS_NAME}
      >
        {entry.valueText}{' '}
        {hasBonusPopover ? (
          <button
            type="button"
            className={`${bonusToneClassName} ${STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_BONUS_BUTTON_CLASS_NAME}`}
            aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_ATTACK_BONUS_BUTTON}
            aria-expanded={isBonusPopoverOpen}
            onClick={() => {
              setIsBonusPopoverOpen((current) => !current);
            }}
          >
            {valueBonusText}
          </button>
        ) : (
          <span className={bonusToneClassName}>{valueBonusText}</span>
        )}
      </span>
      {isBonusPopoverOpen && hasBonusPopover ? (
        <div
          role="tooltip"
          className={
            STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTACK_BONUS_POPOVER_CLASS_NAME
          }
        >
          <span
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTACK_BONUS_POPOVER_TITLE_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_PROFILE_PANEL_ATTACK_BONUS_POPOVER_TITLE}
          </span>
          {valueBonusDetailLines.map((line) => (
            <span
              key={line}
              className={
                STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTACK_BONUS_POPOVER_LINE_CLASS_NAME
              }
            >
              {line}
            </span>
          ))}
        </div>
      ) : null}
    </span>
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
            <RenderingWorldPlazaProfilePanelAttributeValue entry={entry} />
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
  inventoryState,
  nominalAttackSpeed,
  naturalDefense,
  naturalRunSpeed,
  onInventoryStateChange,
  onShowToast,
  armorLoadoutState = creatingEmptyWorldPlazaArmorLoadoutState(),
  onUnequipArmorSlot,
}: RenderingWorldPlazaProfilePanelProps): React.JSX.Element | null {
  const selectedAvatarSkinId = usingWorldPlazaSelectedAvatarSkin();
  const isSpritcoreUpgradeEnabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SPRITCORE_LEVELING
  );
  const visibleTabs = useMemo(
    () =>
      DEFINING_WORLD_PLAZA_PROFILE_PANEL_TAB_REGISTRY.filter(
        (tab) => tab.id !== 'upgrade' || isSpritcoreUpgradeEnabled
      ),
    [isSpritcoreUpgradeEnabled]
  );
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

  useEffect(() => {
    if (activeTabId === 'upgrade' && !isSpritcoreUpgradeEnabled) {
      setActiveTabId(DEFINING_WORLD_PLAZA_PROFILE_PANEL_DEFAULT_TAB_ID);
    }
  }, [activeTabId, isSpritcoreUpgradeEnabled]);

  if (!isOpen) {
    return null;
  }

  const sections = resolvingWorldPlazaProfilePanelSections({
    health: healthHudSnapshot,
    stamina: staminaHud,
    hunger: hungerHudSnapshot,
    derivedStats,
    skinId: selectedAvatarSkinId,
    inventoryState,
  });
  const canShowUpgradeTab =
    isSpritcoreUpgradeEnabled &&
    inventoryState !== undefined &&
    nominalAttackSpeed !== undefined &&
    naturalDefense !== undefined &&
    naturalRunSpeed !== undefined &&
    onInventoryStateChange !== undefined &&
    onShowToast !== undefined;

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
            {canShowUpgradeTab ? (
              <button
                type="button"
                className={
                  STYLING_WORLD_PLAZA_PROFILE_PANEL_LEVEL_CHIP_BUTTON_CLASS_NAME
                }
                aria-label={`Open ${LABELING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SECTION} upgrades`}
                onClick={() => setActiveTabId('upgrade')}
              >
                <Icon
                  icon="mdi:star-four-points"
                  width={10}
                  height={10}
                  aria-hidden
                />
                Level {derivedStats.level}
              </button>
            ) : (
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
            )}
          </div>
        </div>

        <div
          className={STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST_CLASS_NAME}
          role="tablist"
          aria-label={LABELING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST}
        >
          {visibleTabs.map((tab) => {
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
                <RenderingWorldPlazaProfilePanelArmorSlots
                  slots={armorSlots}
                  loadoutState={armorLoadoutState}
                  onUnequipArmorSlot={onUnequipArmorSlot}
                />
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
          ) : null}

          {activeTabId === 'stats' ? (
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
          ) : null}

          {activeTabId === 'upgrade' && canShowUpgradeTab ? (
            <div
              id="plaza-profile-tab-panel-upgrade"
              role="tabpanel"
              aria-labelledby="plaza-profile-tab-upgrade"
              className={
                STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_SECTION_STACK_CLASS_NAME
              }
            >
              <RenderingWorldPlazaSpritcoreUpgradePanel
                inventoryState={inventoryState}
                effectiveMaxHealth={derivedStats.effectiveMaxHealth}
                attackPower={derivedStats.attackPower}
                nominalAttackSpeed={nominalAttackSpeed}
                naturalDefense={naturalDefense}
                naturalRunSpeed={naturalRunSpeed}
                onInventoryStateChange={onInventoryStateChange}
                onShowToast={onShowToast}
              />
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
