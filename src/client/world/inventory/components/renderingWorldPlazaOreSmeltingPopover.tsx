'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  checkingWorldPlazaOreSmeltingFuelItemTypeId,
  resolvingWorldPlazaOreSmeltingRecipe,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingRegistry';
import {
  definingWorldPlazaOreSmeltingSlotDroppableId,
  type DefiningWorldPlazaOreSmeltingStationSlotKind,
} from '@/components/world/crafting/domains/definingWorldPlazaOreSmeltingDndIds';
import { resolvingWorldPlazaOreSmeltingPopoverUi } from '@/components/world/crafting/domains/resolvingWorldPlazaOreSmeltingPopoverUi';
import type { DefiningWorldPlazaOreSmeltingStationState } from '@/components/world/crafting/hooks/usingWorldPlazaOreSmeltingStations';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  useDndContext,
  useDroppable,
  type Active,
} from '@dnd-kit/core';
import type * as React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type RenderingWorldPlazaOreSmeltingSlotProps = {
  readonly slotKind: DefiningWorldPlazaOreSmeltingStationSlotKind;
  readonly itemTypeId: string | null;
  readonly isLocked: boolean;
  readonly stationBlockDefinitionId: string;
  readonly inputSlotLabel: string;
};

function resolvingDraggedItemTypeId(active: Active | null): string | null {
  const dragData = active?.data.current as
    | { readonly itemTypeId?: string }
    | undefined;
  return typeof dragData?.itemTypeId === 'string'
    ? dragData.itemTypeId
    : null;
}

function computingWorldPlazaOreSmeltingProgressRatio(
  stationState: DefiningWorldPlazaOreSmeltingStationState,
  nowMs: number
): number {
  if (
    stationState.startedAtMs === null ||
    stationState.endsAtMs === null
  ) {
    return 0;
  }

  const durationMs = stationState.endsAtMs - stationState.startedAtMs;
  if (durationMs <= 0) {
    return 1;
  }

  return Math.min(
    1,
    Math.max(0, (nowMs - stationState.startedAtMs) / durationMs)
  );
}

function RenderingWorldPlazaOreSmeltingSlot({
  slotKind,
  itemTypeId,
  isLocked,
  stationBlockDefinitionId,
  inputSlotLabel,
}: RenderingWorldPlazaOreSmeltingSlotProps): React.JSX.Element {
  const { active } = useDndContext();
  const draggedItemTypeId = resolvingDraggedItemTypeId(active);
  const isValidDraggedItem =
    draggedItemTypeId === null
      ? true
      : slotKind === 'ore'
        ? resolvingWorldPlazaOreSmeltingRecipe(
            draggedItemTypeId,
            stationBlockDefinitionId
          ) !== null
        : checkingWorldPlazaOreSmeltingFuelItemTypeId(draggedItemTypeId);
  const { setNodeRef, isOver } = useDroppable({
    id: definingWorldPlazaOreSmeltingSlotDroppableId(slotKind),
    disabled: isLocked || itemTypeId !== null,
  });

  const slotLabel = slotKind === 'ore' ? inputSlotLabel : 'Fuel';

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-bold uppercase tracking-wide text-amber-100">
        {slotLabel}
      </span>
      <div
        ref={setNodeRef}
        className={[
          'flex h-11 w-11 items-center justify-center rounded border-2 bg-stone-950/80',
          isOver && isValidDraggedItem
            ? 'border-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)]'
            : isOver
              ? 'border-red-400'
              : 'border-stone-500',
        ].join(' ')}
        aria-label={`${slotLabel} smelting slot`}
      >
        {itemTypeId ? (
          <RenderingWorldPlazaInventoryItemGlyph
            itemTypeId={itemTypeId}
            registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
            iconStyle={{ width: 30, height: 30 }}
            emojiStyle={{ fontSize: 24 }}
            fallbackTextStyle={{ fontSize: 9 }}
          />
        ) : (
          <span className="text-[8px] text-stone-400">Drop</span>
        )}
      </div>
    </div>
  );
}

export type RenderingWorldPlazaOreSmeltingPopoverProps = {
  readonly stationName: string;
  readonly stationBlockDefinitionId: string;
  readonly stationState: DefiningWorldPlazaOreSmeltingStationState;
  readonly onClose: () => void;
  readonly onCollectOutput: () => void;
};

/**
 * Smelting station popover. Progress bar width updates imperatively so the
 * plaza/hotbar tree is not re-rendered on a smelt clock.
 */
export function RenderingWorldPlazaOreSmeltingPopover({
  stationName,
  stationBlockDefinitionId,
  stationState,
  onClose,
  onCollectOutput,
}: RenderingWorldPlazaOreSmeltingPopoverProps): React.JSX.Element {
  const progressBarElementRef = useRef<HTMLDivElement | null>(null);
  const stationStateRef = useRef(stationState);
  stationStateRef.current = stationState;

  const isSmelting = stationState.endsAtMs !== null;
  const popoverUi = resolvingWorldPlazaOreSmeltingPopoverUi(
    stationBlockDefinitionId
  );
  const initialProgressPercent = Math.round(
    computingWorldPlazaOreSmeltingProgressRatio(stationState, Date.now()) * 100
  );

  useEffect(() => {
    if (!isSmelting) {
      const progressBarElement = progressBarElementRef.current;
      if (progressBarElement) {
        progressBarElement.style.width = '0%';
      }
      return;
    }

    let rafId = 0;
    const tickingProgress = (): void => {
      const progressBarElement = progressBarElementRef.current;
      if (progressBarElement) {
        const progressRatio = computingWorldPlazaOreSmeltingProgressRatio(
          stationStateRef.current,
          Date.now()
        );
        progressBarElement.style.width = `${Math.round(progressRatio * 100)}%`;
      }
      rafId = window.requestAnimationFrame(tickingProgress);
    };

    rafId = window.requestAnimationFrame(tickingProgress);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isSmelting, stationState.startedAtMs, stationState.endsAtMs]);

  if (typeof document === 'undefined') {
    return <></>;
  }

  // Portal escapes the hotbar shell: its `transform: translateZ(0)` makes it
  // the containing block for fixed positioning, which would offset the panel.
  return createPortal(
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className={popoverUi.panelClassName}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold">{stationName}</span>
        <button
          type="button"
          className={popoverUi.closeButtonClassName}
          onClick={onClose}
          aria-label="Close smelting station"
        >
          ×
        </button>
      </div>

      <div className="flex items-end justify-center gap-3">
        <RenderingWorldPlazaOreSmeltingSlot
          slotKind="ore"
          itemTypeId={stationState.inputItemTypeId}
          isLocked={isSmelting}
          stationBlockDefinitionId={stationBlockDefinitionId}
          inputSlotLabel={popoverUi.inputSlotLabel}
        />
        <RenderingWorldPlazaOreSmeltingSlot
          slotKind="fuel"
          itemTypeId={stationState.fuelItemTypeId}
          isLocked={isSmelting}
          stationBlockDefinitionId={stationBlockDefinitionId}
          inputSlotLabel={popoverUi.inputSlotLabel}
        />
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded bg-stone-700">
        <div
          ref={progressBarElementRef}
          className="h-full bg-linear-to-r from-orange-700 via-orange-400 to-yellow-300"
          style={{ width: `${initialProgressPercent}%` }}
        />
      </div>
      <p className="mt-1 text-center text-[9px] text-stone-300">
        {isSmelting
          ? 'Smelting...'
          : stationState.outputItemTypeId
            ? `${stationState.outputDisplayName} waiting`
            : popoverUi.idleHintText}
      </p>
      {stationState.outputItemTypeId ? (
        <button
          type="button"
          className="mt-2 w-full rounded bg-amber-700 px-2 py-1 text-[10px] font-bold hover:bg-amber-600"
          onClick={onCollectOutput}
        >
          Collect
        </button>
      ) : null}
    </div>,
    document.body
  );
}
