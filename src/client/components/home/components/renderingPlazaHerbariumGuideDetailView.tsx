'use client';

import {
  PLAZA_CODEX_DETAIL_STAT_CELL_CLASS_NAME,
  RenderingPlazaCodexStudyDetailSection,
} from '@/components/home/components/renderingPlazaCodexStudyDetailSections';
import { RenderingPlazaHerbariumBerryPortrait } from '@/components/home/components/renderingPlazaHerbariumBerryPortrait';
import { RenderingPlazaHerbariumCloverPortrait } from '@/components/home/components/renderingPlazaHerbariumCloverPortrait';
import { RenderingPlazaHerbariumFlowerPortrait } from '@/components/home/components/renderingPlazaHerbariumFlowerPortrait';
import { RenderingPlazaHerbariumTreePortrait } from '@/components/home/components/renderingPlazaHerbariumTreePortrait';
import { DEFINING_PLAZA_HERBARIUM_BERRY_PORTRAIT_DETAIL_ZOOM } from '@/components/home/domains/definingPlazaHerbariumBerryPortraitConstants';
import { DEFINING_PLAZA_HERBARIUM_CLOVER_PORTRAIT_DETAIL_ZOOM } from '@/components/home/domains/definingPlazaHerbariumCloverPortraitConstants';
import { DEFINING_PLAZA_HERBARIUM_FLOWER_PORTRAIT_DETAIL_ZOOM } from '@/components/home/domains/definingPlazaHerbariumFlowerPortraitConstants';
import { DEFINING_PLAZA_HERBARIUM_TREE_PORTRAIT_DETAIL_ZOOM } from '@/components/home/domains/definingPlazaHerbariumTreePortraitConstants';
import type { PlazaCodexStudyTrackId } from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  checkingPlazaCodexStudyTierUnlocked,
  formattingPlazaCodexStudyCountProgress,
  formattingPlazaCodexStudyProgressLabel,
  resolvingPlazaCodexStudyTierBookIcon,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';
import type { PlazaHerbariumGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaHerbariumGuideDisplayEntries';
import { resolvingPlazaHerbariumEntryRarityBadgeVariant } from '@/components/home/domains/resolvingPlazaHerbariumRarity';
import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { resolvingWorldPlazaFlowerEatEffectProcChance } from '@/components/world/inventory/domains/resolvingWorldPlazaFlowerEatEffectProcChance';
import { resolvingWorldPlazaInventoryItemDetailBadgeShellClassName } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDetailBadgeShellClassName';
import { cn } from '@/lib/utils';

const PLAZA_HERBARIUM_DETAIL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_HERBARIUM_DETAIL_STUDIED_BADGE_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadge} flex items-center gap-1 border border-emerald-500/60 bg-emerald-950/88 py-0 pl-0.5 pr-1.5 shadow-md`;

const PLAZA_HERBARIUM_DETAIL_STUDIED_BADGE_SOCKET_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadgeSocket} flex size-4 shrink-0 items-center justify-center rounded-[2px]`;

function resolvingPlazaHerbariumCodexStudyTrackId(
  entry: PlazaHerbariumGuideDisplayEntry
): PlazaCodexStudyTrackId {
  switch (entry.kind) {
    case 'flower':
      return 'herbarium-flower';
    case 'tree':
      return 'herbarium-tree';
    case 'clover':
      return 'herbarium-clover';
    case 'berry':
      return 'herbarium-berry';
  }
}

function labelingPlazaHerbariumPropertiesCellTitle(
  entry: PlazaHerbariumGuideDisplayEntry
): string {
  if (entry.kind === 'flower') {
    return 'Eaten';
  }

  if (entry.kind === 'clover') {
    return entry.cloverKind === 'four_leaf' ? 'Held' : 'Forage';
  }

  if (entry.kind === 'berry') {
    return entry.berryLootKind === 'tea_leaves' ? 'Gathered' : 'Eaten';
  }

  return 'Wood';
}

export type RenderingPlazaHerbariumGuideDetailViewProps = {
  entry: PlazaHerbariumGuideDisplayEntry;
  onBack: () => void;
  onClose?: () => void;
  className?: string;
};

/** Full-screen herbarium codex page for a sighted flower or tree. */
export function RenderingPlazaHerbariumGuideDetailView({
  entry,
  onBack,
  onClose,
  className = '',
}: RenderingPlazaHerbariumGuideDetailViewProps): React.JSX.Element {
  const trackId = resolvingPlazaHerbariumCodexStudyTrackId(entry);
  const studyCount = entry.studyCount;
  const studyProgressLabel = formattingPlazaCodexStudyProgressLabel(
    trackId,
    studyCount
  );
  const isFamiliarityUnlocked = checkingPlazaCodexStudyTierUnlocked(
    trackId,
    'familiarity',
    studyCount
  );
  const isExpertiseUnlocked = checkingPlazaCodexStudyTierUnlocked(
    trackId,
    'expertise',
    studyCount
  );
  const rawFlowerProcChancePercent = Math.round(
    resolvingWorldPlazaFlowerEatEffectProcChance({ preparation: 'raw' }) * 100
  );

  return (
    <div
      className={`plaza-panel plaza-pop-in flex max-h-[min(90dvh,42rem)] w-full max-w-md flex-col gap-3 overflow-hidden rounded-md p-4 font-body sm:max-h-[min(85dvh,42rem)] sm:gap-4 sm:p-6 ${className}`.trim()}
    >
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to herbarium list"
          className={PLAZA_HERBARIUM_DETAIL_HEADER_BUTTON_CLASS_NAME}
        >
          <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            {entry.displayName}
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm font-medium italic text-ink-soft">
            <span
              className={resolvingWorldPlazaInventoryItemDetailBadgeShellClassName(
                resolvingPlazaHerbariumEntryRarityBadgeVariant(entry.rarity)
              )}
            >
              {entry.rarityLabel}
            </span>
            <Icon
              icon={resolvingPlazaCodexStudyTierBookIcon(trackId, studyCount)}
              className="size-4 shrink-0 text-poster-teal-deep"
              aria-hidden
            />
            <span className="font-mono not-italic tabular-nums text-poster-teal-deep">
              {formattingPlazaCodexStudyCountProgress(trackId, studyCount)}
            </span>
            <span className="text-ink-soft/80">
              · {isFamiliarityUnlocked ? studyProgressLabel : 'Sighted entry'}
            </span>
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_HERBARIUM_DETAIL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 touch-pan-y">
        <article className="overflow-hidden rounded-md border border-poster-teal/35 bg-parchment/50 shadow-[0_2px_6px_rgba(28,25,18,0.18)]">
          <div className="relative flex h-28 items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_55%,#1a3038_100%)] sm:h-32">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_12px,rgba(255,255,255,0.03)_12px_24px)]" />
            {entry.kind === 'flower' ? (
              <RenderingPlazaHerbariumFlowerPortrait
                speciesId={entry.speciesId}
                variant="revealed"
                zoom={DEFINING_PLAZA_HERBARIUM_FLOWER_PORTRAIT_DETAIL_ZOOM}
                className="size-24 sm:size-28"
              />
            ) : entry.kind === 'clover' ? (
              <RenderingPlazaHerbariumCloverPortrait
                cloverKind={entry.cloverKind}
                variant="revealed"
                zoom={DEFINING_PLAZA_HERBARIUM_CLOVER_PORTRAIT_DETAIL_ZOOM}
                className="size-24 sm:size-28"
              />
            ) : entry.kind === 'berry' ? (
              <RenderingPlazaHerbariumBerryPortrait
                berryLootKind={entry.berryLootKind}
                variant="revealed"
                zoom={DEFINING_PLAZA_HERBARIUM_BERRY_PORTRAIT_DETAIL_ZOOM}
                className="size-24 sm:size-28"
              />
            ) : (
              <RenderingPlazaHerbariumTreePortrait
                treeVariant={entry.variant}
                variant="revealed"
                zoom={DEFINING_PLAZA_HERBARIUM_TREE_PORTRAIT_DETAIL_ZOOM}
                className="size-24 sm:size-28"
              />
            )}
            <span className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-full border border-poster-gold/50 bg-poster-teal-deep/85 text-parchment shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              <Icon icon={entry.icon} className="size-5" aria-hidden />
            </span>
            {entry.isFullyStudied ? (
              <div className="absolute right-3 top-3 z-10">
                <div
                  className={PLAZA_HERBARIUM_DETAIL_STUDIED_BADGE_CLASS_NAME}
                >
                  <span
                    className={
                      PLAZA_HERBARIUM_DETAIL_STUDIED_BADGE_SOCKET_CLASS_NAME
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
                  className={PLAZA_HERBARIUM_DETAIL_STUDIED_BADGE_CLASS_NAME}
                >
                  <span
                    className={
                      PLAZA_HERBARIUM_DETAIL_STUDIED_BADGE_SOCKET_CLASS_NAME
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
            {isFamiliarityUnlocked ? (
              <p className="text-sm font-medium leading-snug text-ink-soft">
                {entry.summary}
              </p>
            ) : null}

            <RenderingPlazaCodexStudyDetailSection
              trackId={trackId}
              studyCount={studyCount}
              tierId="understanding"
            >
              <p className="text-[11px] font-medium text-ink">
                {entry.studiedSummary}
              </p>
            </RenderingPlazaCodexStudyDetailSection>

            <RenderingPlazaCodexStudyDetailSection
              trackId={trackId}
              studyCount={studyCount}
              tierId="application"
            >
              <div className="space-y-2">
                {entry.propertiesSummary ? (
                  <p className="text-[11px] font-medium text-ink">
                    {entry.propertiesSummary}
                  </p>
                ) : null}
                {entry.biomeChips.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {entry.biomeChips.map((chip) => (
                      <span
                        key={chip.kind}
                        title={
                          chip.isExplored ? chip.label : 'Undiscovered region'
                        }
                        className={
                          chip.isExplored
                            ? 'rounded-sm border border-poster-teal/25 bg-parchment/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-poster-teal-deep'
                            : 'rounded-sm border border-poster-teal/15 bg-parchment/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft/55'
                        }
                      >
                        {chip.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] font-medium text-ink-soft">
                    No habitat recorded for this species.
                  </p>
                )}
              </div>
            </RenderingPlazaCodexStudyDetailSection>

            <RenderingPlazaCodexStudyDetailSection
              trackId={trackId}
              studyCount={studyCount}
              tierId="proficiency"
            >
              {entry.propertiesSummary ? (
                <div className={PLAZA_CODEX_DETAIL_STAT_CELL_CLASS_NAME}>
                  <dt className="font-bold uppercase tracking-wide text-ink-soft">
                    {labelingPlazaHerbariumPropertiesCellTitle(entry)}
                  </dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {entry.propertiesSummary}
                  </dd>
                </div>
              ) : null}
            </RenderingPlazaCodexStudyDetailSection>

            <RenderingPlazaCodexStudyDetailSection
              trackId={trackId}
              studyCount={studyCount}
              tierId="expertise"
            >
              <div className="space-y-2">
                {entry.kind === 'flower' && isExpertiseUnlocked ? (
                  <div className={PLAZA_CODEX_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Proc (raw)
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {rawFlowerProcChancePercent}% when eaten raw
                    </dd>
                  </div>
                ) : null}
                {entry.kind === 'flower' &&
                entry.eatEffectStatRows &&
                entry.eatEffectStatRows.length > 0 ? (
                  <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {entry.eatEffectStatRows.map((row) => (
                      <div
                        key={`${row.label}:${row.value}`}
                        className={cn(
                          PLAZA_CODEX_DETAIL_STAT_CELL_CLASS_NAME,
                          row.value.length > 42 ? 'sm:col-span-2' : null
                        )}
                      >
                        <dt className="font-bold uppercase tracking-wide text-ink-soft">
                          {row.label}
                        </dt>
                        <dd className="mt-0.5 font-mono text-[11px] tabular-nums font-medium leading-snug text-ink">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {entry.kind === 'clover' &&
                entry.luckyEffectStatRows &&
                entry.luckyEffectStatRows.length > 0 ? (
                  <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {entry.luckyEffectStatRows.map((row) => (
                      <div
                        key={`${row.label}:${row.value}`}
                        className={cn(
                          PLAZA_CODEX_DETAIL_STAT_CELL_CLASS_NAME,
                          row.value.length > 42 ? 'sm:col-span-2' : null
                        )}
                      >
                        <dt className="font-bold uppercase tracking-wide text-ink-soft">
                          {row.label}
                        </dt>
                        <dd className="mt-0.5 font-mono text-[11px] tabular-nums font-medium leading-snug text-ink">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </RenderingPlazaCodexStudyDetailSection>

            <RenderingPlazaCodexStudyDetailSection
              trackId={trackId}
              studyCount={studyCount}
              tierId="mastery"
            >
              {entry.apostleFlavor ? (
                <p className="border-l-2 border-poster-gold/50 pl-3 text-xs font-medium italic leading-snug text-ink-soft">
                  {entry.apostleFlavor}
                </p>
              ) : (
                <p className="text-[11px] font-medium text-ink">
                  {entry.studiedSummary}
                </p>
              )}
            </RenderingPlazaCodexStudyDetailSection>
          </div>
        </article>
      </div>
    </div>
  );
}
