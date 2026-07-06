'use client';

import {
  DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX,
  DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX,
  resolvingPlazaTutorialIsoTileScreenOffset,
} from '@/components/home/domains/resolvingPlazaTutorialIsoTileScreenOffset';
import { DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS } from '@/components/ui/domains/definingReigncraftBadgeConstants';
import { resolvingReigncraftTutorialCapacityBadgeClassNames } from '@/components/ui/domains/resolvingReigncraftBadgeClassNames';
import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_LOCAL_PLAYER_FILL_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_REMOTE_PLAYER_FILL_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_SQUARE_PANEL_FILL_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_TREE_TILE_COLOR,
} from '@/components/world/domains/definingWorldPlazaMiniMapConstants';
import { DEFINING_WORLD_PLAZA_HUNGER_ICON_COUNT } from '@/components/world/hunger/domains/listingWorldPlazaHungerIconFillStates';
import {
  DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR,
  DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_FILL_COLOR,
} from '@/components/world/hunger/domains/resolvingWorldPlazaHungerIndicatorViewportStyles';
import { DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';

const PLAZA_TUTORIAL_ISO_SCENE_ORIGIN_GRID_X = 2;
const PLAZA_TUTORIAL_ISO_SCENE_ORIGIN_GRID_Y = 2;

type PlazaTutorialIsoTileVariant = 'grass' | 'claimed' | 'claimable' | 'path';

type RenderingPlazaTutorialIsoTileProps = {
  gridX: number;
  gridY: number;
  variant?: PlazaTutorialIsoTileVariant;
  className?: string;
  style?: CSSProperties;
};

function RenderingPlazaTutorialIsoTile({
  gridX,
  gridY,
  variant = 'grass',
  className,
  style,
}: RenderingPlazaTutorialIsoTileProps): React.JSX.Element {
  const offset = resolvingPlazaTutorialIsoTileScreenOffset(
    gridX,
    gridY,
    PLAZA_TUTORIAL_ISO_SCENE_ORIGIN_GRID_X,
    PLAZA_TUTORIAL_ISO_SCENE_ORIGIN_GRID_Y
  );

  const fillClassName =
    variant === 'claimed'
      ? 'bg-[linear-gradient(180deg,#d9a441_0%,#a67c28_100%)]'
      : variant === 'claimable'
        ? 'bg-[linear-gradient(180deg,#7cb86a_0%,#4f8f45_100%)]'
        : variant === 'path'
          ? 'bg-[linear-gradient(180deg,#8f9a72_0%,#6d7658_100%)]'
          : 'bg-[linear-gradient(180deg,#6f9a58_0%,#4f7440_100%)]';

  return (
    <div
      className={cn(
        'absolute [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)]',
        fillClassName,
        className
      )}
      style={{
        width: DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX,
        height: DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX,
        left: `calc(50% + ${offset.left}px - ${DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX / 2}px)`,
        top: `calc(50% + ${offset.top}px - ${DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX / 2}px)`,
        ...style,
      }}
    />
  );
}

type RenderingPlazaTutorialIsoSceneShellProps = {
  children: React.ReactNode;
  className?: string;
};

function RenderingPlazaTutorialIsoSceneShell({
  children,
  className,
}: RenderingPlazaTutorialIsoSceneShellProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'relative mx-auto h-36 w-full max-w-[15rem] overflow-hidden rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#2c4a52_0%,#1c333c_55%,#14252b_100%)] shadow-[inset_0_0_24px_rgba(0,0,0,0.35)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
      {children}
    </div>
  );
}

function RenderingPlazaTutorialIsoAvatar({
  gridX,
  gridY,
  className,
}: {
  gridX: number;
  gridY: number;
  className?: string;
}): React.JSX.Element {
  const offset = resolvingPlazaTutorialIsoTileScreenOffset(
    gridX,
    gridY,
    PLAZA_TUTORIAL_ISO_SCENE_ORIGIN_GRID_X,
    PLAZA_TUTORIAL_ISO_SCENE_ORIGIN_GRID_Y
  );

  return (
    <div
      className={cn(
        'absolute z-20 flex size-7 -translate-x-1/2 -translate-y-[calc(100%-4px)] items-center justify-center rounded-full border-2 border-parchment/80 bg-[linear-gradient(180deg,#c1592f_0%,#8f3a1c_100%)] shadow-[0_2px_6px_rgba(0,0,0,0.45)]',
        className
      )}
      style={{
        left: `calc(50% + ${offset.left}px)`,
        top: `calc(50% + ${offset.top}px)`,
      }}
    >
      <Icon
        icon="ph:person-simple-run"
        className="size-4 text-parchment"
        aria-hidden
      />
    </div>
  );
}

function resolvingPlazaTutorialIsoBlockStyle(
  gridX: number,
  gridY: number,
  worldLayer: number
): CSSProperties {
  const offset = resolvingPlazaTutorialIsoTileScreenOffset(
    gridX,
    gridY,
    PLAZA_TUTORIAL_ISO_SCENE_ORIGIN_GRID_X,
    PLAZA_TUTORIAL_ISO_SCENE_ORIGIN_GRID_Y
  );
  const layerLiftPx =
    (worldLayer - 1) * DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX;

  return {
    width: DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX,
    height: DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX,
    left: `calc(50% + ${offset.left}px - ${DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX / 2}px)`,
    top: `calc(50% + ${offset.top}px - ${DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX / 2}px - ${layerLiftPx}px)`,
  };
}

function RenderingPlazaTutorialIsoBlock({
  gridX,
  gridY,
  worldLayer,
  className,
}: {
  gridX: number;
  gridY: number;
  worldLayer: number;
  className?: string;
}): React.JSX.Element {
  return (
    <div
      className={cn(
        'absolute [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] bg-[linear-gradient(180deg,#8b5a2b_0%,#5c3a1c_100%)]',
        className
      )}
      style={resolvingPlazaTutorialIsoBlockStyle(gridX, gridY, worldLayer)}
    />
  );
}

function RenderingPlazaTutorialLayerBadge({
  gridX,
  gridY,
  worldLayer,
  label,
  className,
}: {
  gridX: number;
  gridY: number;
  worldLayer: number;
  label: string;
  className?: string;
}): React.JSX.Element {
  const offset = resolvingPlazaTutorialIsoTileScreenOffset(
    gridX,
    gridY,
    PLAZA_TUTORIAL_ISO_SCENE_ORIGIN_GRID_X,
    PLAZA_TUTORIAL_ISO_SCENE_ORIGIN_GRID_Y
  );
  const layerLiftPx =
    (worldLayer - 1) * DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX;

  return (
    <span
      className={cn(
        'absolute z-30 rounded border border-poster-gold/50 bg-ink/60 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-parchment',
        className
      )}
      style={{
        left: `calc(50% + ${offset.left}px + 14px)`,
        top: `calc(50% + ${offset.top}px - ${layerLiftPx + 18}px)`,
      }}
    >
      {label}
    </span>
  );
}

function RenderingPlazaTutorialKeyHint({
  label,
  isActive = false,
  className,
}: {
  label: string;
  isActive?: boolean;
  className?: string;
}): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex min-w-8 items-center justify-center rounded border px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition-colors duration-200',
        isActive
          ? 'border-poster-gold bg-poster-gold/25 text-parchment shadow-[0_0_10px_rgba(217,164,65,0.45)]'
          : 'border-parchment/25 bg-ink/35 text-parchment/70',
        className
      )}
    >
      {label}
    </span>
  );
}

function RenderingPlazaTutorialTouchHint({
  label,
  className,
}: {
  label: string;
  className?: string;
}): React.JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-poster-gold/40 bg-poster-teal/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-poster-teal-deep',
        className
      )}
    >
      <Icon icon="mdi:crosshairs-gps" className="size-3.5" aria-hidden />
      {label}
    </span>
  );
}

export type RenderingPlazaTutorialDemoProps = {
  isMobile?: boolean;
};

/** Animated click-to-walk demo with WASD or tap hints. */
export function RenderingPlazaTutorialMovementDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <RenderingPlazaTutorialIsoSceneShell>
        {[
          [0, 1],
          [1, 0],
          [1, 1],
          [1, 2],
          [2, 0],
          [2, 1],
          [2, 2],
          [2, 3],
          [3, 1],
          [3, 2],
          [3, 3],
          [4, 2],
        ].map(([gridX, gridY]) => (
          <RenderingPlazaTutorialIsoTile
            key={`${gridX}-${gridY}`}
            gridX={gridX}
            gridY={gridY}
            variant={
              gridX === 2 && gridY === 2
                ? 'path'
                : gridX === 3 && gridY === 3
                  ? 'path'
                  : 'grass'
            }
          />
        ))}

        <RenderingPlazaTutorialIsoTile
          gridX={3}
          gridY={3}
          className="plaza-tutorial-click-target z-10 opacity-90"
        />

        <span
          aria-hidden
          className="plaza-tutorial-click-cursor absolute z-30 text-parchment drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          style={{
            left: 'calc(50% + 22px)',
            top: 'calc(50% + 22px)',
          }}
        >
          <Icon icon="mdi:crosshairs-gps" className="size-5" />
        </span>

        <RenderingPlazaTutorialIsoAvatar
          gridX={2}
          gridY={2}
          className="plaza-tutorial-walk-avatar"
        />
      </RenderingPlazaTutorialIsoSceneShell>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Tap tile" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            to walk there
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <RenderingPlazaTutorialKeyHint
            label="W"
            className="plaza-tutorial-key-w"
          />
          <div className="flex gap-1">
            <RenderingPlazaTutorialKeyHint
              label="A"
              className="plaza-tutorial-key-a"
            />
            <RenderingPlazaTutorialKeyHint
              label="S"
              className="plaza-tutorial-key-s"
            />
            <RenderingPlazaTutorialKeyHint
              label="D"
              className="plaza-tutorial-key-d"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/** Run and jump demo with keyboard or touch highlights. */
export function RenderingPlazaTutorialRunJumpDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <RenderingPlazaTutorialIsoSceneShell>
        {[
          [1, 2],
          [2, 1],
          [2, 2],
          [2, 3],
          [3, 2],
          [3, 3],
          [4, 3],
        ].map(([gridX, gridY]) => (
          <RenderingPlazaTutorialIsoTile
            key={`${gridX}-${gridY}`}
            gridX={gridX}
            gridY={gridY}
          />
        ))}

        <RenderingPlazaTutorialIsoAvatar
          gridX={2}
          gridY={2}
          className="plaza-tutorial-run-jump-avatar"
        />

        <span
          aria-hidden
          className="plaza-tutorial-jump-arc pointer-events-none absolute z-30 size-3 rounded-full border border-poster-gold/70 bg-poster-gold/35"
          style={{
            left: 'calc(50% + 11px)',
            top: 'calc(50% + 11px)',
          }}
        />
      </RenderingPlazaTutorialIsoSceneShell>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Double tap" />
          <span
            aria-hidden
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-parchment shadow-lg"
          >
            <Icon icon="mdi:arrow-up-bold" className="size-4" />
          </span>
          <span className="text-[10px] font-medium italic text-ink-soft">
            jump button
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialKeyHint
            label="Shift"
            className="plaza-tutorial-key-shift"
          />
          <RenderingPlazaTutorialKeyHint
            label="Space"
            className="plaza-tutorial-key-space"
          />
          <span className="text-[10px] font-medium italic text-ink-soft">
            or double-click to run
          </span>
        </div>
      )}
    </div>
  );
}

/** Stamina bar drain and recovery demo for sprinting. */
export function RenderingPlazaTutorialSprintStaminaDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-[15rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex w-fit flex-col items-center gap-2">
          <div className="flex w-28 flex-col gap-1">
            <div className="relative h-1 overflow-hidden rounded-[2px] border border-black/90 bg-[#0d1117] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]">
              <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(180deg,#c43b3b_0%,#8f1010_100%)]" />
            </div>

            <div className="relative h-1 overflow-hidden rounded-[2px] border border-black/90 bg-[#0d1117] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]">
              <div className="plaza-tutorial-stamina-fill absolute inset-y-0 left-0 bg-[linear-gradient(90deg,#d9a441_0%,#f4d35e_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
            </div>
          </div>

          <div className="plaza-tutorial-sprint-avatar flex size-12 items-center justify-center rounded-full border-2 border-parchment/80 bg-[linear-gradient(180deg,#c1592f_0%,#8f3a1c_100%)] shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
            <Icon
              icon="mdi:run-fast"
              className="size-6 text-parchment"
              aria-hidden
            />
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Double tap" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            to sprint — stamina drains while you run
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialKeyHint
            label="Shift"
            className="plaza-tutorial-key-shift"
          />
          <span className="text-[10px] font-medium italic text-ink-soft">
            to sprint — stamina drains while you run
          </span>
        </div>
      )}
    </div>
  );
}

/** Layer stack demo showing ground and rising block heights. */
export function RenderingPlazaTutorialWorldLayersDemo(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <RenderingPlazaTutorialIsoSceneShell>
        {[
          [2, 2],
          [3, 2],
          [4, 2],
        ].map(([gridX, gridY]) => (
          <RenderingPlazaTutorialIsoTile
            key={`ground-${gridX}-${gridY}`}
            gridX={gridX}
            gridY={gridY}
          />
        ))}

        {[2, 3, 4, 5].map((worldLayer) => (
          <RenderingPlazaTutorialIsoBlock
            key={`stack-${worldLayer}`}
            gridX={3}
            gridY={2}
            worldLayer={worldLayer}
            className="z-10"
          />
        ))}

        <RenderingPlazaTutorialLayerBadge
          gridX={2}
          gridY={2}
          worldLayer={1}
          label="L1"
        />
        {[2, 3, 4, 5].map((worldLayer) => (
          <RenderingPlazaTutorialLayerBadge
            key={`layer-badge-${worldLayer}`}
            gridX={3}
            gridY={2}
            worldLayer={worldLayer}
            label={`L${worldLayer}`}
          />
        ))}

        <RenderingPlazaTutorialIsoAvatar gridX={2} gridY={2} />
      </RenderingPlazaTutorialIsoSceneShell>

      <p className="text-center text-xs font-medium text-ink-soft">
        Ground is layer 1. Each block you place adds another layer on that tile.
      </p>
    </div>
  );
}

/** Walk-step and jump-up block climbing demo. */
export function RenderingPlazaTutorialClimbBlocksDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <RenderingPlazaTutorialIsoSceneShell>
        {[
          [2, 2],
          [3, 2],
          [4, 2],
        ].map(([gridX, gridY]) => (
          <RenderingPlazaTutorialIsoTile
            key={`path-${gridX}-${gridY}`}
            gridX={gridX}
            gridY={gridY}
            variant="path"
          />
        ))}

        <RenderingPlazaTutorialIsoBlock
          gridX={3}
          gridY={2}
          worldLayer={2}
          className="z-10"
        />

        {[2, 3, 4, 5].map((worldLayer) => (
          <RenderingPlazaTutorialIsoBlock
            key={`tower-${worldLayer}`}
            gridX={4}
            gridY={2}
            worldLayer={worldLayer}
            className="z-10"
          />
        ))}

        <RenderingPlazaTutorialLayerBadge
          gridX={3}
          gridY={2}
          worldLayer={2}
          label="Walk +1"
        />
        <RenderingPlazaTutorialLayerBadge
          gridX={4}
          gridY={2}
          worldLayer={5}
          label="Jump +4"
        />

        <RenderingPlazaTutorialIsoAvatar
          gridX={2}
          gridY={2}
          className="plaza-tutorial-climb-avatar"
        />

        <span
          aria-hidden
          className="plaza-tutorial-climb-jump-arc pointer-events-none absolute z-30 size-3 rounded-full border border-poster-gold/70 bg-poster-gold/35"
          style={{
            left: 'calc(50% + 22px)',
            top: 'calc(50% + 11px)',
          }}
        />
      </RenderingPlazaTutorialIsoSceneShell>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Walk steps" />
          <span
            aria-hidden
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-parchment shadow-lg"
          >
            <Icon icon="mdi:arrow-up-bold" className="size-4" />
          </span>
          <span className="text-[10px] font-medium italic text-ink-soft">
            to jump ledges
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[10px] font-medium italic text-ink-soft">
            Walk single steps, then press
          </span>
          <RenderingPlazaTutorialKeyHint
            label="Space"
            className="plaza-tutorial-key-space"
          />
          <span className="text-[10px] font-medium italic text-ink-soft">
            to jump higher ledges
          </span>
        </div>
      )}
    </div>
  );
}

/** Claim-mode demo with a tile pulsing then turning gold. */
export function RenderingPlazaTutorialClaimDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <RenderingPlazaTutorialIsoSceneShell>
        {[
          [1, 2],
          [2, 1],
          [2, 2],
          [2, 3],
          [3, 2],
        ].map(([gridX, gridY]) => (
          <RenderingPlazaTutorialIsoTile
            key={`owned-${gridX}-${gridY}`}
            gridX={gridX}
            gridY={gridY}
            variant="claimed"
          />
        ))}

        <RenderingPlazaTutorialIsoTile
          gridX={3}
          gridY={3}
          variant="claimable"
          className="plaza-tutorial-claimable-tile z-10"
        />

        <RenderingPlazaTutorialIsoTile
          gridX={3}
          gridY={3}
          variant="claimed"
          className="plaza-tutorial-claimed-tile z-20 opacity-0"
        />

        <RenderingPlazaTutorialIsoAvatar gridX={2} gridY={2} />

        <span className="absolute right-2 top-2 z-30 rounded border border-poster-gold/50 bg-ink/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-parchment">
          {isMobile ? 'Claim' : 'Claim (C)'}
        </span>
      </RenderingPlazaTutorialIsoSceneShell>

      <p className="text-center text-xs font-medium text-ink-soft">
        {isMobile
          ? 'Tap a highlighted tile next to your land to expand your realm.'
          : 'Click a highlighted tile next to your land to expand your plot.'}
      </p>
    </div>
  );
}

/** Plot capacity badges above the claim tile demo. */
export function RenderingPlazaTutorialPlotsAndClaimsDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  const plotPreset = DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS.plotCapacity;
  const tilePreset = DEFINING_REIGNCRAFT_BADGE_SEMANTIC_PRESETS.tileCapacity;
  const plotBadge =
    resolvingReigncraftTutorialCapacityBadgeClassNames(plotPreset);
  const tileBadge =
    resolvingReigncraftTutorialCapacityBadgeClassNames(tilePreset);

  return (
    <div className="flex flex-col gap-3">
      <div className="mx-auto flex w-full max-w-[15rem] gap-1">
        <div className={plotBadge.shellClassName}>
          <span className={plotBadge.labelClassName}>Plots</span>
          <span className={plotBadge.valueClassName}>
            1<span className={plotBadge.maxValueClassName}>/3</span>
          </span>
        </div>
        <div className={tileBadge.shellClassName}>
          <span className={tileBadge.labelClassName}>Tiles</span>
          <span className={tileBadge.valueClassName}>
            8<span className={tileBadge.maxValueClassName}>/24</span>
          </span>
        </div>
      </div>

      <RenderingPlazaTutorialClaimDemo isMobile={isMobile} />
    </div>
  );
}

/** Save-coords popover demo with double-tap hint. */
export function RenderingPlazaTutorialSaveCoordsDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <RenderingPlazaTutorialIsoSceneShell>
        {[
          [1, 2],
          [2, 1],
          [2, 2],
          [2, 3],
          [3, 2],
        ].map(([gridX, gridY]) => (
          <RenderingPlazaTutorialIsoTile
            key={`save-${gridX}-${gridY}`}
            gridX={gridX}
            gridY={gridY}
            variant="claimed"
          />
        ))}

        <RenderingPlazaTutorialIsoAvatar
          gridX={2}
          gridY={2}
          className="plaza-tutorial-save-coords-avatar"
        />

        <div
          className="plaza-tutorial-save-coords-popover absolute z-30 rounded border border-white/15 bg-black/80 px-2 py-1 shadow-lg"
          style={{
            left: 'calc(50% + 11px)',
            top: 'calc(50% - 18px)',
          }}
        >
          <span className="text-[9px] font-bold uppercase tracking-wide text-[#f4d35e]">
            Save Coords
          </span>
        </div>
      </RenderingPlazaTutorialIsoSceneShell>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Double-tap tile" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            while standing on it (max 3)
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-[10px] font-medium italic text-ink-soft">
            Double-click the tile under your feet (max 3 saved)
          </span>
        </div>
      )}
    </div>
  );
}

/** Track button and direction arrow demo. */
export function RenderingPlazaTutorialTrackCoordsDemo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <RenderingPlazaTutorialIsoSceneShell>
        {[
          [1, 2],
          [2, 1],
          [2, 2],
          [2, 3],
          [3, 2],
          [4, 3],
        ].map(([gridX, gridY]) => (
          <RenderingPlazaTutorialIsoTile
            key={`track-${gridX}-${gridY}`}
            gridX={gridX}
            gridY={gridY}
            variant={gridX === 4 && gridY === 3 ? 'path' : 'claimed'}
          />
        ))}

        <RenderingPlazaTutorialIsoAvatar gridX={2} gridY={2} />

        <span
          aria-hidden
          className="plaza-tutorial-track-star absolute z-20 text-[#f4d35e] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
          style={{
            left: 'calc(50% + 33px)',
            top: 'calc(50% + 11px)',
          }}
        >
          <Icon icon="mdi:star-four-points" className="size-4" />
        </span>

        <span
          aria-hidden
          className="plaza-tutorial-track-arrow pointer-events-none absolute z-30 text-[#f4d35e]"
          style={{
            left: 'calc(50% + 11px)',
            top: 'calc(50% + 11px)',
          }}
        >
          <Icon icon="mdi:arrow-up-bold" className="size-5" />
        </span>
      </RenderingPlazaTutorialIsoSceneShell>

      <div className="flex w-full max-w-[15rem] items-center gap-1">
        <span className="flex flex-1 items-center justify-center rounded-sm border border-[#f4d35e]/35 bg-[#f4d35e]/12 px-1 py-1 font-mono text-[9px] font-medium tabular-nums text-[#f4d35e]">
          42, 18
        </span>
        <span className="rounded-sm border border-[#f4d35e]/70 bg-[#f4d35e]/25 px-2 py-1 text-[8px] font-semibold uppercase text-[#fff3bf]">
          Track
        </span>
      </div>

      <p className="text-center text-xs font-medium text-ink-soft">
        Track from the Saved Coords list in Claim mode. The arrow points toward
        the starred tile.
      </p>
    </div>
  );
}

/** Teleport-to-plot button and screen fade demo. */
export function RenderingPlazaTutorialTeleportPlotsDemo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-[15rem] overflow-hidden rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-3 py-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-1">
          <span className="flex flex-1 items-center justify-center truncate rounded-sm border border-[#f4d35e]/35 bg-[#f4d35e]/12 px-1 py-1 font-mono text-[9px] font-medium tabular-nums text-[#f4d35e]">
            12, 8 · 16, 14
          </span>
          <button
            type="button"
            className="plaza-tutorial-teleport-button shrink-0 rounded-sm border border-sky-400/50 bg-sky-950/60 px-1.5 py-1 text-[8px] font-semibold uppercase tracking-wide text-sky-200"
            aria-hidden
          >
            Teleport to Plot
          </button>
        </div>

        <div
          aria-hidden
          className="plaza-tutorial-teleport-fade pointer-events-none absolute inset-0 bg-black"
        />
      </div>

      <p className="text-center text-xs font-medium text-ink-soft">
        Jump to any of your plot regions from the Claim list. Friend visits work
        the same once approved.
      </p>
    </div>
  );
}

/** Build-mode demo with a rising block column. */
export function RenderingPlazaTutorialBuildDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <RenderingPlazaTutorialIsoSceneShell>
        {[
          [1, 2],
          [2, 1],
          [2, 2],
          [2, 3],
          [3, 2],
        ].map(([gridX, gridY]) => (
          <RenderingPlazaTutorialIsoTile
            key={`plot-${gridX}-${gridY}`}
            gridX={gridX}
            gridY={gridY}
            variant="claimed"
          />
        ))}

        <RenderingPlazaTutorialIsoTile
          gridX={3}
          gridY={2}
          variant="claimed"
          className="z-10"
        />

        <div
          className="plaza-tutorial-block-rise absolute z-20 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] bg-[linear-gradient(180deg,#8b5a2b_0%,#5c3a1c_100%)]"
          style={{
            width: DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX,
            height: DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX,
            left: 'calc(50% + 11px - 22px)',
            top: 'calc(50% + 11px - 11px)',
          }}
        />

        <div
          aria-hidden
          className="plaza-tutorial-block-rise-top absolute z-30 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] bg-[linear-gradient(180deg,#a8733f_0%,#7a5228_100%)]"
          style={{
            width: DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX,
            height: DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX,
            left: 'calc(50% + 11px - 22px)',
            top: 'calc(50% + 11px - 11px)',
          }}
        />

        <RenderingPlazaTutorialIsoAvatar gridX={2} gridY={2} />

        <span className="absolute right-2 top-2 z-30 flex items-center gap-1 rounded border border-poster-gold/50 bg-ink/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-parchment">
          <Icon icon="mdi:hammer" className="size-3" aria-hidden />
          {isMobile ? 'Build' : 'Build (B)'}
        </span>
      </RenderingPlazaTutorialIsoSceneShell>

      <p className="text-center text-xs font-medium text-ink-soft">
        {isMobile
          ? 'Tap tiles you own to place blocks and shape your territory.'
          : 'Place blocks on tiles you own to shape your territory.'}
      </p>
    </div>
  );
}

/** Health bar and combat float demo. */
export function RenderingPlazaTutorialHealthDemo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-[15rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex w-fit flex-col items-center gap-2">
          <div className="relative h-2.5 w-28 overflow-hidden rounded-[2px] border border-black/90 bg-[#0d1117] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset]">
            <div className="plaza-tutorial-health-fill absolute inset-y-0 left-0 bg-[linear-gradient(180deg,#c43b3b_0%,#8f1010_100%)] shadow-[inset_0_1px_0_rgba(255,120,120,0.35)]" />
          </div>

          <span
            aria-hidden
            className="plaza-tutorial-damage-float plaza-combat-float-damage pointer-events-none absolute -top-1 text-sm font-bold text-[#ff6b6b]"
          >
            -12
          </span>

          <div className="flex size-12 items-center justify-center rounded-full border-2 border-parchment/80 bg-[linear-gradient(180deg,#c1592f_0%,#8f3a1c_100%)] shadow-[0_2px_6px_rgba(0,0,0,0.45)]">
            <Icon
              icon="ph:person-simple-run"
              className="size-6 text-parchment"
              aria-hidden
            />
          </div>
        </div>
      </div>

      <p className="text-center text-xs font-medium text-ink-soft">
        Watch your health bar — hazards and combat drain it over time.
      </p>
    </div>
  );
}

const PLAZA_TUTORIAL_HUNGER_DEMO_ICON_SIZE_PX = 14;

type RenderingPlazaTutorialHungerDrumstickProps = {
  color: string;
};

function RenderingPlazaTutorialHungerDrumstick({
  color,
}: RenderingPlazaTutorialHungerDrumstickProps): React.JSX.Element {
  return (
    <Icon
      icon="mdi:food-drumstick"
      aria-hidden
      className="shrink-0"
      style={{
        color,
        filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.65))',
      }}
      width={PLAZA_TUTORIAL_HUNGER_DEMO_ICON_SIZE_PX}
      height={PLAZA_TUTORIAL_HUNGER_DEMO_ICON_SIZE_PX}
    />
  );
}

/** Hunger drumstick row and hotbar eat demo. */
export function RenderingPlazaTutorialHungerDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-[15rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex w-fit flex-col items-center gap-3">
          <div className="relative flex gap-px">
            <div className="flex gap-px" aria-hidden>
              {Array.from({
                length: DEFINING_WORLD_PLAZA_HUNGER_ICON_COUNT,
              }).map((_, iconIndex) => (
                <RenderingPlazaTutorialHungerDrumstick
                  key={`empty-${iconIndex}`}
                  color={DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR}
                />
              ))}
            </div>
            <div
              className="plaza-tutorial-hunger-fill-mask absolute inset-y-0 left-0 flex gap-px overflow-hidden"
              aria-hidden
            >
              {Array.from({
                length: DEFINING_WORLD_PLAZA_HUNGER_ICON_COUNT,
              }).map((_, iconIndex) => (
                <RenderingPlazaTutorialHungerDrumstick
                  key={`filled-${iconIndex}`}
                  color={DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_FILL_COLOR}
                />
              ))}
            </div>
          </div>

          <div
            className={cn(
              'plaza-tutorial-eat-slot flex size-11 items-center justify-center rounded border-2 border-poster-gold/45 bg-[linear-gradient(180deg,#2c4a52_0%,#1c333c_100%)] text-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.35)]',
              isMobile
                ? 'plaza-tutorial-eat-slot-tap'
                : 'plaza-tutorial-eat-slot-click'
            )}
            aria-hidden
          >
            🫐
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Double-tap food" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            to restore hunger
          </span>
        </div>
      ) : (
        <p className="text-center text-xs font-medium text-ink-soft">
          Double-click food in your hotbar to restore hunger.
        </p>
      )}
    </div>
  );
}

const PLAZA_TUTORIAL_MINI_MAP_DEMO_TILES = [
  '#3d5c34',
  '#3d5c34',
  '#2d4a22',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#4a6d42',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#d9a441',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
  '#3d5c34',
] as const;

const PLAZA_TUTORIAL_INVENTORY_DEMO_SLOTS = [
  { kind: 'icon' as const, icon: 'game-icons:wood-axe' as const },
  { kind: 'emoji' as const, label: '🪵' },
  { kind: 'emoji' as const, label: '🫐' },
  { kind: 'emoji' as const, label: '🪨' },
  { kind: 'emoji' as const, label: '🍖' },
];

type RenderingPlazaTutorialStatusEffectDemoRow = {
  icon: string;
  value: string;
  borderClassName: string;
  iconClassName: string;
};

const PLAZA_TUTORIAL_STATUS_EFFECT_DEMO_ROWS: RenderingPlazaTutorialStatusEffectDemoRow[] =
  [
    {
      icon: 'game-icons:drop',
      value: '18',
      borderClassName: 'border-red-500/60 bg-red-950/85',
      iconClassName: 'text-red-300',
    },
    {
      icon: 'mdi:biohazard',
      value: '12',
      borderClassName: 'border-lime-500/60 bg-lime-950/85',
      iconClassName: 'text-lime-300',
    },
    {
      icon: 'mdi:shield-plus',
      value: '24',
      borderClassName: 'border-sky-400/60 bg-sky-950/85',
      iconClassName: 'text-sky-200',
    },
  ];

function RenderingPlazaTutorialStatusEffectDemoBadge({
  row,
}: {
  row: RenderingPlazaTutorialStatusEffectDemoRow;
}): React.JSX.Element {
  return (
    <div
      className={`plaza-status-effect-badge flex items-center gap-1 border py-0 pl-0.5 pr-1 ${row.borderClassName}`}
      aria-hidden
    >
      <span className="plaza-status-effect-badge-socket flex size-3.5 items-center justify-center rounded-[2px]">
        <Icon
          icon={row.icon}
          className={`size-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${row.iconClassName}`}
          aria-hidden
        />
      </span>
      <span className="min-w-5 font-mono text-[11px] font-semibold tabular-nums text-parchment">
        {row.value}
      </span>
    </div>
  );
}

/** Mini map terrain, player dots, and claim markers demo. */
export function RenderingPlazaTutorialMiniMapDemo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative size-32 overflow-hidden rounded-md border border-poster-teal/35 shadow-[inset_0_0_16px_rgba(0,0,0,0.35)]"
        style={{
          backgroundColor:
            DEFINING_WORLD_PLAZA_MINI_MAP_SQUARE_PANEL_FILL_COLOR,
        }}
      >
        <div className="grid size-full grid-cols-7 grid-rows-7 gap-px p-1.5">
          {PLAZA_TUTORIAL_MINI_MAP_DEMO_TILES.map((fillColor, tileIndex) => (
            <div
              key={tileIndex}
              className="rounded-[1px]"
              style={{ backgroundColor: fillColor }}
            />
          ))}
        </div>

        <span
          className="absolute left-1/2 top-1.5 -translate-x-1/2 text-[9px] font-semibold tracking-wide"
          style={{
            color: DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_COLOR,
            textShadow: '0 1px 2px rgba(0,0,0,0.88)',
          }}
        >
          Grasslands
        </span>

        <span
          className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] font-semibold tabular-nums"
          style={{
            color: DEFINING_WORLD_PLAZA_MINI_MAP_LABEL_TEXT_COLOR,
            textShadow: '0 1px 2px rgba(0,0,0,0.88)',
          }}
        >
          42, 18
        </span>

        <span
          className="plaza-tutorial-minimap-local-dot absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1b263b]"
          style={{
            backgroundColor:
              DEFINING_WORLD_PLAZA_MINI_MAP_LOCAL_PLAYER_FILL_COLOR,
          }}
          aria-hidden
        />

        <span
          className="absolute left-[62%] top-[38%] size-1.5 rounded-full border border-[#1e3a8a]"
          style={{
            backgroundColor:
              DEFINING_WORLD_PLAZA_MINI_MAP_REMOTE_PLAYER_FILL_COLOR,
          }}
          aria-hidden
        />

        <span
          className="absolute left-[46%] top-[42%] size-2 rounded-[1px] border border-dashed border-poster-gold/80 bg-poster-gold/35"
          aria-hidden
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-medium text-ink-soft">
        <span className="inline-flex items-center gap-1">
          <span
            className="size-2 rounded-full border border-[#1b263b]"
            style={{
              backgroundColor:
                DEFINING_WORLD_PLAZA_MINI_MAP_LOCAL_PLAYER_FILL_COLOR,
            }}
            aria-hidden
          />
          You
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="size-1.5 rounded-full border border-[#1e3a8a]"
            style={{
              backgroundColor:
                DEFINING_WORLD_PLAZA_MINI_MAP_REMOTE_PLAYER_FILL_COLOR,
            }}
            aria-hidden
          />
          Players
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="size-2 rounded-[1px] border border-dashed border-poster-gold/80 bg-poster-gold/35"
            aria-hidden
          />
          Your land
        </span>
        <span className="inline-flex items-center gap-1">
          <span
            className="size-2 rounded-[1px]"
            style={{
              backgroundColor: DEFINING_WORLD_PLAZA_MINI_MAP_TREE_TILE_COLOR,
            }}
            aria-hidden
          />
          Trees
        </span>
      </div>
    </div>
  );
}

/** Hotbar slots, equip highlight, and drag affordances demo. */
export function RenderingPlazaTutorialInventoryDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="rounded-md border-2 border-[#5c3a1c] bg-[linear-gradient(180deg,#8b5a2b_0%,#6d4422_100%)] p-1.5 shadow-[0_3px_0_0_#3a2818]">
        <div className="flex gap-1">
          {PLAZA_TUTORIAL_INVENTORY_DEMO_SLOTS.map((slot, slotIndex) => (
            <div
              key={slotIndex}
              className={cn(
                'flex size-11 items-center justify-center rounded border-2 bg-[linear-gradient(180deg,#f5ead6_0%,#e8d7b8_100%)] text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]',
                slotIndex === 0
                  ? 'plaza-tutorial-inventory-equipped-slot border-poster-gold'
                  : 'border-[#8b6914]/70'
              )}
              aria-hidden
            >
              {slot.kind === 'icon' ? (
                <Icon icon={slot.icon} className="size-5 text-[#5c3a1c]" />
              ) : (
                slot.label
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs font-medium text-ink-soft">
        {isMobile
          ? `Tap a slot to equip tools. Drag to rearrange your ${DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY} hotbar slots or drop items on the ground.`
          : `Click a slot to equip tools. Drag to rearrange your ${DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY} hotbar slots or drop items on the ground.`}
      </p>
    </div>
  );
}

/** Top-right status effect badge stack demo. */
export function RenderingPlazaTutorialStatusEffectsDemo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[15rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="ml-auto flex w-fit flex-col items-end gap-1">
          {PLAZA_TUTORIAL_STATUS_EFFECT_DEMO_ROWS.map((row) => (
            <RenderingPlazaTutorialStatusEffectDemoBadge
              key={row.icon}
              row={row}
            />
          ))}
        </div>
      </div>

      <p className="text-center text-xs font-medium text-ink-soft">
        Watch the top-right stack for damage-over-time, shields, and timed
        buffs.
      </p>
    </div>
  );
}

type PlazaTutorialBiomeDemoStrip = {
  label: string;
  groundColor: string;
  skyClassName: string;
  highlightClassName: string;
};

const PLAZA_TUTORIAL_BIOME_DEMO_STRIPS: PlazaTutorialBiomeDemoStrip[] = [
  {
    label: 'Plains',
    groundColor: '#7cba3d',
    skyClassName: 'bg-gradient-to-b from-sky-400 to-[#7cba3d]',
    highlightClassName: 'plaza-tutorial-biome-highlight-0',
  },
  {
    label: 'Forest',
    groundColor: '#4a7c3f',
    skyClassName: 'bg-gradient-to-b from-sky-500 to-[#4a7c3f]',
    highlightClassName: 'plaza-tutorial-biome-highlight-1',
  },
  {
    label: 'Desert',
    groundColor: '#dbc083',
    skyClassName: 'bg-gradient-to-b from-sky-300 to-[#dbc083]',
    highlightClassName: 'plaza-tutorial-biome-highlight-2',
  },
  {
    label: 'Snow',
    groundColor: '#e8f0f4',
    skyClassName: 'bg-gradient-to-b from-slate-300 to-[#e8f0f4]',
    highlightClassName: 'plaza-tutorial-biome-highlight-3',
  },
  {
    label: 'Fire',
    groundColor: '#3a2420',
    skyClassName: 'bg-gradient-to-b from-red-950 to-[#3a2420]',
    highlightClassName: 'plaza-tutorial-biome-highlight-4',
  },
];

/** Biome strip demo cycling through region types. */
export function RenderingPlazaTutorialBiomesDemo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[15rem] overflow-hidden rounded-md border border-poster-teal/25 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="flex h-28">
          {PLAZA_TUTORIAL_BIOME_DEMO_STRIPS.map((strip) => (
            <div
              key={strip.label}
              className={cn(
                'relative flex min-w-0 flex-1 flex-col overflow-hidden border-r border-black/20 last:border-r-0',
                strip.skyClassName,
                strip.highlightClassName
              )}
            >
              <div
                className="mt-auto h-8 border-t border-black/15"
                style={{ backgroundColor: strip.groundColor }}
                aria-hidden
              />
              <span className="absolute inset-x-0 bottom-1 text-center text-[7px] font-bold uppercase tracking-wide text-ink/80 drop-shadow-[0_1px_1px_rgba(255,255,255,0.45)]">
                {strip.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs font-medium text-ink-soft">
        Biomes blend across the map. Trees, water, and music change as you cross
        each border.
      </p>
    </div>
  );
}

/** Minimap temperature readout and scorch/frost badge demo. */
export function RenderingPlazaTutorialTemperatureDemo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[15rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#f5ead6_0%,#e8d7b8_100%)] p-2 shadow-[inset_0_0_16px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between border-b border-[#8b6914]/25 px-1.5 py-1 font-mono text-[11px] font-semibold tabular-nums">
          <time className="text-ink">2:14 PM</time>
          <div className="relative h-4 w-10">
            <span className="plaza-tutorial-temp-comfort absolute inset-0 text-right text-ink">
              22°C
            </span>
            <span className="plaza-tutorial-temp-heat absolute inset-0 text-right text-poster-orange-deep">
              62°C
            </span>
            <span className="plaza-tutorial-temp-cold absolute inset-0 text-right text-poster-teal">
              -12°C
            </span>
          </div>
        </div>

        <div className="relative mt-1.5">
          <div
            className="grid size-20 grid-cols-4 grid-rows-4 gap-px rounded-sm border border-[#8b6914]/20 p-1"
            style={{
              backgroundColor:
                DEFINING_WORLD_PLAZA_MINI_MAP_SQUARE_PANEL_FILL_COLOR,
            }}
            aria-hidden
          >
            {Array.from({ length: 16 }).map((_, tileIndex) => (
              <div key={tileIndex} className="rounded-[1px] bg-[#3d5c34]" />
            ))}
          </div>
          <span
            className="plaza-tutorial-minimap-local-dot absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#1b263b]"
            style={{
              backgroundColor:
                DEFINING_WORLD_PLAZA_MINI_MAP_LOCAL_PLAYER_FILL_COLOR,
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <div
          className="plaza-tutorial-temp-scorch-badge plaza-status-effect-badge flex items-center gap-1 border border-amber-500/60 bg-amber-950/85 py-0 pl-0.5 pr-1"
          aria-hidden
        >
          <span className="plaza-status-effect-badge-socket flex size-3.5 items-center justify-center rounded-[2px]">
            <Icon
              icon="solar:fire-bold"
              className="size-3 text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
              aria-hidden
            />
          </span>
          <span className="min-w-5 font-mono text-[11px] font-semibold tabular-nums text-parchment">
            3/s
          </span>
        </div>

        <div
          className="plaza-tutorial-temp-frost-badge plaza-status-effect-badge flex items-center gap-1 border border-sky-400/60 bg-sky-950/85 py-0 pl-0.5 pr-1"
          aria-hidden
        >
          <span className="plaza-status-effect-badge-socket flex size-3.5 items-center justify-center rounded-[2px]">
            <Icon
              icon="mdi:snowflake"
              className="size-3 text-sky-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
              aria-hidden
            />
          </span>
          <span className="min-w-5 font-mono text-[11px] font-semibold tabular-nums text-parchment">
            2/s
          </span>
        </div>
      </div>

      <p className="text-center text-xs font-medium text-ink-soft">
        Safe between about -10°C and 50°C. A fire or snowflake badge appears
        when heat or frost damage starts ticking.
      </p>
    </div>
  );
}
