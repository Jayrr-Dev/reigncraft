'use client';

/**
 * Centered in-game overlay for the Spritcore upgrade panel.
 *
 * @module components/world/components/renderingWorldPlazaSpritcoreUpgradeOverlay
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_OVERLAY_CLASS_NAME,
  LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_OVERLAY_DIALOG,
} from '@/components/world/domains/definingWorldPlazaSpritcoreUpgradeOverlayConstants';
import { RenderingWorldPlazaSpritcoreUpgradePanel } from '@/components/world/spritcore/components/renderingWorldPlazaSpritcoreUpgradePanel';
import { useCallback, useEffect, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

export type RenderingWorldPlazaSpritcoreUpgradeOverlayProps = {
  readonly isOpen: boolean;
  readonly inventoryState: DefiningInventoryState;
  readonly effectiveMaxHealth: number;
  readonly attackPower: number;
  readonly nominalAttackSpeed: number;
  readonly onInventoryStateChange: (nextState: DefiningInventoryState) => void;
  readonly onShowToast: (message: string) => void;
  readonly onClose: () => void;
};

/**
 * Modal shell for spending Spritcore on permanent upgrades.
 */
export function RenderingWorldPlazaSpritcoreUpgradeOverlay({
  isOpen,
  inventoryState,
  effectiveMaxHealth,
  attackPower,
  nominalAttackSpeed,
  onInventoryStateChange,
  onShowToast,
  onClose,
}: RenderingWorldPlazaSpritcoreUpgradeOverlayProps): React.JSX.Element | null {
  const stoppingPlazaWalkPointerPropagation = useCallback(
    (event: SyntheticEvent<HTMLElement>): void => {
      event.stopPropagation();
    },
    []
  );

  const closingOverlayOnBackdropClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>): void => {
      if (event.target !== event.currentTarget) {
        return;
      }

      onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dismissingOverlayOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return;
      }

      onClose();
    };

    document.addEventListener('keydown', dismissingOverlayOnEscape);

    return () => {
      document.removeEventListener('keydown', dismissingOverlayOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      role="dialog"
      aria-modal="true"
      aria-label={LABELING_WORLD_PLAZA_SPRITCORE_UPGRADE_OVERLAY_DIALOG}
      className={DEFINING_WORLD_PLAZA_SPRITCORE_UPGRADE_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
      onClick={closingOverlayOnBackdropClick}
    >
      <RenderingWorldPlazaSpritcoreUpgradePanel
        inventoryState={inventoryState}
        effectiveMaxHealth={effectiveMaxHealth}
        attackPower={attackPower}
        nominalAttackSpeed={nominalAttackSpeed}
        onInventoryStateChange={onInventoryStateChange}
        onShowToast={onShowToast}
        onClose={onClose}
      />
    </div>,
    document.body
  );
}
