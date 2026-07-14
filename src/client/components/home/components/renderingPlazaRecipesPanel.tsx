'use client';

/**
 * Codex Recipes guide panel: cookbook filters + attached / mystery recipe cards.
 *
 * @module components/home/components/renderingPlazaRecipesPanel
 */

import { RenderingPlazaRecipesGuideDetailView } from '@/components/home/components/renderingPlazaRecipesGuideDetailView';
import {
  DEFINING_PLAZA_RECIPES_PANEL_SUBTITLE,
  LABELING_PLAZA_RECIPES_ATTACHED_PROGRESS,
  LABELING_PLAZA_RECIPES_EMPTY_COOKBOOK,
  LABELING_PLAZA_RECIPES_UNDISCOVERED_NAME,
} from '@/components/home/domains/definingPlazaRecipesGuideConstants';
import { filteringPlazaRecipesGuideDisplayEntriesByCookbook } from '@/components/home/domains/filteringPlazaRecipesGuideDisplayEntriesByCookbook';
import {
  listingPlazaRecipesGuideCookbookFilters,
  type DefiningPlazaRecipesGuideCookbookFilterId,
} from '@/components/home/domains/listingPlazaRecipesGuideCookbookFilters';
import {
  resolvingPlazaRecipesGuideDisplayEntries,
  type PlazaRecipesGuideDisplayEntry,
} from '@/components/home/domains/resolvingPlazaRecipesGuideDisplayEntries';
import { DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER } from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaCampfireRecipePreview } from '@/components/world/building/components/renderingWorldPlazaCampfireRecipePreview';
import { RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview } from '@/components/world/building/components/renderingWorldPlazaCraftModeRecipeSpriteSheetPreview';
import type { DefiningWorldPlazaCraftModeRecipeId } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  gettingWorldPlazaRecipeAttachedSnapshot,
  subscribingWorldPlazaRecipeDiscovery,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { cn } from '@/lib/utils';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';

const PLAZA_RECIPES_PANEL_HEADER_BUTTON_CLASS_NAME =
  'plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]';

const PLAZA_RECIPES_COOKBOOK_TAB_BAR_CLASS_NAME =
  'flex shrink-0 flex-wrap gap-0.5 rounded-md border border-poster-teal/25 bg-parchment/40 p-0.5';

const PLAZA_RECIPES_COOKBOOK_TAB_BUTTON_CLASS_NAME =
  'rounded-sm border border-transparent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-soft transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40 sm:px-2 sm:text-[10px]';

const PLAZA_RECIPES_COOKBOOK_TAB_BUTTON_ACTIVE_CLASS_NAME =
  'border-poster-teal/30 bg-poster-teal/15 text-poster-teal-deep shadow-sm';

const PLAZA_RECIPES_GUIDE_TILE_BASE_CLASS_NAME =
  'flex w-full flex-col overflow-hidden rounded-md border';

const PLAZA_RECIPES_GUIDE_TILE_STAGE_CLASS_NAME =
  'relative flex aspect-square w-full items-center justify-center overflow-hidden';

const PLAZA_RECIPES_GUIDE_TILE_NAME_CLASS_NAME =
  'block truncate border-t px-1 py-1 text-center font-display text-[10px] font-bold uppercase tracking-wide sm:text-[11px]';

function RenderingPlazaRecipesGuideCardArt({
  entry,
}: {
  readonly entry: PlazaRecipesGuideDisplayEntry;
}): React.JSX.Element {
  if (
    entry.recipeDefinition.recipeVisual.visualKind === 'world-plaza-campfire'
  ) {
    return (
      <RenderingWorldPlazaCampfireRecipePreview
        presentation="card"
        isSilhouette={!entry.isAttached}
      />
    );
  }

  if (entry.recipeDefinition.recipeVisual.visualKind === 'sprite-sheet') {
    return (
      <RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview
        spriteSheetIcon={entry.recipeDefinition.recipeVisual.spriteSheetIcon}
        className={cn('size-[72%]', !entry.isAttached && 'opacity-90')}
        style={
          entry.isAttached
            ? undefined
            : { filter: DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER }
        }
      />
    );
  }

  return (
    <Icon
      icon={entry.silhouetteIconifyIcon}
      className={
        entry.isAttached ? 'size-[72%] text-[#8b5a2b]' : 'size-[72%] text-ink'
      }
      style={
        entry.isAttached
          ? undefined
          : { filter: DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER }
      }
      aria-hidden
    />
  );
}

export type RenderingPlazaRecipesPanelProps = {
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
};

function RenderingPlazaRecipesGuideCard({
  entry,
  onSelect,
}: {
  entry: PlazaRecipesGuideDisplayEntry;
  onSelect: (recipeId: DefiningWorldPlazaCraftModeRecipeId) => void;
}): React.JSX.Element {
  if (!entry.isAttached) {
    return (
      <article
        className={cn(
          PLAZA_RECIPES_GUIDE_TILE_BASE_CLASS_NAME,
          'border-poster-teal/20 bg-parchment/30'
        )}
      >
        <div className={PLAZA_RECIPES_GUIDE_TILE_STAGE_CLASS_NAME} aria-hidden>
          <RenderingPlazaRecipesGuideCardArt entry={entry} />
        </div>
        <span
          className={cn(
            PLAZA_RECIPES_GUIDE_TILE_NAME_CLASS_NAME,
            'border-poster-teal/15 tracking-[0.25em] text-ink-soft/60'
          )}
        >
          {LABELING_PLAZA_RECIPES_UNDISCOVERED_NAME}
        </span>
      </article>
    );
  }

  return (
    <button
      type="button"
      className={cn(
        PLAZA_RECIPES_GUIDE_TILE_BASE_CLASS_NAME,
        'cursor-pointer border-poster-teal/35 bg-parchment/50 text-left shadow-[0_2px_6px_rgba(28,25,18,0.18)] transition hover:border-poster-teal/55 hover:bg-parchment/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40'
      )}
      onClick={() => onSelect(entry.recipeId)}
      aria-label={`View ${entry.displayName} recipe`}
    >
      <div className={PLAZA_RECIPES_GUIDE_TILE_STAGE_CLASS_NAME} aria-hidden>
        <RenderingPlazaRecipesGuideCardArt entry={entry} />
      </div>
      <span
        className={cn(
          PLAZA_RECIPES_GUIDE_TILE_NAME_CLASS_NAME,
          'border-poster-teal/20 text-poster-teal-deep'
        )}
      >
        {entry.displayName}
      </span>
    </button>
  );
}

/**
 * Codex panel listing attached cookbook recipes and mystery slots for the rest.
 */
export function RenderingPlazaRecipesPanel({
  onBack,
  onClose,
  className = '',
}: RenderingPlazaRecipesPanelProps): React.JSX.Element {
  const [cookbookFilterId, setCookbookFilterId] =
    useState<DefiningPlazaRecipesGuideCookbookFilterId>('all');
  const [selectedRecipeId, setSelectedRecipeId] =
    useState<DefiningWorldPlazaCraftModeRecipeId | null>(null);
  const attachedRecipeIds = useSyncExternalStore(
    subscribingWorldPlazaRecipeDiscovery,
    gettingWorldPlazaRecipeAttachedSnapshot,
    () => []
  );
  const attachedSet = useMemo(
    () => new Set(attachedRecipeIds),
    [attachedRecipeIds]
  );
  const guideEntries = useMemo(
    () => resolvingPlazaRecipesGuideDisplayEntries(attachedSet),
    [attachedSet]
  );
  const filteredGuideEntries = useMemo(
    () =>
      filteringPlazaRecipesGuideDisplayEntriesByCookbook(
        guideEntries,
        cookbookFilterId
      ),
    [cookbookFilterId, guideEntries]
  );
  const selectedEntry = useMemo(
    () =>
      selectedRecipeId === null
        ? null
        : (guideEntries.find((entry) => entry.recipeId === selectedRecipeId) ??
          null),
    [guideEntries, selectedRecipeId]
  );
  const cookbookFilters = useMemo(
    () => listingPlazaRecipesGuideCookbookFilters(),
    []
  );
  const selectingCookbookFilter = useCallback(
    (filterId: DefiningPlazaRecipesGuideCookbookFilterId): void => {
      setCookbookFilterId(filterId);
    },
    []
  );
  const openingRecipeDetail = useCallback(
    (recipeId: DefiningWorldPlazaCraftModeRecipeId) => {
      setSelectedRecipeId(recipeId);
    },
    []
  );
  const closingRecipeDetail = useCallback((): void => {
    setSelectedRecipeId(null);
  }, []);
  const attachedCount = guideEntries.filter((entry) => entry.isAttached).length;
  const totalCount = guideEntries.length;
  const progressPercent =
    totalCount > 0 ? Math.round((attachedCount / totalCount) * 100) : 0;

  if (selectedEntry?.isAttached) {
    return (
      <RenderingPlazaRecipesGuideDetailView
        entry={selectedEntry}
        onBack={closingRecipeDetail}
        onClose={onClose}
        className={className}
      />
    );
  }

  return (
    <div
      className={`plaza-panel plaza-pop-in flex h-[min(90dvh,42rem)] w-full max-w-md flex-col gap-3 overflow-hidden rounded-md p-4 font-body sm:h-[min(85dvh,42rem)] sm:gap-4 sm:p-6 ${className}`.trim()}
    >
      <div className="flex shrink-0 items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className={PLAZA_RECIPES_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
          </button>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            Recipes
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            {DEFINING_PLAZA_RECIPES_PANEL_SUBTITLE}
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className={PLAZA_RECIPES_PANEL_HEADER_BUTTON_CLASS_NAME}
          >
            <Icon icon="mdi:close" className="size-5" aria-hidden />
          </button>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        <div className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wide text-ink-soft">
          <span>
            {LABELING_PLAZA_RECIPES_ATTACHED_PROGRESS} {attachedCount}/
            {totalCount}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-poster-teal/15">
          <div
            className="h-full rounded-full bg-poster-gold/80 transition-[width]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className={PLAZA_RECIPES_COOKBOOK_TAB_BAR_CLASS_NAME} role="tablist">
        {cookbookFilters.map((filter) => {
          const isActive = cookbookFilterId === filter.id;

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectingCookbookFilter(filter.id)}
              className={cn(
                PLAZA_RECIPES_COOKBOOK_TAB_BUTTON_CLASS_NAME,
                isActive && PLAZA_RECIPES_COOKBOOK_TAB_BUTTON_ACTIVE_CLASS_NAME
              )}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {filteredGuideEntries.length === 0 ? (
        <p className="py-8 text-center text-sm font-medium italic text-ink-soft">
          {LABELING_PLAZA_RECIPES_EMPTY_COOKBOOK}
        </p>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {filteredGuideEntries.map((entry) => (
              <RenderingPlazaRecipesGuideCard
                key={entry.recipeId}
                entry={entry}
                onSelect={openingRecipeDetail}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
