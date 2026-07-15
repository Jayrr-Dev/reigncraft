'use client';

import { RenderingPlazaCodexDualProgress } from '@/components/home/components/renderingPlazaCodexDualProgress';
import { RenderingPlazaLapidaryGuideDetailView } from '@/components/home/components/renderingPlazaLapidaryGuideDetailView';
import { RenderingPlazaLapidaryOrePortrait } from '@/components/home/components/renderingPlazaLapidaryOrePortrait';
import { computingPlazaCodexAggregateStudyProgress } from '@/components/home/domains/computingPlazaCodexAggregateStudyProgress';
import { DEFINING_PLAZA_LAPIDARY_PANEL_SUBTITLE } from '@/components/home/domains/definingPlazaLapidaryGuideConstants';
import {
  resolvingPlazaLapidaryGuideDisplayEntries,
  type PlazaLapidaryGuideDisplayEntry,
} from '@/components/home/domains/resolvingPlazaLapidaryGuideDisplayEntries';
import { resolvingPlazaLapidaryEntryRarityBadgeVariant } from '@/components/home/domains/resolvingPlazaLapidaryRarity';
import {
  formattingPlazaLapidaryStudyCountProgress,
  resolvingPlazaLapidaryStudyTierBookIcon,
} from '@/components/home/domains/resolvingPlazaLapidaryStudyTier';
import { Icon } from '@/components/ui/icon';
import {
  gettingWorldPlazaExploredBiomesSnapshot,
  subscribingWorldPlazaExploredBiomes,
} from '@/components/world/domains/managingWorldPlazaExploredBiomesStore';
import {
  gettingWorldPlazaLapidaryOreStudyCountsSnapshot,
  gettingWorldPlazaLapidarySightedOreSpeciesSnapshot,
  subscribingWorldPlazaLapidaryDiscovery,
} from '@/components/world/domains/managingWorldPlazaLapidaryDiscoveryStore';
import { resolvingWorldPlazaInventoryItemDetailBadgeShellClassName } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailBadgeShellClassName';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const PLAZA_LAPIDARY_PANEL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_LAPIDARY_GUIDE_TILE_BASE_CLASS_NAME =
  'flex w-full flex-col overflow-hidden rounded-md border';

const PLAZA_LAPIDARY_GUIDE_TILE_STAGE_CLASS_NAME =
  'relative flex aspect-square w-full items-center justify-center overflow-hidden';

const PLAZA_LAPIDARY_GUIDE_TILE_NAME_CLASS_NAME =
  'block truncate border-t px-1 py-1 text-center font-display text-[10px] font-bold uppercase tracking-wide sm:text-[11px]';

export type RenderingPlazaLapidaryPanelProps = {
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
};

const PLAZA_LAPIDARY_GUIDE_TILE_RARITY_BADGE_CLASS_NAME =
  'h-4! max-w-18 px-1 text-[7px] sm:h-4! sm:px-1 sm:text-[7px]';

function RenderingPlazaLapidaryGuideCardRarityBadge({
  entry,
}: {
  entry: PlazaLapidaryGuideDisplayEntry;
}): React.JSX.Element {
  return (
    <div className="absolute right-1 top-1 z-1">
      <span
        className={cn(
          resolvingWorldPlazaInventoryItemDetailBadgeShellClassName(
            resolvingPlazaLapidaryEntryRarityBadgeVariant(entry.rarity)
          ),
          PLAZA_LAPIDARY_GUIDE_TILE_RARITY_BADGE_CLASS_NAME
        )}
      >
        {entry.rarityLabel}
      </span>
    </div>
  );
}

function RenderingPlazaLapidaryGuideCard({
  entry,
  onSelect,
}: {
  entry: PlazaLapidaryGuideDisplayEntry;
  onSelect: (entry: PlazaLapidaryGuideDisplayEntry) => void;
}): React.JSX.Element {
  if (!entry.isSighted) {
    return (
      <article
        className={cn(
          PLAZA_LAPIDARY_GUIDE_TILE_BASE_CLASS_NAME,
          'border-poster-teal/20 bg-parchment/30'
        )}
      >
        <div className={PLAZA_LAPIDARY_GUIDE_TILE_STAGE_CLASS_NAME} aria-hidden>
          <RenderingPlazaLapidaryOrePortrait
            speciesId={entry.speciesId}
            variant="silhouette"
            className="size-[48%]"
          />
          <RenderingPlazaLapidaryGuideCardRarityBadge entry={entry} />
        </div>
        <span
          className={cn(
            PLAZA_LAPIDARY_GUIDE_TILE_NAME_CLASS_NAME,
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
        PLAZA_LAPIDARY_GUIDE_TILE_BASE_CLASS_NAME,
        'cursor-pointer border-poster-teal/35 bg-parchment/50 text-left shadow-[0_2px_6px_rgba(28,25,18,0.18)] transition hover:border-poster-teal/55 hover:bg-parchment/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40'
      )}
      onClick={() => onSelect(entry)}
      aria-label={`View ${entry.displayName} details`}
    >
      <div className={PLAZA_LAPIDARY_GUIDE_TILE_STAGE_CLASS_NAME} aria-hidden>
        <RenderingPlazaLapidaryOrePortrait
          speciesId={entry.speciesId}
          variant="revealed"
          className="size-[48%]"
        />
        <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded-sm border border-poster-teal/35 bg-poster-teal-deep/90 px-1 py-0.5 shadow">
          <Icon
            icon={resolvingPlazaLapidaryStudyTierBookIcon(entry.studyCount)}
            className="size-2.5 text-parchment"
            aria-hidden
          />
          <span className="font-mono text-[8px] font-bold tabular-nums text-parchment">
            {formattingPlazaLapidaryStudyCountProgress(entry.studyCount)}
          </span>
        </span>
        <RenderingPlazaLapidaryGuideCardRarityBadge entry={entry} />
      </div>
      <span
        className={cn(
          PLAZA_LAPIDARY_GUIDE_TILE_NAME_CLASS_NAME,
          'border-poster-teal/20 text-poster-teal-deep'
        )}
      >
        {entry.displayName}
      </span>
    </button>
  );
}

/** Codex panel listing sighted ores and mystery slots for the rest. */
export function RenderingPlazaLapidaryPanel({
  onBack,
  onClose,
  className = '',
}: RenderingPlazaLapidaryPanelProps): React.JSX.Element {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const oreStudyCountsBySpeciesId = useSyncExternalStore(
    subscribingWorldPlazaLapidaryDiscovery,
    gettingWorldPlazaLapidaryOreStudyCountsSnapshot,
    () => ({})
  );
  const sightedOreSpeciesIds = useSyncExternalStore(
    subscribingWorldPlazaLapidaryDiscovery,
    gettingWorldPlazaLapidarySightedOreSpeciesSnapshot,
    () => []
  );
  const exploredBiomeKinds = useSyncExternalStore(
    subscribingWorldPlazaExploredBiomes,
    gettingWorldPlazaExploredBiomesSnapshot,
    () => []
  );
  const sightedOreSet = useMemo(
    () => new Set(sightedOreSpeciesIds),
    [sightedOreSpeciesIds]
  );
  const exploredKinds = useMemo(
    () => new Set(exploredBiomeKinds),
    [exploredBiomeKinds]
  );
  const guideEntries = useMemo(
    () =>
      resolvingPlazaLapidaryGuideDisplayEntries(
        oreStudyCountsBySpeciesId,
        sightedOreSet,
        exploredKinds
      ),
    [exploredKinds, oreStudyCountsBySpeciesId, sightedOreSet]
  );
  const resolvingPlazaLapidaryEntryId = useCallback(
    (entry: PlazaLapidaryGuideDisplayEntry): string => `ore:${entry.speciesId}`,
    []
  );
  const selectedEntry = useMemo(
    () =>
      selectedEntryId === null
        ? null
        : (guideEntries.find(
            (entry) => resolvingPlazaLapidaryEntryId(entry) === selectedEntryId
          ) ?? null),
    [guideEntries, resolvingPlazaLapidaryEntryId, selectedEntryId]
  );
  const openingEntryDetail = useCallback(
    (entry: PlazaLapidaryGuideDisplayEntry) => {
      setSelectedEntryId(resolvingPlazaLapidaryEntryId(entry));
    },
    [resolvingPlazaLapidaryEntryId]
  );
  const closingEntryDetail = useCallback((): void => {
    setSelectedEntryId(null);
  }, []);
  const sightedCount = guideEntries.filter((entry) => entry.isSighted).length;
  const totalCount = guideEntries.length;
  const studiedProgress = computingPlazaCodexAggregateStudyProgress(
    guideEntries.map((entry) => ({
      trackId: 'lapidary' as const,
      studyCount: entry.studyCount,
    }))
  );

  if (selectedEntry?.isSighted) {
    return (
      <RenderingPlazaLapidaryGuideDetailView
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
            className={PLAZA_LAPIDARY_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            Lapidary
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            {DEFINING_PLAZA_LAPIDARY_PANEL_SUBTITLE}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_LAPIDARY_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <RenderingPlazaCodexDualProgress
        left={{
          label: 'Sighted',
          value: sightedCount,
          max: totalCount,
          ariaLabel: 'Ores sighted',
        }}
        right={{
          label: 'Studied',
          value: studiedProgress.value,
          max: studiedProgress.max,
          ariaLabel: 'Ore study points',
        }}
      />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 touch-pan-y">
        <div className="grid grid-cols-2 content-start gap-1.5 sm:grid-cols-3 sm:gap-2">
          {guideEntries.map((entry) => (
            <RenderingPlazaLapidaryGuideCard
              key={resolvingPlazaLapidaryEntryId(entry)}
              entry={entry}
              onSelect={openingEntryDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
