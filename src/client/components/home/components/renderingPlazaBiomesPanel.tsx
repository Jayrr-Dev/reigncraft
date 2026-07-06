'use client';

import {
  DEFINING_PLAZA_BIOMES_PANEL_SUBTITLE,
  DEFINING_PLAZA_BIOMES_RARITY_FILTERS,
  type PlazaBiomesRarityFilterId,
} from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import { filteringPlazaBiomesGuideDisplayEntriesByRarity } from '@/components/home/domains/filteringPlazaBiomesGuideDisplayEntriesByRarity';
import {
  resolvingPlazaBiomesGuideDisplayEntries,
  type PlazaBiomesGuideDisplayEntry,
} from '@/components/home/domains/resolvingPlazaBiomesGuideDisplayEntries';
import { Icon } from '@/components/ui/icon';
import {
  gettingWorldPlazaExploredBiomesSnapshot,
  subscribingWorldPlazaExploredBiomes,
} from '@/components/world/domains/managingWorldPlazaExploredBiomesStore';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const PLAZA_BIOMES_PANEL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_BIOMES_RARITY_TAB_BAR_CLASS_NAME =
  'scrollbar-none flex shrink-0 gap-1 overflow-x-auto rounded-md border border-poster-teal/25 bg-parchment/40 p-1';

const PLAZA_BIOMES_RARITY_TAB_BUTTON_CLASS_NAME =
  'shrink-0 rounded-sm px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40 sm:text-xs';

const PLAZA_BIOMES_RARITY_TAB_BUTTON_ACTIVE_CLASS_NAME =
  'border border-poster-teal/30 bg-poster-teal/15 text-poster-teal-deep shadow-sm';

const PLAZA_BIOMES_RARITY_BADGE_CLASS_NAME =
  'inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:text-[10px]';

export type RenderingPlazaBiomesPanelProps = {
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
};

function RenderingPlazaBiomesRarityBadge({
  entry,
}: {
  entry: PlazaBiomesGuideDisplayEntry;
}): React.JSX.Element {
  return (
    <span
      className={cn(
        PLAZA_BIOMES_RARITY_BADGE_CLASS_NAME,
        entry.rarityBadgeClassName
      )}
    >
      {entry.rarityLabel}
    </span>
  );
}

function RenderingPlazaBiomesGuideCard({
  entry,
}: {
  entry: PlazaBiomesGuideDisplayEntry;
}): React.JSX.Element {
  if (!entry.isExplored) {
    return (
      <article className="overflow-hidden rounded-md border border-poster-teal/20 bg-parchment/30">
        <div
          className="relative flex h-16 items-center justify-center bg-[linear-gradient(180deg,#22333b_0%,#182329_60%,#10181d_100%)] sm:h-20"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_10px,rgba(255,255,255,0.03)_10px_20px)]" />
          <span className="font-display text-xl font-bold tracking-[0.3em] text-parchment/45 sm:text-2xl">
            ???
          </span>
        </div>
        <div className="flex items-center justify-between gap-1.5 border-t border-poster-teal/15 px-2.5 py-2">
          <div className="flex min-w-0 items-center gap-1.5">
            <Icon
              icon="mdi:lock"
              className="size-3.5 shrink-0 text-ink-soft/60"
              aria-hidden
            />
            <span className="truncate text-xs font-bold uppercase tracking-wide text-ink-soft/70">
              Undiscovered
            </span>
          </div>
          <RenderingPlazaBiomesRarityBadge entry={entry} />
        </div>
      </article>
    );
  }

  return (
    <article className="overflow-hidden rounded-md border border-poster-teal/35 bg-parchment/50 shadow-[0_2px_6px_rgba(28,25,18,0.18)]">
      <div
        className={cn(
          'relative h-16 overflow-hidden sm:h-20',
          entry.skyBackdropClassName
        )}
        aria-hidden
      >
        <div
          className="absolute inset-x-0 bottom-0 h-7 border-t-2 border-black/15"
          style={{ backgroundColor: entry.groundColor }}
        />
        <div className="absolute inset-0 shadow-[inset_0_0_18px_rgba(0,0,0,0.22)]" />
        <span className="absolute right-1.5 top-1.5 flex size-7 items-center justify-center rounded-full border border-poster-gold/50 bg-poster-teal-deep/85 text-parchment shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
          <Icon icon={entry.icon} className="size-4" aria-hidden />
        </span>
      </div>
      <div className="border-t border-poster-teal/20 px-2.5 py-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate font-display text-sm font-bold tracking-wide text-poster-teal-deep">
            {entry.displayName}
          </h3>
          <RenderingPlazaBiomesRarityBadge entry={entry} />
        </div>
        <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-snug text-ink-soft">
          {entry.summary}
        </p>
      </div>
    </article>
  );
}

/**
 * Codex panel listing explored biomes and mystery slots for the rest.
 */
export function RenderingPlazaBiomesPanel({
  onBack,
  onClose,
  className = '',
}: RenderingPlazaBiomesPanelProps): React.JSX.Element {
  const [rarityFilterId, setRarityFilterId] =
    useState<PlazaBiomesRarityFilterId>('all');
  const exploredBiomeKinds = useSyncExternalStore(
    subscribingWorldPlazaExploredBiomes,
    gettingWorldPlazaExploredBiomesSnapshot,
    () => []
  );
  const exploredKinds = useMemo(
    () => new Set(exploredBiomeKinds),
    [exploredBiomeKinds]
  );
  const guideEntries = useMemo(
    () => resolvingPlazaBiomesGuideDisplayEntries(exploredKinds),
    [exploredKinds]
  );
  const filteredGuideEntries = useMemo(
    () =>
      filteringPlazaBiomesGuideDisplayEntriesByRarity(
        guideEntries,
        rarityFilterId
      ),
    [guideEntries, rarityFilterId]
  );
  const selectingRarityFilter = useCallback(
    (filterId: PlazaBiomesRarityFilterId): void => {
      setRarityFilterId(filterId);
    },
    []
  );
  const exploredCount = guideEntries.filter((entry) => entry.isExplored).length;
  const totalCount = guideEntries.length;
  const progressPercent =
    totalCount > 0 ? Math.round((exploredCount / totalCount) * 100) : 0;

  return (
    <div
      className={`plaza-panel plaza-pop-in flex max-h-[min(90dvh,42rem)] w-full max-w-md flex-col gap-3 overflow-hidden rounded-md p-4 font-body sm:max-h-[min(85dvh,42rem)] sm:gap-4 sm:p-6 ${className}`.trim()}
    >
      <div className="flex shrink-0 items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className={PLAZA_BIOMES_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            Biomes
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            {DEFINING_PLAZA_BIOMES_PANEL_SUBTITLE}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_BIOMES_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="shrink-0 rounded-md border border-poster-teal/25 bg-parchment/45 px-3 py-2">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide">
          <span className="text-ink-soft">Discovered</span>
          <span className="font-mono tabular-nums text-poster-teal-deep">
            {exploredCount} / {totalCount}
          </span>
        </div>
        <div
          className="mt-1.5 h-2 overflow-hidden rounded-full border border-poster-teal/25 bg-poster-teal-deep/15"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totalCount}
          aria-valuenow={exploredCount}
          aria-label="Biomes discovered"
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#c98a2d_0%,#d9a441_100%)] transition-[width] duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div
        className={PLAZA_BIOMES_RARITY_TAB_BAR_CLASS_NAME}
        role="tablist"
        aria-label="Biome rarity filters"
      >
        {DEFINING_PLAZA_BIOMES_RARITY_FILTERS.map((filter) => {
          const isActive = filter.id === rarityFilterId;

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(
                PLAZA_BIOMES_RARITY_TAB_BUTTON_CLASS_NAME,
                isActive && PLAZA_BIOMES_RARITY_TAB_BUTTON_ACTIVE_CLASS_NAME
              )}
              onClick={() => selectingRarityFilter(filter.id)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="scrollbar-none grid min-h-0 flex-1 grid-cols-2 content-start gap-2 overflow-y-auto overscroll-contain pr-1 touch-pan-y sm:gap-2.5">
        {filteredGuideEntries.map((entry) => (
          <RenderingPlazaBiomesGuideCard key={entry.kind} entry={entry} />
        ))}
      </div>
    </div>
  );
}
