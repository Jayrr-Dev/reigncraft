'use client';

import {
  DEFINING_PLAZA_BUTTON_SFX_KIND,
  definingPlazaButtonSfxDataAttributes,
} from '@/components/home/domains/definingPlazaDefaultButtonSfxConstants';
import {
  DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX,
  DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX,
  resolvingPlazaTutorialIsoTileScreenOffset,
} from '@/components/home/domains/resolvingPlazaTutorialIsoTileScreenOffset';
import { Badge } from '@/components/ui/badge';
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
import {
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_BADGE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_ROW_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_LABEL,
} from '@/components/world/domains/definingWorldPlazaSavedCoordsListUiConstants';
import { RenderingWorldPlazaEntityDiseaseIconGlyph } from '@/components/world/health/components/renderingWorldPlazaEntityDiseaseIconGlyph';
import type { DefiningWorldPlazaEntityDiseaseId } from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import {
  DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR,
  DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_FILL_COLOR,
} from '@/components/world/hunger/domains/resolvingWorldPlazaHungerIndicatorViewportStyles';
import { resolvingWorldPlazaHungerTierSpriteIconStyle } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerTierSpriteIconStyle';
import { DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
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
      ? 'bg-[linear-gradient(180deg,#fb923c_0%,#ea580c_100%)]'
      : variant === 'claimable'
        ? 'bg-[linear-gradient(180deg,#7dd3fc_0%,#38bdf8_100%)]'
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
          <RenderingPlazaTutorialTouchHint label="Hold" />
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
            or hold / double-click to run
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
          <RenderingPlazaTutorialTouchHint label="Hold" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            to sprint: stamina drains while you run
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialKeyHint
            label="Shift"
            className="plaza-tutorial-key-shift"
          />
          <span className="text-[10px] font-medium italic text-ink-soft">
            to sprint: stamina drains while you run
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

/** Roll dodge demo with dodge direction and input hints. */
export function RenderingPlazaTutorialRollDodgeDemo({
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
          className="plaza-tutorial-roll-dodge-avatar"
        />

        <span
          aria-hidden
          className="plaza-tutorial-roll-dodge-shield pointer-events-none absolute z-30 flex size-9 -translate-x-1/2 -translate-y-[calc(100%-4px)] items-center justify-center rounded-full border border-sky-300/70 bg-sky-400/20 shadow-[0_0_12px_rgba(125,211,252,0.45)]"
          style={{
            left: 'calc(50% + 11px)',
            top: 'calc(50% + 11px)',
          }}
        >
          <Icon icon="mdi:shield-half-full" className="size-4 text-sky-100" />
        </span>
      </RenderingPlazaTutorialIsoSceneShell>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span
            aria-hidden
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-parchment shadow-lg"
          >
            <Icon icon="ph:person-simple-run" className="size-4" />
          </span>
          <span className="text-[10px] font-medium italic text-ink-soft">
            roll button
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialKeyHint
            label="R"
            className="plaza-tutorial-key-r"
          />
          <span className="text-[10px] font-medium italic text-ink-soft">
            to dodge physical hits
          </span>
        </div>
      )}
    </div>
  );
}

/** Melee attack demo with click-to-strike hints. */
export function RenderingPlazaTutorialMeleeAttackDemo({
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
            key={`${gridX}-${gridY}`}
            gridX={gridX}
            gridY={gridY}
          />
        ))}

        <RenderingPlazaTutorialIsoAvatar gridX={2} gridY={2} />

        <div
          className="plaza-tutorial-melee-target absolute z-20 flex size-8 -translate-x-1/2 -translate-y-[calc(100%-4px)] items-center justify-center rounded-full border-2 border-[#6b4f2a]/80 bg-[linear-gradient(180deg,#8b6b3f_0%,#5c4224_100%)] shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
          style={{
            left: 'calc(50% + 22px)',
            top: 'calc(50% + 11px)',
          }}
        >
          <Icon
            icon="boxicons:target"
            className="size-4 text-parchment"
            aria-hidden
          />
        </div>

        <span
          aria-hidden
          className="plaza-tutorial-melee-strike pointer-events-none absolute z-30 text-poster-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.65)]"
          style={{
            left: 'calc(50% + 18px)',
            top: 'calc(50% + 4px)',
          }}
        >
          <Icon icon="boxicons:sword-filled" className="size-5" />
        </span>

        <span
          aria-hidden
          className="plaza-tutorial-melee-click-cursor absolute z-40 text-parchment drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
          style={{
            left: 'calc(50% + 30px)',
            top: 'calc(50% + 18px)',
          }}
        >
          <Icon icon="mdi:crosshairs-gps" className="size-5" />
        </span>
      </RenderingPlazaTutorialIsoSceneShell>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Tap enemy" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            to lock on and auto-swing
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Click enemy" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            to lock on and auto-swing
          </span>
        </div>
      )}
    </div>
  );
}

/** Claim-mode demo with a tile pulsing then turning orange. */
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
          ? 'Arm Claim, then tap a sky-blue tile beside your land (or start a new plot).'
          : 'Arm Claim, then click a sky-blue tile beside your land (or start a new plot).'}
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
            8<span className={tileBadge.maxValueClassName}>/64</span>
          </span>
        </div>
      </div>

      <RenderingPlazaTutorialClaimDemo isMobile={isMobile} />
    </div>
  );
}

/** Save-coords demo with claim mode hotbar hint. */
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

        <span className="absolute right-2 top-2 z-30 rounded border border-poster-gold/50 bg-ink/55 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-parchment">
          {isMobile ? 'Claim' : 'Claim (C)'}
        </span>

        <div className="plaza-tutorial-save-coords-popover absolute bottom-2 left-1/2 z-30 -translate-x-1/2 rounded border border-white/15 bg-black/80 px-2 py-1 shadow-lg">
          <span className="text-[9px] font-bold uppercase tracking-wide text-[#f4d35e]">
            Save Coords
          </span>
        </div>
      </RenderingPlazaTutorialIsoSceneShell>

      <p className="text-center text-xs font-medium text-ink-soft">
        {isMobile
          ? 'Open Claim mode, tap Save Coords, then tap a tile (max 3 saved).'
          : 'Open Claim mode (C), press Save Coords, then click a tile (max 3 saved).'}
      </p>
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

      <div
        className={cn(
          'w-full max-w-[15rem]',
          DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_ROW_CLASS_NAME
        )}
      >
        <Badge
          variant="outline"
          className={cn(
            DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_BADGE_CLASS_NAME,
            'flex-1'
          )}
        >
          42, 18
        </Badge>
        <button
          type="button"
          tabIndex={-1}
          {...definingPlazaButtonSfxDataAttributes(
            DEFINING_PLAZA_BUTTON_SFX_KIND.none
          )}
          className={
            DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_ACTIVE_CLASS_NAME
          }
          aria-hidden
        >
          {DEFINING_WORLD_PLAZA_SAVED_COORDS_LIST_TRACK_BUTTON_LABEL}
        </button>
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
            tabIndex={-1}
            {...definingPlazaButtonSfxDataAttributes(
              DEFINING_PLAZA_BUTTON_SFX_KIND.none
            )}
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
        Watch your health bar: hazards and combat drain it over time.
      </p>
    </div>
  );
}

const PLAZA_TUTORIAL_HUNGER_DEMO_SPHERE_SIZE_PX = 40;
const PLAZA_TUTORIAL_HUNGER_DEMO_ICON_SIZE_PX = 18;

/** Hunger sphere orb and hotbar eat demo. */
export function RenderingPlazaTutorialHungerDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-full max-w-[15rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex w-fit flex-col items-center gap-3">
          <div
            className="relative flex items-center justify-center overflow-hidden rounded-full"
            style={{
              width: PLAZA_TUTORIAL_HUNGER_DEMO_SPHERE_SIZE_PX,
              height: PLAZA_TUTORIAL_HUNGER_DEMO_SPHERE_SIZE_PX,
              backgroundColor:
                DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_EMPTY_COLOR,
              boxShadow: 'inset 0 0 0 1.5px rgba(120, 90, 55, 0.85)',
            }}
            aria-hidden
          >
            <div
              className="plaza-tutorial-hunger-fill absolute inset-x-0 bottom-0"
              style={{
                backgroundColor:
                  DEFINING_WORLD_PLAZA_HUNGER_INDICATOR_FOOD_FILL_COLOR,
              }}
            />
            <span
              className="relative z-10 shrink-0"
              style={resolvingWorldPlazaHungerTierSpriteIconStyle(
                'well_fed',
                PLAZA_TUTORIAL_HUNGER_DEMO_ICON_SIZE_PX
              )}
              aria-hidden
            />
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
  '#f97316',
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
  { kind: 'emoji' as const, label: '' },
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
          className="absolute left-[46%] top-[42%] size-2 rounded-[1px] border border-dashed border-orange-500/80 bg-orange-500/45"
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
            className="size-2 rounded-[1px] border border-dashed border-orange-500/80 bg-orange-500/45"
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
          ? `Tap a slot to see item actions. Choose Drop, then tap the ground to place items from your ${DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT} hotbar slots.`
          : `Click a slot to see item actions. Choose Drop, then click the ground to place items from your ${DEFINING_WORLD_PLAZA_INVENTORY_MAIN_HOTBAR_SLOT_COUNT} hotbar slots.`}
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

type RenderingPlazaTutorialBuffBadgeDemoRow = {
  icon: string;
  label: string;
  polarity: 'buff' | 'debuff' | 'disease';
  diseaseId?: DefiningWorldPlazaEntityDiseaseId;
  borderClassName?: string;
  iconClassName?: string;
};

const PLAZA_TUTORIAL_OFFENSE_BUFF_BADGE_DEMO_ROWS: RenderingPlazaTutorialBuffBadgeDemoRow[] =
  [
    { icon: 'boxicons:target', label: 'Exposed', polarity: 'debuff' },
    {
      icon: 'game-icons:broken-heart',
      label: 'Vulnerable',
      polarity: 'debuff',
    },
    { icon: 'game-icons:scythe', label: 'Condemned', polarity: 'debuff' },
  ];

const PLAZA_TUTORIAL_DISEASE_BUFF_BADGE_DEMO_ROWS: RenderingPlazaTutorialBuffBadgeDemoRow[] =
  [
    {
      icon: 'mdi:stomach',
      label: 'Salmonellosis',
      polarity: 'disease',
      diseaseId: 'salmonellosis',
      borderClassName: 'border-lime-500/70 bg-lime-950/90',
      iconClassName: 'text-lime-300',
    },
    {
      icon: 'mdi:biohazard',
      label: 'Trichinellosis',
      polarity: 'disease',
      diseaseId: 'trichinellosis',
      borderClassName: 'border-amber-500/70 bg-amber-950/90',
      iconClassName: 'text-amber-300',
    },
    {
      icon: 'mdi:head-question',
      label: 'Chronic Wasting',
      polarity: 'disease',
      diseaseId: 'chronic-wasting',
      borderClassName: 'border-purple-500/70 bg-purple-950/90',
      iconClassName: 'text-purple-300',
    },
  ];

const PLAZA_TUTORIAL_DEFENSE_BUFF_BADGE_DEMO_ROWS: RenderingPlazaTutorialBuffBadgeDemoRow[] =
  [
    { icon: 'mdi:shield-half-full', label: 'Braced', polarity: 'buff' },
    { icon: 'mdi:shield', label: 'Guarded', polarity: 'buff' },
    { icon: 'mdi:star-four-points', label: 'Ultra Instinct', polarity: 'buff' },
  ];

function RenderingPlazaTutorialBuffBadgeDemoIcon({
  row,
}: {
  row: RenderingPlazaTutorialBuffBadgeDemoRow;
}): React.JSX.Element {
  const borderClassName =
    row.borderClassName ??
    (row.polarity === 'debuff'
      ? 'border-red-400/70 bg-red-950/80'
      : row.polarity === 'disease'
        ? 'border-lime-500/70 bg-lime-950/90'
        : 'border-poster-gold/55 bg-black/80');
  const iconClassName =
    row.iconClassName ??
    (row.polarity === 'debuff'
      ? 'text-red-200'
      : row.polarity === 'disease'
        ? 'text-lime-300'
        : 'text-poster-gold');

  return (
    <div className="flex flex-col items-center gap-1" aria-hidden>
      <div
        className={`flex size-8 items-center justify-center rounded-[2px] border p-0.5 shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] ${borderClassName}`}
      >
        {row.diseaseId ? (
          <RenderingWorldPlazaEntityDiseaseIconGlyph
            diseaseId={row.diseaseId}
            className="size-4"
          />
        ) : (
          <Icon icon={row.icon} className={`size-4 ${iconClassName}`} />
        )}
      </div>
      <span className="max-w-[4.5rem] text-center text-[9px] font-semibold leading-tight text-ink-soft">
        {row.label}
      </span>
    </div>
  );
}

/** Health-bar buff badge row demo for offense and defense tier locks. */
export function RenderingPlazaTutorialBuffBadgesDemo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[18rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="mx-auto h-2.5 w-24 overflow-hidden rounded-sm border border-black/50 bg-black/60">
          <div className="h-full w-3/4 bg-gradient-to-r from-red-700 to-red-500" />
        </div>

        <div className="mt-3 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-center">
            <div className="flex-1">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-red-300">
                Offense debuffs
              </p>
              <div className="flex justify-center gap-2">
                {PLAZA_TUTORIAL_OFFENSE_BUFF_BADGE_DEMO_ROWS.map((row) => (
                  <RenderingPlazaTutorialBuffBadgeDemoIcon
                    key={row.label}
                    row={row}
                  />
                ))}
              </div>
            </div>

            <div className="flex-1">
              <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-lime-300">
                Diseases
              </p>
              <div className="flex justify-center gap-2">
                {PLAZA_TUTORIAL_DISEASE_BUFF_BADGE_DEMO_ROWS.map((row) => (
                  <RenderingPlazaTutorialBuffBadgeDemoIcon
                    key={row.label}
                    row={row}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-wide text-poster-gold">
              Defense buffs
            </p>
            <div className="flex justify-center gap-3">
              {PLAZA_TUTORIAL_DEFENSE_BUFF_BADGE_DEMO_ROWS.map((row) => (
                <RenderingPlazaTutorialBuffBadgeDemoIcon
                  key={row.label}
                  row={row}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs font-medium text-ink-soft">
        Badges sit under your health bar. Gold borders are buffs; red borders
        are debuffs.
      </p>
    </div>
  );
}

/** Raw vs cooked wildlife meat and disease risk demo. */
export function RenderingPlazaTutorialCookWildMeatDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[18rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex max-w-[14rem] flex-col items-center gap-4">
          <div className="flex w-full items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl" aria-hidden>
                🥩
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-red-300">
                Raw
              </span>
            </div>
            <Icon
              icon="mdi:fire"
              className="size-5 text-orange-300"
              aria-hidden
            />
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl" aria-hidden>
                🍖
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-poster-gold">
                Cooked
              </span>
            </div>
          </div>

          <div className="mx-auto h-2 w-20 overflow-hidden rounded-sm border border-black/50 bg-black/60">
            <div className="h-full w-2/3 bg-gradient-to-r from-red-700 to-red-500" />
          </div>

          <div className="flex justify-center gap-2" aria-hidden>
            <div className="flex flex-col items-center gap-1">
              <div className="flex size-8 items-center justify-center rounded-[2px] border border-lime-500/70 bg-lime-950/90 p-0.5">
                <RenderingWorldPlazaEntityDiseaseIconGlyph
                  diseaseId="salmonellosis"
                  className="size-4"
                />
              </div>
              <span className="text-[9px] font-semibold text-lime-300">
                Disease
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="flex size-8 items-center justify-center rounded-[2px] border border-poster-gold/55 bg-black/80 p-0.5">
                <Icon
                  icon="mdi:heart-plus"
                  className="size-4 text-poster-gold"
                />
              </div>
              <span className="text-[9px] font-semibold text-poster-gold">
                Well fed
              </span>
            </div>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Cook at campfire" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            before you eat raw cuts
          </span>
        </div>
      ) : (
        <p className="text-center text-xs font-medium text-ink-soft">
          Cook wildlife meat at a campfire. Raw cuts risk disease; cooked cuts
          may grant a well-fed buff.
        </p>
      )}
    </div>
  );
}

/** Corpse Study demo: select a body, channel Study, fill bestiary progress. */
export function RenderingPlazaTutorialStudyWildlifeDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[18rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] px-4 py-5 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="mx-auto flex max-w-[14rem] flex-col items-center gap-4">
          <div className="relative flex w-full items-end justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <div
                aria-hidden
                className="plaza-tutorial-study-corpse flex h-8 w-12 items-end justify-center rounded-sm border border-[#5c4224]/80 bg-[linear-gradient(180deg,#6b4f2a_0%,#3d2a16_100%)] shadow-[0_2px_6px_rgba(0,0,0,0.45)]"
              >
                <span className="mb-0.5 h-2 w-8 rounded-full bg-[#2a1a0c]/70" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wide text-parchment/70">
                Corpse
              </span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-hidden
                className="plaza-tutorial-study-button inline-flex items-center gap-1 rounded-sm border border-poster-gold/55 bg-poster-teal-deep/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-parchment shadow"
              >
                <Icon
                  icon="mdi:book-open-page-variant"
                  className="size-3"
                  aria-hidden
                />
                Study
              </span>
              <div className="h-1.5 w-16 overflow-hidden rounded-sm border border-black/50 bg-black/60">
                <div className="plaza-tutorial-study-progress h-full bg-gradient-to-r from-poster-teal to-poster-gold" />
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="flex items-center gap-1.5 rounded-sm border border-poster-teal/35 bg-poster-teal-deep/90 px-2 py-1 shadow"
          >
            <Icon
              icon="mdi:book-open-page-variant"
              className="size-3.5 text-parchment"
            />
            <span className="plaza-tutorial-study-count font-mono text-[11px] font-bold tabular-nums text-parchment">
              2/100
            </span>
          </div>
        </div>
      </div>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Tap corpse" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            then Study before it fades
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Click corpse" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            then Study before it fades
          </span>
        </div>
      )}
    </div>
  );
}

/** Fishing cast demo: rod near water, Fish then Reel. */
export function RenderingPlazaTutorialFishingDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <RenderingPlazaTutorialIsoSceneShell className="h-40">
        <RenderingPlazaTutorialIsoTile gridX={1} gridY={2} />
        <RenderingPlazaTutorialIsoTile gridX={2} gridY={2} />
        <RenderingPlazaTutorialIsoTile
          gridX={3}
          gridY={2}
          className="bg-[linear-gradient(180deg,#3b82f6_0%,#1d4ed8_100%)]"
        />
        <RenderingPlazaTutorialIsoTile
          gridX={2}
          gridY={3}
          className="bg-[linear-gradient(180deg,#3b82f6_0%,#1d4ed8_100%)]"
        />
        <RenderingPlazaTutorialIsoTile
          gridX={3}
          gridY={3}
          className="bg-[linear-gradient(180deg,#2563eb_0%,#1e40af_100%)]"
        />
        <RenderingPlazaTutorialIsoAvatar gridX={2} gridY={2} />
        <div
          aria-hidden
          className="plaza-tutorial-fishing-label absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-sm border border-poster-gold/60 bg-poster-teal-deep/95 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-parchment shadow"
        >
          <span className="inline-flex items-center gap-1">
            <Icon icon="mdi:fishing" className="size-3" />
            <span className="relative inline-grid place-items-center">
              <span className="plaza-tutorial-fishing-label-fish col-start-1 row-start-1">
                Fish
              </span>
              <span className="plaza-tutorial-fishing-label-reel col-start-1 row-start-1">
                Reel
              </span>
            </span>
          </span>
        </div>
        <div
          aria-hidden
          className="plaza-tutorial-fishing-ring absolute left-1/2 top-12 z-30 size-10 -translate-x-1/2 rounded-full border-2 border-poster-gold/70"
        />
      </RenderingPlazaTutorialIsoSceneShell>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Tap Fish" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            then Reel when it flashes
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Click Fish" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            then Reel when it flashes
          </span>
        </div>
      )}
    </div>
  );
}

/** Character profile sheet demo: Status / Stats / Upgrade tabs. */
export function RenderingPlazaTutorialCharacterProfileDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[18rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#f5ead6_0%,#e8d7b8_100%)] p-3 shadow-[inset_0_0_16px_rgba(0,0,0,0.12)]">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full border border-poster-teal/40 bg-poster-teal/15">
            <Icon
              icon="mdi:shield-account"
              className="size-4 text-poster-teal-deep"
              aria-hidden
            />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-bold text-poster-teal-deep">
              Character
            </p>
            <p className="text-[10px] font-medium italic text-ink-soft">
              Action bar person icon
            </p>
          </div>
        </div>
        <div
          aria-hidden
          className="mb-2 flex gap-1 rounded-sm border border-poster-teal/20 bg-parchment/50 p-0.5"
        >
          {(['Status', 'Stats', 'Upgrade'] as const).map((tabLabel, index) => (
            <span
              key={tabLabel}
              className={cn(
                'flex-1 rounded-sm px-1 py-1 text-center text-[9px] font-bold uppercase tracking-wide',
                index === 0
                  ? 'plaza-tutorial-profile-tab-active border border-poster-teal/30 bg-poster-teal/15 text-poster-teal-deep'
                  : 'text-ink-soft'
              )}
            >
              {tabLabel}
            </span>
          ))}
        </div>
        <div className="space-y-1.5 rounded-sm border border-poster-teal/15 bg-white/40 px-2 py-2">
          <div className="flex items-center justify-between text-[10px] font-semibold text-ink">
            <span>Health</span>
            <span className="font-mono tabular-nums">120 / 120</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-sm bg-black/15">
            <div className="h-full w-full bg-[linear-gradient(90deg,#ef4444_0%,#b91c1c_100%)]" />
          </div>
          <div className="flex items-center justify-between text-[10px] font-semibold text-ink">
            <span>Stamina</span>
            <span className="font-mono tabular-nums">100%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-sm bg-black/15">
            <div className="h-full w-[85%] bg-[linear-gradient(90deg,#eab308_0%,#a16207_100%)]" />
          </div>
        </div>
      </div>

      {isMobile ? (
        <RenderingPlazaTutorialTouchHint label="Tap Character" />
      ) : (
        <RenderingPlazaTutorialTouchHint label="Open Character" />
      )}
    </div>
  );
}

/** Spritcore upgrade lanes demo: Commit spend on a power-up. */
export function RenderingPlazaTutorialUpgradeSpritcoreDemo({
  isMobile = false,
}: RenderingPlazaTutorialDemoProps): React.JSX.Element {
  const upgradeLanes = [
    { label: 'Health', icon: 'mdi:heart-plus' },
    { label: 'Damage', icon: 'mdi:sword-cross' },
    { label: 'Speed', icon: 'mdi:run-fast' },
  ] as const;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-full max-w-[18rem] rounded-md border border-poster-teal/25 bg-[linear-gradient(180deg,#1c333c_0%,#14252b_100%)] p-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.35)]">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wide text-parchment/80">
            Upgrade
          </span>
          <span className="rounded-sm border border-poster-gold/45 bg-poster-gold/15 px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums text-poster-gold">
            12 SC
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {upgradeLanes.map((lane, index) => (
            <div
              key={lane.label}
              className={cn(
                'flex items-center gap-2 rounded-sm border border-parchment/15 bg-black/25 px-2 py-1.5',
                index === 0 && 'plaza-tutorial-upgrade-lane-active'
              )}
            >
              <Icon
                icon={lane.icon}
                className="size-3.5 shrink-0 text-poster-gold"
                aria-hidden
              />
              <span className="min-w-0 flex-1 text-[11px] font-semibold text-parchment">
                {lane.label}
              </span>
              <span
                className={cn(
                  'rounded-sm border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide',
                  index === 0
                    ? 'plaza-tutorial-upgrade-commit border-poster-gold/60 bg-poster-gold/25 text-parchment'
                    : 'border-parchment/20 text-parchment/55'
                )}
              >
                Commit
              </span>
            </div>
          ))}
        </div>
      </div>

      {isMobile ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Tap Upgrade" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            then Commit a lane
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RenderingPlazaTutorialTouchHint label="Open Upgrade" />
          <span className="text-[10px] font-medium italic text-ink-soft">
            then Commit a lane
          </span>
        </div>
      )}
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
        Safe between about 0°C and 40°C. A fire or snowflake badge appears when
        heat or frost damage starts ticking.
      </p>
    </div>
  );
}

/** Chop / mine / pick harvest icons for the Mechanics World tab. */
export function RenderingPlazaTutorialChopAndMineDemo(): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex w-full max-w-[15rem] items-stretch justify-center gap-2">
        <div className="flex flex-1 flex-col items-center gap-1.5 rounded-md border border-poster-teal/25 bg-parchment/50 px-2 py-3">
          <Icon
            icon="game-icons:wood-axe"
            className="size-7 text-poster-teal-deep"
            aria-hidden
          />
          <span className="text-[10px] font-bold uppercase tracking-wide text-ink">
            Chop
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1.5 rounded-md border border-poster-teal/25 bg-parchment/50 px-2 py-3">
          <Icon
            icon="game-icons:war-pick"
            className="size-7 text-poster-teal-deep"
            aria-hidden
          />
          <span className="text-[10px] font-bold uppercase tracking-wide text-ink">
            Mine
          </span>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1.5 rounded-md border border-poster-teal/25 bg-parchment/50 px-2 py-3">
          <Icon
            icon="game-icons:stone-pile"
            className="size-7 text-poster-teal-deep"
            aria-hidden
          />
          <span className="text-[10px] font-bold uppercase tracking-wide text-ink">
            Pick
          </span>
        </div>
      </div>
      <p className="text-center text-xs font-medium text-ink-soft">
        Axe for trees, pickaxe for boulders, bare hands for floor pebbles.
      </p>
    </div>
  );
}
