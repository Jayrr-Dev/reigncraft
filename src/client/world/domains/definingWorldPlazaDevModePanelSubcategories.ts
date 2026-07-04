import type { RenderingWorldPlazaDevModePanelTabId } from '@/components/world/components/renderingWorldPlazaDevModePanelTabs';

export type DefiningWorldPlazaDevModePanelSubcategory = {
  id: string;
  label: string;
};

/** Subcategory badge definitions keyed by dev panel tab. */
export const DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORIES: Record<
  RenderingWorldPlazaDevModePanelTabId,
  readonly DefiningWorldPlazaDevModePanelSubcategory[]
> = {
  world: [
    { id: 'status', label: 'Status' },
    { id: 'state', label: 'World state' },
  ],
  health: [
    { id: 'vitals', label: 'Vitals' },
    { id: 'modifiers', label: 'Modifiers' },
    { id: 'temperature', label: 'Temperature' },
  ],
  combat: [
    { id: 'engine', label: 'Engine' },
    { id: 'force-tier', label: 'Force tier' },
    { id: 'defender', label: 'Defender' },
    { id: 'attacker', label: 'Attacker' },
  ],
  tools: [
    { id: 'toggles', label: 'Toggles' },
    { id: 'readouts', label: 'Readouts' },
  ],
};

/**
 * Returns the default subcategory id for a dev panel tab.
 */
export function resolvingWorldPlazaDevModePanelDefaultSubcategoryId(
  tabId: RenderingWorldPlazaDevModePanelTabId
): string {
  return DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORIES[tabId][0]?.id ?? '';
}

/**
 * Lists subcategory badges for a dev panel tab.
 */
export function listingWorldPlazaDevModePanelSubcategories(
  tabId: RenderingWorldPlazaDevModePanelTabId
): readonly DefiningWorldPlazaDevModePanelSubcategory[] {
  return DEFINING_WORLD_PLAZA_DEV_MODE_PANEL_SUBCATEGORIES[tabId];
}
