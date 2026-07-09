'use client';

import {
  RenderingPlazaMechanicsBuffBadgeRollCurveDemo,
  RenderingPlazaMechanicsDamageTypeDemo,
  RenderingPlazaMechanicsStatusEffectTypeDemo,
} from '@/components/home/components/renderingPlazaMechanicsVisualDemos';
import { RenderingPlazaTutorialSection } from '@/components/home/components/renderingPlazaTutorialSection';
import {
  RenderingPlazaTutorialBiomesDemo,
  RenderingPlazaTutorialTemperatureDemo,
} from '@/components/home/components/renderingPlazaTutorialVisualDemos';
import type {
  PlazaMechanicsBuffBadgeFilterId,
  PlazaMechanicsTabId,
  PlazaMechanicsWorldSectionId,
} from '@/components/home/domains/definingPlazaMechanicsConstants';
import {
  DEFINING_PLAZA_MECHANICS_BADGES_INTRO,
  DEFINING_PLAZA_MECHANICS_BADGES_SEARCH_EMPTY_MESSAGE,
  DEFINING_PLAZA_MECHANICS_BADGES_SEARCH_LABEL,
  DEFINING_PLAZA_MECHANICS_BADGES_SEARCH_PLACEHOLDER,
  DEFINING_PLAZA_MECHANICS_BUFF_BADGE_FILTERS,
  DEFINING_PLAZA_MECHANICS_DAMAGE_SECTIONS,
  DEFINING_PLAZA_MECHANICS_DEFAULT_TAB_ID,
  DEFINING_PLAZA_MECHANICS_PANEL_SUBTITLE,
  DEFINING_PLAZA_MECHANICS_STATUS_EFFECT_SECTIONS,
  DEFINING_PLAZA_MECHANICS_TABS,
  DEFINING_PLAZA_MECHANICS_WORLD_SECTIONS,
} from '@/components/home/domains/definingPlazaMechanicsConstants';
import {
  filteringPlazaMechanicsBuffBadgeGuideGroupsBySearchQuery,
  filteringPlazaMechanicsDiseaseBadgeGuideEntriesBySearchQuery,
} from '@/components/home/domains/filteringPlazaMechanicsBadgeGuideEntriesBySearchQuery';
import type { PlazaMechanicsBuffBadgeGuideEntry } from '@/components/home/domains/resolvingPlazaMechanicsBuffBadgeGuideEntries';
import { listingPlazaMechanicsBuffBadgeGuideEntriesByCategory } from '@/components/home/domains/resolvingPlazaMechanicsBuffBadgeGuideEntries';
import { resolvingPlazaMechanicsBuffBadgePlayerImpact } from '@/components/home/domains/resolvingPlazaMechanicsBuffBadgePlayerImpact';
import {
  listingPlazaMechanicsDiseaseBadgeGuideEntries,
  resolvingPlazaMechanicsDiseaseBadgePlayerImpact,
  type PlazaMechanicsDiseaseBadgeGuideEntry,
} from '@/components/home/domains/resolvingPlazaMechanicsDiseaseBadgeGuideEntries';
import {
  listingPlazaMechanicsDiseaseStageGuideEntries,
  resolvingPlazaMechanicsDiseaseTimelineGuide,
} from '@/components/home/domains/resolvingPlazaMechanicsDiseaseStageGuideEntries';
import { Icon } from '@/components/ui/icon';
import { useMemo, useState } from 'react';

const PLAZA_MECHANICS_PANEL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_MECHANICS_TAB_BAR_CLASS_NAME =
  'flex shrink-0 gap-1 rounded-md border border-poster-teal/25 bg-parchment/40 p-1';

const PLAZA_MECHANICS_TAB_BUTTON_CLASS_NAME =
  'flex-1 rounded-sm px-2 py-1.5 text-xs font-bold uppercase tracking-wide text-ink-soft transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

const PLAZA_MECHANICS_TAB_BUTTON_ACTIVE_CLASS_NAME =
  'border border-poster-teal/30 bg-poster-teal/15 text-poster-teal-deep shadow-sm';

const PLAZA_MECHANICS_BADGE_FILTER_BUTTON_CLASS_NAME =
  'rounded-sm px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-soft transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

const PLAZA_MECHANICS_BADGE_FILTER_BUTTON_ACTIVE_CLASS_NAME =
  'border border-poster-teal/30 bg-poster-teal/15 text-poster-teal-deep';

const PLAZA_MECHANICS_BADGE_SEARCH_INPUT_CLASS_NAME =
  'w-full rounded-md border border-poster-teal/25 bg-parchment/50 py-2 pl-9 pr-9 text-sm font-medium text-ink placeholder:text-ink-soft/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

const PLAZA_MECHANICS_BADGE_LIST_BUTTON_CLASS_NAME =
  'flex w-full items-center gap-3 px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40';

const PLAZA_MECHANICS_BADGE_ACCORDION_ITEM_CLASS_NAME =
  'overflow-hidden rounded-md border border-poster-teal/20 bg-parchment/35 transition-colors';

const PLAZA_MECHANICS_BADGE_ACCORDION_ITEM_EXPANDED_CLASS_NAME =
  'border-poster-teal/40 bg-parchment/55';

const PLAZA_MECHANICS_WORLD_SECTION_DEMOS: Record<
  PlazaMechanicsWorldSectionId,
  () => React.JSX.Element
> = {
  'explore-biomes': RenderingPlazaTutorialBiomesDemo,
  'watch-temperature': RenderingPlazaTutorialTemperatureDemo,
  'frost-movement-slow': RenderingPlazaTutorialTemperatureDemo,
};

function filteringPlazaMechanicsBuffBadgeEntries(
  filterId: PlazaMechanicsBuffBadgeFilterId
): ReturnType<typeof listingPlazaMechanicsBuffBadgeGuideEntriesByCategory> {
  if (filterId === 'disease') {
    return [];
  }

  const grouped = listingPlazaMechanicsBuffBadgeGuideEntriesByCategory();

  if (filterId === 'all') {
    return grouped;
  }

  return grouped
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) => entry.polarity === filterId),
    }))
    .filter((group) => group.entries.length > 0);
}

function RenderingPlazaMechanicsDiseaseBadgeAccordionItem({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: PlazaMechanicsDiseaseBadgeGuideEntry;
  isExpanded: boolean;
  onToggle: (diseaseId: string) => void;
}): React.JSX.Element {
  const panelId = `plaza-mechanics-disease-panel-${entry.id}`;
  const playerImpact = isExpanded
    ? resolvingPlazaMechanicsDiseaseBadgePlayerImpact(entry.id)
    : null;
  const timelineGuide = isExpanded
    ? resolvingPlazaMechanicsDiseaseTimelineGuide(entry.id)
    : null;
  const stageGuideEntries = isExpanded
    ? listingPlazaMechanicsDiseaseStageGuideEntries(entry.id)
    : [];

  return (
    <div
      className={`${PLAZA_MECHANICS_BADGE_ACCORDION_ITEM_CLASS_NAME} ${
        isExpanded
          ? PLAZA_MECHANICS_BADGE_ACCORDION_ITEM_EXPANDED_CLASS_NAME
          : ''
      }`}
    >
      <button
        type="button"
        className={`${PLAZA_MECHANICS_BADGE_LIST_BUTTON_CLASS_NAME} hover:bg-parchment/25`}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => onToggle(entry.id)}
      >
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-[2px] border ${entry.hudIconBorderClassName}`}
        >
          <Icon
            icon={entry.icon}
            className={`size-4 ${entry.hudIconColorClassName}`}
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-display text-sm font-bold tracking-wide text-ink">
              {entry.label}
            </span>
            <span className="rounded bg-lime-950/50 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-lime-300">
              Disease
            </span>
          </span>
          <span className="mt-0.5 block text-xs font-medium text-ink-soft">
            {entry.timelineSubtitle}
          </span>
        </span>
        <Icon
          icon="mdi:chevron-down"
          className={`size-4 shrink-0 text-poster-teal-deep transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      {isExpanded ? (
        <div
          id={panelId}
          className="border-t border-poster-teal/15 px-3 pb-3 pt-2"
        >
          <p className="text-sm font-medium leading-snug text-ink-soft">
            {entry.description}
          </p>
          {timelineGuide ? (
            <p className="mt-1.5 text-xs font-medium leading-snug text-ink-soft">
              Incubation usually falls between{' '}
              {timelineGuide.incubationRangeLabel} with no symptoms (bell-curve
              roll per infection). Active illness usually lasts{' '}
              {timelineGuide.illnessDurationRangeLabel} once signs appear.
            </p>
          ) : null}
          {stageGuideEntries.length > 0 ? (
            <ul className="mt-2 space-y-1">
              {stageGuideEntries.map((stageEntry, index) => (
                <li
                  key={`${entry.id}-stage-${index}`}
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
          {playerImpact ? (
            <p className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold leading-snug text-ink">
              <Icon
                icon="mdi:arrow-down-bold"
                className="mt-0.5 size-4 shrink-0 text-red-700"
                aria-label="Bad for you"
              />
              <span>{playerImpact.replace(/^Bad for you: /, '')}</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function RenderingPlazaMechanicsBuffBadgeAccordionItem({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: PlazaMechanicsBuffBadgeGuideEntry;
  isExpanded: boolean;
  onToggle: (buffId: string) => void;
}): React.JSX.Element {
  const borderClassName =
    entry.polarity === 'debuff'
      ? 'border-red-400/70 bg-red-950/80'
      : 'border-poster-gold/55 bg-black/80';
  const iconClassName =
    entry.polarity === 'debuff' ? 'text-red-200' : 'text-poster-gold';
  const panelId = `plaza-mechanics-badge-panel-${entry.id}`;
  const playerImpact = isExpanded
    ? resolvingPlazaMechanicsBuffBadgePlayerImpact(entry.id)
    : null;

  return (
    <div
      className={`${PLAZA_MECHANICS_BADGE_ACCORDION_ITEM_CLASS_NAME} ${
        isExpanded
          ? PLAZA_MECHANICS_BADGE_ACCORDION_ITEM_EXPANDED_CLASS_NAME
          : ''
      }`}
    >
      <button
        type="button"
        className={`${PLAZA_MECHANICS_BADGE_LIST_BUTTON_CLASS_NAME} hover:bg-parchment/25`}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => onToggle(entry.id)}
      >
        <span
          className={`flex size-9 shrink-0 items-center justify-center rounded-[2px] border ${borderClassName}`}
        >
          <Icon icon={entry.icon} className={`size-4 ${iconClassName}`} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="font-display text-sm font-bold tracking-wide text-ink">
              {entry.label}
            </span>
            <span
              className={`rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                entry.polarity === 'debuff'
                  ? 'bg-red-950/50 text-red-300'
                  : 'bg-poster-teal/10 text-poster-teal-deep'
              }`}
            >
              {entry.polarityLabel}
            </span>
          </span>
          <span className="mt-0.5 block text-xs font-medium text-ink-soft">
            {entry.polarityLabel} · {entry.durationLabel}
          </span>
        </span>
        <Icon
          icon="mdi:chevron-down"
          className={`size-4 shrink-0 text-poster-teal-deep transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      {isExpanded ? (
        <div
          id={panelId}
          className="border-t border-poster-teal/15 px-3 pb-3 pt-2"
        >
          <p className="text-sm font-medium leading-snug text-ink-soft">
            {entry.description}
          </p>
          {playerImpact ? (
            <p className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold leading-snug text-ink">
              <Icon
                icon={
                  playerImpact.sentiment === 'good'
                    ? 'mdi:arrow-up-bold'
                    : playerImpact.sentiment === 'bad'
                      ? 'mdi:arrow-down-bold'
                      : 'mdi:swap-vertical-bold'
                }
                className={`mt-0.5 size-4 shrink-0 ${
                  playerImpact.sentiment === 'good'
                    ? 'text-emerald-700'
                    : playerImpact.sentiment === 'bad'
                      ? 'text-red-700'
                      : 'text-poster-amber'
                }`}
                aria-label={
                  playerImpact.sentiment === 'good'
                    ? 'Good for you'
                    : playerImpact.sentiment === 'bad'
                      ? 'Bad for you'
                      : 'Trade-off'
                }
              />
              <span>{playerImpact.text}</span>
            </p>
          ) : null}
          {isExpanded ? (
            <RenderingPlazaMechanicsBuffBadgeRollCurveDemo buffId={entry.id} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export type RenderingPlazaMechanicsPanelProps = {
  onBack?: () => void;
  onClose?: () => void;
  initialTabId?: PlazaMechanicsTabId;
  className?: string;
};

/**
 * Reusable mechanics guide with Combat, Status Effects, World, and Badges tabs.
 */
export function RenderingPlazaMechanicsPanel({
  onBack,
  onClose,
  initialTabId = DEFINING_PLAZA_MECHANICS_DEFAULT_TAB_ID,
  className = '',
}: RenderingPlazaMechanicsPanelProps): React.JSX.Element {
  const [activeTabId, setActiveTabId] =
    useState<PlazaMechanicsTabId>(initialTabId);
  const [expandedBuffBadgeId, setExpandedBuffBadgeId] = useState<string | null>(
    null
  );
  const [buffBadgeFilterId, setBuffBadgeFilterId] =
    useState<PlazaMechanicsBuffBadgeFilterId>('all');
  const [badgeSearchQuery, setBadgeSearchQuery] = useState('');

  const buffBadgeGroups = useMemo(
    () =>
      filteringPlazaMechanicsBuffBadgeGuideGroupsBySearchQuery(
        filteringPlazaMechanicsBuffBadgeEntries(buffBadgeFilterId),
        badgeSearchQuery
      ),
    [badgeSearchQuery, buffBadgeFilterId]
  );
  const diseaseBadgeEntries = useMemo(
    () =>
      filteringPlazaMechanicsDiseaseBadgeGuideEntriesBySearchQuery(
        buffBadgeFilterId === 'all' || buffBadgeFilterId === 'disease'
          ? listingPlazaMechanicsDiseaseBadgeGuideEntries()
          : [],
        badgeSearchQuery
      ),
    [badgeSearchQuery, buffBadgeFilterId]
  );
  const hasVisibleBadgeEntries =
    buffBadgeGroups.length > 0 || diseaseBadgeEntries.length > 0;

  const togglingBuffBadgeAccordion = (buffId: string): void => {
    setExpandedBuffBadgeId((currentExpandedBuffBadgeId) =>
      currentExpandedBuffBadgeId === buffId ? null : buffId
    );
  };

  const selectingMechanicsTab = (tabId: PlazaMechanicsTabId): void => {
    setActiveTabId(tabId);
    setExpandedBuffBadgeId(null);
    setBadgeSearchQuery('');
  };

  const selectingBuffBadgeFilter = (
    filterId: PlazaMechanicsBuffBadgeFilterId
  ): void => {
    setBuffBadgeFilterId(filterId);
    setExpandedBuffBadgeId(null);
  };

  const changingBadgeSearchQuery = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setBadgeSearchQuery(event.target.value);
    setExpandedBuffBadgeId(null);
  };

  const clearingBadgeSearchQuery = (): void => {
    setBadgeSearchQuery('');
    setExpandedBuffBadgeId(null);
  };

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
            className={PLAZA_MECHANICS_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            Mechanics
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            {DEFINING_PLAZA_MECHANICS_PANEL_SUBTITLE}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_MECHANICS_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div
        aria-hidden
        className="h-px shrink-0 bg-[linear-gradient(90deg,transparent,rgba(44,74,82,0.5),transparent)]"
      />

      <div
        className={PLAZA_MECHANICS_TAB_BAR_CLASS_NAME}
        role="tablist"
        aria-label="Mechanics sections"
      >
        {DEFINING_PLAZA_MECHANICS_TABS.map((tab) => {
          const isActive = tab.id === activeTabId;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`${PLAZA_MECHANICS_TAB_BUTTON_CLASS_NAME} ${
                isActive ? PLAZA_MECHANICS_TAB_BUTTON_ACTIVE_CLASS_NAME : ''
              }`}
              onClick={() => selectingMechanicsTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        aria-label={`${activeTabId} mechanics`}
        className="scrollbar-none flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-1"
      >
        {activeTabId === 'combat'
          ? DEFINING_PLAZA_MECHANICS_DAMAGE_SECTIONS.map(
              (section, sectionIndex) => (
                <RenderingPlazaTutorialSection
                  key={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  delayMs={60 + sectionIndex * 40}
                >
                  <RenderingPlazaMechanicsDamageTypeDemo
                    sectionId={section.id}
                  />
                </RenderingPlazaTutorialSection>
              )
            )
          : null}

        {activeTabId === 'status-effects'
          ? DEFINING_PLAZA_MECHANICS_STATUS_EFFECT_SECTIONS.map(
              (section, sectionIndex) => (
                <RenderingPlazaTutorialSection
                  key={section.id}
                  title={section.title}
                  description={section.description}
                  icon={section.icon}
                  delayMs={60 + sectionIndex * 40}
                >
                  <RenderingPlazaMechanicsStatusEffectTypeDemo
                    sectionId={section.id}
                  />
                </RenderingPlazaTutorialSection>
              )
            )
          : null}

        {activeTabId === 'world'
          ? DEFINING_PLAZA_MECHANICS_WORLD_SECTIONS.map(
              (section, sectionIndex) => {
                const Demo = PLAZA_MECHANICS_WORLD_SECTION_DEMOS[section.id];

                return (
                  <RenderingPlazaTutorialSection
                    key={section.id}
                    title={section.title}
                    description={section.description}
                    icon={section.icon}
                    delayMs={60 + sectionIndex * 40}
                  >
                    <Demo />
                  </RenderingPlazaTutorialSection>
                );
              }
            )
          : null}

        {activeTabId === 'badges' ? (
          <>
            <p className="text-sm font-medium leading-snug text-ink-soft">
              {DEFINING_PLAZA_MECHANICS_BADGES_INTRO}
            </p>
            <div className="relative">
              <Icon
                icon="mdi:magnify"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft/70"
                aria-hidden
              />
              <input
                type="search"
                value={badgeSearchQuery}
                onChange={changingBadgeSearchQuery}
                placeholder={DEFINING_PLAZA_MECHANICS_BADGES_SEARCH_PLACEHOLDER}
                aria-label={DEFINING_PLAZA_MECHANICS_BADGES_SEARCH_LABEL}
                className={PLAZA_MECHANICS_BADGE_SEARCH_INPUT_CLASS_NAME}
              />
              {badgeSearchQuery ? (
                <button
                  type="button"
                  onClick={clearingBadgeSearchQuery}
                  aria-label="Clear badge search"
                  className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 cursor-pointer items-center justify-center rounded-sm text-ink-soft transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40"
                >
                  <Icon icon="mdi:close" className="size-4" aria-hidden />
                </button>
              ) : null}
            </div>
            <div
              className="flex flex-wrap gap-1"
              role="tablist"
              aria-label="Buff badge filters"
            >
              {DEFINING_PLAZA_MECHANICS_BUFF_BADGE_FILTERS.map((filter) => {
                const isActive = filter.id === buffBadgeFilterId;

                return (
                  <button
                    key={filter.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${PLAZA_MECHANICS_BADGE_FILTER_BUTTON_CLASS_NAME} ${
                      isActive
                        ? PLAZA_MECHANICS_BADGE_FILTER_BUTTON_ACTIVE_CLASS_NAME
                        : ''
                    }`}
                    onClick={() => selectingBuffBadgeFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-4">
              {!hasVisibleBadgeEntries ? (
                <p className="rounded-md border border-poster-teal/20 bg-parchment/35 px-3 py-4 text-center text-sm font-medium text-ink-soft">
                  {DEFINING_PLAZA_MECHANICS_BADGES_SEARCH_EMPTY_MESSAGE}
                </p>
              ) : null}
              {buffBadgeGroups.map((group) => (
                <div key={group.categoryId} className="flex flex-col gap-2">
                  <h3 className="font-display text-xs font-bold uppercase tracking-wide text-poster-teal-deep">
                    {group.categoryLabel}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {group.entries.map((entry) => (
                      <RenderingPlazaMechanicsBuffBadgeAccordionItem
                        key={entry.id}
                        entry={entry}
                        isExpanded={expandedBuffBadgeId === entry.id}
                        onToggle={togglingBuffBadgeAccordion}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {diseaseBadgeEntries.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <h3 className="font-display text-xs font-bold uppercase tracking-wide text-poster-teal-deep">
                    Diseases
                  </h3>
                  <div className="flex flex-col gap-2">
                    {diseaseBadgeEntries.map((entry) => (
                      <RenderingPlazaMechanicsDiseaseBadgeAccordionItem
                        key={entry.id}
                        entry={entry}
                        isExpanded={expandedBuffBadgeId === entry.id}
                        onToggle={togglingBuffBadgeAccordion}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
