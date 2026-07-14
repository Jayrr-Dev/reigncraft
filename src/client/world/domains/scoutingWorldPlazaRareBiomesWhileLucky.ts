import { DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES } from '@/components/home/domains/definingPlazaBiomesGuideConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { recordingWorldPlazaExploredBiomeKind } from '@/components/world/domains/managingWorldPlazaExploredBiomesStore';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { DEFINING_WORLD_PLAZA_LUCKY_DISCOVERY_LUCK_MULTIPLIER } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverConstants';
import { checkingWorldPlazaHeldLuckyBuffIsActive } from '@/components/world/inventory/domains/managingWorldPlazaHeldLuckyBuffBridge';

const SCOUT_TILE_RADIUS = 6;
const SCOUT_SAMPLE_COUNT = 2;

/**
 * While lucky, scout nearby tiles for rare/legendary biomes to codex.
 */
export function scoutingWorldPlazaRareBiomesWhileLucky(
  playerPosition: DefiningWorldPlazaWorldPoint
): void {
  if (!checkingWorldPlazaHeldLuckyBuffIsActive()) {
    return;
  }

  const rareKinds = new Set(
    DEFINING_PLAZA_BIOMES_GUIDE_ENTRIES.filter(
      (entry) => entry.rarity === 'rare' || entry.rarity === 'legendary'
    ).map((entry) => entry.kind)
  );
  const centerTileX = Math.floor(playerPosition.x);
  const centerTileY = Math.floor(playerPosition.y);

  for (
    let sampleIndex = 0;
    sampleIndex <
    Math.ceil(
      SCOUT_SAMPLE_COUNT * DEFINING_WORLD_PLAZA_LUCKY_DISCOVERY_LUCK_MULTIPLIER
    );
    sampleIndex += 1
  ) {
    const offsetX =
      Math.floor(Math.random() * (SCOUT_TILE_RADIUS * 2 + 1)) -
      SCOUT_TILE_RADIUS;
    const offsetY =
      Math.floor(Math.random() * (SCOUT_TILE_RADIUS * 2 + 1)) -
      SCOUT_TILE_RADIUS;
    const tileX = centerTileX + offsetX;
    const tileY = centerTileY + offsetY;
    const biomeKind = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind;

    if (rareKinds.has(biomeKind)) {
      recordingWorldPlazaExploredBiomeKind(biomeKind);
    }
  }
}
