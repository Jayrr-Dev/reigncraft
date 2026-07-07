'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_INFO_DIALOG_DATA_ATTRIBUTE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_DISMISS,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENCHANTMENTS,
  LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STATS,
  type DefiningWorldPlazaInventoryItemDetailInfoRow,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import { resolvingWorldPlazaInventoryItemDetailInfoRowValueClassName } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailInfoRowValueClassName';
import type { ResolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import type { ResolvingWorldPlazaInventoryItemEnchantmentRow } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemEnchantments';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';
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

function RenderingWorldPlazaInventoryItemInfoEnchantment({
  enchantment,
}: {
  readonly enchantment: ResolvingWorldPlazaInventoryItemEnchantmentRow;
}): React.JSX.Element {
  return (
    <div
      className={
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.enchantmentRow
      }
    >
      <p
        className={
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.enchantmentName
        }
      >
        {enchantment.badgeLabel}
      </p>
      {enchantment.description ? (
        <p
          className={
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.enchantmentDescription
          }
        >
          {enchantment.description}
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
  useEffect(() => {
    if (!isOpen) {
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

  const durabilityPercent =
    model.durabilityRatio === null
      ? null
      : Math.round(model.durabilityRatio * 100);

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
            <Icon icon="mdi:close" className="size-3.5" aria-hidden />
          </button>
        </div>

        <div
          className={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.body}
        >
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
              <div className="space-y-1">
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
            <div className="space-y-1">
              <p
                className={
                  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE.durabilityLabel
                }
              >
                {model.durabilityLabel}
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-black/15">
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
              <div className="space-y-1">
                {model.passiveEnchantments.map((enchantment) => (
                  <RenderingWorldPlazaInventoryItemInfoEnchantment
                    key={enchantment.enchantmentId}
                    enchantment={enchantment}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
