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
import type { DefiningWorldPlazaOreSmeltingStationState } from '@/components/world/crafting/hooks/usingWorldPlazaOreSmeltingStations';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  useDndContext,
  useDroppable,
  type Active,
} from '@dnd-kit/core';
import type * as React from 'react';

type RenderingWorldPlazaOreSmeltingSlotProps = {
  readonly slotKind: DefiningWorldPlazaOreSmeltingStationSlotKind;
  readonly itemTypeId: string | null;
  readonly isLocked: boolean;
  readonly stationBlockDefinitionId: string;
};

function resolvingDraggedItemTypeId(active: Active | null): string | null {
  const dragData = active?.data.current as
    | { readonly itemTypeId?: string }
    | undefined;
  return typeof dragData?.itemTypeId === 'string'
    ? dragData.itemTypeId
    : null;
}

function RenderingWorldPlazaOreSmeltingSlot({
  slotKind,
  itemTypeId,
  isLocked,
  stationBlockDefinitionId,
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

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-bold uppercase tracking-wide text-amber-100">
        {slotKind === 'ore' ? 'Ore' : 'Fuel'}
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
        aria-label={`${slotKind} smelting slot`}
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
  readonly progressRatio: number;
  readonly onClose: () => void;
  readonly onCollectOutput: () => void;
};

export function RenderingWorldPlazaOreSmeltingPopover({
  stationName,
  stationBlockDefinitionId,
  stationState,
  progressRatio,
  onClose,
  onCollectOutput,
}: RenderingWorldPlazaOreSmeltingPopoverProps): React.JSX.Element {
  const isSmelting = stationState.endsAtMs !== null;

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className="absolute bottom-[calc(100%+8px)] left-1/2 z-50 w-44 -translate-x-1/2 rounded-md border-2 border-amber-900 bg-stone-900/95 p-2 text-amber-50 shadow-xl"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold">{stationName}</span>
        <button
          type="button"
          className="h-5 w-5 rounded text-xs text-stone-300 hover:bg-stone-700"
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
        />
        <RenderingWorldPlazaOreSmeltingSlot
          slotKind="fuel"
          itemTypeId={stationState.fuelItemTypeId}
          isLocked={isSmelting}
          stationBlockDefinitionId={stationBlockDefinitionId}
        />
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded bg-stone-700">
        <div
          className="h-full bg-linear-to-r from-orange-700 via-orange-400 to-yellow-300"
          style={{ width: `${Math.round(progressRatio * 100)}%` }}
        />
      </div>
      <p className="mt-1 text-center text-[9px] text-stone-300">
        {isSmelting
          ? 'Smelting...'
          : stationState.outputItemTypeId
            ? `${stationState.outputDisplayName} waiting`
            : 'Drop ore + 1 coal or 3 wood'}
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
    </div>
  );
}
