'use client';

/**
 * Dev panel controls for Spirited Sprites beta animal spawns.
 *
 * @module components/world/beta/spirited/components/renderingSpiritedSpritesBetaDevControls
 */

import type { DefiningSpiritedSpritesBetaAnimalId } from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaCatalog';
import { DEFINING_SPIRITED_SPRITES_BETA_ANIMAL_CATALOG } from '@/components/world/beta/spirited/domains/definingSpiritedSpritesBetaCatalog';
import {
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  DEFINING_WILDLIFE_DEV_SPAWN_SPECIES_GRID_COLUMN_COUNT,
  STYLING_WILDLIFE_DEV_SPAWN_SPECIES_BUTTON_CLASS_NAME,
  STYLING_WILDLIFE_DEV_SPAWN_SPECIES_GRID_SHELL_CLASS_NAME,
} from '@/components/world/wildlife/domains/definingWildlifeDevSpawnConstants';
import { useMemo, useState } from 'react';

export type RenderingSpiritedSpritesBetaDevControlsProps = {
  readonly onSpawnAnimal: (
    animalId: DefiningSpiritedSpritesBetaAnimalId
  ) => void;
  readonly onClearSpawns: () => void;
};

/**
 * Searchable spawn grid for Spirited beta animals.
 */
export function RenderingSpiritedSpritesBetaDevControls({
  onSpawnAnimal,
  onClearSpawns,
}: RenderingSpiritedSpritesBetaDevControlsProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');

  const catalogEntries = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return DEFINING_SPIRITED_SPRITES_BETA_ANIMAL_CATALOG;
    }

    return DEFINING_SPIRITED_SPRITES_BETA_ANIMAL_CATALOG.filter((entry) => {
      return (
        entry.displayName.toLowerCase().includes(normalizedQuery) ||
        entry.animalId.toLowerCase().includes(normalizedQuery) ||
        entry.fileStem.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Spirited Sprites (beta)
      </span>
      <p className="text-[10px] leading-snug text-white/55">
        Visual-only slide-walk preview (1 pose per facing, tiny bob). No foot
        cycle. Judge if it looks too bad.
      </p>

      <label className="flex flex-col gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/50">
          Search
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Fox, wolf, hare…"
          className="rounded border border-white/15 bg-black/50 px-2 py-1 text-[11px] text-white/90 placeholder:text-white/35 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-300/70"
        />
      </label>

      <button
        type="button"
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME}
        onClick={onClearSpawns}
      >
        Clear beta spawns
      </button>

      <div className="flex flex-col gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-white/50">
          Animals ({catalogEntries.length})
        </span>
        {catalogEntries.length === 0 ? (
          <div className="rounded border border-white/10 bg-black/35 px-1 py-2 text-[10px] text-white/50">
            No animals match this search.
          </div>
        ) : (
          <div
            className={STYLING_WILDLIFE_DEV_SPAWN_SPECIES_GRID_SHELL_CLASS_NAME}
            style={{
              gridTemplateColumns: `repeat(${DEFINING_WILDLIFE_DEV_SPAWN_SPECIES_GRID_COLUMN_COUNT}, minmax(0, 1fr))`,
            }}
          >
            {catalogEntries.map((entry) => (
              <button
                key={entry.animalId}
                type="button"
                title={`${entry.displayName} (${entry.fileStem})`}
                className={STYLING_WILDLIFE_DEV_SPAWN_SPECIES_BUTTON_CLASS_NAME}
                onClick={() => onSpawnAnimal(entry.animalId)}
              >
                {entry.displayName}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
