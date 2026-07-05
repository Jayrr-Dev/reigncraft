'use client';

import {
  DEFINING_PLAZA_TUTORIAL_ISO_TILE_HEIGHT_PX,
  DEFINING_PLAZA_TUTORIAL_ISO_TILE_WIDTH_PX,
  resolvingPlazaTutorialIsoTileScreenOffset,
} from '@/components/home/domains/resolvingPlazaTutorialIsoTileScreenOffset';
import { Icon } from '@/components/ui/icon';
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

/** Animated click-to-walk demo with WASD key highlights. */
export function RenderingPlazaTutorialMovementDemo(): React.JSX.Element {
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
    </div>
  );
}

/** Run and jump demo with Shift / Space highlights. */
export function RenderingPlazaTutorialRunJumpDemo(): React.JSX.Element {
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
    </div>
  );
}

/** Claim-mode demo with a tile pulsing then turning gold. */
export function RenderingPlazaTutorialClaimDemo(): React.JSX.Element {
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
          Claim (C)
        </span>
      </RenderingPlazaTutorialIsoSceneShell>

      <p className="text-center text-xs font-medium text-ink-soft">
        Tap a highlighted tile next to your land to expand your realm.
      </p>
    </div>
  );
}

/** Build-mode demo with a rising block column. */
export function RenderingPlazaTutorialBuildDemo(): React.JSX.Element {
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
          Build (B)
        </span>
      </RenderingPlazaTutorialIsoSceneShell>

      <p className="text-center text-xs font-medium text-ink-soft">
        Place blocks on tiles you own to shape your territory.
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
