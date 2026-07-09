/**
 * Pixel inventory icons from the Tools Icons pack.
 *
 * Imported as Vite `?url` assets so playtest rebuilds upload them even when
 * `copyPublicDir` is skipped (`DEVVIT_PLAYTEST_SKIP_PUBLIC_COPY`).
 *
 * Source PNGs: `src/client/world/inventory/assets/tools-icons/`
 * (mirrored under `public/tools-icons/` for local static serving).
 *
 * @module components/world/inventory/domains/definingWorldPlazaToolInventoryIconConstants
 */

import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import fishrodIconUrl from '@/components/world/inventory/assets/tools-icons/fishrod.png?url';
import goldAxeIconUrl from '@/components/world/inventory/assets/tools-icons/gold-axe.png?url';
import goldHoeIconUrl from '@/components/world/inventory/assets/tools-icons/gold-hoe.png?url';
import goldPickaxeIconUrl from '@/components/world/inventory/assets/tools-icons/gold-pickaxe.png?url';
import goldSwordIconUrl from '@/components/world/inventory/assets/tools-icons/gold-sword.png?url';
import ironAxeIconUrl from '@/components/world/inventory/assets/tools-icons/iron-axe.png?url';
import ironHoeIconUrl from '@/components/world/inventory/assets/tools-icons/iron-hoe.png?url';
import ironPickaxeIconUrl from '@/components/world/inventory/assets/tools-icons/iron-pickaxe.png?url';
import ironSwordIconUrl from '@/components/world/inventory/assets/tools-icons/iron-sword.png?url';
import steelAxeIconUrl from '@/components/world/inventory/assets/tools-icons/steel-axe.png?url';
import steelHoeIconUrl from '@/components/world/inventory/assets/tools-icons/steel-hoe.png?url';
import steelPickaxeIconUrl from '@/components/world/inventory/assets/tools-icons/steel-pickaxe.png?url';
import steelSwordIconUrl from '@/components/world/inventory/assets/tools-icons/steel-sword.png?url';
import woodAxeIconUrl from '@/components/world/inventory/assets/tools-icons/wood-axe.png?url';
import woodHoeIconUrl from '@/components/world/inventory/assets/tools-icons/wood-hoe.png?url';
import woodPickaxeIconUrl from '@/components/world/inventory/assets/tools-icons/wood-pickaxe.png?url';
import woodSwordIconUrl from '@/components/world/inventory/assets/tools-icons/wood-sword.png?url';

export type DefiningWorldPlazaToolInventoryIconFamily =
  | 'sword'
  | 'axe'
  | 'pickaxe'
  | 'hoe'
  | 'fishrod';

type DefiningWorldPlazaToolInventoryIconTier = Record<
  DefiningWorldPlazaHeldItemTier,
  string
>;

/** Bundled URL for the legacy wood axe inventory glyph. */
export const DEFINING_WORLD_PLAZA_WOOD_AXE_INVENTORY_ICON_URL = woodAxeIconUrl;

/** Per-tier inventory icon URLs for each tool family that has pack art. */
export const DEFINING_WORLD_PLAZA_TOOL_INVENTORY_ICON_URL_BY_FAMILY: Readonly<
  Record<
    DefiningWorldPlazaToolInventoryIconFamily,
    DefiningWorldPlazaToolInventoryIconTier
  >
> = {
  sword: {
    wood: woodSwordIconUrl,
    iron: ironSwordIconUrl,
    steel: steelSwordIconUrl,
    gold: goldSwordIconUrl,
  },
  axe: {
    wood: woodAxeIconUrl,
    iron: ironAxeIconUrl,
    steel: steelAxeIconUrl,
    gold: goldAxeIconUrl,
  },
  pickaxe: {
    wood: woodPickaxeIconUrl,
    iron: ironPickaxeIconUrl,
    steel: steelPickaxeIconUrl,
    gold: goldPickaxeIconUrl,
  },
  hoe: {
    wood: woodHoeIconUrl,
    iron: ironHoeIconUrl,
    steel: steelHoeIconUrl,
    gold: goldHoeIconUrl,
  },
  fishrod: {
    wood: fishrodIconUrl,
    iron: fishrodIconUrl,
    steel: fishrodIconUrl,
    gold: fishrodIconUrl,
  },
};
