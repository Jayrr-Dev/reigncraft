import { checkingPlazaHerbariumCloverStudyTierUnlocked } from '@/components/home/domains/resolvingPlazaHerbariumCloverStudyTier';
import { checkingPlazaHerbariumFlowerStudyTierUnlocked } from '@/components/home/domains/resolvingPlazaHerbariumFlowerStudyTier';
import { checkingPlazaLapidaryStudyTierUnlocked } from '@/components/home/domains/resolvingPlazaLapidaryStudyTier';
import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import { resolvingWorldPlazaEquipmentAttackEvModifier } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedAttackEv';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { computingWorldPlazaInventoryItemResolvedCost } from '@/components/world/inventory/domains/computingWorldPlazaInventoryItemResolvedCost';
import {
  checkingWorldPlazaInventoryItemIsFlowerHerb,
  parsingWorldPlazaFlowerSpeciesIdFromItemTypeId,
} from '@/components/world/inventory/domains/definingWorldPlazaFlowerEatEffectRegistry';
import { DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_BREAK_CHANCE_AT_ZERO } from '@/components/world/inventory/domains/definingWorldPlazaInventoryDurabilityConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_EQUIPMENT_TOOL_KIND_BADGE_LABELS,
  type DefiningWorldPlazaInventoryItemDetailBadge,
  type DefiningWorldPlazaInventoryItemDetailBadgeVariant,
  type DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_LABELS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_SPECIAL_TAG_LABELS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemSpecialTagConstants';
import type { DefiningWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import {
  checkingWorldPlazaInventoryItemIsOre,
  parsingWorldPlazaOreSpeciesIdFromItemTypeId,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreSpriteSheetConstants';
import { formattingWorldPlazaInventoryItemDurabilityLabel } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryItemDurabilityLabel';
import { checkingWorldPlazaHeldLuckyBuffIsActive } from '@/components/world/inventory/domains/managingWorldPlazaHeldLuckyBuffBridge';
import {
  parsingWorldPlazaCloverKindFromItemTypeId,
  resolvingWorldPlazaInventoryCloverDetailContent,
  resolvingWorldPlazaInventoryCloverDetailReveal,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryCloverDetailReveal';
import {
  resolvingWorldPlazaInventoryFlowerDetailContent,
  resolvingWorldPlazaInventoryFlowerDetailReveal,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFlowerDetailReveal';
import { resolvingWorldPlazaInventoryFoodHealAmount } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealAmount';
import { resolvingWorldPlazaInventoryItemDescription } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDescription';
import { resolvingWorldPlazaInventoryItemDurability } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDurability';
import {
  partitioningWorldPlazaInventoryItemEnchantmentRows,
  resolvingWorldPlazaInventoryItemEnchantmentRows,
  type ResolvingWorldPlazaInventoryItemEnchantmentRow,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemEnchantments';
import {
  checkingWorldPlazaInventoryItemIsFood,
  resolvingWorldPlazaInventoryFoodDefinition,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import {
  formattingWorldPlazaInventoryItemEvModifierLabel,
  resolvingWorldPlazaInventoryItemCreatedBy,
  resolvingWorldPlazaInventoryItemForgeLevel,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemInstanceInspectFields';
import { checkingWorldPlazaInventoryItemIsRecipePage } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemRecipePage';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';
import {
  resolvingWorldPlazaInventoryOreDetailContent,
  resolvingWorldPlazaInventoryOreDetailReveal,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryOreDetailReveal';
import { resolvingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryStackQuantityLabel';
import {
  resolvingWorldPlazaInventoryWildlifeMeatDetailContent,
  resolvingWorldPlazaInventoryWildlifeMeatDetailReveal,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryWildlifeMeatDetailReveal';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { WorldFlowerSpeciesId } from '../../../../shared/worldFlowerRarity';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

export type ResolvingWorldPlazaInventoryItemDetailPopoverModel = {
  readonly itemTypeId: string;
  readonly name: string;
  readonly description: string;
  readonly durabilityLabel: string | null;
  readonly durabilityRatio: number | null;
  readonly badges: readonly DefiningWorldPlazaInventoryItemDetailBadge[];
  readonly infoRows: readonly DefiningWorldPlazaInventoryItemDetailInfoRow[];
  readonly passiveEnhancements: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
  readonly passiveEnchantments: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
  readonly activeEnhancements: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
  readonly activeEnchantments: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
  readonly canEat: boolean;
  readonly canStudy: boolean;
  readonly canAttachRecipePage: boolean;
  readonly canDrop: boolean;
  readonly canEquip: boolean;
  readonly canOpenBag: boolean;
};

export type ResolvingWorldPlazaInventoryItemDetailPopoverModelOptions = {
  readonly isEquipped: boolean;
  readonly nowMs?: number;
  /** Per-species corpse Study totals; gates wildlife meat inspect detail. */
  readonly studyCountsBySpeciesId?: Readonly<
    Partial<Record<DefiningWildlifeSpeciesId, number>>
  >;
  /** Per-flower Study totals; hides Study once the herbarium dossier is full. */
  readonly flowerStudyCountsBySpeciesId?: Readonly<
    Partial<Record<WorldFlowerSpeciesId, number>>
  >;
  /** Per-ore Study totals; hides Study once the lapidary dossier is full. */
  readonly oreStudyCountsBySpeciesId?: Readonly<
    Partial<Record<WorldOreSpeciesId, number>>
  >;
  /** Combined clover Study total for lucky-charm inspect gating. */
  readonly cloverStudyCount?: number;
  /** Local player effective max HP for food heal preview. */
  readonly playerEffectiveMaxHealth?: number;
};

/**
 * True when a flower herb still has herbarium Study progress left.
 */
function checkingWorldPlazaInventoryItemCanStudyFlower(
  itemTypeId: string,
  flowerStudyCountsBySpeciesId:
    | Readonly<Partial<Record<WorldFlowerSpeciesId, number>>>
    | undefined
): boolean {
  if (!checkingWorldPlazaInventoryItemIsFlowerHerb(itemTypeId)) {
    return false;
  }

  const speciesId = parsingWorldPlazaFlowerSpeciesIdFromItemTypeId(itemTypeId);

  if (!speciesId) {
    return false;
  }

  const studyCount = flowerStudyCountsBySpeciesId?.[speciesId] ?? 0;

  return !checkingPlazaHerbariumFlowerStudyTierUnlocked('full', studyCount);
}

/**
 * True when an ore specimen still has lapidary Study progress left.
 */
function checkingWorldPlazaInventoryItemCanStudyOre(
  itemTypeId: string,
  oreStudyCountsBySpeciesId:
    | Readonly<Partial<Record<WorldOreSpeciesId, number>>>
    | undefined
): boolean {
  if (!checkingWorldPlazaInventoryItemIsOre(itemTypeId)) {
    return false;
  }

  const speciesId = parsingWorldPlazaOreSpeciesIdFromItemTypeId(itemTypeId);

  if (!speciesId) {
    return false;
  }

  const studyCount = oreStudyCountsBySpeciesId?.[speciesId] ?? 0;

  return !checkingPlazaLapidaryStudyTierUnlocked('full', studyCount);
}

/**
 * True when a clover still has shared herbarium Study progress left.
 */
function checkingWorldPlazaInventoryItemCanStudyClover(
  itemTypeId: string,
  cloverStudyCount: number | undefined
): boolean {
  if (!parsingWorldPlazaCloverKindFromItemTypeId(itemTypeId)) {
    return false;
  }

  return !checkingPlazaHerbariumCloverStudyTierUnlocked(
    'full',
    cloverStudyCount ?? 0
  );
}

/**
 * True when the item can be Studied for Herbarium or Lapidary progress.
 */
function checkingWorldPlazaInventoryItemCanStudy(
  itemTypeId: string,
  flowerStudyCountsBySpeciesId:
    | Readonly<Partial<Record<WorldFlowerSpeciesId, number>>>
    | undefined,
  oreStudyCountsBySpeciesId:
    | Readonly<Partial<Record<WorldOreSpeciesId, number>>>
    | undefined,
  cloverStudyCount: number | undefined
): boolean {
  return (
    checkingWorldPlazaInventoryItemCanStudyFlower(
      itemTypeId,
      flowerStudyCountsBySpeciesId
    ) ||
    checkingWorldPlazaInventoryItemCanStudyOre(
      itemTypeId,
      oreStudyCountsBySpeciesId
    ) ||
    checkingWorldPlazaInventoryItemCanStudyClover(itemTypeId, cloverStudyCount)
  );
}

function resolvingWorldPlazaInventoryItemRarityBadgeVariant(
  rarity: DefiningWorldPlazaInventoryItemTypeDefinition['rarity']
): DefiningWorldPlazaInventoryItemDetailBadgeVariant {
  return `rarity-${rarity}`;
}

function resolvingWildlifeMeatStudyCount(
  wildlifeSpeciesId: string | undefined,
  studyCountsBySpeciesId:
    | Readonly<Partial<Record<DefiningWildlifeSpeciesId, number>>>
    | undefined
): number {
  if (!wildlifeSpeciesId || !studyCountsBySpeciesId) {
    return 0;
  }

  return (
    studyCountsBySpeciesId[wildlifeSpeciesId as DefiningWildlifeSpeciesId] ?? 0
  );
}

function listingWorldPlazaInventoryItemDetailBadges(
  item: DefiningInventoryItem,
  definition: DefiningWorldPlazaInventoryItemTypeDefinition,
  options: {
    readonly isEquipped: boolean;
    readonly includeFoodHungerBadge?: boolean;
    readonly playerEffectiveMaxHealth?: number;
  }
): DefiningWorldPlazaInventoryItemDetailBadge[] {
  const badges: DefiningWorldPlazaInventoryItemDetailBadge[] = [
    {
      id: 'rarity',
      label:
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_LABELS[definition.rarity],
      variant: resolvingWorldPlazaInventoryItemRarityBadgeVariant(
        definition.rarity
      ),
    },
  ];

  if (definition.tags) {
    for (const tag of definition.tags) {
      badges.push({
        id: `tag-${tag}`,
        label: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_SPECIAL_TAG_LABELS[tag],
        variant: `tag-${tag}`,
      });
    }
  }

  const forgeLevel = resolvingWorldPlazaInventoryItemForgeLevel(
    item,
    definition.forgeLevel
  );

  if (forgeLevel !== null) {
    badges.push({
      id: 'forge-level',
      label: `Forge ${forgeLevel}`,
      variant: 'tool',
    });
  }

  if (options.isEquipped) {
    badges.push({
      id: 'equipped',
      label: 'Equipped',
      variant: 'positive',
    });
  }

  if (definition.food && options.includeFoodHungerBadge !== false) {
    if (definition.food.hungerRestoreRatio > 0) {
      badges.push({
        id: 'food',
        label: `Restores ${Math.round(definition.food.hungerRestoreRatio * 100)}% hunger`,
        variant: 'food',
      });
    }

    const healthHealAmount = resolvingWorldPlazaInventoryFoodHealAmount({
      healthHeal: definition.food.healthHeal,
      effectiveMaxHealth:
        options.playerEffectiveMaxHealth ??
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX,
      foodItemMetadata: item.metadata,
    });

    if (healthHealAmount > 0) {
      badges.push({
        id: 'food-heal',
        label:
          options.playerEffectiveMaxHealth !== undefined
            ? `Heals ${healthHealAmount} HP`
            : `Heals ~${healthHealAmount} HP`,
        variant: 'food',
      });
    }
  }

  if (definition.equipment) {
    for (const toolKind of definition.equipment.toolKinds) {
      badges.push({
        id: `tool-${toolKind}`,
        label:
          DEFINING_WORLD_PLAZA_INVENTORY_EQUIPMENT_TOOL_KIND_BADGE_LABELS[
            toolKind
          ],
        variant: 'tool',
      });
    }

    if (definition.equipment.harvestSpeedMultiplier > 1) {
      badges.push({
        id: 'harvest-speed',
        label: `${definition.equipment.harvestSpeedMultiplier}x harvest speed`,
        variant: 'positive',
      });
    }
  }

  const durabilitySnapshot = resolvingWorldPlazaInventoryItemDurability(item);

  if (durabilitySnapshot) {
    if (durabilitySnapshot.remaining <= 0) {
      const breakChancePercent = Math.round(
        (definition.durability?.breakChanceAtZero ??
          DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_BREAK_CHANCE_AT_ZERO) *
          100
      );
      badges.push({
        id: 'durability-worn',
        label: `May break (${breakChancePercent}% per use)`,
        variant: 'warning',
      });
    }
  }

  if (!definition.isDroppable) {
    badges.push({
      id: 'bound',
      label: 'Cannot drop',
      variant: 'neutral',
    });
  }

  return badges;
}

function listingWorldPlazaInventoryItemDetailInfoRows(
  item: DefiningInventoryItem,
  definition: DefiningWorldPlazaInventoryItemTypeDefinition,
  options: {
    readonly includeFoodRows?: boolean;
  }
): DefiningWorldPlazaInventoryItemDetailInfoRow[] {
  const rows: DefiningWorldPlazaInventoryItemDetailInfoRow[] = [];

  const createdBy = resolvingWorldPlazaInventoryItemCreatedBy(item);

  if (createdBy) {
    rows.push({
      id: 'created-by',
      label: 'Created by',
      value: createdBy,
      tone: 'neutral',
    });
  }

  if (definition.cost) {
    const resolvedCost = computingWorldPlazaInventoryItemResolvedCost(
      definition.cost
    );
    rows.push({
      id: 'cost',
      label: 'Cost',
      value:
        resolvedCost === definition.cost.base
          ? String(resolvedCost)
          : `${resolvedCost} (base ${definition.cost.base})`,
      tone: 'neutral',
    });
  }

  if (definition.food && options.includeFoodRows !== false) {
    if (definition.food.meatKind === 'raw') {
      if (definition.food.rawSicknessChance !== undefined) {
        rows.push({
          id: 'raw-sickness',
          label: 'Raw meat risk',
          value: `${Math.round(definition.food.rawSicknessChance * 100)}% sickness`,
          tone: 'warning',
        });
      }

      if (
        definition.food.rawPoisonFlatEv !== undefined &&
        definition.food.rawPoisonDurationMs !== undefined
      ) {
        const poisonSeconds = Math.round(
          definition.food.rawPoisonDurationMs / 1000
        );
        rows.push({
          id: 'raw-poison',
          label: 'Poison if eaten',
          value: `${definition.food.rawPoisonFlatEv} damage over ${poisonSeconds}s`,
          tone: 'warning',
        });
      }
    } else if (definition.food.meatKind === 'cooked') {
      rows.push({
        id: 'cooked-safe',
        label: 'Preparation',
        value: 'Cooked, safe to eat',
        tone: 'positive',
      });
    }
  }

  if (definition.equipment) {
    const attackModifier = resolvingWorldPlazaEquipmentAttackEvModifier(
      definition.equipment
    );

    if (attackModifier) {
      rows.push({
        id: 'attack-ev',
        label: 'Attack EV',
        value: formattingWorldPlazaInventoryItemEvModifierLabel(attackModifier),
        tone: 'tool',
      });
    }

    if (definition.equipment.defenseEvModifier) {
      rows.push({
        id: 'defense-ev',
        label: 'Defense EV',
        value: formattingWorldPlazaInventoryItemEvModifierLabel(
          definition.equipment.defenseEvModifier
        ),
        tone: 'tool',
      });
    }
  }

  if (definition.container) {
    const slotCount = definition.container.columns * definition.container.rows;
    rows.push({
      id: 'storage',
      label: 'Storage',
      value: `${definition.container.columns}×${definition.container.rows} (${slotCount} slots)`,
      tone: 'neutral',
    });
  }

  if (definition.isStackable && definition.maxStack > 1) {
    rows.push({
      id: 'stack',
      label: 'Stack',
      value: `${resolvingWorldPlazaInventoryStackQuantityLabel(
        item.itemTypeId,
        item.quantity
      )} / ${definition.maxStack}`,
      tone: 'neutral',
    });
  } else if (item.quantity > 1) {
    rows.push({
      id: 'quantity',
      label: 'Quantity',
      value: resolvingWorldPlazaInventoryStackQuantityLabel(
        item.itemTypeId,
        item.quantity
      ),
      tone: 'neutral',
    });
  }

  return rows;
}

/**
 * Resolves popover copy and badges for one hotbar item instance.
 */
export function resolvingWorldPlazaInventoryItemDetailPopoverModel(
  item: DefiningInventoryItem,
  options: ResolvingWorldPlazaInventoryItemDetailPopoverModelOptions
): ResolvingWorldPlazaInventoryItemDetailPopoverModel | null {
  const definition = resolvingWorldPlazaInventoryItemTypeDefinition(
    item.itemTypeId
  );

  if (!definition) {
    return null;
  }

  const foodDefinition = resolvingWorldPlazaInventoryFoodDefinition(
    item.itemTypeId
  );
  const isWildlifeMeat = Boolean(foodDefinition?.wildlifeSpeciesId);
  const flowerSpeciesId = parsingWorldPlazaFlowerSpeciesIdFromItemTypeId(
    item.itemTypeId
  );
  const flowerStudyCount = flowerSpeciesId
    ? (options.flowerStudyCountsBySpeciesId?.[flowerSpeciesId] ?? 0)
    : 0;
  const flowerReveal = flowerSpeciesId
    ? resolvingWorldPlazaInventoryFlowerDetailReveal(flowerStudyCount)
    : null;
  const flowerContent = flowerSpeciesId
    ? resolvingWorldPlazaInventoryFlowerDetailContent(flowerSpeciesId, {
        studyCount: flowerStudyCount,
        fallbackName: definition.name,
        fallbackDescription: resolvingWorldPlazaInventoryItemDescription(
          item.itemTypeId,
          { fallbackName: definition.name }
        ),
      })
    : null;
  const cloverKind = parsingWorldPlazaCloverKindFromItemTypeId(item.itemTypeId);
  const cloverStudyCount = options.cloverStudyCount ?? 0;
  const cloverReveal = cloverKind
    ? resolvingWorldPlazaInventoryCloverDetailReveal(cloverStudyCount)
    : null;
  const cloverContent = cloverKind
    ? resolvingWorldPlazaInventoryCloverDetailContent(cloverKind, {
        studyCount: cloverStudyCount,
        fallbackName: definition.name,
        fallbackDescription: resolvingWorldPlazaInventoryItemDescription(
          item.itemTypeId,
          { fallbackName: definition.name }
        ),
        isLuckyCharmActive:
          cloverKind === 'four_leaf' &&
          checkingWorldPlazaHeldLuckyBuffIsActive(),
      })
    : null;
  const oreSpeciesId = parsingWorldPlazaOreSpeciesIdFromItemTypeId(
    item.itemTypeId
  );
  const oreStudyCount = oreSpeciesId
    ? (options.oreStudyCountsBySpeciesId?.[oreSpeciesId] ?? 0)
    : 0;
  const oreReveal = oreSpeciesId
    ? resolvingWorldPlazaInventoryOreDetailReveal(oreStudyCount)
    : null;
  const oreContent = oreSpeciesId
    ? resolvingWorldPlazaInventoryOreDetailContent(oreSpeciesId, {
        studyCount: oreStudyCount,
        fallbackName: definition.name,
        fallbackDescription: resolvingWorldPlazaInventoryItemDescription(
          item.itemTypeId,
          { fallbackName: definition.name }
        ),
      })
    : null;
  const wildlifeStudyCount = resolvingWildlifeMeatStudyCount(
    foodDefinition?.wildlifeSpeciesId,
    options.studyCountsBySpeciesId
  );
  const wildlifeMeatReveal = isWildlifeMeat
    ? resolvingWorldPlazaInventoryWildlifeMeatDetailReveal(wildlifeStudyCount)
    : null;
  const wildlifeMeatContent =
    isWildlifeMeat && foodDefinition
      ? resolvingWorldPlazaInventoryWildlifeMeatDetailContent(foodDefinition, {
          studyCount: wildlifeStudyCount,
          fallbackName: definition.name,
          foodItemMetadata: item.metadata,
          effectiveMaxHealth: options.playerEffectiveMaxHealth,
        })
      : null;
  const includeGenericMeta =
    (!isWildlifeMeat || Boolean(wildlifeMeatReveal?.showGenericItemMeta)) &&
    (!flowerSpeciesId || Boolean(flowerReveal?.showGenericItemMeta)) &&
    (!cloverKind || Boolean(cloverReveal?.showGenericItemMeta)) &&
    (!oreSpeciesId || Boolean(oreReveal?.showGenericItemMeta));
  const includeGenericFoodRows =
    !isWildlifeMeat && !flowerSpeciesId && !cloverKind;
  const includeFoodHungerBadge =
    !isWildlifeMeat && !flowerSpeciesId && !cloverKind;

  const durabilitySnapshot = resolvingWorldPlazaInventoryItemDurability(item);
  const enchantmentRows = resolvingWorldPlazaInventoryItemEnchantmentRows(
    item,
    options.nowMs ?? Date.now()
  );
  const {
    passiveEnhancements,
    passiveEnchantments,
    activeEnhancements,
    activeEnchantments,
  } = partitioningWorldPlazaInventoryItemEnchantmentRows(enchantmentRows);

  if (wildlifeMeatContent && !includeGenericMeta) {
    return {
      itemTypeId: item.itemTypeId,
      name: definition.name,
      description: wildlifeMeatContent.description,
      durabilityLabel: null,
      durabilityRatio: null,
      badges: wildlifeMeatContent.badges,
      infoRows: wildlifeMeatContent.infoRows,
      passiveEnhancements: [],
      passiveEnchantments: [],
      activeEnhancements: [],
      activeEnchantments: [],
      canEat: checkingWorldPlazaInventoryItemIsFood(item.itemTypeId),
      canStudy: checkingWorldPlazaInventoryItemCanStudy(
        item.itemTypeId,
        options.flowerStudyCountsBySpeciesId,
        options.oreStudyCountsBySpeciesId,
        options.cloverStudyCount
      ),
      canAttachRecipePage: checkingWorldPlazaInventoryItemIsRecipePage(
        item.itemTypeId
      ),
      canDrop: definition.isDroppable,
      canEquip: false,
      canOpenBag: checkingWorldPlazaInventoryItemIsBag(item.itemTypeId),
    };
  }

  const genericBadges = listingWorldPlazaInventoryItemDetailBadges(
    item,
    definition,
    {
      isEquipped: options.isEquipped,
      includeFoodHungerBadge,
      playerEffectiveMaxHealth: options.playerEffectiveMaxHealth,
    }
  );
  const genericInfoRows = listingWorldPlazaInventoryItemDetailInfoRows(
    item,
    definition,
    {
      includeFoodRows: includeGenericFoodRows,
    }
  );

  const mergedBadges = [
    ...genericBadges,
    ...(wildlifeMeatContent?.badges ?? []),
    ...(flowerContent?.badges ?? []),
    ...(cloverContent?.badges ?? []),
    ...(oreContent?.badges ?? []),
  ];
  const mergedInfoRows = [
    ...(flowerContent?.infoRows ?? []),
    ...(cloverContent?.infoRows ?? []),
    ...(oreContent?.infoRows ?? []),
    ...genericInfoRows,
    ...(wildlifeMeatContent?.infoRows ?? []),
  ];

  return {
    itemTypeId: item.itemTypeId,
    name: definition.name,
    description: flowerSpeciesId
      ? (flowerContent?.description ?? '')
      : cloverKind
        ? (cloverContent?.description ?? '')
        : oreSpeciesId
          ? (oreContent?.description ?? '')
          : (wildlifeMeatContent?.description ??
            resolvingWorldPlazaInventoryItemDescription(item.itemTypeId, {
              fallbackName: definition.name,
            })),
    durabilityLabel: formattingWorldPlazaInventoryItemDurabilityLabel(item),
    durabilityRatio: durabilitySnapshot?.ratio ?? null,
    badges: mergedBadges,
    infoRows: mergedInfoRows,
    passiveEnhancements,
    passiveEnchantments,
    activeEnhancements,
    activeEnchantments,
    canEat: checkingWorldPlazaInventoryItemIsFood(item.itemTypeId),
    canStudy: checkingWorldPlazaInventoryItemCanStudy(
      item.itemTypeId,
      options.flowerStudyCountsBySpeciesId,
      options.oreStudyCountsBySpeciesId,
      options.cloverStudyCount
    ),
    canAttachRecipePage: checkingWorldPlazaInventoryItemIsRecipePage(
      item.itemTypeId
    ),
    canDrop: definition.isDroppable,
    canEquip: false,
    canOpenBag: checkingWorldPlazaInventoryItemIsBag(item.itemTypeId),
  };
}
