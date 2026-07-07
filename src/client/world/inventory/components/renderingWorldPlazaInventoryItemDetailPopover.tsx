'use client';

import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_CLASS_BY_VARIANT,
  type DefiningWorldPlazaInventoryItemDetailBadge,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemDetailConstants';
import { STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryThemeConstants';
import type { ResolvingWorldPlazaInventoryItemDetailPopoverModel } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailPopoverModel';
import type { ResolvingWorldPlazaInventoryItemEnchantmentRow } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemEnchantments';
import { cn } from '@/lib/utils';

const RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_POPOVER_PANEL_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.glassPanel} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme} pointer-events-auto absolute bottom-full left-1/2 z-50 mb-2 w-max min-w-[11.5rem] max-w-[min(15rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md px-2.5 py-2 text-left shadow-lg`;

const RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_CLASS_NAME =
  'inline-flex rounded-full border px-1.5 py-0.5 font-body text-[8px] font-semibold leading-none';

export type RenderingWorldPlazaInventoryItemDetailPopoverProps = {
  readonly itemTypeId: string;
  readonly registry: DefiningInventoryItemRegistry;
  readonly model: ResolvingWorldPlazaInventoryItemDetailPopoverModel;
  readonly onEatItem?: () => void;
  readonly onDropItem?: () => void;
  readonly onEquipItem?: () => void;
  readonly onOpenBag?: () => void;
  readonly onUseActiveEnchantment?: (enchantmentId: string) => void;
};

const RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_ACTION_BUTTON_CLASS_NAME =
  'w-full rounded border px-2 py-1 font-body text-[9px] font-semibold transition-colors';

const RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_PRIMARY_ACTION_BUTTON_CLASS_NAME = `${RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_ACTION_BUTTON_CLASS_NAME} border-poster-gold/30 bg-parchment/90 text-ink hover:bg-parchment`;

const RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_DROP_ACTION_BUTTON_CLASS_NAME = `${RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_ACTION_BUTTON_CLASS_NAME} border-amber-400/35 bg-amber-500/15 text-amber-50 hover:bg-amber-500/25`;

const RENDERING_WORLD_PLAZA_INVENTORY_ITEM_PASSIVE_ENCHANTMENT_BADGE_CLASS_NAME =
  'inline-flex rounded-full border border-violet-400/35 bg-violet-500/15 px-1.5 py-0.5 font-body text-[8px] font-semibold leading-none text-violet-100';

const RENDERING_WORLD_PLAZA_INVENTORY_ITEM_ACTIVE_ENCHANTMENT_BUTTON_CLASS_NAME =
  'inline-flex rounded-full border px-2 py-1 font-body text-[8px] font-semibold leading-none transition-colors';

function RenderingWorldPlazaInventoryPassiveEnchantmentBadge({
  enchantment,
}: {
  readonly enchantment: ResolvingWorldPlazaInventoryItemEnchantmentRow;
}): React.JSX.Element {
  return (
    <span
      className={
        RENDERING_WORLD_PLAZA_INVENTORY_ITEM_PASSIVE_ENCHANTMENT_BADGE_CLASS_NAME
      }
      title={enchantment.description}
    >
      {enchantment.badgeLabel}
    </span>
  );
}

function RenderingWorldPlazaInventoryActiveEnchantmentButton({
  enchantment,
  onUseActiveEnchantment,
}: {
  readonly enchantment: ResolvingWorldPlazaInventoryItemEnchantmentRow;
  readonly onUseActiveEnchantment?: (enchantmentId: string) => void;
}): React.JSX.Element {
  const isDisabled = !enchantment.isUsable;

  return (
    <button
      type="button"
      disabled={isDisabled}
      className={cn(
        RENDERING_WORLD_PLAZA_INVENTORY_ITEM_ACTIVE_ENCHANTMENT_BUTTON_CLASS_NAME,
        enchantment.isArmed
          ? 'border-amber-300/50 bg-amber-300/25 text-amber-50'
          : isDisabled
            ? 'cursor-not-allowed border-white/15 bg-white/5 text-white/45'
            : 'border-poster-gold/45 bg-poster-gold/20 text-parchment hover:bg-poster-gold/30'
      )}
      title={enchantment.description}
      onClick={(event) => {
        event.stopPropagation();

        if (!isDisabled) {
          onUseActiveEnchantment?.(enchantment.enchantmentId);
        }
      }}
    >
      {enchantment.isArmed
        ? `${enchantment.badgeLabel} armed`
        : (enchantment.useButtonLabel ?? enchantment.badgeLabel)}
      {enchantment.statusLabel ? ` · ${enchantment.statusLabel}` : ''}
    </button>
  );
}

function RenderingWorldPlazaInventoryItemDetailBadge({
  badge,
}: {
  readonly badge: DefiningWorldPlazaInventoryItemDetailBadge;
}): React.JSX.Element {
  return (
    <span
      className={cn(
        RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_CLASS_NAME,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_CLASS_BY_VARIANT[
          badge.variant
        ]
      )}
    >
      {badge.label}
    </span>
  );
}

/**
 * Item detail popover for hotbar double-click: name, description, durability, badges.
 */
export function RenderingWorldPlazaInventoryItemDetailPopover({
  itemTypeId,
  registry,
  model,
  onEatItem,
  onDropItem,
  onEquipItem,
  onOpenBag,
  onUseActiveEnchantment,
}: RenderingWorldPlazaInventoryItemDetailPopoverProps): React.JSX.Element {
  const durabilityPercent =
    model.durabilityRatio === null
      ? null
      : Math.round(model.durabilityRatio * 100);

  return (
    <div
      role="dialog"
      aria-label={`${model.name} details`}
      className={
        RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_POPOVER_PANEL_CLASS_NAME
      }
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="flex items-start gap-2">
        <div
          className={cn(
            'flex size-8 shrink-0 items-center justify-center rounded border border-poster-gold/25 bg-parchment/90',
            STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS
          )}
        >
          <RenderingWorldPlazaInventoryItemGlyph
            itemTypeId={itemTypeId}
            registry={registry}
            iconStyle={{ width: 18, height: 18 }}
            emojiStyle={{ fontSize: 18, lineHeight: 1 }}
            fallbackTextStyle={{ fontSize: 10 }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[11px] font-semibold leading-tight text-ink">
            {model.name}
          </p>
          <p className="mt-0.5 font-body text-[9px] leading-snug text-ink-soft">
            {model.description}
          </p>
        </div>
      </div>

      {model.activeEnchantments.length > 0 ||
      model.passiveEnchantments.length > 0 ? (
        <div className="mt-2 border-t border-white/10 pt-2">
          <p className="mb-1 font-body text-[8px] font-semibold uppercase tracking-wide text-parchment/70">
            Enchantments
          </p>
          {model.activeEnchantments.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {model.activeEnchantments.map((enchantment) => (
                <RenderingWorldPlazaInventoryActiveEnchantmentButton
                  key={enchantment.enchantmentId}
                  enchantment={enchantment}
                  onUseActiveEnchantment={onUseActiveEnchantment}
                />
              ))}
            </div>
          ) : null}
          {model.passiveEnchantments.length > 0 ? (
            <div
              className={cn(
                'flex flex-wrap gap-1',
                model.activeEnchantments.length > 0 ? 'mt-1.5' : ''
              )}
            >
              {model.passiveEnchantments.map((enchantment) => (
                <RenderingWorldPlazaInventoryPassiveEnchantmentBadge
                  key={enchantment.enchantmentId}
                  enchantment={enchantment}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      {model.durabilityLabel !== null && durabilityPercent !== null ? (
        <div className="mt-2">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="font-body text-[8px] font-semibold uppercase tracking-wide text-ink/70">
              Durability
            </span>
            <span className="font-body text-[8px] tabular-nums text-ink-soft">
              {model.durabilityLabel}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-black/20">
            <div
              className={cn(
                'h-full rounded-full transition-[width]',
                durabilityPercent <= 0 ? 'bg-amber-400' : 'bg-emerald-400'
              )}
              style={{ width: `${durabilityPercent}%` }}
            />
          </div>
        </div>
      ) : null}

      {model.badges.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {model.badges.map((badge) => (
            <RenderingWorldPlazaInventoryItemDetailBadge
              key={badge.id}
              badge={badge}
            />
          ))}
        </div>
      ) : null}

      {model.canEquip && onEquipItem ? (
        <button
          type="button"
          className={cn(
            RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_PRIMARY_ACTION_BUTTON_CLASS_NAME,
            'mt-2'
          )}
          onClick={(event) => {
            event.stopPropagation();
            onEquipItem();
          }}
        >
          Equip
        </button>
      ) : null}

      {model.canOpenBag && onOpenBag ? (
        <button
          type="button"
          className={cn(
            RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_PRIMARY_ACTION_BUTTON_CLASS_NAME,
            model.canEquip && onEquipItem ? 'mt-1' : 'mt-2'
          )}
          onClick={(event) => {
            event.stopPropagation();
            onOpenBag();
          }}
        >
          Open storage
        </button>
      ) : null}

      {model.canEat && onEatItem ? (
        <button
          type="button"
          className={cn(
            RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_PRIMARY_ACTION_BUTTON_CLASS_NAME,
            (model.canEquip && onEquipItem) || (model.canOpenBag && onOpenBag)
              ? 'mt-1'
              : 'mt-2'
          )}
          onClick={(event) => {
            event.stopPropagation();
            onEatItem();
          }}
        >
          Eat
        </button>
      ) : null}

      {model.canDrop && onDropItem ? (
        <button
          type="button"
          className={cn(
            RENDERING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_DROP_ACTION_BUTTON_CLASS_NAME,
            (model.canEquip && onEquipItem) ||
              (model.canOpenBag && onOpenBag) ||
              (model.canEat && onEatItem)
              ? 'mt-1'
              : 'mt-2'
          )}
          onClick={(event) => {
            event.stopPropagation();
            onDropItem();
          }}
        >
          Drop
        </button>
      ) : null}
    </div>
  );
}
