'use client';

/**
 * Portal modal for a bonded companion. Shares Character parchment chrome and
 * unlocks sections as loyalty rises (see definingWildlifePetLoyaltyTiersRegistry).
 *
 * @module components/world/wildlife/pets/components/renderingWildlifePetModal
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { Icon } from '@/components/ui/icon';
import { resolvingWorldPlazaCharacterEngineSkillDefinition } from '@/components/world/character/domains/definingWorldPlazaCharacterEngineSkillRegistry';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { checkingWorldPlazaInventoryItemIsFood } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  gettingWildlifeInstance,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { checkingWildlifePetItemIsEquippableWeapon } from '@/components/world/wildlife/pets/domains/checkingWildlifePetItemIsEquippableWeapon';
import { DEFINING_WILDLIFE_PET_MAX_LOYALTY } from '@/components/world/wildlife/pets/domains/definingWildlifePetLoyaltyTiersRegistry';
import {
  DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_CARD_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_GRID_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_LABEL_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_VALUE_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_ARMOR_COMING_SOON_LABEL,
  DEFINING_WILDLIFE_PET_MODAL_ARMOR_SLOT_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_BACKDROP_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_BODY_STACK_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_CARE_GRID_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_CLOSE_BUTTON_ARIA_LABEL,
  DEFINING_WILDLIFE_PET_MODAL_CLOSE_BUTTON_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_COMMAND_GRID_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_COMMAND_OPTIONS,
  DEFINING_WILDLIFE_PET_MODAL_DATA_ATTRIBUTE,
  DEFINING_WILDLIFE_PET_MODAL_EMPTY_STATE_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_FEED_LABEL,
  DEFINING_WILDLIFE_PET_MODAL_HEADER_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_HEADER_ROW_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_HEAL_LABEL,
  DEFINING_WILDLIFE_PET_MODAL_ICON_SIZE_PX,
  DEFINING_WILDLIFE_PET_MODAL_INLINE_LINK_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_INVENTORY_ROW_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_NAME_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_NAME_INPUT_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_NAME_PLACEHOLDER,
  DEFINING_WILDLIFE_PET_MODAL_NO_EQUIPPABLE_WEAPONS_LABEL,
  DEFINING_WILDLIFE_PET_MODAL_NO_TEACHABLE_SKILLS_LABEL,
  DEFINING_WILDLIFE_PET_MODAL_OVERLAY_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_PANEL_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_PORTRAIT_FRAME_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_SECTION_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_SECTION_HEADING_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_SOULSAVE_CONSUMED_LABEL,
  DEFINING_WILDLIFE_PET_MODAL_SOULSAVE_READY_LABEL,
  DEFINING_WILDLIFE_PET_MODAL_SOULSAVE_TEXT_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_SPECIES_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_STAT_BAR_TRACK_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_STAT_DETAIL_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_STAT_LABEL_ROW_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_STAT_LIST_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_STAT_ROW_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_STAT_VALUE_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_TIER_CHIP_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_TITLE_CLASS_NAME,
  DEFINING_WILDLIFE_PET_MODAL_VITAL_REGISTRY,
  LABELING_WILDLIFE_PET_MODAL_TITLE,
  resolvingWildlifePetModalVitalFillClassName,
  type DefiningWildlifePetModalVitalId,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetModalConstants';
import type { DefiningWildlifePetCommandId } from '@/components/world/wildlife/pets/domains/definingWildlifePetTypes';
import { resolvingWildlifePetAdvancedStats } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetAdvancedStats';
import {
  checkingWildlifePetHasCapability,
  resolvingWildlifePetLoyaltyTier,
} from '@/components/world/wildlife/pets/domains/resolvingWildlifePetLoyaltyTier';
import { useCallback, useEffect, useState, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

/** Polling interval for refreshing the live instance snapshot while open. */
const RENDERING_WILDLIFE_PET_MODAL_REFRESH_INTERVAL_MS = 400;

export type RenderingWildlifePetModalProps = {
  readonly isOpen: boolean;
  readonly instanceId: string | null;
  readonly wildlifeStoreRef: React.RefObject<ManagingWildlifeInstanceStore>;
  readonly inventoryState: DefiningInventoryState;
  readonly characterSkillIds: readonly string[];
  readonly onClose: () => void;
  readonly onRename: (instanceId: string, name: string | null) => void;
  readonly onSetCommand: (
    instanceId: string,
    command: DefiningWildlifePetCommandId
  ) => void;
  readonly onFeed: (instanceId: string, inventorySlotIndex: number) => void;
  readonly onHeal: (instanceId: string) => void;
  readonly onEquipWeapon: (
    instanceId: string,
    inventorySlotIndex: number
  ) => void;
  readonly onUnequipWeapon: (instanceId: string) => void;
  readonly onTeachSkill: (instanceId: string, skillId: string) => void;
  readonly onEquipSkill: (instanceId: string, skillId: string | null) => void;
};

type RenderingWildlifePetModalVitalRow = {
  readonly id: DefiningWildlifePetModalVitalId;
  readonly label: string;
  readonly iconId: string;
  readonly valueText: string;
  readonly detailText: string;
  readonly ratio: number;
};

function computingStatBarWidthPercent(ratio: number): string {
  return `${Math.round(Math.min(1, Math.max(0, ratio)) * 100)}%`;
}

function listingWildlifePetModalVitalRows(
  instance: DefiningWildlifeInstance,
  loyalty: number,
  tierDisplayName: string
): readonly RenderingWildlifePetModalVitalRow[] {
  const healthRatio =
    instance.healthState.baseMaxHealth > 0
      ? instance.healthState.currentHealth / instance.healthState.baseMaxHealth
      : 0;
  const loyaltyRatio = loyalty / DEFINING_WILDLIFE_PET_MAX_LOYALTY;

  const valuesById: Record<
    DefiningWildlifePetModalVitalId,
    { valueText: string; detailText: string; ratio: number }
  > = {
    health: {
      valueText: `${Math.round(instance.healthState.currentHealth)} / ${Math.round(instance.healthState.baseMaxHealth)}`,
      detailText: 'Owner heal restores hit points',
      ratio: healthRatio,
    },
    stamina: {
      valueText: `${Math.round(instance.staminaState.staminaRatio * 100)}%`,
      detailText: 'Drains while chasing and fighting',
      ratio: instance.staminaState.staminaRatio,
    },
    hunger: {
      valueText: `${Math.round(instance.hungerState.hungerRatio * 100)}%`,
      detailText: 'Feed from your bag to restore',
      ratio: instance.hungerState.hungerRatio,
    },
    loyalty: {
      valueText: `${loyalty} / ${DEFINING_WILDLIFE_PET_MAX_LOYALTY}`,
      detailText: `${tierDisplayName} bond`,
      ratio: loyaltyRatio,
    },
  };

  return DEFINING_WILDLIFE_PET_MODAL_VITAL_REGISTRY.map((vital) => ({
    id: vital.id,
    label: vital.label,
    iconId: vital.iconId,
    ...valuesById[vital.id],
  }));
}

/**
 * Bonded companion panel: name, vitals, commands, advanced stats, equipment,
 * skills, and soulsave status, each gated by the pet bond's loyalty tier.
 */
export function RenderingWildlifePetModal({
  isOpen,
  instanceId,
  wildlifeStoreRef,
  inventoryState,
  characterSkillIds,
  onClose,
  onRename,
  onSetCommand,
  onFeed,
  onHeal,
  onEquipWeapon,
  onUnequipWeapon,
  onTeachSkill,
  onEquipSkill,
}: RenderingWildlifePetModalProps): React.JSX.Element | null {
  const [instanceSnapshot, setInstanceSnapshot] =
    useState<DefiningWildlifeInstance | null>(null);
  const [nameDraft, setNameDraft] = useState('');

  useEffect(() => {
    if (!isOpen || !instanceId) {
      setInstanceSnapshot(null);
      return;
    }

    const refreshingSnapshot = (): void => {
      setInstanceSnapshot(
        gettingWildlifeInstance(wildlifeStoreRef.current, instanceId) ?? null
      );
    };

    refreshingSnapshot();
    const intervalId = window.setInterval(
      refreshingSnapshot,
      RENDERING_WILDLIFE_PET_MODAL_REFRESH_INTERVAL_MS
    );

    return () => window.clearInterval(intervalId);
  }, [isOpen, instanceId, wildlifeStoreRef]);

  useEffect(() => {
    setNameDraft(instanceSnapshot?.customDisplayName ?? '');
  }, [instanceSnapshot?.customDisplayName]);

  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dismissingModalOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return;
      }

      onClose();
    };

    document.addEventListener('keydown', dismissingModalOnEscape);

    return () =>
      document.removeEventListener('keydown', dismissingModalOnEscape);
  }, [isOpen, onClose]);

  const committingNameDraft = useCallback((): void => {
    if (!instanceId) {
      return;
    }

    onRename(instanceId, nameDraft.trim().length > 0 ? nameDraft.trim() : null);
  }, [instanceId, nameDraft, onRename]);

  if (
    !isOpen ||
    !instanceId ||
    !instanceSnapshot ||
    !instanceSnapshot.petBond ||
    typeof document === 'undefined'
  ) {
    return null;
  }

  const petBond = instanceSnapshot.petBond;
  const loyalty = petBond.loyalty;
  const tier = resolvingWildlifePetLoyaltyTier(loyalty);
  const species = resolvingWildlifeSpeciesDefinition(
    instanceSnapshot.speciesId
  );
  const companionName =
    instanceSnapshot.customDisplayName?.trim() ||
    species?.displayName ||
    'Companion';
  const hasCapability = (
    capability: Parameters<typeof checkingWildlifePetHasCapability>[1]
  ): boolean => checkingWildlifePetHasCapability(loyalty, capability);

  const isNamable = hasCapability('namable');
  const hasBasicUi = hasCapability('basicUi');
  const hasAdvancedStatsUi = hasCapability('advancedStatsUi');
  const hasEquipment = hasCapability('equipment');
  const hasTeachSpells = hasCapability('teachSpells');
  const hasSoulsave = hasCapability('soulsave');

  const availableCommandOptions =
    DEFINING_WILDLIFE_PET_MODAL_COMMAND_OPTIONS.filter((option) =>
      hasCapability(option.requiredCapability)
    );

  const advancedStats = hasAdvancedStatsUi
    ? resolvingWildlifePetAdvancedStats({
        speciesId: instanceSnapshot.speciesId,
        sizeScaleSample: instanceSnapshot.sizeScaleSample,
        largeSizeFrame: instanceSnapshot.largeSizeFrame ?? null,
        aggressionLevel: instanceSnapshot.aggressionLevel,
        weaponItem: petBond.weaponItem,
      })
    : null;

  const equippableWeaponSlots = hasEquipment
    ? inventoryState.slots
        .map((slot, slotIndex) => ({ slot, slotIndex }))
        .filter(
          (
            entry
          ): entry is {
            slot: NonNullable<typeof entry.slot>;
            slotIndex: number;
          } => checkingWildlifePetItemIsEquippableWeapon(entry.slot)
        )
    : [];

  const learnedSkillIdSet = new Set(petBond.learnedSkillIds);
  const teachableSkillIds = characterSkillIds.filter(
    (skillId) => !learnedSkillIdSet.has(skillId)
  );

  const feedableFoodSlotIndex = inventoryState.slots.findIndex(
    (slot) =>
      slot !== null && checkingWorldPlazaInventoryItemIsFood(slot.itemTypeId)
  );

  const vitalRows = hasBasicUi
    ? listingWildlifePetModalVitalRows(
        instanceSnapshot,
        loyalty,
        tier.displayName
      )
    : [];

  return createPortal(
    <div
      {...{
        [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: 'pet-modal',
        [DEFINING_WILDLIFE_PET_MODAL_DATA_ATTRIBUTE]: '',
      }}
      className={DEFINING_WILDLIFE_PET_MODAL_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
    >
      <button
        type="button"
        aria-label={DEFINING_WILDLIFE_PET_MODAL_CLOSE_BUTTON_ARIA_LABEL}
        className={DEFINING_WILDLIFE_PET_MODAL_BACKDROP_CLASS_NAME}
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${companionName} panel`}
        className={DEFINING_WILDLIFE_PET_MODAL_PANEL_CLASS_NAME}
        onPointerDown={stoppingPlazaWalkPointerPropagation}
        onClick={stoppingPlazaWalkPointerPropagation}
      >
        <header className={DEFINING_WILDLIFE_PET_MODAL_HEADER_CLASS_NAME}>
          <h2 className={DEFINING_WILDLIFE_PET_MODAL_TITLE_CLASS_NAME}>
            {LABELING_WILDLIFE_PET_MODAL_TITLE}
          </h2>
          <button
            type="button"
            className={DEFINING_WILDLIFE_PET_MODAL_CLOSE_BUTTON_CLASS_NAME}
            aria-label={DEFINING_WILDLIFE_PET_MODAL_CLOSE_BUTTON_ARIA_LABEL}
            onClick={onClose}
          >
            <Icon icon="mdi:close" width={16} height={16} aria-hidden />
          </button>
        </header>

        <div className={DEFINING_WILDLIFE_PET_MODAL_BODY_STACK_CLASS_NAME}>
          <div className={DEFINING_WILDLIFE_PET_MODAL_HEADER_ROW_CLASS_NAME}>
            <div
              className={DEFINING_WILDLIFE_PET_MODAL_PORTRAIT_FRAME_CLASS_NAME}
            >
              <Icon
                icon="mdi:paw"
                width={28}
                height={28}
                className="text-poster-teal-deep"
                aria-hidden
              />
            </div>
            <div className="min-w-0">
              <p className={DEFINING_WILDLIFE_PET_MODAL_NAME_CLASS_NAME}>
                {companionName}
              </p>
              <p className={DEFINING_WILDLIFE_PET_MODAL_SPECIES_CLASS_NAME}>
                {species?.displayName ?? instanceSnapshot.speciesId}
              </p>
              <span
                className={DEFINING_WILDLIFE_PET_MODAL_TIER_CHIP_CLASS_NAME}
              >
                {tier.displayName} · {loyalty}/
                {DEFINING_WILDLIFE_PET_MAX_LOYALTY}
              </span>
            </div>
          </div>

          {isNamable ? (
            <div className={DEFINING_WILDLIFE_PET_MODAL_SECTION_CLASS_NAME}>
              <p
                className={
                  DEFINING_WILDLIFE_PET_MODAL_SECTION_HEADING_CLASS_NAME
                }
              >
                Name
              </p>
              <input
                type="text"
                value={nameDraft}
                placeholder={DEFINING_WILDLIFE_PET_MODAL_NAME_PLACEHOLDER}
                maxLength={24}
                className={DEFINING_WILDLIFE_PET_MODAL_NAME_INPUT_CLASS_NAME}
                onChange={(event) => setNameDraft(event.target.value)}
                onBlur={committingNameDraft}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    committingNameDraft();
                  }
                }}
              />
            </div>
          ) : null}

          {hasBasicUi ? (
            <div className={DEFINING_WILDLIFE_PET_MODAL_SECTION_CLASS_NAME}>
              <p
                className={
                  DEFINING_WILDLIFE_PET_MODAL_SECTION_HEADING_CLASS_NAME
                }
              >
                Vitals
              </p>
              <div className={DEFINING_WILDLIFE_PET_MODAL_STAT_LIST_CLASS_NAME}>
                {vitalRows.map((row) => (
                  <div
                    key={row.id}
                    className={DEFINING_WILDLIFE_PET_MODAL_STAT_ROW_CLASS_NAME}
                  >
                    <div
                      className={
                        DEFINING_WILDLIFE_PET_MODAL_STAT_LABEL_ROW_CLASS_NAME
                      }
                    >
                      <Icon
                        icon={row.iconId}
                        width={DEFINING_WILDLIFE_PET_MODAL_ICON_SIZE_PX}
                        height={DEFINING_WILDLIFE_PET_MODAL_ICON_SIZE_PX}
                        className="shrink-0 text-poster-teal-deep"
                        aria-hidden
                      />
                      <span className="truncate">{row.label}</span>
                      <span
                        className={
                          DEFINING_WILDLIFE_PET_MODAL_STAT_VALUE_CLASS_NAME
                        }
                      >
                        {row.valueText}
                      </span>
                    </div>
                    <div
                      className={
                        DEFINING_WILDLIFE_PET_MODAL_STAT_BAR_TRACK_CLASS_NAME
                      }
                      role="meter"
                      aria-label={row.label}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(row.ratio * 100)}
                    >
                      <div
                        className={resolvingWildlifePetModalVitalFillClassName(
                          row.ratio
                        )}
                        style={{
                          width: computingStatBarWidthPercent(row.ratio),
                        }}
                      />
                    </div>
                    <p
                      className={
                        DEFINING_WILDLIFE_PET_MODAL_STAT_DETAIL_CLASS_NAME
                      }
                    >
                      {row.detailText}
                    </p>
                  </div>
                ))}
              </div>

              <div className={DEFINING_WILDLIFE_PET_MODAL_CARE_GRID_CLASS_NAME}>
                <button
                  type="button"
                  className={
                    DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_CLASS_NAME
                  }
                  disabled={feedableFoodSlotIndex < 0}
                  onClick={() => onFeed(instanceId, feedableFoodSlotIndex)}
                >
                  <Icon
                    icon="mdi:food-drumstick"
                    className="size-3.5"
                    aria-hidden
                  />
                  {DEFINING_WILDLIFE_PET_MODAL_FEED_LABEL}
                </button>
                <button
                  type="button"
                  className={
                    DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_CLASS_NAME
                  }
                  onClick={() => onHeal(instanceId)}
                >
                  <Icon
                    icon="mdi:heart-plus"
                    className="size-3.5"
                    aria-hidden
                  />
                  {DEFINING_WILDLIFE_PET_MODAL_HEAL_LABEL}
                </button>
              </div>
            </div>
          ) : null}

          {availableCommandOptions.length > 0 ? (
            <div className={DEFINING_WILDLIFE_PET_MODAL_SECTION_CLASS_NAME}>
              <p
                className={
                  DEFINING_WILDLIFE_PET_MODAL_SECTION_HEADING_CLASS_NAME
                }
              >
                Command
              </p>
              <div
                className={DEFINING_WILDLIFE_PET_MODAL_COMMAND_GRID_CLASS_NAME}
              >
                {availableCommandOptions.map((option) => {
                  const isActive = petBond.command === option.commandId;

                  return (
                    <button
                      key={option.commandId}
                      type="button"
                      className={`${DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_CLASS_NAME} ${
                        isActive
                          ? DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_ACTIVE_CLASS_NAME
                          : ''
                      }`}
                      onClick={() => onSetCommand(instanceId, option.commandId)}
                    >
                      <Icon
                        icon={option.iconId}
                        className="size-3.5"
                        aria-hidden
                      />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {hasAdvancedStatsUi && advancedStats ? (
            <div className={DEFINING_WILDLIFE_PET_MODAL_SECTION_CLASS_NAME}>
              <p
                className={
                  DEFINING_WILDLIFE_PET_MODAL_SECTION_HEADING_CLASS_NAME
                }
              >
                Stats
              </p>
              <div
                className={
                  DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_GRID_CLASS_NAME
                }
              >
                <div
                  className={
                    DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_CARD_CLASS_NAME
                  }
                >
                  <p
                    className={
                      DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_VALUE_CLASS_NAME
                    }
                  >
                    {advancedStats.combat}
                  </p>
                  <p
                    className={
                      DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_LABEL_CLASS_NAME
                    }
                  >
                    Combat
                  </p>
                </div>
                <div
                  className={
                    DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_CARD_CLASS_NAME
                  }
                >
                  <p
                    className={
                      DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_VALUE_CLASS_NAME
                    }
                  >
                    {advancedStats.agility}
                  </p>
                  <p
                    className={
                      DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_LABEL_CLASS_NAME
                    }
                  >
                    Agility
                  </p>
                </div>
                <div
                  className={
                    DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_CARD_CLASS_NAME
                  }
                >
                  <p
                    className={
                      DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_VALUE_CLASS_NAME
                    }
                  >
                    {advancedStats.physicality}
                  </p>
                  <p
                    className={
                      DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_LABEL_CLASS_NAME
                    }
                  >
                    Physicality
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {hasEquipment ? (
            <div className={DEFINING_WILDLIFE_PET_MODAL_SECTION_CLASS_NAME}>
              <p
                className={
                  DEFINING_WILDLIFE_PET_MODAL_SECTION_HEADING_CLASS_NAME
                }
              >
                Equipment
              </p>
              {petBond.weaponItem ? (
                <div
                  className={
                    DEFINING_WILDLIFE_PET_MODAL_INVENTORY_ROW_CLASS_NAME
                  }
                >
                  <span className="flex items-center gap-1.5">
                    <Icon
                      icon="game-icons:broadsword"
                      className="size-3.5 text-poster-orange-deep"
                      aria-hidden
                    />
                    {petBond.weaponItem.itemTypeId}
                  </span>
                  <button
                    type="button"
                    className={
                      DEFINING_WILDLIFE_PET_MODAL_INLINE_LINK_CLASS_NAME
                    }
                    onClick={() => onUnequipWeapon(instanceId)}
                  >
                    Unequip
                  </button>
                </div>
              ) : equippableWeaponSlots.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {equippableWeaponSlots.map(({ slot, slotIndex }) => (
                    <div
                      key={slotIndex}
                      className={
                        DEFINING_WILDLIFE_PET_MODAL_INVENTORY_ROW_CLASS_NAME
                      }
                    >
                      <span className="flex items-center gap-1.5">
                        <Icon
                          icon="game-icons:broadsword"
                          className="size-3.5 text-poster-orange-deep"
                          aria-hidden
                        />
                        {slot.itemTypeId}
                      </span>
                      <button
                        type="button"
                        className={
                          DEFINING_WILDLIFE_PET_MODAL_INLINE_LINK_CLASS_NAME
                        }
                        onClick={() => onEquipWeapon(instanceId, slotIndex)}
                      >
                        Equip
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={DEFINING_WILDLIFE_PET_MODAL_EMPTY_STATE_CLASS_NAME}
                >
                  {DEFINING_WILDLIFE_PET_MODAL_NO_EQUIPPABLE_WEAPONS_LABEL}
                </p>
              )}
              <div
                className={`${DEFINING_WILDLIFE_PET_MODAL_ARMOR_SLOT_CLASS_NAME} mt-0.5`}
              >
                <span className="flex items-center gap-1.5">
                  <Icon icon="mdi:shield" className="size-3.5" aria-hidden />
                  {DEFINING_WILDLIFE_PET_MODAL_ARMOR_COMING_SOON_LABEL}
                </span>
              </div>
            </div>
          ) : null}

          {hasTeachSpells ? (
            <div className={DEFINING_WILDLIFE_PET_MODAL_SECTION_CLASS_NAME}>
              <p
                className={
                  DEFINING_WILDLIFE_PET_MODAL_SECTION_HEADING_CLASS_NAME
                }
              >
                Skills
              </p>
              {petBond.learnedSkillIds.length > 0 ? (
                <div className="mb-1.5 flex flex-col gap-1.5">
                  {petBond.learnedSkillIds.map((skillId) => {
                    const skillDefinition =
                      resolvingWorldPlazaCharacterEngineSkillDefinition(
                        skillId
                      );
                    const isEquipped = petBond.equippedSkillId === skillId;

                    return (
                      <button
                        key={skillId}
                        type="button"
                        className={`${DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_CLASS_NAME} w-full justify-start ${
                          isEquipped
                            ? DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_ACTIVE_CLASS_NAME
                            : ''
                        }`}
                        onClick={() =>
                          onEquipSkill(instanceId, isEquipped ? null : skillId)
                        }
                      >
                        <Icon
                          icon={skillDefinition?.iconName ?? 'mdi:book-outline'}
                          className="size-3.5"
                          aria-hidden
                        />
                        {skillDefinition?.displayName ?? skillId}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {teachableSkillIds.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {teachableSkillIds.map((skillId) => {
                    const skillDefinition =
                      resolvingWorldPlazaCharacterEngineSkillDefinition(
                        skillId
                      );

                    return (
                      <div
                        key={skillId}
                        className={
                          DEFINING_WILDLIFE_PET_MODAL_INVENTORY_ROW_CLASS_NAME
                        }
                      >
                        <span className="flex items-center gap-1.5">
                          <Icon
                            icon={
                              skillDefinition?.iconName ?? 'mdi:book-outline'
                            }
                            className="size-3.5 text-poster-orange-deep"
                            aria-hidden
                          />
                          {skillDefinition?.displayName ?? skillId}
                        </span>
                        <button
                          type="button"
                          className={
                            DEFINING_WILDLIFE_PET_MODAL_INLINE_LINK_CLASS_NAME
                          }
                          onClick={() => onTeachSkill(instanceId, skillId)}
                        >
                          Teach
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p
                  className={DEFINING_WILDLIFE_PET_MODAL_EMPTY_STATE_CLASS_NAME}
                >
                  {DEFINING_WILDLIFE_PET_MODAL_NO_TEACHABLE_SKILLS_LABEL}
                </p>
              )}
            </div>
          ) : null}

          {hasSoulsave ? (
            <div className={DEFINING_WILDLIFE_PET_MODAL_SECTION_CLASS_NAME}>
              <p
                className={
                  DEFINING_WILDLIFE_PET_MODAL_SECTION_HEADING_CLASS_NAME
                }
              >
                Soulsave
              </p>
              <p
                className={DEFINING_WILDLIFE_PET_MODAL_SOULSAVE_TEXT_CLASS_NAME}
              >
                <Icon
                  icon={
                    petBond.soulsaveConsumed
                      ? 'mdi:heart-outline'
                      : 'mdi:heart-plus'
                  }
                  className="size-3.5 text-poster-teal-deep"
                  aria-hidden
                />
                {petBond.soulsaveConsumed
                  ? DEFINING_WILDLIFE_PET_MODAL_SOULSAVE_CONSUMED_LABEL
                  : DEFINING_WILDLIFE_PET_MODAL_SOULSAVE_READY_LABEL}
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>,
    document.body
  );
}
