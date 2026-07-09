'use client';

import { RenderingPlazaBestiarySpritePortrait } from '@/components/home/components/renderingPlazaBestiarySpritePortrait';
import { DEFINING_PLAZA_BESTIARY_PORTRAIT_DETAIL_ZOOM } from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import type { PlazaBestiaryGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaBestiaryGuideDisplayEntries';
import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

const PLAZA_BESTIARY_DETAIL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_BESTIARY_DETAIL_STUDIED_BADGE_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadge} flex items-center gap-1 border border-emerald-500/60 bg-emerald-950/88 py-0 pl-0.5 pr-1.5 shadow-md`;

const PLAZA_BESTIARY_DETAIL_STUDIED_BADGE_SOCKET_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadgeSocket} flex size-4 shrink-0 items-center justify-center rounded-[2px]`;

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
          <p className="text-sm font-medium italic text-ink-soft">
            {entry.isStudied ? 'Studied entry' : 'Sighted entry'}
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
            {entry.isStudied ? (
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

            {entry.biomeLabels.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {entry.biomeLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-sm border border-poster-teal/25 bg-parchment/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-poster-teal-deep"
                  >
                    {label}
                  </span>
                ))}
              </div>
            ) : null}

            {entry.isStudied ? (
              <dl className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                {entry.temperamentLabel ? (
                  <div className="rounded-sm border border-poster-teal/20 bg-parchment/45 px-2 py-1.5">
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Temperament
                    </dt>
                    <dd className="mt-0.5 font-medium text-ink">
                      {entry.temperamentLabel}
                    </dd>
                  </div>
                ) : null}
                {entry.diet ? (
                  <div className="rounded-sm border border-poster-teal/20 bg-parchment/45 px-2 py-1.5">
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Diet
                    </dt>
                    <dd className="mt-0.5 font-medium text-ink">
                      {entry.diet}
                    </dd>
                  </div>
                ) : null}
                {entry.activityPatternLabel ? (
                  <div className="rounded-sm border border-poster-teal/20 bg-parchment/45 px-2 py-1.5">
                    <dt className="font-bold uppercase tracking-wide text-ink-soft">
                      Activity
                    </dt>
                    <dd className="mt-0.5 font-medium text-ink">
                      {entry.activityPatternLabel}
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : (
              <p className="mt-4 rounded-sm border border-dashed border-poster-teal/25 bg-parchment/35 px-3 py-2 text-[11px] font-medium italic text-ink-soft">
                Kill one to unlock temperament, diet, and fuller notes.
              </p>
            )}

            {entry.isStudied && entry.apostleFlavor ? (
              <p className="mt-4 border-l-2 border-poster-gold/50 pl-3 text-xs font-medium italic leading-snug text-ink-soft">
                {entry.apostleFlavor}
              </p>
            ) : null}
          </div>
        </article>
      </div>
    </div>
  );
}
