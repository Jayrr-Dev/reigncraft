'use client';

import { RenderingPlazaBiomesGuideCardForagingSection } from '@/components/home/components/renderingPlazaBiomesGuideCardForagingSection';
import type { PlazaBiomesGuideDisplayEntry } from '@/components/home/domains/resolvingPlazaBiomesGuideDisplayEntries';
import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import { cn } from '@/lib/utils';

const PLAZA_BIOMES_DETAIL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_BIOMES_DETAIL_RARITY_BADGE_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadge} flex items-center gap-1 border py-0 pl-0.5 pr-1.5 shadow-md`;

const PLAZA_BIOMES_DETAIL_RARITY_BADGE_SOCKET_CLASS_NAME = `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.statusEffectBadgeSocket} flex size-4 shrink-0 items-center justify-center rounded-[2px]`;

export type RenderingPlazaBiomesGuideDetailViewProps = {
  entry: PlazaBiomesGuideDisplayEntry;
  onBack: () => void;
  onClose?: () => void;
  className?: string;
};

/** Full-screen biome codex page for a discovered region. */
export function RenderingPlazaBiomesGuideDetailView({
  entry,
  onBack,
  onClose,
  className = '',
}: RenderingPlazaBiomesGuideDetailViewProps): React.JSX.Element {
  return (
    <div
      className={`plaza-panel plaza-pop-in flex max-h-[min(90dvh,42rem)] w-full max-w-md flex-col gap-3 overflow-hidden rounded-md p-4 font-body sm:max-h-[min(85dvh,42rem)] sm:gap-4 sm:p-6 ${className}`.trim()}
    >
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to biomes list"
          className={PLAZA_BIOMES_DETAIL_HEADER_BUTTON_CLASS_NAME}
        >
          <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            {entry.displayName}
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            Region details
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_BIOMES_DETAIL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 touch-pan-y">
        <article className="overflow-hidden rounded-md border border-poster-teal/35 bg-parchment/50 shadow-[0_2px_6px_rgba(28,25,18,0.18)]">
          <div
            className={cn(
              'relative h-28 overflow-hidden sm:h-32',
              entry.skyBackdropClassName
            )}
          >
            <div
              className="absolute inset-x-0 bottom-0 h-10 border-t-2 border-black/15"
              style={{ backgroundColor: entry.groundColor }}
            />
            <div className="absolute inset-0 shadow-[inset_0_0_24px_rgba(0,0,0,0.24)]" />
            <span className="absolute left-3 top-3 flex size-9 items-center justify-center rounded-full border border-poster-gold/50 bg-poster-teal-deep/85 text-parchment shadow-[0_1px_3px_rgba(0,0,0,0.4)]">
              <Icon icon={entry.icon} className="size-5" aria-hidden />
            </span>
            {/* Wrapper owns the absolute positioning; the badge shell class
                forces position: relative and would ignore right/top offsets. */}
            <div className="absolute right-3 top-3 z-10">
              <div
                className={cn(
                  PLAZA_BIOMES_DETAIL_RARITY_BADGE_CLASS_NAME,
                  entry.rarityBadgeBorderClassName
                )}
              >
                <span
                  className={PLAZA_BIOMES_DETAIL_RARITY_BADGE_SOCKET_CLASS_NAME}
                >
                  <Icon
                    icon={entry.rarityBadgeIcon}
                    className={cn(
                      'size-3 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]',
                      entry.rarityBadgeIconClassName
                    )}
                    aria-hidden
                  />
                </span>
                <span className="font-display text-[10px] font-bold uppercase leading-none tracking-wide text-parchment [text-shadow:0_1px_0_rgba(0,0,0,0.9),0_0_6px_rgba(0,0,0,0.55)]">
                  {entry.rarityLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-poster-teal/20 px-3 py-3 sm:px-4 sm:py-4">
            <p className="text-sm font-medium leading-snug text-ink-soft">
              {entry.summary}
            </p>
            {entry.foraging ? (
              <RenderingPlazaBiomesGuideCardForagingSection
                foraging={entry.foraging}
                animals={entry.animals}
                layout="detail"
              />
            ) : null}
          </div>
        </article>
      </div>
    </div>
  );
}
