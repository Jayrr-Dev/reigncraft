'use client';

import type { PlazaCodexStudyDetailSectionTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';
import {
  DEFINING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TIER_GATES,
  LABELING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TITLES,
  type PlazaCodexBestiaryExtraSectionId,
  type PlazaCodexStudyTrackId,
} from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  checkingPlazaCodexStudyTierUnlocked,
  labelingPlazaCodexAwarenessLabel,
  labelingPlazaCodexStudyTierSectionTitle,
  labelingPlazaCodexStudyTierTeaser,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';
import { cn } from '@/lib/utils';

export const PLAZA_CODEX_DETAIL_SECTION_TITLE_CLASS_NAME =
  'font-display text-[11px] font-bold uppercase tracking-wide text-poster-teal-deep';

export const PLAZA_CODEX_DETAIL_TEASER_CLASS_NAME =
  'rounded-sm border border-dashed border-poster-teal/25 bg-parchment/35 px-3 py-2 text-[11px] font-medium italic text-ink-soft';

export const PLAZA_CODEX_DETAIL_STAT_CELL_CLASS_NAME =
  'rounded-sm border border-poster-teal/20 bg-parchment/45 px-2 py-1.5 text-[11px]';

export type RenderingPlazaCodexStudyDetailSectionProps = {
  trackId: PlazaCodexStudyTrackId;
  studyCount: number;
  tierId: PlazaCodexStudyDetailSectionTierId;
  children: React.ReactNode;
  entryScaleMultiplier?: number;
  className?: string;
};

/** Generic codex detail section: title, teaser when locked, children when unlocked. */
export function RenderingPlazaCodexStudyDetailSection({
  trackId,
  studyCount,
  tierId,
  children,
  entryScaleMultiplier = 1,
  className = '',
}: RenderingPlazaCodexStudyDetailSectionProps): React.JSX.Element {
  const isUnlocked = checkingPlazaCodexStudyTierUnlocked(
    trackId,
    tierId,
    studyCount,
    entryScaleMultiplier
  );

  return (
    <section className={cn('mt-4', className)}>
      <h3 className={PLAZA_CODEX_DETAIL_SECTION_TITLE_CLASS_NAME}>
        {labelingPlazaCodexStudyTierSectionTitle(trackId, tierId)}
      </h3>
      {isUnlocked ? (
        <div className="mt-2">{children}</div>
      ) : (
        <p className={cn(PLAZA_CODEX_DETAIL_TEASER_CLASS_NAME, 'mt-2')}>
          {labelingPlazaCodexStudyTierTeaser(tierId)}
        </p>
      )}
    </section>
  );
}

export type RenderingPlazaCodexBestiaryExtraDetailSectionProps = {
  studyCount: number;
  sectionId: PlazaCodexBestiaryExtraSectionId;
  children: React.ReactNode;
  entryScaleMultiplier?: number;
  className?: string;
};

/** Bestiary-only detail section gated by extra-section tier map. */
export function RenderingPlazaCodexBestiaryExtraDetailSection({
  studyCount,
  sectionId,
  children,
  entryScaleMultiplier = 1,
  className = '',
}: RenderingPlazaCodexBestiaryExtraDetailSectionProps): React.JSX.Element {
  const tierId = DEFINING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TIER_GATES[sectionId];
  const isUnlocked = checkingPlazaCodexStudyTierUnlocked(
    'bestiary',
    tierId,
    studyCount,
    entryScaleMultiplier
  );

  return (
    <section className={cn('mt-4', className)}>
      <h3 className={PLAZA_CODEX_DETAIL_SECTION_TITLE_CLASS_NAME}>
        {LABELING_PLAZA_CODEX_BESTIARY_EXTRA_SECTION_TITLES[sectionId]}
      </h3>
      {isUnlocked ? (
        <div className="mt-2">{children}</div>
      ) : (
        <p className={cn(PLAZA_CODEX_DETAIL_TEASER_CLASS_NAME, 'mt-2')}>
          {labelingPlazaCodexStudyTierTeaser(tierId)}
        </p>
      )}
    </section>
  );
}

export type RenderingPlazaCodexStudyAwarenessBadgeProps = {
  trackId: PlazaCodexStudyTrackId;
  studyCount: number;
  entryScaleMultiplier?: number;
  className?: string;
};

/** Compact awareness label for the current unlocked study tier. */
export function RenderingPlazaCodexStudyAwarenessBadge({
  trackId,
  studyCount,
  entryScaleMultiplier = 1,
  className = '',
}: RenderingPlazaCodexStudyAwarenessBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        'rounded-sm border border-poster-teal/25 bg-parchment/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-poster-teal-deep not-italic',
        className
      )}
    >
      {labelingPlazaCodexAwarenessLabel(
        trackId,
        studyCount,
        entryScaleMultiplier
      )}
    </span>
  );
}
