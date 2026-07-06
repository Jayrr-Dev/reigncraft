'use client';

import { DEFINING_PLAZA_BIOMES_PANEL_SUBTITLE } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
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
import { useMemo, useSyncExternalStore } from 'react';

const PLAZA_BIOMES_PANEL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

export type RenderingPlazaBiomesPanelProps = {
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
};

function RenderingPlazaBiomesGuideCard({
  entry,
}: {
  entry: PlazaBiomesGuideDisplayEntry;
}): React.JSX.Element {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-md border bg-parchment/35 transition-colors',
        entry.isExplored
          ? 'border-poster-teal/25'
          : 'border-poster-teal/15 opacity-90'
      )}
    >
      <div className="flex items-stretch gap-3 p-3">
        <div
          className={cn(
            'relative h-16 w-14 shrink-0 overflow-hidden rounded-sm border shadow-[inset_0_0_12px_rgba(0,0,0,0.25)]',
            entry.isExplored
              ? 'border-poster-teal/20'
              : 'border-black/20 grayscale'
          )}
          aria-hidden
        >
          <div
            className={cn(
              'absolute inset-0',
              entry.isExplored
                ? entry.skyBackdropClassName
                : 'bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900'
            )}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-5 border-t border-black/20"
            style={{
              backgroundColor: entry.isExplored ? entry.groundColor : '#1f2937',
            }}
          />
          {!entry.isExplored ? (
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold tracking-widest text-parchment/80">
              ???
            </span>
          ) : null}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Icon
              icon={entry.isExplored ? entry.icon : 'mdi:lock'}
              className={cn(
                'size-4 shrink-0',
                entry.isExplored ? 'text-poster-teal-deep' : 'text-ink-soft/70'
              )}
              aria-hidden
            />
            <h3
              className={cn(
                'truncate font-display text-base font-bold tracking-wide',
                entry.isExplored ? 'text-poster-teal-deep' : 'text-ink-soft/80'
              )}
            >
              {entry.displayName}
            </h3>
          </div>
          <p className="mt-1 text-xs font-medium leading-snug text-ink-soft">
            {entry.summary}
          </p>
        </div>
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

  return (
    <div
      className={`plaza-panel plaza-pop-in flex max-h-[min(85dvh,42rem)] w-full max-w-md flex-col gap-4 overflow-hidden rounded-md p-5 font-body sm:p-6 ${className}`.trim()}
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

      <div
        aria-hidden
        className="h-px shrink-0 bg-[linear-gradient(90deg,transparent,rgba(44,74,82,0.5),transparent)]"
      />

      <div className="scrollbar-none flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
        {guideEntries.map((entry) => (
          <RenderingPlazaBiomesGuideCard key={entry.kind} entry={entry} />
        ))}
      </div>
    </div>
  );
}
