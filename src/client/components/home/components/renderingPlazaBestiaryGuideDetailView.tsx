'use client';

import { RenderingPlazaBestiarySpritePortrait } from '@/components/home/components/renderingPlazaBestiarySpritePortrait';
import { DEFINING_PLAZA_BESTIARY_PORTRAIT_DETAIL_ZOOM } from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import {
  LABELING_PLAZA_BESTIARY_STUDY_TIER_SECTION_TITLES,
  LABELING_PLAZA_BESTIARY_STUDY_TIER_TEASERS,
  type PlazaBestiaryStudyTierId,
} from '@/components/home/domains/definingPlazaBestiaryStudyTier';
import type { PlazaBestiaryGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaBestiaryGuideDisplayEntries';
import {
  checkingPlazaBestiaryStudyTierUnlocked,
  formattingPlazaBestiaryKillProgressLabel,
  formattingPlazaBestiaryStudyCountProgress,
  resolvingPlazaBestiaryStudyTierBookIcon,
} from '@/components/home/domains/resolvingPlazaBestiaryStudyTier';
import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { cn } from '@/lib/utils';

const PLAZA_BESTIARY_DETAIL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_BESTIARY_DETAIL_STUDIED_BADGE_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadge} flex items-center gap-1 border border-emerald-500/60 bg-emerald-950/88 py-0 pl-0.5 pr-1.5 shadow-md`;

const PLAZA_BESTIARY_DETAIL_STUDIED_BADGE_SOCKET_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadgeSocket} flex size-4 shrink-0 items-center justify-center rounded-[2px]`;

const PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME =
  'rounded-sm border border-poster-teal/20 bg-parchment/45 px-2 py-1.5 text-[11px]';

const PLAZA_BESTIARY_DETAIL_SECTION_TITLE_CLASS_NAME =
  'font-display text-[11px] font-bold uppercase tracking-wide text-poster-teal-deep';

const PLAZA_BESTIARY_DETAIL_TEASER_CLASS_NAME =
  'rounded-sm border border-dashed border-poster-teal/25 bg-parchment/35 px-3 py-2 text-[11px] font-medium italic text-ink-soft';

type RenderingPlazaBestiaryGuideDetailSectionProps = {
  tierId: Exclude<PlazaBestiaryStudyTierId, 'sighted'>;
  killCount: number;
  children: React.ReactNode;
};

function RenderingPlazaBestiaryGuideDetailSection({
  tierId,
  killCount,
  children,
}: RenderingPlazaBestiaryGuideDetailSectionProps): React.JSX.Element {
  const isUnlocked = checkingPlazaBestiaryStudyTierUnlocked(tierId, killCount);

  return (
    <section className="mt-4">
      <h3 className={PLAZA_BESTIARY_DETAIL_SECTION_TITLE_CLASS_NAME}>
        {LABELING_PLAZA_BESTIARY_STUDY_TIER_SECTION_TITLES[tierId]}
      </h3>
      {isUnlocked ? (
        <div className="mt-2">{children}</div>
      ) : (
        <p className={cn(PLAZA_BESTIARY_DETAIL_TEASER_CLASS_NAME, 'mt-2')}>
          {LABELING_PLAZA_BESTIARY_STUDY_TIER_TEASERS[tierId]}
        </p>
      )}
    </section>
  );
}

export type RenderingPlazaBestiaryGuideDetailViewProps = {
  entry: PlazaBestiaryGuideDisplayEntry;
  onBack: () => void;
  onClose?: () => void;
  className?: string;
};

/** Full-screen bestiary codex page for a sighted species. */
export function RenderingPlazaBestiaryGuideDetailView({
  entry,
  onBack,
  onClose,
  className = '',
}: RenderingPlazaBestiaryGuideDetailViewProps): React.JSX.Element {
  const killProgressLabel = formattingPlazaBestiaryKillProgressLabel(
    entry.killCount
  );

  return (
    <div
      className={`plaza-panel plaza-pop-in flex max-h-[min(90dvh,42rem)] w-full max-w-md flex-col gap-3 overflow-hidden rounded-md p-4 font-body sm:max-h-[min(85dvh,42rem)] sm:gap-4 sm:p-6 ${className}`.trim()}
    >
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to bestiary list"
          className={PLAZA_BESTIARY_DETAIL_HEADER_BUTTON_CLASS_NAME}
        >
          <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            {entry.displayName}
          </h2>
          <p className="flex items-center gap-1.5 text-sm font-medium italic text-ink-soft">
            <Icon
              icon={resolvingPlazaBestiaryStudyTierBookIcon(entry.killCount)}
              className="size-4 shrink-0 text-poster-teal-deep"
              aria-hidden
            />
            <span className="font-mono not-italic tabular-nums text-poster-teal-deep">
              {formattingPlazaBestiaryStudyCountProgress(entry.killCount)}
            </span>
            <span className="text-ink-soft/80">
              · {entry.isStudied ? killProgressLabel : 'Sighted entry'}
            </span>
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_BESTIARY_DETAIL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 touch-pan-y">
        <article className="overflow-hidden rounded-md border border-poster-teal/35 bg-parchment/50 shadow-[0_2px_6px_rgba(28,25,18,0.18)]">
          <div className="relative flex h-28 items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_55%,#1a3038_100%)] sm:h-32">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_12px,rgba(255,255,255,0.03)_12px_24px)]" />
            <RenderingPlazaBestiarySpritePortrait
              speciesId={entry.speciesId}
              variant="revealed"
              zoom={DEFINING_PLAZA_BESTIARY_PORTRAIT_DETAIL_ZOOM}
              className="size-24 sm:size-28"
            />
            <span className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-full border border-poster-gold/50 bg-poster-teal-deep/85 text-parchment shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              <Icon icon={entry.icon} className="size-5" aria-hidden />
            </span>
            {entry.isFullyStudied ? (
              <div className="absolute right-3 top-3 z-10">
                <div className={PLAZA_BESTIARY_DETAIL_STUDIED_BADGE_CLASS_NAME}>
                  <span
                    className={
                      PLAZA_BESTIARY_DETAIL_STUDIED_BADGE_SOCKET_CLASS_NAME
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
                <div className={PLAZA_BESTIARY_DETAIL_STUDIED_BADGE_CLASS_NAME}>
                  <span
                    className={
                      PLAZA_BESTIARY_DETAIL_STUDIED_BADGE_SOCKET_CLASS_NAME
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
              {entry.isStudied ? entry.studiedSummary : entry.summary}
            </p>

            {entry.biomeChips.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
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
            ) : null}

            <RenderingPlazaBestiaryGuideDetailSection
              tierId="studied"
              killCount={entry.killCount}
            >
              <dl className="grid grid-cols-2 gap-2">
                {entry.temperamentLabel ? (
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Temperament
                    </dt>
                    <dd className="mt-0.5 font-medium text-ink">
                      {entry.temperamentLabel}
                    </dd>
                  </div>
                ) : null}
                {entry.diet ? (
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Diet
                    </dt>
                    <dd className="mt-0.5 font-medium text-ink">
                      {entry.diet}
                    </dd>
                  </div>
                ) : null}
                {entry.activityPatternLabel ? (
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Activity
                    </dt>
                    <dd className="mt-0.5 font-medium text-ink">
                      {entry.activityPatternLabel}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </RenderingPlazaBestiaryGuideDetailSection>

            <RenderingPlazaBestiaryGuideDetailSection
              tierId="combat"
              killCount={entry.killCount}
            >
              {entry.combatStats ? (
                <dl className="grid grid-cols-2 gap-2">
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Health
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.combatStats.maxHealth}
                    </dd>
                  </div>
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Attack
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.combatStats.attackPower}
                    </dd>
                  </div>
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Defense
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.combatStats.defense}
                    </dd>
                  </div>
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Attack speed
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.combatStats.attackIntervalMs}ms
                    </dd>
                  </div>
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Walk
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.combatStats.walkSpeedGridPerSecond} grid/s
                    </dd>
                  </div>
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Run
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.combatStats.runSpeedGridPerSecond} grid/s
                    </dd>
                  </div>
                </dl>
              ) : null}
            </RenderingPlazaBestiaryGuideDetailSection>

            <RenderingPlazaBestiaryGuideDetailSection
              tierId="procs"
              killCount={entry.killCount}
            >
              {entry.onHitProcRows && entry.onHitProcRows.length > 0 ? (
                <ul className="space-y-1.5">
                  {entry.onHitProcRows.map((procRow) => (
                    <li
                      key={`${procRow.label}-${procRow.procChancePercent}`}
                      className="flex items-center justify-between gap-2 rounded-sm border border-poster-teal/20 bg-parchment/45 px-2 py-1.5 text-[11px]"
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <Icon
                          icon={procRow.icon}
                          className="size-4 shrink-0 text-poster-teal-deep"
                          aria-hidden
                        />
                        <span className="truncate font-medium text-ink">
                          {procRow.label}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono tabular-nums font-bold text-poster-teal-deep">
                        {procRow.procChancePercent}%
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11px] font-medium text-ink-soft">
                  No on-hit effects recorded for this species.
                </p>
              )}
            </RenderingPlazaBestiaryGuideDetailSection>

            <RenderingPlazaBestiaryGuideDetailSection
              tierId="ecology"
              killCount={entry.killCount}
            >
              {entry.ecologyStats ? (
                <dl className="grid grid-cols-2 gap-2">
                  {entry.ecologyStats.favoritePreyLabels.length > 0 ? (
                    <div
                      className={cn(
                        PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME,
                        'col-span-2'
                      )}
                    >
                      <dt className="font-bold uppercase tracking-wide text-ink-soft">
                        Favorite prey
                      </dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {entry.ecologyStats.favoritePreyLabels.join(', ')}
                      </dd>
                    </div>
                  ) : null}
                  {entry.ecologyStats.preyAllowLabels.length > 0 ? (
                    <div
                      className={cn(
                        PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME,
                        'col-span-2'
                      )}
                    >
                      <dt className="font-bold uppercase tracking-wide text-ink-soft">
                        Hunts
                      </dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {entry.ecologyStats.preyAllowLabels.join(', ')}
                      </dd>
                    </div>
                  ) : null}
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Aggro radius
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.ecologyStats.aggroRadiusGrid} grid
                    </dd>
                  </div>
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Pack share
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.ecologyStats.packShareRadiusGrid} grid
                    </dd>
                  </div>
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Mass
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.ecologyStats.massKg} kg
                    </dd>
                  </div>
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Trophic tier
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.ecologyStats.trophicTier}
                    </dd>
                  </div>
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Stamina drain
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.ecologyStats.staminaDrainMultiplier}x
                    </dd>
                  </div>
                  <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Stamina regen
                    </dt>
                    <dd className="mt-0.5 font-mono tabular-nums font-medium text-ink">
                      {entry.ecologyStats.staminaRegenMultiplier}x
                    </dd>
                  </div>
                </dl>
              ) : null}
            </RenderingPlazaBestiaryGuideDetailSection>

            <RenderingPlazaBestiaryGuideDetailSection
              tierId="full"
              killCount={entry.killCount}
            >
              {entry.lootStats ? (
                <div className="space-y-2">
                  <dl className="grid grid-cols-2 gap-2">
                    <div className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}>
                      <dt className="font-bold uppercase tracking-wide text-ink-soft">
                        Loot
                      </dt>
                      <dd className="mt-0.5 font-medium text-ink">
                        {entry.lootStats.lootQuantity}x{' '}
                        {entry.lootStats.rawMeatLabel}
                      </dd>
                    </div>
                    {entry.lootStats.rawDiseaseLabel &&
                    entry.lootStats.rawDiseaseChancePercent !== null ? (
                      <div
                        className={PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME}
                      >
                        <dt className="font-bold uppercase tracking-wide text-ink-soft">
                          Raw disease
                        </dt>
                        <dd className="mt-0.5 flex items-center justify-between gap-2 font-medium text-ink">
                          <span className="flex min-w-0 items-center gap-1.5">
                            {entry.lootStats.rawDiseaseIcon ? (
                              <Icon
                                icon={entry.lootStats.rawDiseaseIcon}
                                className="size-4 shrink-0 text-poster-teal-deep"
                                aria-hidden
                              />
                            ) : null}
                            <span className="truncate">
                              {entry.lootStats.rawDiseaseLabel}
                            </span>
                          </span>
                          <span className="shrink-0 font-mono tabular-nums font-bold text-poster-teal-deep">
                            {entry.lootStats.rawDiseaseChancePercent}%
                          </span>
                        </dd>
                      </div>
                    ) : null}
                    {entry.lootStats.cookedWellFedLabel &&
                    entry.lootStats.cookedWellFedChancePercent !== null ? (
                      <div
                        className={cn(
                          PLAZA_BESTIARY_DETAIL_STAT_CELL_CLASS_NAME,
                          'col-span-2'
                        )}
                      >
                        <dt className="font-bold uppercase tracking-wide text-ink-soft">
                          Cooked buff
                        </dt>
                        <dd className="mt-0.5 flex items-center justify-between gap-2 font-medium text-ink">
                          <span className="flex min-w-0 items-center gap-1.5">
                            {entry.lootStats.cookedWellFedIcon ? (
                              <Icon
                                icon={entry.lootStats.cookedWellFedIcon}
                                className="size-4 shrink-0 text-poster-teal-deep"
                                aria-hidden
                              />
                            ) : null}
                            <span className="truncate">
                              {entry.lootStats.cookedWellFedLabel}
                            </span>
                          </span>
                          <span className="shrink-0 font-mono tabular-nums font-bold text-poster-teal-deep">
                            {entry.lootStats.cookedWellFedChancePercent}%
                          </span>
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  {entry.lootStats.hazardLabels.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {entry.lootStats.hazardLabels.map((label) => (
                        <span
                          key={label}
                          className="rounded-sm border border-poster-teal/25 bg-parchment/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-poster-teal-deep"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {entry.apostleFlavor ? (
                    <p className="border-l-2 border-poster-gold/50 pl-3 text-xs font-medium italic leading-snug text-ink-soft">
                      {entry.apostleFlavor}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </RenderingPlazaBestiaryGuideDetailSection>
          </div>
        </article>
      </div>
    </div>
  );
}
