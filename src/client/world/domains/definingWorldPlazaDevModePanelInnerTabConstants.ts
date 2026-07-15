/**
 * Inner tab button registries for combined Dev tools leaf views.
 *
 * @module components/world/domains/definingWorldPlazaDevModePanelInnerTabConstants
 */

export type DefiningWorldPlazaDevModePanelWorldStatusTimeTabId =
  | 'status'
  | 'time'
  | 'client';

export type DefiningWorldPlazaDevModePanelPlayerClimateTabId =
  | 'frostbite'
  | 'climate';

export type DefiningWorldPlazaDevModePanelInnerTab<TId extends string> = {
  id: TId;
  label: string;
};

export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_WORLD_STATUS_TIME_TABS: readonly DefiningWorldPlazaDevModePanelInnerTab<DefiningWorldPlazaDevModePanelWorldStatusTimeTabId>[] =
  [
    { id: 'status', label: 'Status' },
    { id: 'time', label: 'Time' },
    { id: 'client', label: 'Client' },
  ] as const;

export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_WORLD_STATUS_TIME_DEFAULT_TAB_ID: DefiningWorldPlazaDevModePanelWorldStatusTimeTabId =
  'status';

export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_PLAYER_CLIMATE_TABS: readonly DefiningWorldPlazaDevModePanelInnerTab<DefiningWorldPlazaDevModePanelPlayerClimateTabId>[] =
  [
    { id: 'frostbite', label: 'Frostbite' },
    { id: 'climate', label: 'Climate' },
  ] as const;

export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_PLAYER_CLIMATE_DEFAULT_TAB_ID: DefiningWorldPlazaDevModePanelPlayerClimateTabId =
  'frostbite';
