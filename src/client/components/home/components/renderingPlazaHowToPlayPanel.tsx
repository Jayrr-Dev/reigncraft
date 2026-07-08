'use client';

import { RenderingPlazaTutorialSection } from '@/components/home/components/renderingPlazaTutorialSection';
import { RenderingPlazaTutorialTabBar } from '@/components/home/components/renderingPlazaTutorialTabBar';
import {
  RenderingPlazaTutorialBuffBadgesDemo,
  RenderingPlazaTutorialBuildDemo,
  RenderingPlazaTutorialClimbBlocksDemo,
  RenderingPlazaTutorialCookWildMeatDemo,
  RenderingPlazaTutorialHealthDemo,
  RenderingPlazaTutorialHungerDemo,
  RenderingPlazaTutorialInventoryDemo,
  RenderingPlazaTutorialMeleeAttackDemo,
  RenderingPlazaTutorialMiniMapDemo,
  RenderingPlazaTutorialMovementDemo,
  RenderingPlazaTutorialPlotsAndClaimsDemo,
  RenderingPlazaTutorialRollDodgeDemo,
  RenderingPlazaTutorialRunJumpDemo,
  RenderingPlazaTutorialSaveCoordsDemo,
  RenderingPlazaTutorialSprintStaminaDemo,
  RenderingPlazaTutorialStatusEffectsDemo,
  RenderingPlazaTutorialTeleportPlotsDemo,
  RenderingPlazaTutorialTrackCoordsDemo,
  RenderingPlazaTutorialWorldLayersDemo,
  type RenderingPlazaTutorialDemoProps,
} from '@/components/home/components/renderingPlazaTutorialVisualDemos';
import {
  DEFINING_PLAZA_TUTORIAL_DEFAULT_TAB_ID,
  resolvingPlazaTutorialPanelSubtitle,
  resolvingPlazaTutorialTabs,
  type PlazaTutorialSectionId,
  type PlazaTutorialTabId,
} from '@/components/home/domains/definingPlazaTutorialConstants';
import { Icon } from '@/components/ui/icon';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMemo, useState } from 'react';

const PLAZA_TUTORIAL_SECTION_DEMOS: Record<
  PlazaTutorialSectionId,
  (props: RenderingPlazaTutorialDemoProps) => React.JSX.Element
> = {
  'move-around': RenderingPlazaTutorialMovementDemo,
  'run-jump': RenderingPlazaTutorialRunJumpDemo,
  'sprint-stamina': RenderingPlazaTutorialSprintStaminaDemo,
  'world-layers': RenderingPlazaTutorialWorldLayersDemo,
  'climb-blocks': RenderingPlazaTutorialClimbBlocksDemo,
  'roll-dodge': RenderingPlazaTutorialRollDodgeDemo,
  'melee-attack': RenderingPlazaTutorialMeleeAttackDemo,
  'plots-and-claims': RenderingPlazaTutorialPlotsAndClaimsDemo,
  'save-coords': RenderingPlazaTutorialSaveCoordsDemo,
  'track-coords': RenderingPlazaTutorialTrackCoordsDemo,
  'teleport-plots': RenderingPlazaTutorialTeleportPlotsDemo,
  'build-realm': RenderingPlazaTutorialBuildDemo,
  'stay-alive': RenderingPlazaTutorialHealthDemo,
  'manage-hunger': RenderingPlazaTutorialHungerDemo,
  'cook-wild-meat': RenderingPlazaTutorialCookWildMeatDemo,
  'read-minimap': RenderingPlazaTutorialMiniMapDemo,
  'use-inventory': RenderingPlazaTutorialInventoryDemo,
  'track-status-effects': RenderingPlazaTutorialStatusEffectsDemo,
  'track-buff-badges': RenderingPlazaTutorialBuffBadgesDemo,
};

const PLAZA_HOW_TO_PLAY_PANEL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

export type RenderingPlazaHowToPlayPanelProps = {
  /** When provided, renders the back button in the panel header. */
  onBack?: () => void;
  /** When provided, renders the close button in the panel header. */
  onClose?: () => void;
  /** Optional initial tab; defaults to movement. */
  initialTabId?: PlazaTutorialTabId;
  /** Extra classes on the outer panel shell. */
  className?: string;
  /**
   * When set, selects desktop vs mobile tutorial copy and demos.
   * Falls back to the viewport hook when omitted.
   */
  isMobile?: boolean;
};

/**
 * Reusable how-to-play panel with tabbed tutorial categories and live demos.
 * Add new tabs or sections in `definingPlazaTutorialConstants.ts`.
 */
export function RenderingPlazaHowToPlayPanel({
  onBack,
  onClose,
  initialTabId = DEFINING_PLAZA_TUTORIAL_DEFAULT_TAB_ID,
  className = '',
  isMobile: isMobileProp,
}: RenderingPlazaHowToPlayPanelProps): React.JSX.Element {
  const isMobileFromViewport = useIsMobile();
  const isMobile = isMobileProp ?? isMobileFromViewport;
  const tutorialTabs = useMemo(
    () => resolvingPlazaTutorialTabs(isMobile),
    [isMobile]
  );
  const panelSubtitle = useMemo(
    () => resolvingPlazaTutorialPanelSubtitle(isMobile),
    [isMobile]
  );

  const [activeTabId, setActiveTabId] =
    useState<PlazaTutorialTabId>(initialTabId);

  const activeTab =
    tutorialTabs.find((tab) => tab.id === activeTabId) ?? tutorialTabs[0];

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
            className={PLAZA_HOW_TO_PLAY_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            How to Play
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            {panelSubtitle}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_HOW_TO_PLAY_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div
        aria-hidden
        className="h-px shrink-0 bg-[linear-gradient(90deg,transparent,rgba(44,74,82,0.5),transparent)]"
      />

      <RenderingPlazaTutorialTabBar
        tabs={tutorialTabs}
        activeTabId={activeTab.id}
        onSelectTab={setActiveTabId}
      />

      <div
        role="tabpanel"
        aria-label={`${activeTab.label} tutorial`}
        className="scrollbar-none flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1"
      >
        {activeTab.sections.map((section, sectionIndex) => {
          const Demo = PLAZA_TUTORIAL_SECTION_DEMOS[section.id];

          return (
            <RenderingPlazaTutorialSection
              key={section.id}
              title={section.title}
              description={section.description}
              icon={section.icon}
              delayMs={60 + sectionIndex * 60}
            >
              <Demo isMobile={isMobile} />
            </RenderingPlazaTutorialSection>
          );
        })}
      </div>
    </div>
  );
}
