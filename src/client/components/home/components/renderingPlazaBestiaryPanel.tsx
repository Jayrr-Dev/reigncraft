'use client';

import { RenderingPlazaBestiaryGuideDetailView } from '@/components/home/components/renderingPlazaBestiaryGuideDetailView';
import { RenderingPlazaBestiarySpritePortrait } from '@/components/home/components/renderingPlazaBestiarySpritePortrait';
import { DEFINING_PLAZA_BESTIARY_PANEL_SUBTITLE } from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import { filteringPlazaBestiaryGuideDisplayEntriesByBiome } from '@/components/home/domains/filteringPlazaBestiaryGuideDisplayEntriesByBiome';
import {
  resolvingPlazaBestiaryGuideDisplayEntries,
  type PlazaBestiaryGuideDisplayEntry,
} from '@/components/home/domains/resolvingPlazaBestiaryGuideDisplayEntries';
import { Icon } from '@/components/ui/icon';
import {
  gettingWorldPlazaBestiaryKillCountsSnapshot,
  gettingWorldPlazaBestiarySightedSpeciesSnapshot,
  subscribingWorldPlazaBestiaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  listingWildlifeDevSpawnBiomeFilters,
  type DefiningWildlifeDevSpawnBiomeFilterId,
} from '@/components/world/wildlife/domains/listingWildlifeDevSpawnBiomeFilters';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const PLAZA_BESTIARY_PANEL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_BESTIARY_BIOME_TAB_BAR_CLASS_NAME =
  'flex shrink-0 flex-wrap gap-0.5 rounded-md border border-poster-teal/25 bg-parchment/40 p-0.5';

const PLAZA_BESTIARY_BIOME_TAB_BUTTON_CLASS_NAME =
  'rounded-sm border border-transparent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-soft transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40 sm:px-2 sm:text-[10px]';

const PLAZA_BESTIARY_BIOME_TAB_BUTTON_ACTIVE_CLASS_NAME =
  'border-poster-teal/30 bg-poster-teal/15 text-poster-teal-deep shadow-sm';

const PLAZA_BESTIARY_GUIDE_TILE_BASE_CLASS_NAME =
  'flex w-full flex-col overflow-hidden rounded-md border';

const PLAZA_BESTIARY_GUIDE_TILE_STAGE_CLASS_NAME =
  'relative flex aspect-square w-full items-center justify-center overflow-hidden';

const PLAZA_BESTIARY_GUIDE_TILE_NAME_CLASS_NAME =
  'block truncate border-t px-1 py-1 text-center font-display text-[10px] font-bold uppercase tracking-wide sm:text-[11px]';

export type RenderingPlazaBestiaryPanelProps = {
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
};

function RenderingPlazaBestiaryGuideCard({
  entry,
  onSelect,
}: {
  entry: PlazaBestiaryGuideDisplayEntry;
  onSelect: (speciesId: DefiningWildlifeSpeciesId) => void;
}): React.JSX.Element {
  if (!entry.isSighted) {
    return (
      <article
        className={cn(
          PLAZA_BESTIARY_GUIDE_TILE_BASE_CLASS_NAME,
          'border-poster-teal/20 bg-parchment/30'
        )}
      >
        <div className={PLAZA_BESTIARY_GUIDE_TILE_STAGE_CLASS_NAME} aria-hidden>
          <RenderingPlazaBestiarySpritePortrait
            speciesId={entry.speciesId}
            variant="silhouette"
            className="size-[72%]"
          />
        </div>
        <span
          className={cn(
            PLAZA_BESTIARY_GUIDE_TILE_NAME_CLASS_NAME,
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
        PLAZA_BESTIARY_GUIDE_TILE_BASE_CLASS_NAME,
        'cursor-pointer border-poster-teal/35 bg-parchment/50 text-left shadow-[0_2px_6px_rgba(28,25,18,0.18)] transition hover:border-poster-teal/55 hover:bg-parchment/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40'
      )}
      onClick={() => onSelect(entry.speciesId)}
      aria-label={`View ${entry.displayName} details`}
    >
      <div className={PLAZA_BESTIARY_GUIDE_TILE_STAGE_CLASS_NAME} aria-hidden>
        <RenderingPlazaBestiarySpritePortrait
          speciesId={entry.speciesId}
          variant="revealed"
          className="size-[72%]"
        />
        {entry.isStudied ? (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full border border-emerald-500/60 bg-emerald-950/88 shadow">
            <Icon
              icon="mdi:check-bold"
              className="size-2.5 text-emerald-200"
              aria-hidden
            />
          </span>
        ) : null}
      </div>
      <span
        className={cn(
          PLAZA_BESTIARY_GUIDE_TILE_NAME_CLASS_NAME,
          'border-poster-teal/20 text-poster-teal-deep'
        )}
      >
        {entry.displayName}
      </span>
    </button>
  );
}

/** Codex panel listing sighted wildlife and mystery slots for the rest. */
export function RenderingPlazaBestiaryPanel({
  onBack,
  onClose,
  className = '',
}: RenderingPlazaBestiaryPanelProps): React.JSX.Element {
  const [biomeFilterId, setBiomeFilterId] =
    useState<DefiningWildlifeDevSpawnBiomeFilterId>('all');
  const [selectedSpeciesId, setSelectedSpeciesId] =
    useState<DefiningWildlifeSpeciesId | null>(null);
  const sightedSpeciesIds = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiarySightedSpeciesSnapshot,
    () => []
  );
  const killCountsBySpeciesId = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiaryKillCountsSnapshot,
    () => ({})
  );
  const sightedSet = useMemo(
    () => new Set(sightedSpeciesIds),
    [sightedSpeciesIds]
  );
  const guideEntries = useMemo(
    () =>
      resolvingPlazaBestiaryGuideDisplayEntries(
        sightedSet,
        killCountsBySpeciesId
      ),
    [killCountsBySpeciesId, sightedSet]
  );
  const filteredGuideEntries = useMemo(
    () =>
      filteringPlazaBestiaryGuideDisplayEntriesByBiome(
        guideEntries,
        biomeFilterId
      ),
    [biomeFilterId, guideEntries]
  );
  const selectedEntry = useMemo(
    () =>
      selectedSpeciesId === null
        ? null
        : (guideEntries.find(
            (entry) => entry.speciesId === selectedSpeciesId
          ) ?? null),
    [guideEntries, selectedSpeciesId]
  );
  const biomeFilters = useMemo(() => listingWildlifeDevSpawnBiomeFilters(), []);
  const selectingBiomeFilter = useCallback(
    (filterId: DefiningWildlifeDevSpawnBiomeFilterId): void => {
      setBiomeFilterId(filterId);
    },
    []
  );
  const openingSpeciesDetail = useCallback(
    (speciesId: DefiningWildlifeSpeciesId) => {
      setSelectedSpeciesId(speciesId);
    },
    []
  );
  const closingSpeciesDetail = useCallback((): void => {
    setSelectedSpeciesId(null);
  }, []);
  const sightedCount = guideEntries.filter((entry) => entry.isSighted).length;
  const studiedCount = guideEntries.filter((entry) => entry.isStudied).length;
  const totalCount = guideEntries.length;
  const progressPercent =
    totalCount > 0 ? Math.round((sightedCount / totalCount) * 100) : 0;

  if (selectedEntry?.isSighted) {
    return (
      <RenderingPlazaBestiaryGuideDetailView
        entry={selectedEntry}
        onBack={closingSpeciesDetail}
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
            className={PLAZA_BESTIARY_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            Bestiary
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            {DEFINING_PLAZA_BESTIARY_PANEL_SUBTITLE}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_BESTIARY_PANEL_HEADER_BUTTON_CLASS_NAME}
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
          aria-label="Wildlife sighted"
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#c98a2d_0%,#d9a441_100%)] transition-[width] duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div
        className={PLAZA_BESTIARY_BIOME_TAB_BAR_CLASS_NAME}
        role="tablist"
        aria-label="Biome filters"
      >
        {biomeFilters.map((filter) => {
          const isActive = filter.id === biomeFilterId;

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn(
                PLAZA_BESTIARY_BIOME_TAB_BUTTON_CLASS_NAME,
                isActive && PLAZA_BESTIARY_BIOME_TAB_BUTTON_ACTIVE_CLASS_NAME
              )}
              onClick={() => selectingBiomeFilter(filter.id)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 touch-pan-y">
        <div className="grid grid-cols-2 content-start gap-1.5 sm:grid-cols-3 sm:gap-2">
          {filteredGuideEntries.map((entry) => (
            <RenderingPlazaBestiaryGuideCard
              key={entry.speciesId}
              entry={entry}
              onSelect={openingSpeciesDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
