'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { DEFINING_WORLD_PLAZA_INVENTORY_INFO_DIALOG_DATA_ATTRIBUTE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_DISMISS,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENCHANTMENT_EXPAND,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENCHANTMENTS,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STATS,
  type DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { resolvingWorldPlazaInventoryItemDetailInfoRowValueClassName } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailInfoRowValueClassName';
import { resolvingWorldPlazaInventoryItemEnchantmentBadgeShellClassName } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemEnchantmentBadgeShellClassName';
import type { ResolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import type { ResolvingWorldPlazaInventoryItemEnchantmentRow } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemEnchantments';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export type RenderingWorldPlazaInventoryItemInfoDialogProps = {
  readonly isOpen: boolean;
  readonly model: ResolvingWorldPlazaInventoryItemDetailPopoverModel;
  readonly onClose: () => void;
};

function RenderingWorldPlazaInventoryItemInfoRow({
  row,
}: {
  readonly row: DefiningWorldPlazaInventoryItemDetailInfoRow;
}): React.JSX.Element {
  return (
    <div className={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoRow}>
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

function RenderingWorldPlazaInventoryItemInfoEnchantmentBadge({
  enchantment,
  isExpanded,
  onToggle,
}: {
  readonly enchantment: ResolvingWorldPlazaInventoryItemEnchantmentRow;
  readonly isExpanded: boolean;
  readonly onToggle: (enchantmentId: string) => void;
}): React.JSX.Element {
  const hasDescription = Boolean(enchantment.description);

  return (
    <button
      type="button"
      className={resolvingWorldPlazaInventoryItemEnchantmentBadgeShellClassName(
        isExpanded
      )}
      aria-expanded={hasDescription ? isExpanded : undefined}
      aria-label={
        hasDescription
          ? `${enchantment.badgeLabel}. ${LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENCHANTMENT_EXPAND}`
          : enchantment.badgeLabel
      }
      onClick={(event) => {
        event.stopPropagation();

        if (!hasDescription) {
          return;
        }

        onToggle(enchantment.enchantmentId);
      }}
    >
      {enchantment.badgeLabel}
    </button>
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
  const [expandedEnchantmentId, setExpandedEnchantmentId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!isOpen) {
      setExpandedEnchantmentId(null);
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

  const togglingEnchantment = (enchantmentId: string): void => {
    setExpandedEnchantmentId((currentEnchantmentId) =>
      currentEnchantmentId === enchantmentId ? null : enchantmentId
    );
  };

  const durabilityPercent =
    model.durabilityRatio === null
      ? null
      : Math.round(model.durabilityRatio * 100);

  const itemIconClassName =
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.itemIcon;

  const expandedEnchantment =
    model.passiveEnchantments.find(
      (enchantment) => enchantment.enchantmentId === expandedEnchantmentId
    ) ?? null;

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
          className={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.header}
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

          <p
            className={
              DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.description
            }
          >
            {model.description}
          </p>

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
            <div className="space-y-1.5 sm:space-y-2">
              <p
                className={
                  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.durabilityLabel
                }
              >
                {model.durabilityLabel}
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-black/15 sm:h-2.5">
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

          {model.passiveEnchantments.length > 0 ? (
            <div
              className={
                DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.enchantmentBlock
              }
            >
              <p
                className={
                  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.infoSectionLabel
                }
              >
                {LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENCHANTMENTS}
              </p>
              <div
                className={
                  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.enchantmentBadgeRow
                }
              >
                {model.passiveEnchantments.map((enchantment) => (
                  <RenderingWorldPlazaInventoryItemInfoEnchantmentBadge
                    key={enchantment.enchantmentId}
                    enchantment={enchantment}
                    isExpanded={
                      expandedEnchantmentId === enchantment.enchantmentId
                    }
                    onToggle={togglingEnchantment}
                  />
                ))}
              </div>
              {expandedEnchantment?.description ? (
                <p
                  className={
                    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.enchantmentDescription
                  }
                >
                  {expandedEnchantment.description}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
