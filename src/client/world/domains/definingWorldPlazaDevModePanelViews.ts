/**
 * Flat view registry for the plaza dev tools panel.
 * One dropdown bar per group; each bar picks a leaf view in that section.
 *
 * @module components/world/domains/definingWorldPlazaDevModePanelViews
 */

export type DefiningWorldPlazaDevModePanelGroupId =
  | 'world'
  | 'player'
  | 'combat'
  | 'wildlife'
  | 'beta'
  | 'debug';

export type DefiningWorldPlazaDevModePanelViewId =
  | 'world-status-time'
  | 'world-biome'
  | 'player-vitals'
  | 'player-diseases'
  | 'player-climate'
  | 'combat-rolls'
  | 'combat-force-tier'
  | 'combat-projectiles'
  | 'combat-buffs-attack'
  | 'combat-buffs-defence'
  | 'combat-buffs-utility'
  | 'combat-skills'
  | 'wildlife-spawner'
  | 'wildlife-pets'
  | 'wildlife-bestiary'
  | 'beta-spirited-sprites'
  | 'debug-overlays'
  | 'debug-readouts';

export type DefiningWorldPlazaDevModePanelView = {
  id: DefiningWorldPlazaDevModePanelViewId;
  groupId: DefiningWorldPlazaDevModePanelGroupId;
  groupLabel: string;
  label: string;
  /** Content leaf key consumed by health / combat control routers. */
  leafId: string;
};

export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_DEFAULT_VIEW_ID: DefiningWorldPlazaDevModePanelViewId =
  'world-status-time';

/** Ordered leaf views shown across per-section dropdown bars. */
export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_VIEWS: readonly DefiningWorldPlazaDevModePanelView[] =
  [
    {
      id: 'world-status-time',
      groupId: 'world',
      groupLabel: 'World',
      label: 'Status & time',
      leafId: 'status-time',
    },
    {
      id: 'world-biome',
      groupId: 'world',
      groupLabel: 'World',
      label: 'Biome teleports',
      leafId: 'biome',
    },
    {
      id: 'player-vitals',
      groupId: 'player',
      groupLabel: 'Player',
      label: 'Vitals',
      leafId: 'vitals',
    },
    {
      id: 'player-diseases',
      groupId: 'player',
      groupLabel: 'Player',
      label: 'Diseases',
      leafId: 'diseases',
    },
    {
      id: 'player-climate',
      groupId: 'player',
      groupLabel: 'Player',
      label: 'Frostbite & climate',
      leafId: 'frostbite-climate',
    },
    {
      id: 'combat-rolls',
      groupId: 'combat',
      groupLabel: 'Combat',
      label: 'Damage rolls',
      leafId: 'engine',
    },
    {
      id: 'combat-force-tier',
      groupId: 'combat',
      groupLabel: 'Combat',
      label: 'Force tier',
      leafId: 'force-tier',
    },
    {
      id: 'combat-projectiles',
      groupId: 'combat',
      groupLabel: 'Combat',
      label: 'Projectiles',
      leafId: 'projectiles',
    },
    {
      id: 'combat-buffs-attack',
      groupId: 'combat',
      groupLabel: 'Combat',
      label: 'Attack buffs',
      leafId: 'combat',
    },
    {
      id: 'combat-buffs-defence',
      groupId: 'combat',
      groupLabel: 'Combat',
      label: 'Defence buffs',
      leafId: 'defence',
    },
    {
      id: 'combat-buffs-utility',
      groupId: 'combat',
      groupLabel: 'Combat',
      label: 'Utility buffs',
      leafId: 'utility',
    },
    {
      id: 'combat-skills',
      groupId: 'combat',
      groupLabel: 'Combat',
      label: 'Skills',
      leafId: 'character',
    },
    {
      id: 'wildlife-spawner',
      groupId: 'wildlife',
      groupLabel: 'Wildlife',
      label: 'Spawner',
      leafId: 'spawner',
    },
    {
      id: 'wildlife-pets',
      groupId: 'wildlife',
      groupLabel: 'Wildlife',
      label: 'Pets',
      leafId: 'pets',
    },
    {
      id: 'wildlife-bestiary',
      groupId: 'wildlife',
      groupLabel: 'Wildlife',
      label: 'Bestiary',
      leafId: 'bestiary',
    },
    {
      id: 'beta-spirited-sprites',
      groupId: 'beta',
      groupLabel: 'Beta Features',
      label: 'Spirited Sprites',
      leafId: 'spirited-sprites',
    },
    {
      id: 'debug-overlays',
      groupId: 'debug',
      groupLabel: 'Debug',
      label: 'Overlays',
      leafId: 'toggles',
    },
    {
      id: 'debug-readouts',
      groupId: 'debug',
      groupLabel: 'Debug',
      label: 'Readouts',
      leafId: 'readouts',
    },
  ] as const;

export type DefiningWorldPlazaDevModePanelViewGroup = {
  groupId: DefiningWorldPlazaDevModePanelGroupId;
  groupLabel: string;
  views: readonly DefiningWorldPlazaDevModePanelView[];
};

/**
 * Groups leaf views for the per-section dropdown bars.
 */
export function listingWorldPlazaDevModePanelViewGroups(): readonly DefiningWorldPlazaDevModePanelViewGroup[] {
  const groups: DefiningWorldPlazaDevModePanelViewGroup[] = [];
  const indexByGroupId = new Map<
    DefiningWorldPlazaDevModePanelGroupId,
    number
  >();

  for (const view of DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_VIEWS) {
    const existingIndex = indexByGroupId.get(view.groupId);
    if (existingIndex === undefined) {
      indexByGroupId.set(view.groupId, groups.length);
      groups.push({
        groupId: view.groupId,
        groupLabel: view.groupLabel,
        views: [view],
      });
      continue;
    }

    const group = groups[existingIndex];
    groups[existingIndex] = {
      ...group,
      views: [...group.views, view],
    };
  }

  return groups;
}

/**
 * Resolves a view definition by id, falling back to the default view.
 */
export function resolvingWorldPlazaDevModePanelView(
  viewId: DefiningWorldPlazaDevModePanelViewId
): DefiningWorldPlazaDevModePanelView {
  return (
    DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_VIEWS.find(
      (view) => view.id === viewId
    ) ?? DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_VIEWS[0]
  );
}
