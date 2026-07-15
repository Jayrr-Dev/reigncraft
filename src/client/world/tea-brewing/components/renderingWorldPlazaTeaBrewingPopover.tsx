'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT,
  LABELING_WORLD_PLAZA_TEA_BREWING_OPEN,
} from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingConstants';
import { definingWorldPlazaTeaBrewingSlotDroppableId } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingDndIds';
import { resolvingWorldPlazaTeaBrewingIngredient } from '@/components/world/tea-brewing/domains/definingWorldPlazaTeaBrewingIngredientRegistry';
import {
  useDndContext,
  useDroppable,
  type Active,
} from '@dnd-kit/core';
import type * as React from 'react';
import { createPortal } from 'react-dom';

type RenderingWorldPlazaTeaBrewingSlotProps = {
  readonly slotIndex: number;
  readonly itemTypeId: string | null;
  readonly onReturnIngredient?: (slotIndex: number) => void;
};

function resolvingDraggedItemTypeId(active: Active | null): string | null {
  const dragData = active?.data.current as
    | { readonly itemTypeId?: string }
    | undefined;
  return typeof dragData?.itemTypeId === 'string'
    ? dragData.itemTypeId
    : null;
}

function RenderingWorldPlazaTeaBrewingSlot({
  slotIndex,
  itemTypeId,
  onReturnIngredient,
}: RenderingWorldPlazaTeaBrewingSlotProps): React.JSX.Element {
  const { active } = useDndContext();
  const draggedItemTypeId = resolvingDraggedItemTypeId(active);
  const isValidDraggedItem =
    draggedItemTypeId === null
      ? true
      : resolvingWorldPlazaTeaBrewingIngredient(draggedItemTypeId) !== null;
  const { setNodeRef, isOver } = useDroppable({
    id: definingWorldPlazaTeaBrewingSlotDroppableId(slotIndex),
    disabled: itemTypeId !== null,
  });

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] font-bold uppercase tracking-wide text-sky-100">
        {slotIndex + 1}
      </span>
      <button
        ref={setNodeRef}
        type="button"
        className={[
          'flex h-11 w-11 items-center justify-center rounded border-2 bg-stone-950/80',
          isOver && isValidDraggedItem
            ? 'border-sky-300 shadow-[0_0_12px_rgba(125,211,252,0.8)]'
            : isOver
              ? 'border-red-400'
              : 'border-stone-500',
        ].join(' ')}
        aria-label={`Teapot ingredient slot ${slotIndex + 1}`}
        onClick={() => {
          if (itemTypeId) {
            onReturnIngredient?.(slotIndex);
          }
        }}
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
      </button>
    </div>
  );
}

export type RenderingWorldPlazaTeaBrewingPopoverProps = {
  readonly ingredientSlots: readonly (string | null)[];
  readonly onClose: () => void;
  readonly onReturnIngredient: (slotIndex: number) => void;
};

export function RenderingWorldPlazaTeaBrewingPopover({
  ingredientSlots,
  onClose,
  onReturnIngredient,
}: RenderingWorldPlazaTeaBrewingPopoverProps): React.JSX.Element {
  if (typeof document === 'undefined') {
    return <></>;
  }

  return createPortal(
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
      className="pointer-events-auto fixed bottom-[calc(env(safe-area-inset-bottom,0px)+9.5rem)] left-1/2 z-[120] w-[min(92vw,16rem)] -translate-x-1/2 rounded-lg border border-sky-700/80 bg-stone-900/95 p-3 text-stone-100 shadow-lg"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold">{LABELING_WORLD_PLAZA_TEA_BREWING_OPEN}</span>
        <button
          type="button"
          className="rounded px-1 text-lg leading-none text-stone-300 hover:text-white"
          onClick={onClose}
          aria-label="Close teapot"
        >
          ×
        </button>
      </div>

      <div className="flex items-end justify-center gap-2">
        {Array.from(
          { length: DEFINING_WORLD_PLAZA_TEA_BREWING_SLOT_COUNT },
          (_, slotIndex) => (
            <RenderingWorldPlazaTeaBrewingSlot
              key={slotIndex}
              slotIndex={slotIndex}
              itemTypeId={ingredientSlots[slotIndex] ?? null}
              onReturnIngredient={onReturnIngredient}
            />
          )
        )}
      </div>

      <p className="mt-2 text-center text-[9px] text-stone-300">
        Drop flowers, berries, tea, or coffee. Click a slot to return it.
      </p>
    </div>,
    document.body
  );
}
