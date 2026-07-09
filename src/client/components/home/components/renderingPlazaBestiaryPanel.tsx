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
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import {
  gettingWorldPlazaBestiaryKilledSpeciesSnapshot,
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
  'flex shrink-0 flex-wrap gap-1 rounded-md border border-poster-teal/25 bg-parchment/40 p-1';

const PLAZA_BESTIARY_BIOME_TAB_BUTTON_CLASS_NAME =
  'shrink-0 rounded-sm px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40 sm:text-xs';

const PLAZA_BESTIARY_BIOME_TAB_BUTTON_ACTIVE_CLASS_NAME =
  'border border-poster-teal/30 bg-poster-teal/15 text-poster-teal-deep shadow-sm';

const PLAZA_BESTIARY_GUIDE_CARD_BUTTON_CLASS_NAME =
  'group w-full cursor-pointer overflow-hidden rounded-md border text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

const PLAZA_BESTIARY_GUIDE_CARD_SIGHTED_BUTTON_CLASS_NAME =
  'border-poster-teal/35 bg-parchment/50 shadow-[0_2px_6px_rgba(28,25,18,0.18)] hover:border-poster-teal/55 hover:bg-parchment/65 hover:shadow-[0_3px_8px_rgba(28,25,18,0.22)]';

const PLAZA_BESTIARY_STUDIED_BADGE_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadge} absolute right-1 top-1 z-10 flex items-center gap-0.5 border border-emerald-500/60 bg-emerald-950/88 py-0 pl-0.5 pr-1 shadow-md`;

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
      <article className="relative overflow-hidden rounded-md border border-poster-teal/20 bg-parchment/30">
        <div
          className="relative flex h-20 items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#22333b_0%,#182329_60%,#10181d_100%)] sm:h-24"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_10px,rgba(255,255,255,0.03)_10px_20px)]" />
          <RenderingPlazaBestiarySpritePortrait
            speciesId={entry.speciesId}
            variant="silhouette"
            className="size-16 sm:size-20"
          />
        </div>
        <div className="flex items-center gap-1.5 border-t border-poster-teal/15 px-2.5 py-2">
          <Icon
            icon="mdi:lock"
            className="size-3.5 shrink-0 text-ink-soft/60"
            aria-hidden
          />
          <span className="truncate font-display text-sm font-bold tracking-[0.2em] text-ink-soft/70">
            ???
          </span>
        </div>
      </article>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        PLAZA_BESTIARY_GUIDE_CARD_BUTTON_CLASS_NAME,
        PLAZA_BESTIARY_GUIDE_CARD_SIGHTED_BUTTON_CLASS_NAME
      )}
      onClick={() => onSelect(entry.speciesId)}
      aria-label={`View ${entry.displayName} details`}
    >
      <div className="relative">
        {entry.isStudied ? (
          <div className={PLAZA_BESTIARY_STUDIED_BADGE_CLASS_NAME}>
            <Icon
              icon="mdi:shield-check"
              className="size-2.5 text-emerald-200"
              aria-hidden
            />
            <span className="font-display text-[8px] font-bold uppercase leading-none tracking-wide text-parchment">
              Studied
            </span>
          </div>
        ) : null}
        <div
          className="relative flex h-20 items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_55%,#1a3038_100%)] sm:h-24"
          aria-hidden
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_10px,rgba(255,255,255,0.03)_10px_20px)]" />
          <RenderingPlazaBestiarySpritePortrait
            speciesId={entry.speciesId}
            variant="revealed"
            className="size-16 sm:size-20"
          />
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
  const killedSpeciesIds = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiaryKilledSpeciesSnapshot,
    () => []
  );
  const sightedSet = useMemo(
    () => new Set(sightedSpeciesIds),
    [sightedSpeciesIds]
  );
  const killedSet = useMemo(
    () => new Set(killedSpeciesIds),
    [killedSpeciesIds]
  );
  const guideEntries = useMemo(
    () => resolvingPlazaBestiaryGuideDisplayEntries(sightedSet, killedSet),
    [killedSet, sightedSet]
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
      className={`plaza-panel plaza-pop-in flex max-h-[min(90dvh,42rem)] w-full max-w-md flex-col gap-3 overflow-hidden rounded-md p-4 font-body sm:max-h-[min(85dvh,42rem)] sm:gap-4 sm:p-6 ${className}`.trim()}
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

      <div className="shrink-0 rounded-md border border-poster-teal/25 bg-parchment/45 px-3 py-2">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide">
          <span className="text-ink-soft">Sighted</span>
          <span className="font-mono tabular-nums text-poster-teal-deep">
            {sightedCount} / {totalCount}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-ink-soft">
          <span>Studied</span>
          <span className="font-mono tabular-nums text-poster-teal-deep">
            {studiedCount}
          </span>
        </div>
        <div
          className="mt-1.5 h-2 overflow-hidden rounded-full border border-poster-teal/25 bg-poster-teal-deep/15"
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

      <div className="scrollbar-none grid min-h-0 flex-1 grid-cols-2 content-start gap-2 overflow-y-auto overscroll-contain pr-1 touch-pan-y sm:gap-2.5">
        {filteredGuideEntries.map((entry) => (
          <RenderingPlazaBestiaryGuideCard
            key={entry.speciesId}
            entry={entry}
            onSelect={openingSpeciesDetail}
          />
        ))}
      </div>
    </div>
  );
}
