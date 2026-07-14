'use client';

import { RenderingPlazaPathologyGuideDetailView } from '@/components/home/components/renderingPlazaPathologyGuideDetailView';
import { DEFINING_PLAZA_PATHOLOGY_PANEL_SUBTITLE } from '@/components/home/domains/definingPlazaPathologyGuideConstants';
import {
  resolvingPlazaPathologyGuideDisplayEntries,
  type PlazaPathologyGuideDisplayEntry,
} from '@/components/home/domains/resolvingPlazaPathologyGuideDisplayEntries';
import {
  formattingPlazaPathologyStudyCountProgress,
  resolvingPlazaPathologyStudyTierBookIcon,
} from '@/components/home/domains/resolvingPlazaPathologyStudyTier';
import { Icon } from '@/components/ui/icon';
import {
  gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot,
  gettingWorldPlazaPathologyObtainedDiseasesSnapshot,
  subscribingWorldPlazaPathologyDiscovery,
} from '@/components/world/domains/managingWorldPlazaPathologyDiscoveryStore';
import { RenderingWorldPlazaEntityDiseaseIconGlyph } from '@/components/world/health/components/renderingWorldPlazaEntityDiseaseIconGlyph';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const PLAZA_PATHOLOGY_PANEL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_PATHOLOGY_GUIDE_TILE_BASE_CLASS_NAME =
  'flex w-full flex-col overflow-hidden rounded-md border';

const PLAZA_PATHOLOGY_GUIDE_TILE_STAGE_CLASS_NAME =
  'relative flex aspect-square w-full items-center justify-center overflow-hidden';

const PLAZA_PATHOLOGY_GUIDE_TILE_NAME_CLASS_NAME =
  'block truncate border-t px-1 py-1 text-center font-display text-[10px] font-bold uppercase tracking-wide sm:text-[11px]';

export type RenderingPlazaPathologyPanelProps = {
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
};

function RenderingPlazaPathologyGuideCard({
  entry,
  onSelect,
}: {
  entry: PlazaPathologyGuideDisplayEntry;
  onSelect: (entry: PlazaPathologyGuideDisplayEntry) => void;
}): React.JSX.Element {
  if (!entry.isObtained) {
    return (
      <article
        className={cn(
          PLAZA_PATHOLOGY_GUIDE_TILE_BASE_CLASS_NAME,
          'border-poster-teal/20 bg-parchment/30'
        )}
      >
        <div
          className={PLAZA_PATHOLOGY_GUIDE_TILE_STAGE_CLASS_NAME}
          aria-hidden
        >
          <RenderingWorldPlazaEntityDiseaseIconGlyph
            diseaseId={entry.diseaseId}
            fallbackIcon="mdi:biohazard"
            variant="silhouette"
            className="size-[42%]"
          />
        </div>
        <span
          className={cn(
            PLAZA_PATHOLOGY_GUIDE_TILE_NAME_CLASS_NAME,
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
        PLAZA_PATHOLOGY_GUIDE_TILE_BASE_CLASS_NAME,
        'cursor-pointer border-poster-teal/35 bg-parchment/50 text-left shadow-[0_2px_6px_rgba(28,25,18,0.18)] transition hover:border-poster-teal/55 hover:bg-parchment/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40'
      )}
      onClick={() => onSelect(entry)}
      aria-label={`View ${entry.displayName} details`}
    >
      <div className={PLAZA_PATHOLOGY_GUIDE_TILE_STAGE_CLASS_NAME} aria-hidden>
        <span
          className={`flex size-[48%] items-center justify-center rounded-[3px] border ${entry.hudIconBorderClassName}`}
        >
          <RenderingWorldPlazaEntityDiseaseIconGlyph
            diseaseId={entry.diseaseId}
            fallbackIcon={entry.icon}
            className="size-[70%]"
          />
        </span>
        <span className="absolute left-1 top-1 flex items-center gap-0.5 rounded-sm border border-poster-teal/35 bg-poster-teal-deep/90 px-1 py-0.5 shadow">
          <Icon
            icon={resolvingPlazaPathologyStudyTierBookIcon(entry.studyCount)}
            className="size-2.5 text-parchment"
            aria-hidden
          />
          <span className="font-mono text-[8px] font-bold tabular-nums text-parchment">
            {formattingPlazaPathologyStudyCountProgress(entry.studyCount)}
          </span>
        </span>
        <span
          className={`absolute right-1 top-1 rounded-sm border px-1 py-0.5 text-[7px] font-bold uppercase tracking-wide ${entry.hudIconBorderClassName} ${entry.hudIconColorClassName}`}
        >
          {entry.severityLabel}
        </span>
      </div>
      <span
        className={cn(
          PLAZA_PATHOLOGY_GUIDE_TILE_NAME_CLASS_NAME,
          'border-poster-teal/20 text-poster-teal-deep'
        )}
      >
        {entry.displayName}
      </span>
    </button>
  );
}

/** Codex panel listing obtained diseases and mystery slots for the rest. */
export function RenderingPlazaPathologyPanel({
  onBack,
  onClose,
  className = '',
}: RenderingPlazaPathologyPanelProps): React.JSX.Element {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const obtainedDiseaseIds = useSyncExternalStore(
    subscribingWorldPlazaPathologyDiscovery,
    gettingWorldPlazaPathologyObtainedDiseasesSnapshot,
    () => []
  );
  const linkedCreatureStudiesByDiseaseId = useSyncExternalStore(
    subscribingWorldPlazaPathologyDiscovery,
    gettingWorldPlazaPathologyLinkedCreatureStudiesSnapshot,
    () => ({})
  );
  const obtainedSet = useMemo(
    () => new Set(obtainedDiseaseIds),
    [obtainedDiseaseIds]
  );
  const guideEntries = useMemo(
    () =>
      resolvingPlazaPathologyGuideDisplayEntries(
        obtainedSet,
        linkedCreatureStudiesByDiseaseId
      ),
    [linkedCreatureStudiesByDiseaseId, obtainedSet]
  );
  const resolvingPlazaPathologyEntryId = useCallback(
    (entry: PlazaPathologyGuideDisplayEntry): string =>
      `disease:${entry.diseaseId}`,
    []
  );
  const selectedEntry = useMemo(
    () =>
      selectedEntryId === null
        ? null
        : (guideEntries.find(
            (entry) => resolvingPlazaPathologyEntryId(entry) === selectedEntryId
          ) ?? null),
    [guideEntries, resolvingPlazaPathologyEntryId, selectedEntryId]
  );
  const openingEntryDetail = useCallback(
    (entry: PlazaPathologyGuideDisplayEntry) => {
      setSelectedEntryId(resolvingPlazaPathologyEntryId(entry));
    },
    [resolvingPlazaPathologyEntryId]
  );
  const closingEntryDetail = useCallback((): void => {
    setSelectedEntryId(null);
  }, []);
  const obtainedCount = guideEntries.filter((entry) => entry.isObtained).length;
  const studiedCount = guideEntries.filter((entry) => entry.isStudied).length;
  const totalCount = guideEntries.length;
  const progressPercent =
    totalCount > 0 ? Math.round((obtainedCount / totalCount) * 100) : 0;

  if (selectedEntry?.isObtained) {
    return (
      <RenderingPlazaPathologyGuideDetailView
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
            className={PLAZA_PATHOLOGY_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            Pathology
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            {DEFINING_PLAZA_PATHOLOGY_PANEL_SUBTITLE}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_PATHOLOGY_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="shrink-0 rounded-md border border-poster-teal/25 bg-parchment/45 px-3 py-1.5">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
          <span>
            Logged{' '}
            <span className="font-mono tabular-nums text-poster-teal-deep">
              {obtainedCount}/{totalCount}
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
          aria-valuenow={obtainedCount}
          aria-label="Diseases logged"
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#c98a2d_0%,#d9a441_100%)] transition-[width] duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 touch-pan-y">
        <div className="grid grid-cols-2 content-start gap-1.5 sm:grid-cols-3 sm:gap-2">
          {guideEntries.map((entry) => (
            <RenderingPlazaPathologyGuideCard
              key={resolvingPlazaPathologyEntryId(entry)}
              entry={entry}
              onSelect={openingEntryDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
