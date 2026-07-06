'use client';

import { RenderingPlazaBiomesGuideDetailView } from '@/components/home/components/renderingPlazaBiomesGuideDetailView';
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
import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
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

const PLAZA_BIOMES_RARITY_BADGE_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadge} flex items-center gap-0.5 border py-0 pl-0.5 pr-1 shadow-md`;

const PLAZA_BIOMES_RARITY_BADGE_SOCKET_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadgeSocket} flex size-3.5 shrink-0 items-center justify-center rounded-[2px]`;

const PLAZA_BIOMES_RARITY_BADGE_LABEL_CLASS_NAME =
  'max-w-[4.25rem] truncate font-display text-[8px] font-bold uppercase leading-none tracking-wide text-parchment [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_0_6px_rgba(0,0,0,0.55)] sm:max-w-none sm:text-[9px]';

const PLAZA_BIOMES_GUIDE_CARD_BUTTON_CLASS_NAME =
  'group w-full cursor-pointer overflow-hidden rounded-md border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

const PLAZA_BIOMES_GUIDE_CARD_EXPLORED_BUTTON_CLASS_NAME =
  'border-poster-teal/35 bg-parchment/50 shadow-[0_2px_6px_rgba(28,25,18,0.18)] hover:border-poster-teal/55 hover:bg-parchment/65 hover:shadow-[0_3px_8px_rgba(28,25,18,0.22)]';

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
    <div
      className={cn(
        PLAZA_BIOMES_RARITY_BADGE_CLASS_NAME,
        entry.rarityBadgeBorderClassName
      )}
      title={`${entry.rarityLabel} biome`}
    >
      <span className={PLAZA_BIOMES_RARITY_BADGE_SOCKET_CLASS_NAME}>
        <Icon
          icon={entry.rarityBadgeIcon}
          className={cn(
            'size-2.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] sm:size-3',
            entry.rarityBadgeIconClassName
          )}
          aria-hidden
        />
      </span>
      <span className={PLAZA_BIOMES_RARITY_BADGE_LABEL_CLASS_NAME}>
        {entry.rarityLabel}
      </span>
    </div>
  );
}

function RenderingPlazaBiomesGuideCard({
  entry,
  onSelect,
}: {
  entry: PlazaBiomesGuideDisplayEntry;
  onSelect: (kind: DefiningWorldPlazaBiomeKind) => void;
}): React.JSX.Element {
  if (!entry.isExplored) {
    return (
      <article className="relative overflow-hidden rounded-md border border-poster-teal/20 bg-parchment/30">
        <div className="absolute right-1 top-1 z-10">
          <RenderingPlazaBiomesRarityBadge entry={entry} />
        </div>
        <div
          className="relative flex h-16 items-center justify-center bg-[linear-gradient(180deg,#22333b_0%,#182329_60%,#10181d_100%)] sm:h-20"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_10px,rgba(255,255,255,0.03)_10px_20px)]" />
          <span className="font-display text-xl font-bold tracking-[0.3em] text-parchment/45 sm:text-2xl">
            ???
          </span>
        </div>
        <div className="flex items-center gap-1.5 border-t border-poster-teal/15 px-2.5 py-2">
          <Icon
            icon="mdi:lock"
            className="size-3.5 shrink-0 text-ink-soft/60"
            aria-hidden
          />
          <span className="truncate text-xs font-bold uppercase tracking-wide text-ink-soft/70">
            Undiscovered
          </span>
        </div>
      </article>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        PLAZA_BIOMES_GUIDE_CARD_BUTTON_CLASS_NAME,
        PLAZA_BIOMES_GUIDE_CARD_EXPLORED_BUTTON_CLASS_NAME
      )}
      onClick={() => onSelect(entry.kind)}
      aria-label={`View ${entry.displayName} details`}
    >
      <div className="relative">
        <div className="absolute right-1 top-1 z-10">
          <RenderingPlazaBiomesRarityBadge entry={entry} />
        </div>
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
          <span className="absolute left-1.5 top-1.5 flex size-7 items-center justify-center rounded-full border border-poster-gold/50 bg-poster-teal-deep/85 text-parchment shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
            <Icon icon={entry.icon} className="size-4" aria-hidden />
          </span>
        </div>
        <div className="border-t border-poster-teal/20 px-2.5 py-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="min-w-0 truncate pr-2 font-display text-sm font-bold tracking-wide text-poster-teal-deep">
              {entry.displayName}
            </h3>
            <Icon
              icon="mdi:chevron-right"
              className="size-4 shrink-0 text-poster-teal-deep/70 transition group-hover:translate-x-0.5 group-hover:text-poster-teal-deep"
              aria-hidden
            />
          </div>
          <p className="mt-0.5 line-clamp-2 text-[11px] font-medium leading-snug text-ink-soft">
            {entry.summary}
          </p>
        </div>
      </div>
    </button>
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
  const [selectedBiomeKind, setSelectedBiomeKind] =
    useState<DefiningWorldPlazaBiomeKind | null>(null);
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
  const selectedEntry = useMemo(
    () =>
      selectedBiomeKind === null
        ? null
        : (guideEntries.find((entry) => entry.kind === selectedBiomeKind) ??
          null),
    [guideEntries, selectedBiomeKind]
  );
  const selectingRarityFilter = useCallback(
    (filterId: PlazaBiomesRarityFilterId): void => {
      setRarityFilterId(filterId);
    },
    []
  );
  const openingBiomeDetail = useCallback(
    (kind: DefiningWorldPlazaBiomeKind) => {
      setSelectedBiomeKind(kind);
    },
    []
  );
  const closingBiomeDetail = useCallback((): void => {
    setSelectedBiomeKind(null);
  }, []);
  const exploredCount = guideEntries.filter((entry) => entry.isExplored).length;
  const totalCount = guideEntries.length;
  const progressPercent =
    totalCount > 0 ? Math.round((exploredCount / totalCount) * 100) : 0;

  if (selectedEntry?.isExplored) {
    return (
      <RenderingPlazaBiomesGuideDetailView
        entry={selectedEntry}
        onBack={closingBiomeDetail}
        onClose={onClose}
        className={className}
      />
    );
  }

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
          <RenderingPlazaBiomesGuideCard
            key={entry.kind}
            entry={entry}
            onSelect={openingBiomeDetail}
          />
        ))}
      </div>
    </div>
  );
}
