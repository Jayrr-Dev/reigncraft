'use client';

/**
 * Dev wildlife tab: search, biome filter, aggression, spawn any species.
 *
 * @module components/world/wildlife/components/renderingWorldPlazaDevWildlifeSpawnerControls
 */

import {
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CHIP_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CHIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SINGLE_SPAWN_COUNT,
  DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SWARM_SPAWN_COUNT,
  DEFINING_WILDLIFE_DEV_SPAWN_SPECIES_GRID_COLUMN_COUNT,
  STYLING_WILDLIFE_DEV_SPAWN_SPECIES_BUTTON_CLASS_NAME,
  STYLING_WILDLIFE_DEV_SPAWN_SPECIES_GRID_SHELL_CLASS_NAME,
} from '@/components/world/wildlife/domains/definingWildlifeDevSpawnConstants';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeSpeciesId,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  listingWildlifeDevSpawnBiomeFilters,
  type DefiningWildlifeDevSpawnBiomeFilterId,
} from '@/components/world/wildlife/domains/listingWildlifeDevSpawnBiomeFilters';
import { filteringWildlifeDevSpawnSpeciesCatalog } from '@/components/world/wildlife/domains/listingWildlifeDevSpawnSpeciesCatalog';
import { useMemo, useState } from 'react';

const RENDERING_WORLD_PLAZA_DEV_WILDLIFE_BUTTON_CLASS_NAME =
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME;

const RENDERING_WORLD_PLAZA_DEV_WILDLIFE_CHIP_CLASS_NAME =
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CHIP_CLASS_NAME;

const RENDERING_WORLD_PLAZA_DEV_WILDLIFE_CHIP_ACTIVE_CLASS_NAME =
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_CHIP_ACTIVE_CLASS_NAME;

const RENDERING_WORLD_PLAZA_DEV_WILDLIFE_AGGRESSION_OPTIONS: readonly {
  id: DefiningWildlifeAggressionLevel;
  label: string;
}[] = [
  { id: 'tame', label: 'Tame' },
  { id: 'normal', label: 'Normal' },
  { id: 'aggressive', label: 'Aggro' },
];

export type RenderingWorldPlazaDevWildlifeSpawnerControlsProps = {
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly onSpawnAggressiveChickens: (count: number) => void;
  readonly onSpawnRandomGreyWolf: () => void;
  readonly onSpawnWildlifeSpecies: (
    speciesId: DefiningWildlifeSpeciesId,
    aggressionLevel: DefiningWildlifeAggressionLevel
  ) => void;
};

/**
 * Dev-mode wildlife catalog: search, biome chips, aggression, spawn buttons.
 */
export function RenderingWorldPlazaDevWildlifeSpawnerControls({
  playerPositionRef,
  onSpawnAggressiveChickens,
  onSpawnRandomGreyWolf,
  onSpawnWildlifeSpecies,
}: RenderingWorldPlazaDevWildlifeSpawnerControlsProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [biomeFilterId, setBiomeFilterId] =
    useState<DefiningWildlifeDevSpawnBiomeFilterId>('all');
  const [aggressionLevel, setAggressionLevel] =
    useState<DefiningWildlifeAggressionLevel>('normal');

  const biomeFilters = useMemo(() => listingWildlifeDevSpawnBiomeFilters(), []);
  const catalogEntries = useMemo(
    () =>
      filteringWildlifeDevSpawnSpeciesCatalog({
        searchQuery,
        biomeFilterId,
      }),
    [biomeFilterId, searchQuery]
  );

  const handlingSpawnSpecies = (speciesId: DefiningWildlifeSpeciesId): void => {
    if (!playerPositionRef.current) {
      return;
    }

    onSpawnWildlifeSpecies(speciesId, aggressionLevel);
  };

  const handlingSpawnAggressiveChickens = (count: number): void => {
    if (!playerPositionRef.current) {
      return;
    }

    onSpawnAggressiveChickens(count);
  };

  const handlingSpawnRandomGreyWolf = (): void => {
    if (!playerPositionRef.current) {
      return;
    }

    onSpawnRandomGreyWolf();
  };

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Wildlife spawner
      </span>

      <label className="flex flex-col gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/50">
          Search
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Name or species id"
          className="rounded border border-white/15 bg-black/50 px-2 py-1 text-[11px] text-white/90 placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-300/70"
        />
      </label>

      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/50">
          Biome
        </span>
        <div className="flex flex-wrap gap-1">
          {biomeFilters.map((filter) => {
            const isActive = filter.id === biomeFilterId;

            return (
              <button
                key={filter.id}
                type="button"
                className={`${RENDERING_WORLD_PLAZA_DEV_WILDLIFE_CHIP_CLASS_NAME} ${
                  isActive
                    ? RENDERING_WORLD_PLAZA_DEV_WILDLIFE_CHIP_ACTIVE_CLASS_NAME
                    : ''
                }`}
                onClick={() => setBiomeFilterId(filter.id)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/50">
          Aggression
        </span>
        <div className="grid grid-cols-3 gap-1">
          {RENDERING_WORLD_PLAZA_DEV_WILDLIFE_AGGRESSION_OPTIONS.map(
            (option) => {
              const isActive = option.id === aggressionLevel;

              return (
                <button
                  key={option.id}
                  type="button"
                  className={`${RENDERING_WORLD_PLAZA_DEV_WILDLIFE_BUTTON_CLASS_NAME} ${
                    isActive
                      ? 'border-violet-300/50 bg-violet-500/25 text-violet-100'
                      : ''
                  }`}
                  onClick={() => setAggressionLevel(option.id)}
                >
                  {option.label}
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/50">
          Species ({catalogEntries.length})
        </span>
        {catalogEntries.length === 0 ? (
          <div className="rounded border border-white/10 bg-black/35 px-1 py-2 text-[10px] text-white/50">
            No species match this search / biome.
          </div>
        ) : (
          <div
            className={STYLING_WILDLIFE_DEV_SPAWN_SPECIES_GRID_SHELL_CLASS_NAME}
            style={{
              gridTemplateColumns: `repeat(${DEFINING_WILDLIFE_DEV_SPAWN_SPECIES_GRID_COLUMN_COUNT}, minmax(0, 1fr))`,
            }}
          >
            {catalogEntries.map((entry) => {
              const biomeSummary =
                entry.biomeKinds.length > 0
                  ? `${entry.biomeKinds.length} biome${
                      entry.biomeKinds.length === 1 ? '' : 's'
                    }`
                  : 'no biome table';

              return (
                <button
                  key={entry.speciesId}
                  type="button"
                  title={`${entry.displayName} (${entry.speciesId}) · ${biomeSummary}`}
                  className={
                    STYLING_WILDLIFE_DEV_SPAWN_SPECIES_BUTTON_CLASS_NAME
                  }
                  onClick={() => handlingSpawnSpecies(entry.speciesId)}
                >
                  {entry.displayName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded border border-white/10 bg-black/35 px-2 py-1.5 text-[9px] leading-snug text-white/60">
        Quick presets still force cucco chickens / random wolf rolls.
      </div>
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_WILDLIFE_BUTTON_CLASS_NAME}
          onClick={() =>
            handlingSpawnAggressiveChickens(
              DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SINGLE_SPAWN_COUNT
            )
          }
        >
          Aggressive chicken
        </button>
        <button
          type="button"
          className={RENDERING_WORLD_PLAZA_DEV_WILDLIFE_BUTTON_CLASS_NAME}
          onClick={() =>
            handlingSpawnAggressiveChickens(
              DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SWARM_SPAWN_COUNT
            )
          }
        >
          Chicken swarm (
          {DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SWARM_SPAWN_COUNT})
        </button>
      </div>
      <button
        type="button"
        className={RENDERING_WORLD_PLAZA_DEV_WILDLIFE_BUTTON_CLASS_NAME}
        onClick={handlingSpawnRandomGreyWolf}
      >
        Random grey wolf
      </button>
    </div>
  );
}
