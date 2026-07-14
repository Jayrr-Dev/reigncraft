'use client';

import { RenderingPlazaHerbariumFlowerPortrait } from '@/components/home/components/renderingPlazaHerbariumFlowerPortrait';
import { RenderingPlazaHerbariumGuideDetailView } from '@/components/home/components/renderingPlazaHerbariumGuideDetailView';
import { RenderingPlazaHerbariumTreePortrait } from '@/components/home/components/renderingPlazaHerbariumTreePortrait';
import { DEFINING_PLAZA_HERBARIUM_PANEL_SUBTITLE } from '@/components/home/domains/definingPlazaHerbariumGuideConstants';
import {
  resolvingPlazaHerbariumGuideDisplayEntries,
  type PlazaHerbariumGuideDisplayEntry,
} from '@/components/home/domains/resolvingPlazaHerbariumGuideDisplayEntries';
import { resolvingPlazaHerbariumEntryRarityBadgeVariant } from '@/components/home/domains/resolvingPlazaHerbariumRarity';
import {
  formattingPlazaHerbariumStudyCountProgress,
  resolvingPlazaHerbariumStudyTierBookIcon,
} from '@/components/home/domains/resolvingPlazaHerbariumStudyTier';
import { Icon } from '@/components/ui/icon';
import {
  gettingWorldPlazaExploredBiomesSnapshot,
  subscribingWorldPlazaExploredBiomes,
} from '@/components/world/domains/managingWorldPlazaExploredBiomesStore';
import {
  gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot,
  gettingWorldPlazaHerbariumSightedTreeVariantsSnapshot,
  gettingWorldPlazaHerbariumTreeStudyCountsSnapshot,
  subscribingWorldPlazaHerbariumDiscovery,
} from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import { resolvingWorldPlazaInventoryItemDetailBadgeShellClassName } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailBadgeShellClassName';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const PLAZA_HERBARIUM_PANEL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_HERBARIUM_CATEGORY_TAB_BAR_CLASS_NAME =
  'flex shrink-0 flex-wrap gap-0.5 rounded-md border border-poster-teal/25 bg-parchment/40 p-0.5';

const PLAZA_HERBARIUM_CATEGORY_TAB_BUTTON_CLASS_NAME =
  'rounded-sm border border-transparent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-soft transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40 sm:px-2 sm:text-[10px]';

const PLAZA_HERBARIUM_CATEGORY_TAB_BUTTON_ACTIVE_CLASS_NAME =
  'border-poster-teal/30 bg-poster-teal/15 text-poster-teal-deep shadow-sm';

const PLAZA_HERBARIUM_GUIDE_TILE_BASE_CLASS_NAME =
  'flex w-full flex-col overflow-hidden rounded-md border';

const PLAZA_HERBARIUM_GUIDE_TILE_STAGE_CLASS_NAME =
  'relative flex aspect-square w-full items-center justify-center overflow-hidden';

const PLAZA_HERBARIUM_GUIDE_TILE_NAME_CLASS_NAME =
  'block truncate border-t px-1 py-1 text-center font-display text-[10px] font-bold uppercase tracking-wide sm:text-[11px]';

export type PlazaHerbariumCategoryFilterId = 'all' | 'flower' | 'tree';

const PLAZA_HERBARIUM_CATEGORY_FILTERS: readonly {
  id: PlazaHerbariumCategoryFilterId;
  label: string;
}[] = [
  { id: 'all', label: 'All' },
  { id: 'flower', label: 'Flowers' },
  { id: 'tree', label: 'Trees' },
];

export type RenderingPlazaHerbariumPanelProps = {
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
};

function RenderingPlazaHerbariumGuideCard({
  entry,
  onSelect,
}: {
  entry: PlazaHerbariumGuideDisplayEntry;
  onSelect: (entry: PlazaHerbariumGuideDisplayEntry) => void;
}): React.JSX.Element {
  if (!entry.isSighted) {
    return (
      <article
        className={cn(
          PLAZA_HERBARIUM_GUIDE_TILE_BASE_CLASS_NAME,
          'border-poster-teal/20 bg-parchment/30'
        )}
      >
        <div
          className={PLAZA_HERBARIUM_GUIDE_TILE_STAGE_CLASS_NAME}
          aria-hidden
        >
          {entry.kind === 'flower' ? (
            <RenderingPlazaHerbariumFlowerPortrait
              speciesId={entry.speciesId}
              variant="silhouette"
              className="size-[48%]"
            />
          ) : (
            <RenderingPlazaHerbariumTreePortrait
              treeVariant={entry.variant}
              variant="silhouette"
              className="size-[48%]"
            />
          )}
        </div>
        <span
          className={cn(
            PLAZA_HERBARIUM_GUIDE_TILE_NAME_CLASS_NAME,
            'border-poster-teal/15 tracking-[0.25em] text-ink-soft/60'
          )}
        >
          ???
        </span>
      </article>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        PLAZA_HERBARIUM_GUIDE_TILE_BASE_CLASS_NAME,
        'cursor-pointer border-poster-teal/35 bg-parchment/50 text-left shadow-[0_2px_6px_rgba(28,25,18,0.18)] transition hover:border-poster-teal/55 hover:bg-parchment/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40'
      )}
      onClick={() => onSelect(entry)}
      aria-label={`View ${entry.displayName} details`}
    >
      <div className={PLAZA_HERBARIUM_GUIDE_TILE_STAGE_CLASS_NAME} aria-hidden>
        {entry.kind === 'flower' ? (
          <RenderingPlazaHerbariumFlowerPortrait
            speciesId={entry.speciesId}
            variant="revealed"
            className="size-[48%]"
          />
        ) : (
          <RenderingPlazaHerbariumTreePortrait
            treeVariant={entry.variant}
            variant="revealed"
            className="size-[48%]"
          />
        )}
        <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded-sm border border-poster-teal/35 bg-poster-teal-deep/90 px-1 py-0.5 shadow">
          <Icon
            icon={resolvingPlazaHerbariumStudyTierBookIcon(entry.studyCount)}
            className="size-2.5 text-parchment"
            aria-hidden
          />
          <span className="font-mono text-[8px] font-bold tabular-nums text-parchment">
            {formattingPlazaHerbariumStudyCountProgress(entry.studyCount)}
          </span>
        </span>
        <span
          className={cn(
            resolvingWorldPlazaInventoryItemDetailBadgeShellClassName(
              resolvingPlazaHerbariumEntryRarityBadgeVariant(entry.rarity)
            ),
            'absolute right-1 top-1 z-1 h-4! max-w-18 px-1 text-[7px] sm:h-4! sm:px-1 sm:text-[7px]'
          )}
        >
          {entry.rarityLabel}
        </span>
      </div>
      <span
        className={cn(
          PLAZA_HERBARIUM_GUIDE_TILE_NAME_CLASS_NAME,
          'border-poster-teal/20 text-poster-teal-deep'
        )}
      >
        {entry.displayName}
      </span>
    </button>
  );
}

/** Codex panel listing sighted flora and mystery slots for the rest. */
export function RenderingPlazaHerbariumPanel({
  onBack,
  onClose,
  className = '',
}: RenderingPlazaHerbariumPanelProps): React.JSX.Element {
  const [categoryFilterId, setCategoryFilterId] =
    useState<PlazaHerbariumCategoryFilterId>('all');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const flowerStudyCountsBySpeciesId = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumFlowerStudyCountsSnapshot,
    () => ({})
  );
  const sightedTreeVariants = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumSightedTreeVariantsSnapshot,
    () => []
  );
  const treeStudyCountsByVariant = useSyncExternalStore(
    subscribingWorldPlazaHerbariumDiscovery,
    gettingWorldPlazaHerbariumTreeStudyCountsSnapshot,
    () => ({})
  );
  const exploredBiomeKinds = useSyncExternalStore(
    subscribingWorldPlazaExploredBiomes,
    gettingWorldPlazaExploredBiomesSnapshot,
    () => []
  );
  const sightedTreeSet = useMemo(
    () => new Set(sightedTreeVariants),
    [sightedTreeVariants]
  );
  const exploredKinds = useMemo(
    () => new Set(exploredBiomeKinds),
    [exploredBiomeKinds]
  );
  const guideEntries = useMemo(
    () =>
      resolvingPlazaHerbariumGuideDisplayEntries(
        flowerStudyCountsBySpeciesId,
        sightedTreeSet,
        treeStudyCountsByVariant,
        exploredKinds
      ),
    [
      exploredKinds,
      flowerStudyCountsBySpeciesId,
      sightedTreeSet,
      treeStudyCountsByVariant,
    ]
  );
  const filteredGuideEntries = useMemo(
    () =>
      categoryFilterId === 'all'
        ? guideEntries
        : guideEntries.filter((entry) => entry.kind === categoryFilterId),
    [categoryFilterId, guideEntries]
  );
  const resolvingPlazaHerbariumEntryId = useCallback(
    (entry: PlazaHerbariumGuideDisplayEntry): string =>
      entry.kind === 'flower'
        ? `flower:${entry.speciesId}`
        : `tree:${entry.variant}`,
    []
  );
  const selectedEntry = useMemo(
    () =>
      selectedEntryId === null
        ? null
        : (guideEntries.find(
            (entry) => resolvingPlazaHerbariumEntryId(entry) === selectedEntryId
          ) ?? null),
    [guideEntries, resolvingPlazaHerbariumEntryId, selectedEntryId]
  );
  const selectingCategoryFilter = useCallback(
    (filterId: PlazaHerbariumCategoryFilterId): void => {
      setCategoryFilterId(filterId);
    },
    []
  );
  const openingEntryDetail = useCallback(
    (entry: PlazaHerbariumGuideDisplayEntry) => {
      setSelectedEntryId(resolvingPlazaHerbariumEntryId(entry));
    },
    [resolvingPlazaHerbariumEntryId]
  );
  const closingEntryDetail = useCallback((): void => {
    setSelectedEntryId(null);
  }, []);
  const sightedCount = guideEntries.filter((entry) => entry.isSighted).length;
  const studiedCount = guideEntries.filter((entry) => entry.isStudied).length;
  const totalCount = guideEntries.length;
  const progressPercent =
    totalCount > 0 ? Math.round((sightedCount / totalCount) * 100) : 0;

  if (selectedEntry?.isSighted) {
    return (
      <RenderingPlazaHerbariumGuideDetailView
        entry={selectedEntry}
        onBack={closingEntryDetail}
        onClose={onClose}
        className={className}
      />
    );
  }

  return (
    <div
      className={`plaza-panel plaza-pop-in flex h-[min(90dvh,42rem)] w-full max-w-md flex-col gap-3 overflow-hidden rounded-md p-4 font-body sm:h-[min(85dvh,42rem)] sm:gap-4 sm:p-6 ${className}`.trim()}
    >
      <div className="flex shrink-0 items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className={PLAZA_HERBARIUM_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            Herbarium
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            {DEFINING_PLAZA_HERBARIUM_PANEL_SUBTITLE}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_HERBARIUM_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="shrink-0 rounded-md border border-poster-teal/25 bg-parchment/45 px-3 py-1.5">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
          <span>
            Sighted{' '}
            <span className="font-mono tabular-nums text-poster-teal-deep">
              {sightedCount}/{totalCount}
            </span>
          </span>
          <span>
            Studied{' '}
            <span className="font-mono tabular-nums text-poster-teal-deep">
              {studiedCount}
            </span>
          </span>
        </div>
        <div
          className="mt-1 h-1.5 overflow-hidden rounded-full border border-poster-teal/25 bg-poster-teal-deep/15"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totalCount}
          aria-valuenow={sightedCount}
          aria-label="Flora sighted"
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#c98a2d_0%,#d9a441_100%)] transition-[width] duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div
        className={PLAZA_HERBARIUM_CATEGORY_TAB_BAR_CLASS_NAME}
        role="tablist"
        aria-label="Category filters"
      >
        {PLAZA_HERBARIUM_CATEGORY_FILTERS.map((filter) => {
          const isActive = filter.id === categoryFilterId;

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(
                PLAZA_HERBARIUM_CATEGORY_TAB_BUTTON_CLASS_NAME,
                isActive &&
                  PLAZA_HERBARIUM_CATEGORY_TAB_BUTTON_ACTIVE_CLASS_NAME
              )}
              onClick={() => selectingCategoryFilter(filter.id)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 touch-pan-y">
        <div className="grid grid-cols-2 content-start gap-1.5 sm:grid-cols-3 sm:gap-2">
          {filteredGuideEntries.map((entry) => (
            <RenderingPlazaHerbariumGuideCard
              key={resolvingPlazaHerbariumEntryId(entry)}
              entry={entry}
              onSelect={openingEntryDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
