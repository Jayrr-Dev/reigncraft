'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { DEFINING_WORLD_PLAZA_INVENTORY_INFO_DIALOG_DATA_ATTRIBUTE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_ROW_CLASS_NAME,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_INFO_ROW_STACK_VALUE_MIN_CHARS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_DISMISS,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENCHANTMENTS,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENHANCEMENTS,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ITEM_MOD_EXPAND,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STATS,
  type DefiningWorldPlazaInventoryItemDetailBadge,
  type DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { resolvingWorldPlazaInventoryItemDetailBadgeShellClassName } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailBadgeShellClassName';
import { resolvingWorldPlazaInventoryItemDetailInfoRowValueClassName } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailInfoRowValueClassName';
import type { ResolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import { resolvingWorldPlazaInventoryItemEnchantmentBadgeShellClassName } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemEnchantmentBadgeShellClassName';
import type { ResolvingWorldPlazaInventoryItemEnchantmentRow } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemEnchantments';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type RenderingWorldPlazaInventoryItemInfoDialogProps = {
  readonly isOpen: boolean;
  readonly model: ResolvingWorldPlazaInventoryItemDetailPopoverModel;
  readonly onClose: () => void;
};

function RenderingWorldPlazaInventoryItemInfoBadge({
  badge,
}: {
  readonly badge: DefiningWorldPlazaInventoryItemDetailBadge;
}): React.JSX.Element {
  return (
    <span
      className={resolvingWorldPlazaInventoryItemDetailBadgeShellClassName(
        badge.variant
      )}
    >
      {badge.label}
    </span>
  );
}

function RenderingWorldPlazaInventoryItemInfoRow({
  row,
}: {
  readonly row: DefiningWorldPlazaInventoryItemDetailInfoRow;
}): React.JSX.Element {
  const isStacked =
    row.value.length >=
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_INFO_ROW_STACK_VALUE_MIN_CHARS;

  return (
    <div
      className={
        isStacked
          ? DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoRowStacked
          : DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoRow
      }
    >
      <span
        className={
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoRowLabel
        }
      >
        {row.label}
      </span>
      <span
        className={resolvingWorldPlazaInventoryItemDetailInfoRowValueClassName(
          row.tone
        )}
      >
        {row.value}
      </span>
    </div>
  );
}

function RenderingWorldPlazaInventoryItemInfoModBadge({
  itemMod,
  isExpanded,
  onToggle,
}: {
  readonly itemMod: ResolvingWorldPlazaInventoryItemEnchantmentRow;
  readonly isExpanded: boolean;
  readonly onToggle: (enchantmentId: string) => void;
}): React.JSX.Element {
  const hasDescription = Boolean(itemMod.description);

  return (
    <button
      type="button"
      className={resolvingWorldPlazaInventoryItemEnchantmentBadgeShellClassName(
        itemMod.family,
        isExpanded
      )}
      aria-expanded={hasDescription ? isExpanded : undefined}
      aria-label={
        hasDescription
          ? `${itemMod.badgeLabel}. ${LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ITEM_MOD_EXPAND}`
          : itemMod.badgeLabel
      }
      onClick={(event) => {
        event.stopPropagation();

        if (!hasDescription) {
          return;
        }

        onToggle(itemMod.enchantmentId);
      }}
    >
      {itemMod.badgeLabel}
    </button>
  );
}

function RenderingWorldPlazaInventoryItemInfoModSection({
  sectionLabel,
  rows,
  expandedItemModId,
  onToggle,
}: {
  readonly sectionLabel: string;
  readonly rows: readonly ResolvingWorldPlazaInventoryItemEnchantmentRow[];
  readonly expandedItemModId: string | null;
  readonly onToggle: (enchantmentId: string) => void;
}): React.JSX.Element | null {
  if (rows.length === 0) {
    return null;
  }

  const expandedItemMod =
    rows.find((row) => row.enchantmentId === expandedItemModId) ?? null;

  return (
    <div
      className={
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.itemModBlock
      }
    >
      <p
        className={
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoSectionLabel
        }
      >
        {sectionLabel}
      </p>
      <div
        className={
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.itemModBadgeRow
        }
      >
        {rows.map((itemMod) => (
          <RenderingWorldPlazaInventoryItemInfoModBadge
            key={itemMod.enchantmentId}
            itemMod={itemMod}
            isExpanded={expandedItemModId === itemMod.enchantmentId}
            onToggle={onToggle}
          />
        ))}
      </div>
      {expandedItemMod?.description ? (
        <p
          className={
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.itemModDescription
          }
        >
          {expandedItemMod.description}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Centered parchment dialog for item description, stats, and durability.
 */
export function RenderingWorldPlazaInventoryItemInfoDialog({
  isOpen,
  model,
  onClose,
}: RenderingWorldPlazaInventoryItemInfoDialogProps): React.JSX.Element | null {
  const [expandedItemModId, setExpandedItemModId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!isOpen) {
      setExpandedItemModId(null);
      return;
    }

    const dismissingOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', dismissingOnEscape);

    return () => {
      document.removeEventListener('keydown', dismissingOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const togglingItemMod = (enchantmentId: string): void => {
    setExpandedItemModId((currentItemModId) =>
      currentItemModId === enchantmentId ? null : enchantmentId
    );
  };

  const durabilityPercent =
    model.durabilityRatio === null
      ? null
      : Math.round(model.durabilityRatio * 100);

  const itemIconClassName =
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.itemIcon;

  return createPortal(
    <div
      {...{
        [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true,
        [DEFINING_WORLD_PLAZA_INVENTORY_INFO_DIALOG_DATA_ATTRIBUTE]: true,
      }}
      role="dialog"
      aria-modal="true"
      aria-label={LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG}
      className={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.overlay}
      onPointerDown={(event) => {
        event.stopPropagation();

        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.panel}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div
          className={
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.header
          }
        >
          <p
            className={
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.title
            }
          >
            {model.name}
          </p>
          <button
            type="button"
            autoFocus
            aria-label={LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_DISMISS}
            className={
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.closeButton
            }
            onClick={(event) => {
              event.stopPropagation();
              onClose();
            }}
          >
            <Icon
              icon="mdi:close"
              className={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.closeIcon
              }
              aria-hidden
            />
          </button>
        </div>

        <div
          className={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.body}
        >
          <div
            className={
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.iconFrame
            }
            aria-hidden
          >
            <RenderingWorldPlazaInventoryItemGlyph
              itemTypeId={model.itemTypeId}
              registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
              iconClassName={itemIconClassName}
              emojiClassName={itemIconClassName}
              fallbackClassName={itemIconClassName}
            />
          </div>

          {model.description ? (
            <p
              className={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.description
              }
            >
              {model.description}
            </p>
          ) : null}

          {model.badges.length > 0 ? (
            <div
              className={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_ROW_CLASS_NAME
              }
              aria-label="Item badges"
            >
              {model.badges.map((badge) => (
                <RenderingWorldPlazaInventoryItemInfoBadge
                  key={badge.id}
                  badge={badge}
                />
              ))}
            </div>
          ) : null}

          {model.infoRows.length > 0 ? (
            <div
              className={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoSection
              }
            >
              <p
                className={
                  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoSectionLabel
                }
              >
                {LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STATS}
              </p>
              <div className="space-y-1 sm:space-y-1.5">
                {model.infoRows.map((row) => (
                  <RenderingWorldPlazaInventoryItemInfoRow
                    key={row.id}
                    row={row}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {model.durabilityLabel !== null && durabilityPercent !== null ? (
            <div
              className={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.durabilityRow
              }
            >
              <p
                className={
                  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.durabilityLabel
                }
              >
                {model.durabilityLabel}
              </p>
              <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-black/15 sm:h-2.5">
                <div
                  className={cn(
                    'h-full rounded-full',
                    durabilityPercent <= 0 ? 'bg-amber-500' : 'bg-emerald-500'
                  )}
                  style={{ width: `${durabilityPercent}%` }}
                />
              </div>
            </div>
          ) : null}

          <RenderingWorldPlazaInventoryItemInfoModSection
            sectionLabel={
              LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENHANCEMENTS
            }
            rows={model.passiveEnhancements}
            expandedItemModId={expandedItemModId}
            onToggle={togglingItemMod}
          />

          <RenderingWorldPlazaInventoryItemInfoModSection
            sectionLabel={
              LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENCHANTMENTS
            }
            rows={model.passiveEnchantments}
            expandedItemModId={expandedItemModId}
            onToggle={togglingItemMod}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
