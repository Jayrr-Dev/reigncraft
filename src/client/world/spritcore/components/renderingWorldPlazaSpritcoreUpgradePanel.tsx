'use client';

/**
 * Compact Spritcore spend rows for the Character panel Upgrade tab.
 *
 * @module components/world/spritcore/components/renderingWorldPlazaSpritcoreUpgradePanel
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { Icon } from '@/components/ui/icon';
import {
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_HINT,
  LABELING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SECTION,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_BUY_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_CHIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_GRID_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_VALUE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaProfilePanelConstants';
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
import type { WorldPlazaSpritcoreUpgradeLaneId } from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeTypes';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_LANE_REGISTRY,
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_ALREADY_CAPPED,
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_BALANCE,
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_BUY,
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_CAPPED,
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_COMBAT_POWER,
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_NOT_ENOUGH,
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_SPEND_FAILED,
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_UNAVAILABLE,
} from '@/components/world/spritcore/domains/definingWorldPlazaSpritcoreUpgradeUiConstants';
import {
  applyingWorldPlazaSpritcoreUpgradePurchase,
  gettingWorldPlazaSpritcoreUpgradeSnapshot,
  subscribingWorldPlazaSpritcoreUpgrade,
} from '@/components/world/spritcore/domains/managingWorldPlazaSpritcoreUpgradeStore';
import { resolvingWorldPlazaSpritcoreUpgradeOffers } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreUpgradeOffers';
import { useCallback, useMemo, useSyncExternalStore } from 'react';

export type RenderingWorldPlazaSpritcoreUpgradePanelProps = {
  readonly inventoryState: DefiningInventoryState;
  readonly effectiveMaxHealth: number;
  readonly attackPower: number;
  readonly nominalAttackSpeed: number;
  readonly naturalDefense: number;
  readonly naturalRunSpeed: number;
  readonly onInventoryStateChange: (nextState: DefiningInventoryState) => void;
  readonly onShowToast: (message: string) => void;
};

function formattingWorldPlazaSpritcoreUpgradePrice(price: number): string {
  return `${Math.ceil(price).toLocaleString()} SC`;
}

function formattingWorldPlazaSpritcoreUpgradeStatValue(
  laneId: WorldPlazaSpritcoreUpgradeLaneId,
  value: number
): string {
  if (laneId === 'attackSpeed' || laneId === 'moveSpeed') {
    return value.toFixed(2);
  }

  return Math.round(value).toLocaleString();
}

/**
 * Renders compact Spritcore balance + buy rows for the Character Upgrade tab.
 */
export function RenderingWorldPlazaSpritcoreUpgradePanel({
  inventoryState,
  effectiveMaxHealth,
  attackPower,
  nominalAttackSpeed,
  naturalDefense,
  naturalRunSpeed,
  onInventoryStateChange,
  onShowToast,
}: RenderingWorldPlazaSpritcoreUpgradePanelProps): React.JSX.Element {
  const bonuses = useSyncExternalStore(
    subscribingWorldPlazaSpritcoreUpgrade,
    gettingWorldPlazaSpritcoreUpgradeSnapshot,
    gettingWorldPlazaSpritcoreUpgradeSnapshot
  );
  const spiritcoreBalance =
    countingWorldPlazaSpritcoreInventoryQuantity(inventoryState);
  const offers = useMemo(
    () =>
      resolvingWorldPlazaSpritcoreUpgradeOffers({
        bonuses,
        effectiveMaxHealth,
        attackPower,
        nominalAttackSpeed,
        naturalDefense,
        naturalRunSpeed,
      }),
    [
      attackPower,
      bonuses,
      effectiveMaxHealth,
      naturalDefense,
      naturalRunSpeed,
      nominalAttackSpeed,
    ]
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
        onShowToast(LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_ALREADY_CAPPED);
        return;
      }

      const price = Math.ceil(offer.price);

      if (spiritcoreBalance < price) {
        onShowToast(LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_NOT_ENOUGH);
        return;
      }

      const consumeResult = consumingWorldPlazaSpritcoreInventoryQuantity(
        inventoryState,
        price
      );

      if (!consumeResult.consumed) {
        onShowToast(LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_SPEND_FAILED);
        return;
      }

      const purchaseResult = applyingWorldPlazaSpritcoreUpgradePurchase(
        laneId,
        price,
        {
          nominalAttackSpeed,
          naturalDefense,
          naturalRunSpeed,
        }
      );

      if (purchaseResult !== 'applied') {
        onShowToast(LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_UNAVAILABLE);
        return;
      }

      onInventoryStateChange(consumeResult.nextState);
      onShowToast(`Upgraded ${laneId}.`);
    },
    [
      inventoryState,
      naturalDefense,
      naturalRunSpeed,
      nominalAttackSpeed,
      offers,
      onInventoryStateChange,
      onShowToast,
      spiritcoreBalance,
    ]
  );

  return (
    <div className="flex flex-col gap-1.5">
      <div>
        <h3
          className={
            STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME
          }
        >
          {LABELING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SECTION}
        </h3>
        <p
          className={STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME}
        >
          {LABELING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_HINT}
        </p>
      </div>

      <div
        className={
          STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_GRID_CLASS_NAME
        }
      >
        <div
          className={
            STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_CHIP_CLASS_NAME
          }
        >
          <div
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_LABEL_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_BALANCE}
          </div>
          <div
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_VALUE_CLASS_NAME
            }
          >
            {formattingWorldPlazaInventoryStackQuantityLabel(
              spiritcoreBalance,
              DEFINING_WORLD_PLAZA_SPRITCORE_STACK_QUANTITY_DISPLAY
            )}{' '}
            {DEFINING_WORLD_PLAZA_SPRITCORE_ITEM_NAME}
          </div>
        </div>
        <div
          className={
            STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_CHIP_CLASS_NAME
          }
        >
          <div
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_LABEL_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_COMBAT_POWER}
          </div>
          <div
            className={
              STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_SUMMARY_VALUE_CLASS_NAME
            }
          >
            {combatPower.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_LANE_REGISTRY.map((row) => {
          const offer = offers[row.laneId];
          const price = Math.ceil(offer.price);
          const canAfford = spiritcoreBalance >= price;

          return (
            <div
              key={row.laneId}
              className={
                STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_ROW_CLASS_NAME
              }
            >
              <Icon
                icon={row.iconId}
                width={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX}
                height={DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX}
                className="shrink-0 text-poster-teal-deep"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[11px] font-semibold text-ink">
                  {row.label}
                </div>
                <div className="truncate text-[9px] tabular-nums text-ink-soft">
                  {formattingWorldPlazaSpritcoreUpgradeStatValue(
                    row.laneId,
                    offer.currentValue
                  )}{' '}
                  →{' '}
                  {formattingWorldPlazaSpritcoreUpgradeStatValue(
                    row.laneId,
                    offer.nextValue
                  )}
                  <span className="ml-1 font-semibold text-poster-teal-deep">
                    {formattingWorldPlazaSpritcoreUpgradePrice(offer.price)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={
                  STYLING_WORLD_PLAZA_PROFILE_PANEL_UPGRADE_BUY_BUTTON_CLASS_NAME
                }
                disabled={offer.isCapped || !canAfford}
                onClick={() => {
                  purchasingUpgrade(row.laneId);
                }}
              >
                {offer.isCapped
                  ? LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_CAPPED
                  : LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_BUY}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
