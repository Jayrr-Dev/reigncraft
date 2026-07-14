import { DEFINING_WORLD_PLAZA_LUCKY_DISCOVERY_LUCK_MULTIPLIER } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverConstants';
import { checkingWorldPlazaHeldLuckyBuffIsActive } from '@/components/world/inventory/domains/managingWorldPlazaHeldLuckyBuffBridge';

/**
 * Discovery luck multiplier for rare flowers, ores, and biome scouting.
 */
export function resolvingWorldPlazaPlayerDiscoveryLuckMultiplier(): number {
  if (!checkingWorldPlazaHeldLuckyBuffIsActive()) {
    return 1;
  }

  return DEFINING_WORLD_PLAZA_LUCKY_DISCOVERY_LUCK_MULTIPLIER;
}
