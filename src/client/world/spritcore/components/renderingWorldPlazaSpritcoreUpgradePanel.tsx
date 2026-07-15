'use client';

/**
 * Spritcore upgrade panel for spending kill drops on permanent stat gains.
 *
 * @module components/world/spritcore/components/renderingWorldPlazaSpritcoreUpgradePanel
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { Icon } from '@/components/ui/icon';
import {
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_PANEL_SUBTITLE,
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_PANEL_TITLE,
} from '@/components/world/domains/definingWorldPlazaSpritcoreUpgradeOverlayConstants';
import { formattingWorldPlazaInventoryStackQuantityLabel } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryStackQuantityLabel';
import { computingWorldPlazaSpritcoreCombatPower } from '@/components/world/spritcore/domains/computingWorldPlazaSpritcoreCombatPower';
import {
  consumingWorldPlazaSpritcoreInventoryQuantity,
  countingWorldPlazaSpritcoreInventoryQuantity,
} from '@/components/world/spritcore/domains/countingWorldPlazaSpritcoreInventoryQuantity';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_ITEM_NAME,
  DEFINING_WORLD_PLAZA_SPRITCORE_STACK_QUANTITY_DISPLAY,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_ICON } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreSpriteSheetConstants';
import type { WorldPlazaSpritcoreUpgradeLaneId } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';
import {
  applyingWorldPlazaSpritcoreUpgradePurchase,
  gettingWorldPlazaSpritcoreUpgradeSnapshot,
  subscribingWorldPlazaSpritcoreUpgrade,
} from '@/components/world/spritcore/domains/managingWorldPlazaSpritcoreUpgradeStore';
import { resolvingWorldPlazaSpritcoreUpgradeOffers } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreUpgradeOffers';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useSyncExternalStore } from 'react';

const STYLING_WORLD_PLAZA_SPRITCORE_UPGRADE_PANEL_CLASS_NAME =
  'flex max-h-[min(34rem,calc(100vh-3rem))] w-full max-w-lg flex-col overflow-hidden rounded-lg border-2 border-poster-gold/50 bg-[linear-gradient(180deg,#f4e8c8_0%,#e8d4a8_100%)] shadow-[0_8px_0_0_#14252b]';

const STYLING_WORLD_PLAZA_SPRITCORE_UPGRADE_ROW_CLASS_NAME =
  'flex items-center justify-between gap-3 rounded-md border border-poster-teal/20 bg-parchment/70 px-3 py-2.5';

const STYLING_WORLD_PLAZA_SPRITCORE_UPGRADE_BUTTON_CLASS_NAME =
  'plaza-btn-3d shrink-0 rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-parchment disabled:cursor-not-allowed disabled:opacity-50';

export type RenderingWorldPlazaSpritcoreUpgradePanelProps = {
  readonly inventoryState: DefiningInventoryState;
  readonly effectiveMaxHealth: number;
  readonly attackPower: number;
  readonly nominalAttackSpeed: number;
  readonly onInventoryStateChange: (nextState: DefiningInventoryState) => void;
  readonly onShowToast: (message: string) => void;
  readonly onClose: () => void;
};

function formattingWorldPlazaSpritcoreUpgradePrice(price: number): string {
  return `${Math.ceil(price).toLocaleString()} SC`;
}

function formattingWorldPlazaSpritcoreUpgradeStatValue(
  laneId: WorldPlazaSpritcoreUpgradeLaneId,
  value: number
): string {
  if (laneId === 'attackSpeed') {
    return value.toFixed(2);
  }

  return Math.round(value).toLocaleString();
}

/**
 * Renders the Spritcore spend panel with live prices and balances.
 */
export function RenderingWorldPlazaSpritcoreUpgradePanel({
  inventoryState,
  effectiveMaxHealth,
  attackPower,
  nominalAttackSpeed,
  onInventoryStateChange,
  onShowToast,
  onClose,
}: RenderingWorldPlazaSpritcoreUpgradePanelProps): React.JSX.Element {
  const bonuses = useSyncExternalStore(
    subscribingWorldPlazaSpritcoreUpgrade,
    gettingWorldPlazaSpritcoreUpgradeSnapshot,
    gettingWorldPlazaSpritcoreUpgradeSnapshot
  );
  const spiritcoreBalance =
    countingWorldPlazaSpritcoreInventoryQuantity(inventoryState);
  const spiritcoreHeaderIcon =
    DEFINING_WORLD_PLAZA_INVENTORY_SPRITCORE_SPRITE_SHEET_ICON;
  const spiritcoreHeaderIconPositionX =
    spiritcoreHeaderIcon.columnCount <= 1
      ? 0
      : (spiritcoreHeaderIcon.columnIndex /
          (spiritcoreHeaderIcon.columnCount - 1)) *
        100;
  const offers = useMemo(
    () =>
      resolvingWorldPlazaSpritcoreUpgradeOffers({
        bonuses,
        effectiveMaxHealth,
        attackPower,
        nominalAttackSpeed,
      }),
    [attackPower, bonuses, effectiveMaxHealth, nominalAttackSpeed]
  );
  const combatPower = computingWorldPlazaSpritcoreCombatPower(
    effectiveMaxHealth,
    attackPower,
    nominalAttackSpeed
  );

  const purchasingUpgrade = useCallback(
    (laneId: WorldPlazaSpritcoreUpgradeLaneId): void => {
      const offer = offers[laneId];

      if (offer.isCapped) {
        onShowToast('Attack speed is already capped.');
        return;
      }

      const price = Math.ceil(offer.price);

      if (spiritcoreBalance < price) {
        onShowToast('Not enough Spritcore.');
        return;
      }

      const consumeResult = consumingWorldPlazaSpritcoreInventoryQuantity(
        inventoryState,
        price
      );

      if (!consumeResult.consumed) {
        onShowToast('Could not spend Spritcore.');
        return;
      }

      const purchaseResult = applyingWorldPlazaSpritcoreUpgradePurchase(
        laneId,
        price,
        nominalAttackSpeed
      );

      if (purchaseResult !== 'applied') {
        onShowToast('Upgrade unavailable.');
        return;
      }

      onInventoryStateChange(consumeResult.nextState);
      onShowToast(`Upgraded ${laneId}.`);
    },
    [
      inventoryState,
      nominalAttackSpeed,
      offers,
      onInventoryStateChange,
      onShowToast,
      spiritcoreBalance,
    ]
  );

  const upgradeRows: readonly {
    readonly laneId: WorldPlazaSpritcoreUpgradeLaneId;
    readonly label: string;
    readonly icon: string;
  }[] = [
    { laneId: 'health', label: 'Health', icon: 'mdi:heart-plus' },
    { laneId: 'damage', label: 'Damage', icon: 'mdi:sword-cross' },
    { laneId: 'attackSpeed', label: 'Attack speed', icon: 'mdi:speedometer' },
  ];

  return (
    <div className={STYLING_WORLD_PLAZA_SPRITCORE_UPGRADE_PANEL_CLASS_NAME}>
      <div className="flex items-start justify-between gap-3 border-b border-poster-teal/20 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="size-8 shrink-0 bg-no-repeat [image-rendering:pixelated]"
              style={{
                backgroundImage: `url("${spiritcoreHeaderIcon.spriteSheetUrl}")`,
                backgroundPosition: `${spiritcoreHeaderIconPositionX}% 0%`,
                backgroundSize: `${spiritcoreHeaderIcon.columnCount * 100}% ${spiritcoreHeaderIcon.rowCount * 100}%`,
              }}
              aria-hidden
            />
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-ink">
              {LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_PANEL_TITLE}
            </h2>
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            {LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_PANEL_SUBTITLE}
          </p>
        </div>
        <button
          type="button"
          className="plaza-btn-3d rounded-md border-2 border-poster-gold/60 px-2 py-1 text-xs font-bold uppercase text-parchment"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto px-4 py-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-md border border-poster-teal/20 bg-parchment/60 px-3 py-2">
            <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
              Balance
            </div>
            <div className="font-display text-base font-bold text-ink">
              {formattingWorldPlazaInventoryStackQuantityLabel(
                spiritcoreBalance,
                DEFINING_WORLD_PLAZA_SPRITCORE_STACK_QUANTITY_DISPLAY
              )}{' '}
              {DEFINING_WORLD_PLAZA_SPRITCORE_ITEM_NAME}
            </div>
          </div>
          <div className="rounded-md border border-poster-teal/20 bg-parchment/60 px-3 py-2">
            <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">
              Combat power
            </div>
            <div className="font-display text-base font-bold text-ink">
              {combatPower.toFixed(2)}
            </div>
          </div>
        </div>

        {upgradeRows.map((row) => {
          const offer = offers[row.laneId];
          const price = Math.ceil(offer.price);
          const canAfford = spiritcoreBalance >= price;

          return (
            <div
              key={row.laneId}
              className={STYLING_WORLD_PLAZA_SPRITCORE_UPGRADE_ROW_CLASS_NAME}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-ink">
                  <Icon icon={row.icon} className="size-4" aria-hidden />
                  {row.label}
                </div>
                <div className="mt-1 text-xs text-ink-soft">
                  {formattingWorldPlazaSpritcoreUpgradeStatValue(
                    row.laneId,
                    offer.currentValue
                  )}{' '}
                  →{' '}
                  {formattingWorldPlazaSpritcoreUpgradeStatValue(
                    row.laneId,
                    offer.nextValue
                  )}
                </div>
                <div className="text-xs font-semibold text-poster-teal-deep">
                  {formattingWorldPlazaSpritcoreUpgradePrice(offer.price)}
                </div>
              </div>
              <button
                type="button"
                className={cn(
                  STYLING_WORLD_PLAZA_SPRITCORE_UPGRADE_BUTTON_CLASS_NAME
                )}
                disabled={offer.isCapped || !canAfford}
                onClick={() => {
                  purchasingUpgrade(row.laneId);
                }}
              >
                {offer.isCapped ? 'Capped' : 'Buy'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
