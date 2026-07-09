'use client';

import { DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBestiaryGuideConstants';
import {
  DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS,
  type PlazaBestiaryStudyTierId,
} from '@/components/home/domains/definingPlazaBestiaryStudyTier';
import { resolvingPlazaBestiaryStudyTierId } from '@/components/home/domains/resolvingPlazaBestiaryStudyTier';
import {
  DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT,
  DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_KILL_PRESETS,
  DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_UNLOCK_SPECIES_IDS,
} from '@/components/world/domains/definingWorldPlazaDevModeBestiaryUnlockConstants';
import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  gettingWorldPlazaBestiaryKillCountsSnapshot,
  gettingWorldPlazaBestiarySightedSpeciesSnapshot,
  lockingWorldPlazaBestiaryDiscoveryAllForDev,
  settingWorldPlazaBestiarySpeciesKillCountForDev,
  settingWorldPlazaBestiarySpeciesSightedForDev,
  subscribingWorldPlazaBestiaryDiscovery,
  unlockingWorldPlazaBestiaryDiscoveryAllForDev,
} from '@/components/world/domains/managingWorldPlazaBestiaryDiscoveryStore';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { useMemo, useState, useSyncExternalStore } from 'react';

const RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_ACTION_BUTTON_CLASS_NAME =
  'rounded border border-white/20 bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/90 hover:bg-white/10' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_ACTION_BUTTON_PRIMARY_CLASS_NAME =
  'rounded border border-violet-300/45 bg-violet-500/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-violet-100 hover:bg-violet-500/30' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_ROW_CLASS_NAME =
  'flex flex-col gap-1 rounded border border-white/10 bg-black/35 px-2 py-1.5' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_TOGGLE_LOCKED_CLASS_NAME =
  'rounded border border-white/15 bg-black/45 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/45 hover:text-white/70' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_TOGGLE_UNLOCKED_CLASS_NAME =
  'rounded border border-emerald-300/40 bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-100 hover:bg-emerald-500/25' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_PRESET_BUTTON_CLASS_NAME =
  'rounded border border-white/15 bg-black/40 px-1.5 py-0.5 text-[9px] font-mono tabular-nums text-white/55 hover:text-white/85' as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_PRESET_BUTTON_ACTIVE_CLASS_NAME =
  'border-violet-300/50 bg-violet-500/25 text-violet-100' as const;

type RenderingWorldPlazaDevModeBestiaryUnlockRowProps = {
  speciesId: DefiningWildlifeSpeciesId;
  displayName: string;
  isSighted: boolean;
  killCount: number;
};

function RenderingWorldPlazaDevModeBestiaryUnlockRow({
  speciesId,
  displayName,
  isSighted,
  killCount,
}: RenderingWorldPlazaDevModeBestiaryUnlockRowProps): React.JSX.Element {
  const studyTierId = resolvingPlazaBestiaryStudyTierId(killCount);

  return (
    <div className={RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_ROW_CLASS_NAME}>
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-[11px] font-medium text-white/90">
          {displayName}
        </span>
        <button
          type="button"
          className={
            isSighted
              ? RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_TOGGLE_UNLOCKED_CLASS_NAME
              : RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_TOGGLE_LOCKED_CLASS_NAME
          }
          onClick={() =>
            settingWorldPlazaBestiarySpeciesSightedForDev(speciesId, !isSighted)
          }
        >
          {isSighted ? 'Sighted' : 'Locked'}
        </button>
      </div>
      {isSighted ? (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-[9px] font-medium uppercase tracking-wide text-white/45">
            Kills
          </span>
          {DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_KILL_PRESETS.map((preset) => {
            const isActive =
              studyTierId !== 'sighted' && preset.tierId === studyTierId;

            return (
              <button
                key={preset.tierId}
                type="button"
                title={`Set ${preset.killCount} kills (${preset.tierId})`}
                className={`${RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_PRESET_BUTTON_CLASS_NAME} ${
                  isActive
                    ? RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_PRESET_BUTTON_ACTIVE_CLASS_NAME
                    : ''
                }`.trim()}
                onClick={() =>
                  settingWorldPlazaBestiarySpeciesKillCountForDev(
                    speciesId,
                    preset.killCount
                  )
                }
              >
                {preset.label}
              </button>
            );
          })}
          <span className="ml-auto text-[9px] font-medium text-white/50">
            Tier: {studyTierId}
            {studyTierId !== 'sighted'
              ? ` (${DEFINING_PLAZA_BESTIARY_STUDY_TIER_THRESHOLDS[studyTierId as Exclude<PlazaBestiaryStudyTierId, 'sighted'>]}+)`
              : ''}
          </span>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Dev wildlife tab: toggle bestiary sight locks and set study-tier kill counts.
 */
const RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_EMPTY_KILL_COUNTS: Readonly<
  Record<DefiningWildlifeSpeciesId, number>
> = {};

export function RenderingWorldPlazaDevModeBestiaryUnlockControls(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');

  const sightedSpeciesIds = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiarySightedSpeciesSnapshot,
    () => []
  );
  const killCounts = useSyncExternalStore(
    subscribingWorldPlazaBestiaryDiscovery,
    gettingWorldPlazaBestiaryKillCountsSnapshot,
    () => RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_EMPTY_KILL_COUNTS
  );

  const sightedSpeciesIdSet = useMemo(
    () => new Set(sightedSpeciesIds),
    [sightedSpeciesIds]
  );

  const catalogRows = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return DEFINING_PLAZA_BESTIARY_GUIDE_ENTRIES.map((entry) => {
      const definition = resolvingWildlifeSpeciesDefinition(entry.speciesId);
      return {
        speciesId: entry.speciesId,
        displayName: definition?.displayName ?? entry.speciesId,
      };
    })
      .filter((row) => {
        if (!normalizedQuery) {
          return true;
        }

        return (
          row.displayName.toLowerCase().includes(normalizedQuery) ||
          row.speciesId.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((left, right) => left.displayName.localeCompare(right.displayName));
  }, [searchQuery]);

  const unlockedCount =
    DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_UNLOCK_SPECIES_IDS.filter(
      (speciesId) => sightedSpeciesIdSet.has(speciesId)
    ).length;

  return (
    <div className="flex max-h-[min(52dvh,28rem)] flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Bestiary unlocks
      </span>
      <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[9px] leading-snug text-white/60">
        Toggle sighted vs locked per species. Kill presets unlock study tiers at
        1 / 10 / 50 / 100 / 200. Unlock all sights every catalog entry and sets
        full study.
      </div>
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          className={
            RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_ACTION_BUTTON_PRIMARY_CLASS_NAME
          }
          onClick={() =>
            unlockingWorldPlazaBestiaryDiscoveryAllForDev(
              DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_UNLOCK_SPECIES_IDS,
              DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_FULL_UNLOCK_KILL_COUNT
            )
          }
        >
          Unlock all
        </button>
        <button
          type="button"
          className={
            RENDERING_WORLD_PLAZA_DEV_MODE_BESTIARY_ACTION_BUTTON_CLASS_NAME
          }
          onClick={lockingWorldPlazaBestiaryDiscoveryAllForDev}
        >
          Lock all
        </button>
        <span className="ml-auto self-center text-[9px] font-medium text-white/50">
          {unlockedCount}/
          {DEFINING_WORLD_PLAZA_DEV_MODE_BESTIARY_UNLOCK_SPECIES_IDS.length}{' '}
          sighted
        </span>
      </div>
      <input
        type="search"
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        placeholder="Filter species…"
        className="rounded border border-white/15 bg-black/45 px-2 py-1 text-[11px] text-white/90 placeholder:text-white/35"
      />
      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto pr-0.5">
        {catalogRows.map((row) => (
          <RenderingWorldPlazaDevModeBestiaryUnlockRow
            key={row.speciesId}
            speciesId={row.speciesId}
            displayName={row.displayName}
            isSighted={sightedSpeciesIdSet.has(row.speciesId)}
            killCount={killCounts[row.speciesId] ?? 0}
          />
        ))}
      </div>
    </div>
  );
}
