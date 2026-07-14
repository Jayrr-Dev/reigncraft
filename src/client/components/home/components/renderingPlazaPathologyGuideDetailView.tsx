'use client';

import {
  LABELING_PLAZA_PATHOLOGY_STUDY_TIER_SECTION_TITLES,
  LABELING_PLAZA_PATHOLOGY_STUDY_TIER_TEASERS,
  type PlazaPathologyStudyTierId,
} from '@/components/home/domains/definingPlazaPathologyStudyTier';
import type { PlazaPathologyGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaPathologyGuideDisplayEntries';
import {
  checkingPlazaPathologyStudyTierUnlocked,
  formattingPlazaPathologyStudyCountProgress,
  formattingPlazaPathologyStudyProgressLabel,
  resolvingPlazaPathologyStudyTierBookIcon,
} from '@/components/home/domains/resolvingPlazaPathologyStudyTier';
import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { RenderingWorldPlazaEntityDiseaseIconGlyph } from '@/components/world/health/components/renderingWorldPlazaEntityDiseaseIconGlyph';
import { cn } from '@/lib/utils';

const PLAZA_PATHOLOGY_DETAIL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_PATHOLOGY_DETAIL_STUDIED_BADGE_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadge} flex items-center gap-1 border border-emerald-500/60 bg-emerald-950/88 py-0 pl-0.5 pr-1.5 shadow-md`;

const PLAZA_PATHOLOGY_DETAIL_STUDIED_BADGE_SOCKET_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadgeSocket} flex size-4 shrink-0 items-center justify-center rounded-[2px]`;

const PLAZA_PATHOLOGY_DETAIL_STAT_CELL_CLASS_NAME =
  'rounded-sm border border-poster-teal/20 bg-parchment/45 px-2 py-1.5 text-[11px]';

const PLAZA_PATHOLOGY_DETAIL_SECTION_TITLE_CLASS_NAME =
  'font-display text-[11px] font-bold uppercase tracking-wide text-poster-teal-deep';

const PLAZA_PATHOLOGY_DETAIL_TEASER_CLASS_NAME =
  'rounded-sm border border-dashed border-poster-teal/25 bg-parchment/35 px-3 py-2 text-[11px] font-medium italic text-ink-soft';

type RenderingPlazaPathologyGuideDetailSectionProps = {
  tierId: Exclude<PlazaPathologyStudyTierId, 'sighted'>;
  studyCount: number;
  children: React.ReactNode;
};

function RenderingPlazaPathologyGuideDetailSection({
  tierId,
  studyCount,
  children,
}: RenderingPlazaPathologyGuideDetailSectionProps): React.JSX.Element {
  const isUnlocked = checkingPlazaPathologyStudyTierUnlocked(
    tierId,
    studyCount
  );

  return (
    <section className="mt-4">
      <h3 className={PLAZA_PATHOLOGY_DETAIL_SECTION_TITLE_CLASS_NAME}>
        {LABELING_PLAZA_PATHOLOGY_STUDY_TIER_SECTION_TITLES[tierId]}
      </h3>
      {isUnlocked ? (
        <div className="mt-2">{children}</div>
      ) : (
        <p className={cn(PLAZA_PATHOLOGY_DETAIL_TEASER_CLASS_NAME, 'mt-2')}>
          {LABELING_PLAZA_PATHOLOGY_STUDY_TIER_TEASERS[tierId]}
        </p>
      )}
    </section>
  );
}

export type RenderingPlazaPathologyGuideDetailViewProps = {
  entry: PlazaPathologyGuideDisplayEntry;
  onBack: () => void;
  onClose?: () => void;
  className?: string;
};

/** Full-screen Pathology codex page for an obtained disease. */
export function RenderingPlazaPathologyGuideDetailView({
  entry,
  onBack,
  onClose,
  className = '',
}: RenderingPlazaPathologyGuideDetailViewProps): React.JSX.Element {
  const studyProgressLabel = formattingPlazaPathologyStudyProgressLabel(
    entry.studyCount
  );

  return (
    <div
      className={`plaza-panel plaza-pop-in flex max-h-[min(90dvh,42rem)] w-full max-w-md flex-col gap-3 overflow-hidden rounded-md p-4 font-body sm:max-h-[min(85dvh,42rem)] sm:gap-4 sm:p-6 ${className}`.trim()}
    >
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to pathology list"
          className={PLAZA_PATHOLOGY_DETAIL_HEADER_BUTTON_CLASS_NAME}
        >
          <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            {entry.displayName}
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm font-medium italic text-ink-soft">
            <span
              className={`rounded-sm border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${entry.hudIconBorderClassName} ${entry.hudIconColorClassName}`}
            >
              {entry.severityLabel}
            </span>
            <Icon
              icon={resolvingPlazaPathologyStudyTierBookIcon(entry.studyCount)}
              className="size-4 shrink-0 text-poster-teal-deep"
              aria-hidden
            />
            <span className="font-mono not-italic tabular-nums text-poster-teal-deep">
              {formattingPlazaPathologyStudyCountProgress(entry.studyCount)}
            </span>
            <span className="text-ink-soft/80">
              · {entry.isStudied ? studyProgressLabel : 'Logged entry'}
            </span>
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_PATHOLOGY_DETAIL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 touch-pan-y">
        <article className="overflow-hidden rounded-md border border-poster-teal/35 bg-parchment/50 shadow-[0_2px_6px_rgba(28,25,18,0.18)]">
          <div className="relative flex h-28 items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_55%,#1a3038_100%)] sm:h-32">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_12px,rgba(255,255,255,0.03)_12px_24px)]" />
            <span
              className={`flex size-20 items-center justify-center rounded-[4px] border sm:size-24 ${entry.hudIconBorderClassName}`}
            >
              <RenderingWorldPlazaEntityDiseaseIconGlyph
                diseaseId={entry.diseaseId}
                fallbackIcon={entry.icon}
                className="size-14 sm:size-16"
              />
            </span>
            {entry.isFullyStudied ? (
              <div className="absolute right-3 top-3 z-10">
                <div
                  className={PLAZA_PATHOLOGY_DETAIL_STUDIED_BADGE_CLASS_NAME}
                >
                  <span
                    className={
                      PLAZA_PATHOLOGY_DETAIL_STUDIED_BADGE_SOCKET_CLASS_NAME
                    }
                  >
                    <Icon
                      icon="mdi:shield-check"
                      className="size-3 text-emerald-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                      aria-hidden
                    />
                  </span>
                  <span className="font-display text-[10px] font-bold uppercase leading-none tracking-wide text-parchment [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_0_6px_rgba(0,0,0,0.55)]">
                    Fully studied
                  </span>
                </div>
              </div>
            ) : entry.isStudied ? (
              <div className="absolute right-3 top-3 z-10">
                <div
                  className={PLAZA_PATHOLOGY_DETAIL_STUDIED_BADGE_CLASS_NAME}
                >
                  <span
                    className={
                      PLAZA_PATHOLOGY_DETAIL_STUDIED_BADGE_SOCKET_CLASS_NAME
                    }
                  >
                    <Icon
                      icon="mdi:shield-check"
                      className="size-3 text-emerald-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                      aria-hidden
                    />
                  </span>
                  <span className="font-display text-[10px] font-bold uppercase leading-none tracking-wide text-parchment [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_0_6px_rgba(0,0,0,0.55)]">
                    Studied
                  </span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-poster-teal/20 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-sm font-medium leading-snug text-ink-soft">
              {entry.summary}
            </p>

            <RenderingPlazaPathologyGuideDetailSection
              tierId="fieldNotes"
              studyCount={entry.studyCount}
            >
              <p className="text-[11px] font-medium text-ink">
                {entry.studiedSummary}
              </p>
            </RenderingPlazaPathologyGuideDetailSection>

            <RenderingPlazaPathologyGuideDetailSection
              tierId="properties"
              studyCount={entry.studyCount}
            >
              {entry.propertiesSummary ? (
                <div className={PLAZA_PATHOLOGY_DETAIL_STAT_CELL_CLASS_NAME}>
                  <dt className="font-bold uppercase tracking-wide text-ink-soft">
                    Course
                  </dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {entry.propertiesSummary}
                  </dd>
                </div>
              ) : null}
              {entry.stageGuideEntries && entry.stageGuideEntries.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {entry.stageGuideEntries.map((stageEntry, index) => (
                    <li
                      key={`${entry.diseaseId}-stage-${index}`}
                      className="flex items-start gap-2 text-xs font-medium leading-snug text-ink-soft"
                    >
                      <span className="shrink-0 rounded bg-parchment/60 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-poster-teal-deep">
                        {stageEntry.timingLabel}
                      </span>
                      <span>{stageEntry.effectLabel}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </RenderingPlazaPathologyGuideDetailSection>

            <RenderingPlazaPathologyGuideDetailSection
              tierId="habitats"
              studyCount={entry.studyCount}
            >
              {entry.flowerSourceLabel ? (
                <p className="text-[11px] font-medium text-ink">
                  {entry.flowerSourceLabel}
                </p>
              ) : null}
              {entry.carrierChips && entry.carrierChips.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {entry.carrierChips.map((chip) => (
                    <span
                      key={chip.speciesId}
                      className="rounded-sm border border-poster-teal/25 bg-parchment/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-poster-teal-deep"
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>
              ) : !entry.flowerSourceLabel ? (
                <p className="text-[11px] font-medium text-ink-soft">
                  No wildlife carriers recorded for this illness.
                </p>
              ) : null}
            </RenderingPlazaPathologyGuideDetailSection>

            <RenderingPlazaPathologyGuideDetailSection
              tierId="full"
              studyCount={entry.studyCount}
            >
              <div className="grid grid-cols-2 gap-2">
                <div className={PLAZA_PATHOLOGY_DETAIL_STAT_CELL_CLASS_NAME}>
                  <dt className="font-bold uppercase tracking-wide text-ink-soft">
                    Incubation
                  </dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {entry.incubationRangeLabel ?? 'Unknown'}
                  </dd>
                </div>
                <div className={PLAZA_PATHOLOGY_DETAIL_STAT_CELL_CLASS_NAME}>
                  <dt className="font-bold uppercase tracking-wide text-ink-soft">
                    Illness
                  </dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {entry.illnessDurationRangeLabel ?? 'Unknown'}
                  </dd>
                </div>
              </div>
              {entry.apostleFlavor ? (
                <p className="mt-2 text-[11px] font-medium italic text-ink-soft">
                  {entry.apostleFlavor}
                </p>
              ) : null}
            </RenderingPlazaPathologyGuideDetailSection>
          </div>
        </article>
      </div>
    </div>
  );
}
