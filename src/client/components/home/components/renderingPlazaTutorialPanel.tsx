'use client';

import {
  RenderingPlazaTutorialBuildDemo,
  RenderingPlazaTutorialClaimDemo,
  RenderingPlazaTutorialHealthDemo,
  RenderingPlazaTutorialMovementDemo,
  RenderingPlazaTutorialRunJumpDemo,
} from '@/components/home/components/renderingPlazaTutorialVisualDemos';
import { Icon } from '@/components/ui/icon';

export type RenderingPlazaTutorialPanelProps = {
  onBack: () => void;
};

type RenderingPlazaTutorialSectionProps = {
  title: string;
  description: string;
  icon: string;
  delayMs: number;
  children: React.ReactNode;
};

function RenderingPlazaTutorialSection({
  title,
  description,
  icon,
  delayMs,
  children,
}: RenderingPlazaTutorialSectionProps): React.JSX.Element {
  return (
    <section
      className="plaza-pop-in flex flex-col gap-3 rounded-md border border-poster-teal/20 bg-parchment/35 p-4"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-poster-gold/40 bg-poster-teal/10 text-poster-teal-deep">
          <Icon icon={icon} className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-base font-bold tracking-wide text-ink">
            {title}
          </h3>
          <p className="mt-0.5 text-sm font-medium leading-snug text-ink-soft">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

/**
 * Scrollable how-to-play panel with animated visual examples for core plaza
 * controls: movement, claim, build, and survival.
 */
export function RenderingPlazaTutorialPanel({
  onBack,
}: RenderingPlazaTutorialPanelProps): React.JSX.Element {
  return (
    <div className="plaza-panel plaza-pop-in flex max-h-[min(85dvh,42rem)] w-full max-w-md flex-col gap-4 overflow-hidden rounded-md p-5 font-body sm:p-6">
      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to mode select"
          className="plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]"
        >
          <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
        </button>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            How to Play
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            Learn the basics with live examples
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="h-px shrink-0 bg-[linear-gradient(90deg,transparent,rgba(44,74,82,0.5),transparent)]"
      />

      <div className="scrollbar-none flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1">
        <RenderingPlazaTutorialSection
          title="Move Around"
          description="Click any walkable tile to path there. On desktop, WASD and arrow keys work too."
          icon="ph:person-simple-run"
          delayMs={60}
        >
          <RenderingPlazaTutorialMovementDemo />
        </RenderingPlazaTutorialSection>

        <RenderingPlazaTutorialSection
          title="Run & Jump"
          description="Double-click to run, hold Shift while moving, or tap again on mobile while running. Press Space to jump."
          icon="mdi:arrow-up-bold"
          delayMs={120}
        >
          <RenderingPlazaTutorialRunJumpDemo />
        </RenderingPlazaTutorialSection>

        <RenderingPlazaTutorialSection
          title="Claim Land"
          description="Open Claim mode from the action bar (or press C), then select tiles beside your territory."
          icon="mdi:crosshairs-gps"
          delayMs={180}
        >
          <RenderingPlazaTutorialClaimDemo />
        </RenderingPlazaTutorialSection>

        <RenderingPlazaTutorialSection
          title="Build Your Realm"
          description="Switch to Build mode (B) on land you own. Stack blocks, raise walls, and shape the world."
          icon="mdi:hammer"
          delayMs={240}
        >
          <RenderingPlazaTutorialBuildDemo />
        </RenderingPlazaTutorialSection>

        <RenderingPlazaTutorialSection
          title="Stay Alive"
          description="Your health bar sits above your avatar. Avoid hazards, heal when you can, and watch for damage numbers."
          icon="solar:heart-pulse-bold"
          delayMs={300}
        >
          <RenderingPlazaTutorialHealthDemo />
        </RenderingPlazaTutorialSection>
      </div>
    </div>
  );
}
