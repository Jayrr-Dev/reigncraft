'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { cn } from '@/lib/utils';

/** Props for {@link RenderingWorldPlazaCampfireInteractionPanel}. */
export type RenderingWorldPlazaCampfireInteractionPanelProps = {
  readonly block: DefiningWorldBuildingPlacedBlock;
  readonly isLit: boolean;
  readonly onIgnite: () => void;
  readonly onAddFuel: () => void;
  readonly onClose: () => void;
};

/**
 * Small HUD panel for lighting or refueling an interactive campfire block.
 */
export function RenderingWorldPlazaCampfireInteractionPanel({
  block,
  isLit,
  onIgnite,
  onAddFuel,
  onClose,
}: RenderingWorldPlazaCampfireInteractionPanelProps): React.JSX.Element {
  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className={cn(
        'pointer-events-auto absolute bottom-28 left-1/2 z-20 -translate-x-1/2',
        'rounded-xl border border-white/15 bg-black/70 px-4 py-3 text-white shadow-lg backdrop-blur-sm',
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Icon icon="solar:fire-bold" className="size-4 text-orange-300" />
        <span>Campfire</span>
        <span className="text-white/60">
          ({block.tilePosition.tileX}, {block.tilePosition.tileY})
        </span>
      </div>
      <div className="flex items-center gap-2">
        {isLit ? (
          <button
            type="button"
            className="rounded-lg bg-orange-600/90 px-3 py-1.5 text-sm hover:bg-orange-500"
            onClick={onAddFuel}
          >
            Add wood
          </button>
        ) : (
          <button
            type="button"
            className="rounded-lg bg-orange-600/90 px-3 py-1.5 text-sm hover:bg-orange-500"
            onClick={onIgnite}
          >
            Light (1 wood)
          </button>
        )}
        <button
          type="button"
          className="rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
